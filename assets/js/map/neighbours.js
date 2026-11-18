// Neighbour links: which repeaters hear each other directly. Beacon derives the edges from
// adverts, zero-hop receptions, TRACE hops and observers' neighbour reports.
//
// Every link is coloured by how often it is heard (operator 2026-11-15): the counts come from a
// links file (params.beacon.links) or else /nodes/{id}/neighbors, one request per node on the
// map, fetched after the map is drawn (linkCountLoader) and kept for the session. Until a link's count arrives, or when its requests fail, it stays
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

// B-350: with Live-trafik on, links with no node selected are drawn at this share of their opacity,
// so the flashes stand out; a selected node's own links keep full strength.
export const MUTE = 0.35;

// What a link looks like: colour, width, opacity. Traffic focus draws every link a bit thinner;
// `muted` (live traffic on) dims the links of the "all" role.
export function linkStyle({ count = 0, age = 0, role = "all" }, { p = palette(), focus = false, muted = false } = {}) {
  if (role === "background") return { colour: p.linkMuted, width: 1, opacity: 0.3 };
  const c = rampColour(count, p.linkRamp);
  const k = muted && role === "all" ? MUTE : 1;
  const r2 = (x) => Math.round(x * k * 100) / 100;
  if (!c) return { colour: p.linkNone, width: focus ? 2.2 : 1.2, opacity: r2(0.85) };
  return { colour: c, width: focus ? 2.2 : 2.5, opacity: r2(0.85 - 0.6 * age) };
}

// B-350: the other ends of the drawn links of node `id`, with each link's colour, for the flash
// when it transmits. `fc` is what allLinks returned.
export function linkEnds(fc, id) {
  const out = [];
  for (const f of fc?.features || []) {
    const { a, b, colour } = f.properties, [pa, pb] = f.geometry.coordinates;
    if (a === id) out.push({ id: b, lng: pb[0], lat: pb[1], colour });
    else if (b === id) out.push({ id: a, lng: pa[0], lat: pa[1], colour });
  }
  return out;
}

// One line per unordered pair whose both ends have a position: the pairs in the node list's
// neighborIds and in the fetched counts. With `foreign` off ("Utanför regionen" hidden) a link
// with an end outside the region is left out too, since that end is not on the map.
export function allLinks(nodes, counts = new Map(), { selected = null, focus = false, foreign = true, muted = false, p = palette(), now = Date.now() } = {}) {
  const byId = new Map((nodes || []).filter((n) => validPosition(n) && (foreign || !n.possiblyForeign)).map((n) => [n.id, n]));
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
    features.push({ type: "Feature", properties: { ...props, ...linkStyle(props, { p, focus, muted }) },
      geometry: { type: "LineString", coordinates: [[m.lng, m.lat], [n.lng, n.lat]] } });
  }
  return { type: "FeatureCollection", features };
}

// A links file's pairs (Beacon's /static/neighbors.json: { generatedAt, pairs: [{ nodeId,
// neighborId, iata, observationCount, lastSeen }] }, directed, as /nodes/{id}/neighbors returns
// them) -> one { count, lastSeen } per link, merged as mergeLinkCounts does: both directions and
// every IATA summed. Only pairs of `iatas` count (all of them when empty).
export function mergePairCounts(pairs, iatas = []) {
  const out = new Map(), only = iatas.length ? new Set(iatas) : null;
  for (const r of pairs || []) {
    if (!r?.nodeId || !r?.neighborId || r.nodeId === r.neighborId || (only && !only.has(r.iata))) continue;
    const k = linkKey(r.nodeId, r.neighborId), cur = out.get(k) || { count: 0, lastSeen: 0 };
    cur.count += r.observationCount || 0;
    cur.lastSeen = Math.max(cur.lastSeen, r.lastSeen || 0);
    out.set(k, cur);
  }
  return out;
}

// A `bulk` for linkCountLoader: the pairs of the links file `links`, or of one file per IATA when
// it holds {iata}; there a 404 is an area with no links yet. If those fail otherwise, the file
// `all` (one for every IATA) instead.
export function linksFile({ links, all = "", iatas = [], fetch = globalThis.fetch.bind(globalThis) }) {
  const get = async (u, area) => {
    const r = await fetch(u, { priority: "low" });
    if (area && r.status === 404) return [];
    if (!r.ok) throw new Error(`links ${r.status}`);
    return (await r.json())?.pairs || [];
  };
  return async () => {
    if (!links.includes("{iata}")) return get(links, false);
    try {
      return (await Promise.all(iatas.map((i) => get(links.replaceAll("{iata}", encodeURIComponent(i)), true)))).flat();
    } catch (err) {
      if (!all) throw err;
      return get(all, false);
    }
  };
}

const neighbourSig = (n) => (n.neighborIds || []).slice().sort().join(",");

// The link counts behind the colours (B-309). With `bulk` (a function returning the pairs of one
// or more links files; those of `iatas` count) one request per sweep, at most every `bulkMaxAgeMs`; if it
// fails, that sweep falls back to the nodes. Without it, /nodes/{id}/neighbors for the nodes with neighbours that sweep(nodes,
// { want }) asks for (main.js: the ones on the map, in or near the view): `concurrency` at a
// time, `staggerMs` between starts. A node is fetched again after `maxAgeMs`, or after
// `changedAgeMs` if its neighbour list changed. `stop()` true (tab hidden) ends a sweep early; the
// nodes it skipped stay due. A sweep asked for while one runs follows it. onUpdate runs after each
// arrival. Failures leave the node out (its links stay neutral) until the next sweep.
export function linkCountLoader(client, { concurrency = 3, staggerMs = 150, maxAgeMs = 1800e3, changedAgeMs = 600e3,
  bulk = null, bulkMaxAgeMs = 600e3, iatas = [], onUpdate = () => {}, stop = () => false,
  sleep = (ms) => new Promise((r) => setTimeout(r, ms)), clock = () => Date.now() } = {}) {
  const rows = new Map(), fetchedAt = new Map(), sigs = new Map();
  let running = null, queued = null, requests = 0, pairs = null, bulkAt = -Infinity;
  async function sweepNodes(nodes, want) {
    const now = clock();
    const due = (nodes || []).filter((n) => {
      if (!validPosition(n) || !(n.neighborIds?.length || n.knownNeighborCount > 0) || !want(n)) return false;
      const age = now - (fetchedAt.get(n.id) ?? -Infinity);
      return age >= maxAgeMs || (sigs.get(n.id) !== neighbourSig(n) && age >= changedAgeMs);
    });
    for (const n of due) { fetchedAt.set(n.id, now); sigs.set(n.id, neighbourSig(n)); }
    let next = 0;
    const worker = async (w) => {
      await sleep(w * staggerMs);
      while (next < due.length) {
        if (stop()) { for (const n of due.slice(next)) fetchedAt.delete(n.id); next = due.length; return; }
        const id = due[next++].id;
        requests++;
        try {
          rows.set(id, await client.get(`/nodes/${encodeURIComponent(id)}/neighbors`, undefined, { priority: "low" }) || []);
          onUpdate();
        } catch { /* stays neutral */ }
        if (next < due.length) await sleep(staggerMs);
      }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, due.length) }, (_, w) => worker(w)));
  }
  async function run(nodes, want) {
    if (bulk) {
      if (clock() - bulkAt < bulkMaxAgeMs) return;
      requests++;
      bulkAt = clock(); // a failed file is tried again after bulkMaxAgeMs too
      try { pairs = await bulk(); onUpdate(); return; } catch { /* fall back to the nodes */ }
    }
    await sweepNodes(nodes, want);
  }
  function sweep(nodes, { want = () => true } = {}) {
    if (running) { queued = [nodes, want]; return running; }
    running = run(nodes, want).finally(() => {
      running = null;
      if (queued) { const [n, w] = queued; queued = null; sweep(n, { want: w }); }
    });
    return running;
  }
  const counts = () => {
    const own = mergeLinkCounts(rows);
    if (!pairs) return own;
    const out = mergePairCounts(pairs, iatas);
    for (const [k, v] of own) if (!out.has(k)) out.set(k, v);
    return out;
  };
  return { sweep, rows, counts, requests: () => requests, idle: () => (running || Promise.resolve()) };
}

export function addLinkLayer(map, data, id = "links") {
  if (map.getSource(id)) { map.getSource(id).setData(data); return; }
  map.addSource(id, { type: "geojson", data });
  map.addLayer({ id, type: "line", source: id,
    layout: { "line-cap": "round", "line-sort-key": ["case", ["==", ["get", "role"], "background"], 0, 1] },
    paint: { "line-color": ["get", "colour"], "line-width": ["get", "width"], "line-opacity": ["get", "opacity"] } },
    map.getLayer("node-points") ? "node-points" : undefined);
}
