// National mode, a county's front page: the map's nodes outside the county's polygon are marked
// "foreign", as Beacon marks nodes outside an IATA's border, so the map's "outside the region"
// toggle and dimming also mean "outside the county" (plan P3; Stockholm and Uppsala share STO).
// The map's own code is untouched: this listens to its "nodes" source and marks each new copy.
import { inGeometry } from "./geo.js";

const el = document.getElementById("map");

async function attach(map) {
  const geo = await (await fetch(el.dataset.geo)).json();
  const g = geo.features.find((f) => f.properties.scb === el.dataset.lanScb)?.geometry;
  if (!g) return;
  // The links read nodes from the map's own state, not this source: give the map the same test.
  el.isOutside = (n) => !inGeometry(n.lng, n.lat, g);
  el.redrawLinks?.();
  let busy = false;
  map.on("sourcedata", async (e) => {
    // "SE" on (B-370, el.seMode): the whole country, nothing outside the county to mark.
    if (busy || el.seMode || e.sourceId !== "nodes" || !e.isSourceLoaded) return;
    const src = map.getSource("nodes");
    if (!src?.getData) return;
    const data = await src.getData();
    const feats = data?.features || [];
    if (!feats.length || feats.every((f) => f.properties.lanChecked)) return;
    for (const f of feats) {
      const [lng, lat] = f.geometry.coordinates;
      f.properties.lanChecked = true;
      if (!inGeometry(lng, lat, g)) f.properties.foreign = true;
    }
    busy = true;
    src.setData(data);
    setTimeout(() => { busy = false; }, 0);
  });
}

if (el?.dataset.lanScb && el.dataset.geo) {
  // The map starts when it comes near the viewport (js/map/main.js); wait for it, up to 10 minutes.
  let tries = 0;
  const wait = setInterval(() => {
    if (el.mapInstance) { clearInterval(wait); attach(el.mapInstance).catch(() => {}); }
    else if (++tries > 1200) clearInterval(wait);
  }, 500);
}
