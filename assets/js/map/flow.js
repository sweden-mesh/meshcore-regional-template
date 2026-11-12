// Live packet flow. For each packetObservation (resolvePath on) the physical
// route is: the source node, the repeaters in the path, the observer that heard
// it. Only high-confidence hops with a position are drawn; an unresolved hop
// breaks the line instead of being guessed, so every drawn segment is real.
// Measured 2026-11-12: only 7 % of JKG chains resolve completely, so runs of
// resolved hops are animated too (planning/meshcore-jkp.se/live-volume-20261112.md).

export const HOP_MS = 480;
export const FADE_MS = 900;

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
    Object.assign(this, { map, maxFlows, now, flows: [], glows: new Map(), raf: 0, enabled: true });
  }

  install() {
    const map = this.map, empty = { type: "FeatureCollection", features: [] };
    if (map.getSource("flow-trails")) return;
    const before = map.getLayer("node-points") ? "node-points" : undefined;
    map.addSource("flow-trails", { type: "geojson", data: empty });
    map.addSource("flow-heads", { type: "geojson", data: empty });
    map.addSource("flow-glow", { type: "geojson", data: empty });
    map.addLayer({ id: "flow-glow", type: "circle", source: "flow-glow",
      paint: { "circle-color": "#f97316", "circle-radius": 14, "circle-blur": 0.6, "circle-opacity": ["get", "a"] } }, before);
    map.addLayer({ id: "flow-trails", type: "line", source: "flow-trails", layout: { "line-cap": "round" },
      paint: { "line-color": "#f97316", "line-width": 2.5, "line-dasharray": [2, 1.5], "line-opacity": ["get", "a"] } });
    map.addLayer({ id: "flow-heads", type: "circle", source: "flow-heads",
      paint: { "circle-color": "#f97316", "circle-radius": 5, "circle-stroke-color": "#fff", "circle-stroke-width": 1.5,
        "circle-opacity": ["get", "a"], "circle-stroke-opacity": ["get", "a"] } });
  }

  // Light up a node (the observer that heard something), even without a path.
  glow(p) { if (p) this.glows.set(p.id, { p, t0: this.now() }); this.kick(); }

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
    if (!on) { this.flows = []; this.glows.clear(); this.render(); }
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
    const fc = (features) => ({ type: "FeatureCollection", features });
    this.map.getSource("flow-trails").setData(fc(trails));
    this.map.getSource("flow-heads").setData(fc(heads));
    this.map.getSource("flow-glow").setData(fc(glows));
    return trails.length > 0 || glows.length > 0;
  }
}
