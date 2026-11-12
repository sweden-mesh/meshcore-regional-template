// Map island entry point. Settings come from #map's data attributes, written
// by layouts/_partials/map.html from the site's params.
import { createMap } from "./basemap.js";
import { createClient } from "../beacon/rest.js";
import { nodesToGeoJSON, addNodeLayers } from "./nodes.js";

const el = document.getElementById("map");

async function start() {
  const { map } = await createMap(el);
  const ds = el.dataset;
  if (!ds.beacon) return;
  const client = createClient(ds.beacon);
  const iatas = JSON.parse(ds.iatas || "[]");
  const state = { nodes: [] };
  const draw = () => addNodeLayers(map, nodesToGeoJSON(state.nodes));
  // A style switch (dark mode) drops every layer; put them back.
  map.on("style.load", () => { if (state.nodes.length) draw(); });
  state.nodes = await client.getAll("/nodes", { iatas, neighbors: true, limit: 2000 });
  if (map.isStyleLoaded()) draw(); else map.once("load", draw);
  return { map, client, state };
}

if (el) {
  start().catch((err) => {
    el.classList.add("map-failed");
    el.textContent = el.dataset.failText || "Kartan kunde inte laddas.";
    console.error(err);
  });
}
