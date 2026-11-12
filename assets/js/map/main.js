// Map island entry point. Settings come from #map's data attributes, written
// by layouts/_partials/map.html from the site's params.
import { createMap } from "./basemap.js";
import { createClient } from "../beacon/rest.js";
import { nodesToGeoJSON, addNodeLayers } from "./nodes.js";
import { attachPopups } from "./popup.js";
import { LiveFeed } from "../beacon/live.js";
import { FlowLayer, chainFromObservation } from "./flow.js";
import { packetRoutes, routesToGeoJSON, RecentPackets, recentListHtml, routesListHtml, addPathLayer } from "./packetpath.js";
import { ForeignToggle as Toggle } from "./region.js";
import { allLinks, selectedLinks, addLinkLayer, LinkModeControl } from "./neighbours.js";
import { loadBorders, addBorderLayers, frameBorders, ForeignToggle, setForeignVisible } from "./region.js";

const el = document.getElementById("map");

async function start() {
  const { map, maplibregl } = await createMap(el);
  el.mapInstance = map; // for debugging and browser tests
  const ds = el.dataset;
  if (!ds.beacon) return;
  const client = createClient(ds.beacon);
  const iatas = JSON.parse(ds.iatas || "[]");
  const state = { nodes: [], borders: [], showForeign: true, linkMode: "all", selected: null };
  const popup = attachPopups(map, maplibregl, client);
  const drawLinks = async () => {
    if (state.linkMode === "off") return addLinkLayer(map, { type: "FeatureCollection", features: [] });
    if (state.linkMode === "all" || !state.selected) return addLinkLayer(map, allLinks(state.nodes));
    const node = state.nodes.find((n) => n.id === state.selected);
    try {
      addLinkLayer(map, selectedLinks(node, await client.get(`/nodes/${encodeURIComponent(state.selected)}/neighbors`)));
    } catch { addLinkLayer(map, { type: "FeatureCollection", features: [] }); }
  };
  map.on("click", "node-points", (e) => { state.selected = e.features[0].properties.id; if (state.linkMode === "selected") drawLinks(); });
  popup.on("close", () => { if (state.linkMode === "selected") { state.selected = null; drawLinks(); } });
  map.addControl(new LinkModeControl({ title: ds.linksLabel || "Grannlänkar",
    options: { all: ds.linksAll || "alla", selected: ds.linksSelected || "vald nod", off: ds.linksOff || "av" } },
    state.linkMode, (m) => { state.linkMode = m; drawLinks(); }), "top-left");
  const draw = () => {
    addNodeLayers(map, nodesToGeoJSON(state.nodes));
    addBorderLayers(map, state.borders);
    setForeignVisible(map, state.showForeign);
    drawLinks();
  };
  // A style switch (dark mode) drops every layer; put them back.
  map.on("style.load", () => { if (state.nodes.length || state.borders.length) draw(); });
  map.addControl(new ForeignToggle(ds.foreignLabel || "Noder utanför regionen", (v) => {
    state.showForeign = v; setForeignVisible(map, v);
  }), "top-left");
  const [nodes, borders] = await Promise.all([
    client.getAll("/nodes", { iatas, neighbors: true, limit: 2000 }),
    loadBorders(client, iatas),
  ]);
  state.nodes = nodes; state.borders = borders;
  const ready = () => { draw(); frameBorders(map, borders); };
  if (map.isStyleLoaded()) ready(); else map.once("load", ready);
  startLive(map, ds, client, iatas, state, draw);
  return { map, client, state };
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
  const flows = new FlowLayer(map);
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
      const routes = packetRoutes(detail, (id) => observerPoint(state, keys.get(id)));
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
    iatas, events: ["packetObservation"], resolvePath: true, includeObserverKey: true,
    onEvent: (name, data) => {
      if (name !== "packetObservation") return;
      const o = data.observation;
      const obsPt = observerPoint(state, o.observerPublicKey);
      flows.glow(obsPt);
      flows.add(chainFromObservation(o, obsPt), { type: data.packet.payloadTypeName });
      recent.add(data);
      renderRecent();
    },
    // Missed events are only in REST: refresh the nodes.
    onGap: async () => {
      try { state.nodes = await client.getAll("/nodes", { iatas, neighbors: true, limit: 2000 }); draw(); } catch { /* next gap */ }
    },
  });
  map.addControl(new Toggle(ds.liveLabel || "Live-trafik", (on) => {
    flows.setEnabled(on);
    if (on) feed.start(); else feed.stop();
  }), "top-left");
  feed.start();
  return feed;
}

if (el) {
  start().catch((err) => {
    el.classList.add("map-failed");
    el.textContent = el.dataset.failText || "Kartan kunde inte laddas.";
    console.error(err);
  });
}
