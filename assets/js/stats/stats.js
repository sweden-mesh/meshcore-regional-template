// The "Nätet" card: live counts from Beacon. Both node counts come from one
// list, /nodes for the region, nodes not placed elsewhere: the repeaters, and
// the observers of any type, counted on their own (a companion can be an
// observer too; visitor feedback 2026-11-14). (The earlier /stats/node-types + /observers pair counted different
// populations: observers that had not yet advertised as nodes, and all node
// types; two equal numbers looked wrong. Operator's review, 2026-11-12.)
// Packets in the last 24 h come from /stats/payload-breakdown.
// National mode, a county's page (B-330): the county's map area (its IATA) reaches into the
// neighbouring counties, so a node placed outside the county's outline (the test the map hides
// them by, lan/map-county.js) is counted apart, as "+ N i grannlänen". Packets stay per map area:
// Beacon does not say where a packet was heard.
import { inGeometry } from "../lan/geo.js";

const placed = (n) => Number.isFinite(n.lat) && Number.isFinite(n.lng) && !(n.lat === 0 && n.lng === 0);

// isOutside(n) → true for a node outside the county; none on a regional site or Sverige.
export function summarize(nodes, breakdown, isOutside = null) {
  const local = (nodes || []).filter((n) => !n.possiblyForeign);
  const out = (n) => !!isOutside && placed(n) && isOutside(n);
  const count = (f) => [local.filter((n) => f(n) && !out(n)).length, local.filter((n) => f(n) && out(n)).length];
  const [repeaters, repeatersOut] = count((n) => n.nodeType === 2);
  const [online, onlineOut] = count((n) => n.isObserver);
  const packets = (breakdown || []).reduce((n, b) => n + (b.count || 0), 0);
  return { repeaters, online, packets, repeatersOut, onlineOut };
}

// The newest lastSeen (ms) among the nodes summarize counts in the area (not foreign, not outside);
// 0 when there is none. Feeds "Senast hörd nod" under the counts (CONTENT-SV-30).
export function lastHeard(nodes, isOutside = null) {
  let last = 0;
  for (const n of nodes || []) {
    if (n.possiblyForeign || (isOutside && placed(n) && isOutside(n))) continue;
    if (Number(n.lastSeen) > last) last = Number(n.lastSeen);
  }
  return last;
}

// The decimal sign follows the page's language (B-337): a comma in Swedish, a point in English.
export function formatCount(n, lang = globalThis.document?.documentElement.lang || "sv") {
  if (!Number.isFinite(n)) return "–";
  if (n >= 10000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".", lang.startsWith("sv") ? "," : ".")}k`;
  return String(n);
}

// The county's outline test, from data-lan-scb and data-geo; null when the page has none.
async function countyTest(el) {
  const { lanScb, geo } = el.dataset;
  if (!lanScb || !geo) return null;
  const g = (await (await fetch(geo)).json()).features.find((f) => f.properties.scb === lanScb)?.geometry;
  return g ? (n) => !inGeometry(n.lng, n.lat, g) : null;
}

export async function fillStats(el, client, iatas) {
  const [nodes, breakdown, isOutside] = await Promise.all([
    // The same request as the map's (neighbors included), so the page makes it once (B-310).
    client.getAll("/nodes", { iatas, neighbors: true, limit: 2000 }, { share: true }),
    client.get("/stats/payload-breakdown", { iatas }),
    countyTest(el).catch(() => null),
  ]);
  const s = summarize(nodes, breakdown, isOutside);
  for (const [key, value] of Object.entries(s)) {
    for (const target of document.querySelectorAll(`[data-stat="${key}"]`)) target.textContent = formatCount(value);
  }
  // "+ N i grannlänen" under a count, only when there are any.
  for (const target of el.querySelectorAll("[data-stat-out]")) {
    const n = s[`${target.dataset.statOut}Out`] || 0;
    target.textContent = (el.dataset.outText || "+ {n}").replace("{n}", formatCount(n));
    target.hidden = !isOutside || n === 0;
  }
  // The build's "Senast hörd nod …" line, now from the live list, in the visitor's time zone.
  const at = el.querySelector("[data-stat-last]");
  const last = lastHeard(nodes, isOutside);
  if (at && last) {
    const t = new Date(last).toLocaleString("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    at.textContent = at.dataset.statLast.replace("{t}", t);
  }
  const badge = document.getElementById("online-badge");
  if (badge && s.repeaters > 0) badge.hidden = false;
  el.classList.add("stats-live");
  return s;
}
