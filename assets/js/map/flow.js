// Live packet flow. For each packetObservation (resolvePath on) the physical
// route is: the source node, the repeaters in the path, the observer that heard
// it. Only high-confidence hops with a position are drawn; an unresolved hop
// breaks the line instead of being guessed, so every drawn segment is real.
// Measured 2026-11-12: only 7 % of JKG chains resolve completely, so runs of
// resolved hops are animated too (planning/meshcore-jkp.se/live-volume-20261112.md).

export const HOP_MS = 480;
export const FADE_MS = 900;
export const BUBBLE_MS = 700;

// A transmission seen as a radio broadcast: one bubble per neighbour, moving
// from the transmitter to it. Pure, for tests.
export function bubblePositions(from, neighbours, t) {
  const f = Math.max(0, Math.min(1, t / BUBBLE_MS));
  return neighbours.map((n) => [from.lng + (n.lng - from.lng) * f, from.lat + (n.lat - from.lat) * f]);
}

function point(hop) {
  if (!hop || hop.confidence !== "high") return null;
  const n = (hop.nodes || [])[0];
  if (!n || (hop.nodes || []).length !== 1) return null;
  const { longitude: lng, latitude: lat } = n;
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) return null;
  return { id: n.id, lng, lat };
}

// The chain as points or nulls. observerPoint is the observer's own node, if known.
export function chainFromObservation(obs, observerPoint = null) {
  const chain = [];
  if (obs.resolvedSource) chain.push(point(obs.resolvedSource));
  for (const h of obs.resolvedPath || []) chain.push(point(h));
  chain.push(observerPoint);
  return chain;
}

// Runs of consecutive known points, each at least two long; a point repeated
// back to back (a node heard by itself) is collapsed.
export function runs(chain) {
  const out = [];
  let cur = [];
  for (const p of chain) {
    if (!p) { if (cur.length >= 2) out.push(cur); cur = []; continue; }
    if (cur.length && cur[cur.length - 1].id === p.id) continue;
    cur.push(p);
  }
  if (cur.length >= 2) out.push(cur);
  return out;
}

// Position along a run after t ms: { coords: [lng, lat], trail: [[lng,lat]...], done }.
export function positionAt(run, t) {
  const hops = run.length - 1;
  const total = hops * HOP_MS;
  const k = Math.max(0, Math.min(t, total)) / HOP_MS;
  const i = Math.min(Math.floor(k), hops - 1);
  const f = k - i;
  const a = run[i], b = run[i + 1];
  const coords = [a.lng + (b.lng - a.lng) * f, a.lat + (b.lat - a.lat) * f];
  const trail = run.slice(0, i + 1).map((p) => [p.lng, p.lat]).concat([coords]);
  return { coords, trail, done: t >= total, reached: run.slice(0, Math.floor(k) + 1).map((p) => p.id) };
}

// The animation: a few sources updated per frame while anything is moving.
export class FlowLayer {
  constructor(map, { maxFlows = 120, now = () => performance.now() } = {}) {
    Object.assign(this, { map, maxFlows, now, flows: [], glows: new Map(), raf: 0, enabled: true, transmits: [], flashes: new Map() });
  }

  install() {
    const map = this.map, empty = { type: "FeatureCollection", features: [] };
    if (map.getSource("flow-trails")) return;
    const before = map.getLayer("node-points") ? "node-points" : undefined;
    map.addSource("flow-trails", { type: "geojson", data: empty });
    map.addSource("flow-heads", { type: "geojson", data: empty });
    map.addSource("flow-glow", { type: "geojson", data: empty });
    map.addSource("flow-flash", { type: "geojson", data: empty });
    map.addSource("flow-bubbles", { type: "geojson", data: empty });
    map.addLayer({ id: "flow-glow", type: "circle", source: "flow-glow",
      paint: { "circle-color": "#f97316", "circle-radius": 14, "circle-blur": 0.6, "circle-opacity": ["get", "a"] } }, before);
    map.addLayer({ id: "flow-flash", type: "circle", source: "flow-flash",
      paint: { "circle-color": "#facc15", "circle-radius": ["+", 6, ["*", 10, ["get", "t"]]], "circle-blur": 0.3,
        "circle-opacity": ["get", "a"], "circle-stroke-color": "#fde047", "circle-stroke-width": 2, "circle-stroke-opacity": ["get", "a"] } });
    map.addLayer({ id: "flow-bubbles", type: "circle", source: "flow-bubbles",
      paint: { "circle-color": "#fde047", "circle-radius": 4, "circle-opacity": ["get", "a"],
        "circle-stroke-color": "#ffffff", "circle-stroke-width": 1, "circle-stroke-opacity": ["get", "a"] } });
    map.addLayer({ id: "flow-trails", type: "line", source: "flow-trails", layout: { "line-cap": "round" },
      paint: { "line-color": "#f97316", "line-width": 2.5, "line-dasharray": [2, 1.5], "line-opacity": ["get", "a"] } });
    map.addLayer({ id: "flow-heads", type: "circle", source: "flow-heads",
      paint: { "circle-color": "#f97316", "circle-radius": 5, "circle-stroke-color": "#fff", "circle-stroke-width": 1.5,
        "circle-opacity": ["get", "a"], "circle-stroke-opacity": ["get", "a"] } });
  }

  // Light up a node (the observer that heard something), even without a path.
  glow(p) { if (p) this.glows.set(p.id, { p, t0: this.now() }); this.kick(); }

  // Traffic focus: the node flashes yellow and bubbles travel out along its links.
  transmit(p, neighbours, delay = 0) {
    if (!this.enabled || !p) return;
    this.transmits.push({ p, neighbours: neighbours || [], t0: this.now() + delay });
    if (this.transmits.length > this.maxFlows * 2) this.transmits.shift();
    this.kick();
  }

  add(chain, meta = {}) {
    if (!this.enabled) return;
    const t0 = this.now();
    for (const run of runs(chain)) {
      if (this.flows.length >= this.maxFlows) this.flows.shift();
      this.flows.push({ run, t0, meta });
    }
    this.kick();
  }

  setEnabled(on) {
    this.enabled = on;
    if (!on) { this.flows = []; this.glows.clear(); this.transmits = []; this.render(); }
  }

  kick() { if (!this.raf) this.raf = requestAnimationFrame(() => this.frame()); }

  frame() {
    this.raf = 0;
    if (this.render()) this.kick();
  }

  // Returns true while something is still visible.
  render() {
    if (!this.map.getSource("flow-trails")) this.install();
    const now = this.now(), trails = [], heads = [];
    this.flows = this.flows.filter((f) => {
      const t = now - f.t0;
      const pos = positionAt(f.run, t);
      const over = t - (f.run.length - 1) * HOP_MS;
      const a = over <= 0 ? 1 : Math.max(0, 1 - over / FADE_MS);
      if (a <= 0) return false;
      trails.push({ type: "Feature", properties: { a: 0.8 * a, ...f.meta }, geometry: { type: "LineString", coordinates: pos.trail } });
      heads.push({ type: "Feature", properties: { a }, geometry: { type: "Point", coordinates: pos.coords } });
      for (const id of pos.reached) {
        const p = f.run.find((q) => q.id === id);
        if (!this.glows.has(id) || this.glows.get(id).t0 < f.t0 + pos.reached.indexOf(id) * HOP_MS) {
          this.glows.set(id, { p, t0: f.t0 + pos.reached.indexOf(id) * HOP_MS });
        }
      }
      return true;
    });
    const glows = [];
    for (const [id, g] of this.glows) {
      const a = Math.max(0, 1 - (now - g.t0) / FADE_MS);
      if (a <= 0) { this.glows.delete(id); continue; }
      glows.push({ type: "Feature", properties: { a: 0.7 * a }, geometry: { type: "Point", coordinates: [g.p.lng, g.p.lat] } });
    }
    const flash = [], bubbles = [];
    this.transmits = this.transmits.filter((x) => {
      const t = now - x.t0;
      if (t < 0) return true; // scheduled for a later hop
      if (t > BUBBLE_MS + FADE_MS) return false;
      const a = t <= BUBBLE_MS ? 1 : Math.max(0, 1 - (t - BUBBLE_MS) / FADE_MS);
      flash.push({ type: "Feature", properties: { a: 0.85 * a, t: Math.min(1, t / BUBBLE_MS) }, geometry: { type: "Point", coordinates: [x.p.lng, x.p.lat] } });
      if (t <= BUBBLE_MS) {
        for (const c of bubblePositions(x.p, x.neighbours, t)) bubbles.push({ type: "Feature", properties: { a: 0.95 }, geometry: { type: "Point", coordinates: c } });
      }
      return true;
    });
    const fc = (features) => ({ type: "FeatureCollection", features });
    this.map.getSource("flow-flash").setData(fc(flash));
    this.map.getSource("flow-bubbles").setData(fc(bubbles));
    this.map.getSource("flow-trails").setData(fc(trails));
    this.map.getSource("flow-heads").setData(fc(heads));
    this.map.getSource("flow-glow").setData(fc(glows));
    return trails.length > 0 || glows.length > 0 || this.transmits.length > 0;
  }
}
