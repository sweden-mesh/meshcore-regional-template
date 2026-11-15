// Map island entry point. Settings come from #map's data attributes, written
// by layouts/_partials/map.html from the site's params.
import { createMap } from "./basemap.js";
import { nodesBounds, frameNodes, nodePoints, pointsBounds, expandBounds, widenToFit } from "./camera.js";
import { createClient } from "../beacon/rest.js";
import { nodesToGeoJSON, addNodeLayers, publicNodes, mergeNodeUpdate, setMiniZoom, withSeeded } from "./nodes.js";
import { attachPopups } from "./popup.js";
import { LiveFeed } from "../beacon/live.js";
import { FlowLayer, chainFromObservation, HOP_MS } from "./flow.js";
import { packetRoutes, routesToGeoJSON, RecentPackets, recentListHtml, routesListHtml, addPathLayer } from "./packetpath.js";
import { allLinks, addLinkLayer, linkCountLoader } from "./neighbours.js";
import { loadBorders, addBorderLayers, frameBorders, setForeignVisible, unionBbox } from "./region.js";
import { MapPanel } from "./panel.js";
import { parseState, writeState } from "./urlstate.js";
import { setTexts, t } from "./texts.js";
import { coverageControl, coverageLegend } from "./coverage.js";
import { wantedControl, wantedLegend, wantedBounds } from "./wanted.js";

const el = document.getElementById("map");

async function start() {
  const { map, maplibregl } = await createMap(el);
  el.mapInstance = map; // for debugging and browser tests
  const ds = el.dataset;
  try { setTexts(JSON.parse(ds.texts || "{}")); } catch { /* keep the defaults */ }
  const url = parseState(location.search);
  // MeshMapper coverage (data-coverage): off by default, loaded on first switch-on. Works
  // without Beacon too, with a panel of its own.
  // The line "measured up to and including …" under the map shows while the layer is on.
  const covAt = el.parentElement.querySelector(".map-cov-at");
  const cov = ds.coverage ? coverageControl(map, maplibregl, ds.coverage, { on: url.cov ?? false, dead: url.dead ?? false,
    link: ds.meshmapperUrl, onChange: (c) => { if (covAt) covAt.hidden = !c.on; } }) : null;
  el.coverage = cov; // for browser tests
  const covToggles = cov ? [{ key: "cov", label: ds.coverageLabel || "Täckning", on: cov.on },
    { key: "dead", label: ds.deadLabel || "Döda zoner", on: cov.dead, showWhen: "cov" }] : [];
  const covLegend = cov ? coverageLegend() : [];
  const covToggle = (key, on) => { if (key === "cov" || key === "dead") cov.set(key, on); };
  // Places wanted for new repeaters (data-wanted, params.wanted): off by default, with or
  // without Beacon. No places, no toggle.
  let places = [];
  try { places = JSON.parse(ds.wanted || "[]"); } catch { /* none */ }
  const want = places.length ? wantedControl(map, maplibregl, places, { on: url.want ?? false }) : null;
  el.wanted = want; // for browser tests
  const extraToggles = [...covToggles, ...(want ? [{ key: "want", label: ds.wantedLabel || "Önskade platser", on: want.on }] : [])];
  const extraLegend = [...covLegend, ...(want ? wantedLegend() : [])];
  const extraToggle = (key, on) => { covToggle(key, on); if (key === "want") want.set(on); };
  // Switching on "Önskade platser" or "Utanför regionen" widens the view once, so everything
  // shown fits; switching off leaves the view alone. So does opening with want=1 or foreign=1,
  // unless the URL also gives a view.
  const wantBox = want ? wantedBounds(places) : null;
  if (!ds.beacon) {
    if (url.want && want && !url.view) {
      const fit = () => widenToFit(map, wantBox, { animate: false });
      if (map.loaded()) fit(); else map.once("load", fit);
    }
    if (extraToggles.length) map.addControl(new MapPanel({ toggles: extraToggles, legend: extraLegend, onToggle: (key, on) => {
      extraToggle(key, on);
      if (key === "want" && on) widenToFit(map, wantBox);
      history.replaceState(null, "", location.pathname + writeState(location.search, { cov: cov?.on, dead: cov?.dead, want: want?.on }) + location.hash);
    } }), "top-left");
    return;
  }
  const client = createClient(ds.beacon);
  const iatas = JSON.parse(ds.iatas || "[]");
  const opts = { companions: ds.companions === "true" };
  const state = { nodes: [], borders: [], showForeign: url.foreign ?? true, showLinks: url.links ?? true, live: url.live ?? true, focus: url.focus ?? true, selected: null, onLive: null, miniZoom: null, relays: new Map() };
  let live = true; // false once Beacon is unreachable and the map shows the snapshot
  const saveUrl = (extra = {}) => {
    const q = writeState(location.search, { live: state.live, links: state.showLinks, foreign: state.showForeign, focus: state.focus, cov: cov?.on, dead: cov?.dead, want: want?.on, ...extra });
    history.replaceState(null, "", location.pathname + q + location.hash);
  };
  if (url.view) { map.jumpTo(url.view); map.__userMoved = true; }
  map.on("moveend", (e) => { if (e.originalEvent) saveUrl({ view: { zoom: map.getZoom(), center: map.getCenter().toArray() } }); });
  const popup = attachPopups(map, maplibregl, client);
  const empty = { type: "FeatureCollection", features: [] };
  // Every link coloured by how often it is heard (toggle); with a node clicked (its popup open)
  // the other links turn faint grey. The counts arrive one node at a time after the first draw,
  // at most every 10 minutes per node (neighbours.js).
  const drawLinks = () => addLinkLayer(map, state.showLinks
    ? allLinks(state.nodes, linkCounts.counts(), { selected: state.selected, focus: state.focus }) : empty);
  let linkTimer = 0;
  const linkCounts = linkCountLoader(client, { onUpdate: () => { if (!linkTimer) linkTimer = setTimeout(() => { linkTimer = 0; drawLinks(); }, 400); } });
  el.linkCounts = linkCounts; // for browser tests
  for (const id of ["node-points", "node-pills"]) map.on("click", id, (e) => { state.selected = e.features[0].properties.id; drawLinks(); });
  popup.on("close", () => { state.selected = null; drawLinks(); });
  map.addControl(new MapPanel({
    toggles: [
      { key: "live", label: ds.liveLabel || "Live-trafik", on: state.live },
      { key: "links", label: ds.linksLabel || "Grannlänkar", on: state.showLinks },
      { key: "foreign", label: ds.foreignLabel || "Utanför regionen", on: state.showForeign },
      { key: "focus", label: ds.focusLabel || "Trafikfokus", on: state.focus },
      ...extraToggles,
    ],
    legend: [
      { swatch: "pill-active", label: t("lg_active") },
      { swatch: "pill-stale", label: t("lg_stale") },
      { swatch: "pill-observer", label: t("lg_observer") },
      { swatch: "link-strong", label: t("lg_link_strong"), labelCvd: t("lg_link_strong_cvd") },
      { swatch: "link", label: t("lg_link") },
      { swatch: "link-bg", label: t("lg_link_bg") },
      { swatch: "flow", label: t("lg_flow") },
      ...extraLegend,
    ],
    onToggle: (key, on) => {
      if (key === "links") { state.showLinks = on; drawLinks(); }
      if (key === "foreign") { state.showForeign = on; setForeignVisible(map, on); }
      if (key === "live") { state.live = on; state.onLive?.(on); }
      if (key === "focus") { state.focus = on; applyFocus(map, state); drawLinks(); }
      extraToggle(key, on);
      if ((key === "foreign" || key === "want") && on) widenToFit(map, shown());
      saveUrl();
    },
  }), "top-left");
  // Everything on the map: the nodes shown, the region's border, the wanted places while on.
  const shown = () => expandBounds(pointsBounds(nodePoints(state.nodes, state.showForeign)), unionBbox(state.borders),
    want?.on ? wantBox : null);
  const draw = () => {
    addNodeLayers(map, nodesToGeoJSON(state.nodes, state.relays));
    addBorderLayers(map, state.borders);
    setForeignVisible(map, state.showForeign);
    drawLinks();
    if (live) linkCounts.sweep(state.nodes);
    state.miniZoom = setMiniZoom(map, unionBbox(state.borders) || nodesBounds(state.nodes));
    applyFocus(map, state);
  };
  // The threshold depends on the map's width: recompute after a resize.
  let resizeTimer;
  map.on("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!map.getLayer("node-pills")) return;
      state.miniZoom = setMiniZoom(map, unionBbox(state.borders) || nodesBounds(state.nodes));
      applyFocus(map, state);
    }, 200);
  });
  // A style switch (dark mode) drops every layer; put them back.
  map.on("style.load", () => { if (state.nodes.length || state.borders.length) draw(); });
  try {
    const [nodes, borders, snap] = await Promise.all([
      client.getAll("/nodes", { iatas, neighbors: true, limit: 2000 }),
      loadBorders(client, iatas),
      loadSnapshot(ds.snapshot),
    ]);
    state.seeded = snap?.nodes || [];
    state.nodes = publicNodes(withSeeded(nodes, state.seeded, borders), opts); state.borders = borders;
  } catch (err) {
    // Beacon unreachable from this browser: fall back to the build-time snapshot.
    live = false;
    const snap = await loadSnapshot(ds.snapshot);
    state.nodes = publicNodes(snap?.nodes, opts); state.borders = snap?.borders || [];
    note(el, snap ? (ds.snapshotNote || "Beacon kan inte nås just nu; kartan visar läget från {at}.").replace("{at}", formatAt(snap.at))
      : (ds.offlineNote || "Beacon kan inte nås just nu."));
    console.warn("Beacon unreachable, using the snapshot", err);
  }
  const ready = () => {
    draw();
    if (!frameNodes(map, nodesBounds(state.nodes))) frameBorders(map, state.borders);
    if (!url.view && ((url.want && want?.on) || url.foreign === true)) widenToFit(map, shown(), { animate: false });
  };
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
  let p = el.parentElement.querySelector(".map-note:not(.map-mm)");
  if (!p) { p = document.createElement("p"); p.className = "map-note"; el.after(p); }
  p.textContent = text;
}

// Traffic focus (operator 2026-11-12): small circles, no pills or names, a dimmed
// basemap, bright links; transmissions flash yellow with bubbles along links.
function applyFocus(map, state) {
  if (!map.getLayer("node-points")) return;
  const on = state.focus;
  for (const id of ["node-pills", "node-labels"]) map.setLayoutProperty(id, "visibility", on ? "none" : "visible");
  if (on) {
    map.setPaintProperty("node-points", "circle-radius", 3.5);
    map.setPaintProperty("node-obs-dot", "circle-radius", 1.3);
  } else if (state.miniZoom) {
    map.setPaintProperty("node-points", "circle-radius", ["step", ["zoom"], 6, state.miniZoom, 3.5]);
    map.setPaintProperty("node-obs-dot", "circle-radius", ["step", ["zoom"], 2.2, state.miniZoom, 1.2]);
  }
  if (on && !map.getLayer("focus-dim")) {
    // Under the lowest of our layers, whichever order they were added in.
    const ours = ["region-fill", "coverage-fill", "wanted-area", "links", "node-points"];
    const first = map.getStyle().layers.find((l) => ours.includes(l.id))?.id;
    map.addLayer({ id: "focus-dim", type: "background", paint: { "background-color": "rgba(8, 18, 25, 0.55)" } }, first);
  } else if (!on && map.getLayer("focus-dim")) map.removeLayer("focus-dim");
}

function neighbourPoints(state, id) {
  const byId = new Map(state.nodes.map((n) => [n.id, n]));
  const n = byId.get(id);
  return (n?.neighborIds || []).map((x) => byId.get(x)).filter((m) => m && Number.isFinite(m.lat) && !(m.lat === 0 && m.lng === 0))
    .map((m) => ({ lng: m.lng, lat: m.lat }));
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
  let recount = 0; // pills re-ranked by traffic at most every 10 s
  const recent = new RecentPackets(10);
  const panel = document.getElementById("packets");
  const list = document.getElementById("recent-packets");
  const pathBox = document.getElementById("packet-path");
  let pending = 0;
  const renderRecent = () => {
    if (pending || !list) return;
    pending = requestAnimationFrame(() => {
      pending = 0; panel.hidden = false;
      // Not under the visitor's focus or pointer: a redraw would drop the button they are on.
      if (list.contains(document.activeElement) || list.matches(":hover")) return;
      list.innerHTML = recentListHtml(recent.items);
    });
  };
  list?.addEventListener("focusout", (e) => { if (!list.contains(e.relatedTarget)) renderRecent(); });
  list?.addEventListener("mouseleave", renderRecent);
  // Movement only on screen, and not for visitors who ask for reduced motion: then the
  // observer glow (a fade in place) stays, the travelling flows and bubbles do not.
  const calm = matchMedia("(prefers-reduced-motion: reduce)");
  let onScreen = true;
  if ("IntersectionObserver" in window) new IntersectionObserver((es) => { onScreen = es[es.length - 1].isIntersecting; }).observe(el);
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
  function handle(name, data) {
      if (name === "nodeUpdate") {
        state.nodes = publicNodes(mergeNodeUpdate(state.nodes, data), { companions: ds.companions === "true" });
        if (!redraw) redraw = setTimeout(() => { redraw = 0; draw(); }, 2000); // batch bursts of adverts
        return;
      }
      if (name !== "packetObservation") return;
      const o = data.observation;
      const obsPt = observerPoint(state, o.observerPublicKey);
      const animate = onScreen && !calm.matches;
      if (onScreen) flows.glow(obsPt);
      const chain = visibleOnly(state, chainFromObservation(o, obsPt));
      if (animate) flows.add(chain, { type: data.packet.payloadTypeName });
      for (const p of chain) if (p) state.relays.set(p.id, (state.relays.get(p.id) || 0) + 1);
      if (!recount) recount = setTimeout(() => {
        recount = 0;
        map.getSource("nodes")?.setData(nodesToGeoJSON(state.nodes, state.relays));
      }, 10000);
      if (state.focus && animate) {
        // Every node that sent this packet on flashes and sends bubbles to its neighbours.
        const seen = new Set();
        chain.forEach((p, i) => {
          if (!p || seen.has(p.id) || (obsPt && p.id === obsPt.id)) return;
          seen.add(p.id);
          flows.transmit(p, neighbourPoints(state, p.id), i * HOP_MS);
        });
      }
      recent.add(data);
      renderRecent();
  }
  const feed = new LiveFeed(ds.beacon, {
    iatas, events: ["packetObservation", "nodeUpdate"], resolvePath: true, includeObserverKey: true,
    onEvent: handle,
    // Missed events are only in REST: refresh the nodes.
    onGap: async () => {
      try { state.nodes = publicNodes(withSeeded(await client.getAll("/nodes", { iatas, neighbors: true, limit: 2000 }, { priority: "low" }), state.seeded, state.borders), { companions: ds.companions === "true" }); draw(); } catch { /* next gap */ }
    },
  });
  el.mapDebug = { flows, inject: handle }; // browser tests replay captured events through the same path
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
