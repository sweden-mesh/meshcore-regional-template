// Neighbour links: which repeaters hear each other directly. Beacon derives the edges from
// adverts, zero-hop receptions, TRACE hops and observers' neighbour reports.
//
// Every link is coloured by how often it is heard (operator 2026-11-15): the counts come from
// /nodes/{id}/neighbors, one request per node, fetched after the map is drawn (linkCountLoader)
// and kept for the session. Until a link's count arrives, or when its requests fail, it stays
// neutral grey. With a node selected, its links keep their colours and every other link turns
// a faint grey.
import { validPosition } from "./nodes.js";
import { palette } from "./palette.js";

const FADE_DAYS = 28;
// The scale: log10 of the count, absolute (not relative to any node), so a link has the same
// colour with and without a selection: ~1 observation rare, ~20 middle, ~160 and up often.
export const STOPS = [0, 1.3, 2.2];

export const linkKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);

// /nodes/{id}/neighbors rows of every fetched node -> one { count, lastSeen } per link. A link
// shows up in both ends' lists with different counts (A hearing B and B hearing A are separate
// receptions, e.g. 203 against 5), so the two directions are summed: the link's total use. A
// node's rows per IATA are summed as well.
export function mergeLinkCounts(rowsByNode) {
  const out = new Map();
  for (const [id, rows] of rowsByNode) {
    for (const r of rows || []) {
      if (!r?.id || r.id === id) continue;
      const k = linkKey(id, r.id), cur = out.get(k) || { count: 0, lastSeen: 0 };
      cur.count += r.observationCount || 0;
      cur.lastSeen = Math.max(cur.lastSeen, r.lastSeen || 0);
      out.set(k, cur);
    }
  }
  return out;
}

// "all" with nothing selected; "own" for the selected node's links; "background" for the rest.
export function linkRole(a, b, selected) {
  if (!selected) return "all";
  return a === selected || b === selected ? "own" : "background";
}

const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

// A count on the ramp [rare, middle, often] at STOPS, interpolated in RGB like MapLibre does;
// null for no count.
export function rampColour(count, ramp) {
  if (!(count > 0)) return null;
  const x = Math.log10(count);
  if (x <= STOPS[0]) return ramp[0];
  if (x >= STOPS[2]) return ramp[2];
  const i = x < STOPS[1] ? 0 : 1, f = (x - STOPS[i]) / (STOPS[i + 1] - STOPS[i]);
  const [p, q] = [hex(ramp[i]), hex(ramp[i + 1])];
  return toHex(p.map((v, j) => v + (q[j] - v) * f));
}

// What a link looks like: colour, width, opacity. Traffic focus draws every link a bit thinner.
export function linkStyle({ count = 0, age = 0, role = "all" }, { p = palette(), focus = false } = {}) {
  if (role === "background") return { colour: p.linkMuted, width: 1, opacity: 0.3 };
  const c = rampColour(count, p.linkRamp);
  if (!c) return { colour: p.linkNone, width: focus ? 2.2 : 1.2, opacity: 0.85 };
  return { colour: c, width: focus ? 2.2 : 2.5, opacity: Math.round((0.85 - 0.6 * age) * 100) / 100 };
}

// One line per unordered pair whose both ends have a position: the pairs in the node list's
// neighborIds and in the fetched counts.
export function allLinks(nodes, counts = new Map(), { selected = null, focus = false, p = palette(), now = Date.now() } = {}) {
  const byId = new Map((nodes || []).filter(validPosition).map((n) => [n.id, n]));
  const pairs = new Map();
  for (const n of byId.values()) for (const other of n.neighborIds || []) {
    const k = linkKey(n.id, other);
    if (byId.has(other) && !pairs.has(k)) pairs.set(k, [n.id, other]);
  }
  for (const k of counts.keys()) {
    const [a, b] = k.split("|");
    if (byId.has(a) && byId.has(b) && !pairs.has(k)) pairs.set(k, [a, b]);
  }
  const features = [];
  for (const [k, [a, b]] of pairs) {
    const c = counts.get(k), m = byId.get(a), n = byId.get(b);
    const age = c?.lastSeen ? Math.min(1, Math.max(0, (now - c.lastSeen) / (FADE_DAYS * 86400e3))) : 0;
    const props = { a, b, count: c?.count || 0, age, role: linkRole(a, b, selected) };
    features.push({ type: "Feature", properties: { ...props, ...linkStyle(props, { p, focus }) },
      geometry: { type: "LineString", coordinates: [[m.lng, m.lat], [n.lng, n.lat]] } });
  }
  return { type: "FeatureCollection", features };
}

// Fetches /nodes/{id}/neighbors for the nodes that have neighbours: `concurrency` at a time,
// `staggerMs` between starts, and a node again only after `maxAgeMs`. onUpdate runs after each
// arrival. Failures leave the node out (its links stay neutral) until the next sweep.
export function linkCountLoader(client, { concurrency = 3, staggerMs = 150, maxAgeMs = 600e3, onUpdate = () => {},
  sleep = (ms) => new Promise((r) => setTimeout(r, ms)), clock = () => Date.now() } = {}) {
  const rows = new Map(), fetchedAt = new Map();
  let running = null, requests = 0;
  async function sweep(nodes) {
    if (running) return running;
    const now = clock();
    const due = (nodes || []).filter((n) => validPosition(n) && (n.neighborIds?.length || n.knownNeighborCount > 0)
      && !(now - (fetchedAt.get(n.id) ?? -Infinity) < maxAgeMs)).map((n) => n.id);
    if (!due.length) return;
    for (const id of due) fetchedAt.set(id, now);
    running = (async () => {
      let next = 0;
      const worker = async (w) => {
        await sleep(w * staggerMs);
        while (next < due.length) {
          const id = due[next++];
          requests++;
          try {
            rows.set(id, await client.get(`/nodes/${encodeURIComponent(id)}/neighbors`, undefined, { priority: "low" }) || []);
            onUpdate();
          } catch { /* stays neutral */ }
          if (next < due.length) await sleep(staggerMs);
        }
      };
      await Promise.all(Array.from({ length: Math.min(concurrency, due.length) }, (_, w) => worker(w)));
    })().finally(() => { running = null; });
    return running;
  }
  return { sweep, rows, counts: () => mergeLinkCounts(rows), requests: () => requests };
}

export function addLinkLayer(map, data, id = "links") {
  if (map.getSource(id)) { map.getSource(id).setData(data); return; }
  map.addSource(id, { type: "geojson", data });
  map.addLayer({ id, type: "line", source: id,
    layout: { "line-cap": "round", "line-sort-key": ["case", ["==", ["get", "role"], "background"], 0, 1] },
    paint: { "line-color": ["get", "colour"], "line-width": ["get", "width"], "line-opacity": ["get", "opacity"] } },
    map.getLayer("node-points") ? "node-points" : undefined);
}
