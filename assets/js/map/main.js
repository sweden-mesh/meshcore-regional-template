// Map island entry point. Settings come from #map's data attributes, written
// by layouts/_partials/map.html from the site's params.
import { createMap } from "./basemap.js";
import { nodesBounds, frameNodes } from "./camera.js";
import { createClient } from "../beacon/rest.js";
import { nodesToGeoJSON, addNodeLayers, publicNodes, mergeNodeUpdate } from "./nodes.js";
import { attachPopups } from "./popup.js";
import { LiveFeed } from "../beacon/live.js";
import { FlowLayer, chainFromObservation } from "./flow.js";
import { packetRoutes, routesToGeoJSON, RecentPackets, recentListHtml, routesListHtml, addPathLayer } from "./packetpath.js";
import { allLinks, selectedLinks, addLinkLayer } from "./neighbours.js";
import { loadBorders, addBorderLayers, frameBorders, setForeignVisible } from "./region.js";
import { MapPanel } from "./panel.js";
import { parseState, writeState } from "./urlstate.js";

const el = document.getElementById("map");

async function start() {
  const { map, maplibregl } = await createMap(el);
  el.mapInstance = map; // for debugging and browser tests
  const ds = el.dataset;
  if (!ds.beacon) return;
  const client = createClient(ds.beacon);
  const iatas = JSON.parse(ds.iatas || "[]");
  const opts = { companions: ds.companions === "true" };
  const url = parseState(location.search);
  const state = { nodes: [], borders: [], showForeign: url.foreign ?? true, showLinks: url.links ?? true, live: url.live ?? true, selected: null, onLive: null };
  const saveUrl = (extra = {}) => {
    const q = writeState(location.search, { live: state.live, links: state.showLinks, foreign: state.showForeign, ...extra });
    history.replaceState(null, "", location.pathname + q + location.hash);
  };
  if (url.view) { map.jumpTo(url.view); map.__userMoved = true; }
  map.on("moveend", (e) => { if (e.originalEvent) saveUrl({ view: { zoom: map.getZoom(), center: map.getCenter().toArray() } }); });
  const popup = attachPopups(map, maplibregl, client);
  const empty = { type: "FeatureCollection", features: [] };
  // All known links in grey (toggle), plus the clicked node's links coloured by
  // how often they are heard (always, while its popup is open).
  const drawLinks = () => addLinkLayer(map, state.showLinks ? allLinks(state.nodes) : empty);
  const drawSelected = async () => {
    if (!state.selected) return addLinkLayer(map, empty, "links-selected");
    const node = state.nodes.find((n) => n.id === state.selected);
    try {
      addLinkLayer(map, selectedLinks(node, await client.get(`/nodes/${encodeURIComponent(state.selected)}/neighbors`)), "links-selected");
    } catch { addLinkLayer(map, empty, "links-selected"); }
  };
  map.on("click", "node-points", (e) => { state.selected = e.features[0].properties.id; drawSelected(); });
  popup.on("close", () => { state.selected = null; drawSelected(); });
  map.addControl(new MapPanel({
    toggles: [
      { key: "live", label: ds.liveLabel || "Live-trafik", on: state.live },
      { key: "links", label: ds.linksLabel || "Grannlänkar", on: state.showLinks },
      { key: "foreign", label: ds.foreignLabel || "Utanför regionen", on: state.showForeign },
    ],
    legend: [
      { swatch: "pill-active", label: "repeater, hörd nyligen" },
      { swatch: "pill-stale", label: "repeater, inte hörd på länge" },
      { swatch: "pill-observer", label: "◉ observatör (rapporterar till kartan)" },
      { swatch: "link", label: "grannlänk" },
      { swatch: "link-strong", label: "vald nods länkar: röd sällan, grön ofta" },
      { swatch: "flow", label: "paket i rörelse" },
    ],
    onToggle: (key, on) => {
      if (key === "links") { state.showLinks = on; drawLinks(); }
      if (key === "foreign") { state.showForeign = on; setForeignVisible(map, on); }
      if (key === "live") { state.live = on; state.onLive?.(on); }
      saveUrl();
    },
  }), "top-left");
  const draw = () => {
    addNodeLayers(map, nodesToGeoJSON(state.nodes));
    addBorderLayers(map, state.borders);
    setForeignVisible(map, state.showForeign);
    drawLinks();
    drawSelected();
  };
  // A style switch (dark mode) drops every layer; put them back.
  map.on("style.load", () => { if (state.nodes.length || state.borders.length) draw(); });
  let live = true;
  try {
    const [nodes, borders] = await Promise.all([
      client.getAll("/nodes", { iatas, neighbors: true, limit: 2000 }),
      loadBorders(client, iatas),
    ]);
    state.nodes = publicNodes(nodes, opts); state.borders = borders;
  } catch (err) {
    // Beacon unreachable from this browser: fall back to the build-time snapshot.
    live = false;
    const snap = await loadSnapshot(ds.snapshot);
    state.nodes = publicNodes(snap?.nodes, opts); state.borders = snap?.borders || [];
    note(el, snap ? (ds.snapshotNote || "Beacon kan inte nås just nu; kartan visar läget från {at}.").replace("{at}", formatAt(snap.at))
      : (ds.offlineNote || "Beacon kan inte nås just nu."));
    console.warn("Beacon unreachable, using the snapshot", err);
  }
  const ready = () => { draw(); if (!frameNodes(map, nodesBounds(state.nodes))) frameBorders(map, state.borders); };
  if (map.isStyleLoaded()) ready(); else map.once("load", ready);
  if (live) startLive(map, ds, client, iatas, state, draw);
  return { map, client, state };
}

async function loadSnapshot(url) {
  if (!url) return null;
  try { const r = await fetch(url); return r.ok ? r.json() : null; } catch { return null; }
}

function formatAt(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" });
}

function note(el, text) {
  let p = el.parentElement.querySelector(".map-note");
  if (!p) { p = document.createElement("p"); p.className = "map-note"; el.after(p); }
  p.textContent = text;
}

// Hops through nodes that are not shown (companions) become gaps.
function visibleOnly(state, chain) {
  const ids = new Set(state.nodes.map((n) => n.id));
  return chain.map((p) => (p && ids.has(p.id) ? p : null));
}

// The observer's own node (and position), matched by public key: observer
// display names often differ from the node's advertised name.
function observerPoint(state, key) {
  if (!key) return null;
  const k = key.toLowerCase();
  const n = state.nodes.find((x) => (x.publicKey || "").toLowerCase() === k);
  return n && Number.isFinite(n.lat) && !(n.lat === 0 && n.lng === 0) ? { id: n.id, lat: n.lat, lng: n.lng } : null;
}

function startLive(map, ds, client, iatas, state, draw) {
  if (!iatas.length || !("WebSocket" in window)) return;
  // Fewer simultaneous flows on small screens: less to draw on a phone.
  const flows = new FlowLayer(map, { maxFlows: window.innerWidth < 640 ? 40 : 120 });
  let redraw = 0;
  const recent = new RecentPackets(10);
  const panel = document.getElementById("packets");
  const list = document.getElementById("recent-packets");
  const pathBox = document.getElementById("packet-path");
  let pending = 0;
  const renderRecent = () => {
    if (pending || !list) return;
    pending = requestAnimationFrame(() => { pending = 0; panel.hidden = false; list.innerHTML = recentListHtml(recent.items); });
  };
  const observerKeys = new Map(); // observerId → publicKey
  const keyFor = async (id) => {
    if (!observerKeys.has(id)) observerKeys.set(id, client.get(`/observers/${encodeURIComponent(id)}`).then((o) => o?.publicKey || null).catch(() => null));
    return observerKeys.get(id);
  };
  list?.addEventListener("click", async (e) => {
    const hash = e.target.closest("button")?.dataset.hash;
    if (!hash) return;
    try {
      const detail = await client.get(`/packets/${encodeURIComponent(hash)}`);
      const ids = [...new Set((detail.observations || []).map((o) => o.observerId))];
      const keys = new Map();
      for (let i = 0; i < ids.length; i += 3) { // Beacon allows 4 concurrent requests per client
        await Promise.all(ids.slice(i, i + 3).map(async (id) => keys.set(id, await keyFor(id))));
      }
      const routes = packetRoutes(detail, (id) => observerPoint(state, keys.get(id)), (c) => visibleOnly(state, c));
      const fc = routesToGeoJSON(routes);
      addPathLayer(map, fc);
      const pts = fc.features.flatMap((f) => f.geometry.coordinates);
      if (pts.length) {
        const lngs = pts.map((p) => p[0]), lats = pts.map((p) => p[1]);
        map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: 60, maxZoom: 13 });
      }
      pathBox.hidden = false;
      pathBox.querySelector(".routes").innerHTML = routesListHtml(routes);
    } catch (err) { console.error(err); }
  });
  document.getElementById("packet-path-close")?.addEventListener("click", () => {
    pathBox.hidden = true;
    addPathLayer(map, { type: "FeatureCollection", features: [] });
  });
  map.on("style.load", () => flows.install());
  const feed = new LiveFeed(ds.beacon, {
    iatas, events: ["packetObservation", "nodeUpdate"], resolvePath: true, includeObserverKey: true,
    onEvent: (name, data) => {
      if (name === "nodeUpdate") {
        state.nodes = publicNodes(mergeNodeUpdate(state.nodes, data), { companions: ds.companions === "true" });
        if (!redraw) redraw = setTimeout(() => { redraw = 0; draw(); }, 2000); // batch bursts of adverts
        return;
      }
      if (name !== "packetObservation") return;
      const o = data.observation;
      const obsPt = observerPoint(state, o.observerPublicKey);
      flows.glow(obsPt);
      flows.add(visibleOnly(state, chainFromObservation(o, obsPt)), { type: data.packet.payloadTypeName });
      recent.add(data);
      renderRecent();
    },
    // Missed events are only in REST: refresh the nodes.
    onGap: async () => {
      try { state.nodes = publicNodes(await client.getAll("/nodes", { iatas, neighbors: true, limit: 2000 }), { companions: ds.companions === "true" }); draw(); } catch { /* next gap */ }
    },
  });
  state.onLive = (on) => {
    flows.setEnabled(on);
    if (on) feed.start(); else feed.stop();
  };
  if (state.live) feed.start(); else flows.setEnabled(false);
  return feed;
}

// The map is the heaviest part of the page (MapLibre ≈ 440 kB compressed, then
// tiles). Below the cards on a phone it is often never seen, so it starts only
// when it comes within 400 px of the viewport.
function whenNear(target, fn) {
  if (!("IntersectionObserver" in window)) return fn();
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); fn(); }
  }, { rootMargin: "400px 0px" });
  io.observe(target);
}

if (el) whenNear(el, () => {
  start().catch((err) => {
    el.classList.add("map-failed");
    el.textContent = el.dataset.failText || "Kartan kunde inte laddas.";
    console.error(err);
  });
});
