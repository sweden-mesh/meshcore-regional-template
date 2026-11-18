// The live "Senaste paket" list and the packet path view (B-328). Each packet in the list carries
// what the live feed told us: who sent it, its type, the relays of its first observation, the
// last hop's SNR/RSSI, every observation heard since the page opened. Clicking one fits the map to
// the nodes involved and dims the rest; one /packets/{hash} request then adds the observations
// from before the page opened, the channel and, for decrypted channel messages, the sender.
import { chainFromObservation, runs } from "./flow.js";
import { escapeHtml, ago } from "./popup.js";
import { t } from "./texts.js";
import { palette } from "./palette.js";

const colourAt = (i) => { const c = palette().routes; return c[Math.min(i, c.length - 1)]; };

// One entry per observation: who heard it, when (ms after the first), and the drawable runs of
// its route. Fastest first. observerPoint(o) is the observer's own node for observation o.
export function packetRoutes(detail, observerPoint, keep = (chain) => chain) {
  return (detail?.observations || [])
    .map((o) => {
      const end = observerPoint(o);
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
      features.push({ type: "Feature", properties: { colour: colourAt(i), rank: i },
        geometry: { type: "LineString", coordinates: run.map((p) => [p.lng, p.lat]) } });
    }
  });
  return { type: "FeatureCollection", features };
}

// A resolved hop's node: one node, high confidence. Null otherwise: a name is never guessed.
const sure = (hop) => (hop?.confidence === "high" && hop.nodes?.length === 1 ? hop.nodes[0] : null);

// What the list shows of one observation: the origin (name and its key's first 3 bytes), the
// relays (a name where resolved, the hop's bytes otherwise), the hop count, the last hop's signal.
export function packetFacts(data) {
  const o = data?.observation || {};
  const src = sure(o.resolvedSource);
  const size = o.pathLength?.hashSize || 1;
  const bytes = String(o.pathBytes || "").toUpperCase();
  const hops = o.pathLength?.hopCount ?? bytes.length / (2 * size);
  const relays = [];
  for (let i = 0; i < hops; i++) {
    const n = sure(o.resolvedPath?.[i]);
    relays.push(n?.name ? n.name.trim() : bytes.slice(i * 2 * size, (i + 1) * 2 * size) || "?");
  }
  // 0 and 0 is what an observer reports for its own packets: no reception to measure.
  const signal = Number.isFinite(o.snr) && Number.isFinite(o.rssi) && !(o.snr === 0 && o.rssi === 0)
    ? { snr: o.snr, rssi: o.rssi } : null;
  return { origin: src ? { name: (src.name || "").trim(), short: String(src.publicKey || "").slice(0, 6).toUpperCase() } : null,
    hops, relays, signal };
}

// Recent packets from the live feed, newest first, at most `max`. Each keeps its observations (up
// to 40) so a click can draw and fit without asking Beacon; `observerKeys` maps an observer's id to
// its public key, as the live feed reports both and /packets/{hash} only the id.
export class RecentPackets {
  constructor(max = 10) { this.max = max; this.items = []; this.observerKeys = new Map(); }
  add(data) {
    const hash = data.packetHash;
    const o = data.observation;
    if (o?.observerId && o.observerPublicKey) this.observerKeys.set(o.observerId, o.observerPublicKey);
    const existing = this.items.find((p) => p.hash === hash);
    if (existing) {
      existing.count += 1; existing.last = o?.heardAt || Date.now();
      if (o && existing.obs.length < 40) existing.obs.push(o);
      if (!existing.source && o?.resolvedSource) existing.source = o.resolvedSource;
      return false;
    }
    this.items.unshift({ hash, type: data.packet?.payloadTypeName || "", summary: data.packet?.summary || "",
      count: 1, last: o?.heardAt || Date.now(), facts: packetFacts(data), obs: o ? [o] : [], source: o?.resolvedSource || null });
    if (this.items.length > this.max) this.items.length = this.max;
    return true;
  }
  get(hash) { return this.items.find((p) => p.hash === hash) || null; }
}

const typeLabel = (type) => { const s = t(`pk_${type}`); return s === `pk_${type}` ? type : s; };
const num = (x) => String(x).replace(".", t("decimal")).replace("-", "−");

// The list. Every packet: type, origin, channel, age; on wider screens a second line with the hop
// count, the relays and the last hop's signal (.pk-more, hidden on phones by the stylesheet).
export function recentListHtml(items, { selected = null, now = Date.now() } = {}) {
  if (!items.length) return "";
  return items.map((p) => {
    const f = p.facts || {};
    const origin = f.origin || (p.sender ? { name: p.sender } : null);
    const head = [`<span class="pk-type">${escapeHtml(typeLabel(p.type))}</span>`];
    if (origin?.name || origin?.short) {
      head.push(`${escapeHtml(origin.name || "")}${origin.short ? ` <span class="pk-key">${escapeHtml(origin.short)}</span>` : ""}`);
    } else if (p.summary) head.push(escapeHtml(p.summary));
    if (p.channel) head.push(escapeHtml(p.channel));
    const more = [];
    if (Number.isFinite(f.hops)) more.push(escapeHtml(t("hops", { n: f.hops })) + (f.relays?.length ? `: ${f.relays.map(escapeHtml).join(" › ")}` : ""));
    if (f.signal) more.push(`SNR ${escapeHtml(num(f.signal.snr))} dB, RSSI ${escapeHtml(num(f.signal.rssi))} dBm`);
    more.push(escapeHtml(t("heard_times", { n: p.count })));
    return `<li><button type="button" data-hash="${escapeHtml(p.hash)}" aria-pressed="${p.hash === selected}">` +
      `<span class="pk-head">${head.join(" · ")} <span class="muted">· ${escapeHtml(ago(p.last, now))}</span></span>` +
      `<span class="pk-more muted">${more.join(" · ")}</span></button></li>`;
  }).join("");
}

export function routesListHtml(routes) {
  return routes.map((r, i) => `<li><span class="swatch" style="background:${colourAt(i)}"></span>` +
    `${escapeHtml(r.observerName)} <span class="muted">+${r.ms} ms · ${escapeHtml(t("hops", { n: r.hops }))}` +
    `${r.runs.length ? "" : ` · ${escapeHtml(t("route_unknown"))}`}</span></li>`).join("");
}

// The observations to draw for a packet: those from /packets/{hash} when fetched, else the live
// ones; the live feed's resolved source fills in where the detail has none.
export function packetObservations(item, detail) {
  const list = detail?.observations?.length ? detail.observations : item?.obs || [];
  const live = new Map((item?.obs || []).map((o) => [o.observerId, o]));
  return list.map((o) => {
    const l = live.get(o.observerId);
    return { ...o, observerPublicKey: o.observerPublicKey || l?.observerPublicKey,
      resolvedSource: o.resolvedSource || l?.resolvedSource || item?.source || undefined };
  });
}

// The nodes a packet touched that are on the map: the drawn routes' points and every located
// observer. Returns their ids and [lng, lat] points.
export function involved(routes, observerPoints = []) {
  const byId = new Map();
  for (const r of routes) for (const run of r.runs) for (const p of run) byId.set(p.id, p);
  for (const p of observerPoints) if (p) byId.set(p.id, p);
  return { ids: [...byId.keys()], points: [...byId.values()].map((p) => [p.lng, p.lat]) };
}

// The channel of a channel message, from the first byte of its key's SHA-256 (Beacon's
// channelHash): Public, or one of the hashtag channels everyone can derive. Null when unknown.
const PUBLIC_KEY = "8b3387e9c5cdea6ac9e5edbaa115cd72";
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const fromHex = (h) => new Uint8Array(h.match(/../g).map((x) => parseInt(x, 16)));
export async function channelName(hash, iatas = [], subtle = globalThis.crypto?.subtle) {
  if (!hash || !subtle) return null;
  const want = String(hash).toLowerCase();
  const first = async (key) => hex(await subtle.digest("SHA-256", key)).slice(0, 2);
  if (await first(fromHex(PUBLIC_KEY)) === want) return "Public";
  const tags = ["#test", ...iatas.map((i) => `#test-${String(i).toLowerCase()}`), "#wardriving", "#bot"];
  for (const name of tags) {
    const key = hex(await subtle.digest("SHA-256", new TextEncoder().encode(name))).slice(0, 32);
    if (await first(fromHex(key)) === want) return name;
  }
  return null;
}

// Dimming for a picked packet: `base` (a layer's own paint value) for the involved nodes, `dim`
// for the rest. ids null = nothing picked, the base back; with `soft` (B-347: the national
// overview, nothing selected) the dimmed look below zoom SOFT_UNTIL and the base from there in.
export const SOFT_UNTIL = 7;
export function pickPaint(base, ids, dim, prop = "id", soft = false) {
  if (!ids) return soft ? ["step", ["zoom"], dim, SOFT_UNTIL, base] : base;
  return ["case", ["in", ["get", prop], ["literal", ids]], base, dim];
}

// The node and link layers' own opacities (as nodes.js and neighbours.js add them).
const fade = (v) => ["case", ["get", "foreign"], v, 1];
const DIM = 0.12, LINK_DIM = 0.06;
// B-352 (operator 2026-11-18): the soft overview is somewhat stronger on the light basemap, where
// the dark map's levels are too faint; the dark map keeps exactly the B-347 levels. Pure, for tests.
export function softLevels(soft) {
  return soft === "light" ? { node: 0.3, link: 0.15 } : { node: DIM, link: LINK_DIM };
}
// `soft`: the overview of many regions (the national Sverige view) is drawn zoomed out the way a
// picked packet dims the rest: faint nodes and links, so the transmissions stand out. Operator
// 2026-11-18 (B-347): the look he saw after picking a packet, wanted as the normal one. `soft` is
// false, or the basemap's theme ("dark" or "light"; true reads as dark).
export function applyPick(map, ids, soft = false) {
  const lv = ids ? { node: DIM, link: LINK_DIM } : softLevels(soft);
  const set = (layer, prop, base) => { if (map.getLayer(layer)) map.setPaintProperty(layer, prop, pickPaint(base, ids, lv.node, "id", !!soft)); };
  set("node-points", "circle-opacity", fade(0.4));
  set("node-points", "circle-stroke-opacity", fade(0.4));
  set("node-obs-dot", "circle-opacity", fade(0.4));
  set("node-pills", "icon-opacity", fade(0.45));
  set("node-pills", "text-opacity", fade(0.45));
  set("node-labels", "text-opacity", 1);
  if (map.getLayer("links")) {
    // A link stays when both its ends are involved.
    map.setPaintProperty("links", "line-opacity", ids
      ? ["case", ["all", ["in", ["get", "a"], ["literal", ids]], ["in", ["get", "b"], ["literal", ids]]], ["get", "opacity"], LINK_DIM]
      : soft ? ["step", ["zoom"], lv.link, SOFT_UNTIL, ["get", "opacity"]] : ["get", "opacity"]);
  }
}

export function addPathLayer(map, data) {
  if (map.getSource("packet-path")) { map.getSource("packet-path").setData(data); return; }
  map.addSource("packet-path", { type: "geojson", data });
  map.addLayer({ id: "packet-path", type: "line", source: "packet-path", layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": ["get", "colour"], "line-width": ["case", ["==", ["get", "rank"], 0], 5, 3], "line-opacity": 0.85 } },
    map.getLayer("node-points") ? "node-points" : undefined);
}
