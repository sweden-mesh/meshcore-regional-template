// The map island. Reads its settings from #map's data attributes.
// Next: MapLibre GL with the region's nodes from Beacon's REST API, and live
// packets from Beacon's /ws subscription filtered to the region's IATA.
const el = document.getElementById("map");
if (el && el.dataset.beacon) {
  const iatas = JSON.parse(el.dataset.iatas || "[]");
  const center = JSON.parse(el.dataset.center || "[0,0]");
  el.textContent = `Karta över ${iatas.join(", ")} (centrum ${center.join(", ")}) kommer här.`;
}
