// Packet path view: pick a packet from the recent list, see the route it took
// to every observer that heard it (/packets/{hash}), fastest first. Observers
// are mapped to their node by public key via /observers/{id} (cached).
import { chainFromObservation, runs } from "./flow.js";
import { escapeHtml } from "./popup.js";
import { t } from "./texts.js";

const PALETTE = ["#16a34a", "#0ea5e9", "#a855f7", "#f59e0b", "#ef4444", "#14b8a6", "#64748b"];

// One entry per observation: who heard it, when (ms after the first), and the
// drawable runs of its route. Fastest first.
export function packetRoutes(detail, observerPoint, keep = (chain) => chain) {
  return (detail?.observations || [])
    .map((o) => {
      const end = observerPoint(o.observerId);
      return { observerId: o.observerId, observerName: o.observerName || "", ms: o.propagationTimeMs ?? 0,
        snr: o.snr, hops: o.pathLength?.hopCount ?? (o.resolvedPath || []).length,
        runs: runs(keep(chainFromObservation(o, end))), located: !!end };
    })
    .sort((a, b) => a.ms - b.ms);
}

export function routesToGeoJSON(routes) {
  const features = [];
  routes.forEach((r, i) => {
    for (const run of r.runs) {
      features.push({ type: "Feature", properties: { colour: PALETTE[Math.min(i, PALETTE.length - 1)], rank: i },
        geometry: { type: "LineString", coordinates: run.map((p) => [p.lng, p.lat]) } });
    }
  });
  return { type: "FeatureCollection", features };
}

// Recent packets from the live feed, newest first, at most `max`.
export class RecentPackets {
  constructor(max = 10) { this.max = max; this.items = []; }
  add(data) {
    const hash = data.packetHash;
    const existing = this.items.find((p) => p.hash === hash);
    if (existing) { existing.count += 1; existing.last = data.observation?.heardAt || Date.now(); return false; }
    this.items.unshift({ hash, type: data.packet?.payloadTypeName || "", summary: data.packet?.summary || "",
      count: 1, last: data.observation?.heardAt || Date.now() });
    if (this.items.length > this.max) this.items.length = this.max;
    return true;
  }
}

const typeLabel = (type) => { const s = t(`pk_${type}`); return s === `pk_${type}` ? type : s; };

export function recentListHtml(items) {
  if (!items.length) return "";
  return items.map((p) => `<li><button type="button" data-hash="${escapeHtml(p.hash)}">` +
    `${escapeHtml(typeLabel(p.type))}${p.summary ? ` · ${escapeHtml(p.summary)}` : ""}` +
    ` <span class="muted">· ${escapeHtml(t("heard_times", { n: p.count }))}</span></button></li>`).join("");
}

export function routesListHtml(routes) {
  return routes.map((r, i) => `<li><span class="swatch" style="background:${PALETTE[Math.min(i, PALETTE.length - 1)]}"></span>` +
    `${escapeHtml(r.observerName)} <span class="muted">+${r.ms} ms · ${escapeHtml(t("hops", { n: r.hops }))}` +
    `${r.runs.length ? "" : ` · ${escapeHtml(t("route_unknown"))}`}</span></li>`).join("");
}

export function addPathLayer(map, data) {
  if (map.getSource("packet-path")) { map.getSource("packet-path").setData(data); return; }
  map.addSource("packet-path", { type: "geojson", data });
  map.addLayer({ id: "packet-path", type: "line", source: "packet-path", layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": ["get", "colour"], "line-width": ["case", ["==", ["get", "rank"], 0], 5, 3], "line-opacity": 0.85 } },
    map.getLayer("node-points") ? "node-points" : undefined);
}
