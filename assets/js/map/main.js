// Map island entry point. Settings come from #map's data attributes, written
// by layouts/_partials/map.html from the site's params.
import { createMap } from "./basemap.js";
import { createClient } from "../beacon/rest.js";
import { nodesToGeoJSON, addNodeLayers } from "./nodes.js";
import { attachPopups } from "./popup.js";
import { LiveFeed } from "../beacon/live.js";
import { FlowLayer, chainFromObservation } from "./flow.js";
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
  map.on("style.load", () => flows.install());
  const feed = new LiveFeed(ds.beacon, {
    iatas, events: ["packetObservation"], resolvePath: true, includeObserverKey: true,
    onEvent: (name, data) => {
      if (name !== "packetObservation") return;
      const o = data.observation;
      const obsPt = observerPoint(state, o.observerPublicKey);
      flows.glow(obsPt);
      flows.add(chainFromObservation(o, obsPt), { type: data.packet.payloadTypeName });
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
