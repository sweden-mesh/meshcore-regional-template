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

// B-314: when a node transmits, its links flash white with a faint glow and fade back: full
// strength while the bubbles travel, then a fade. Pure, for tests: the line features at time t
// after the transmission (empty before it starts and once faded).
export function linkFlash(from, neighbours, t) {
  if (t < 0 || t > BUBBLE_MS + FADE_MS) return [];
  const a = t <= BUBBLE_MS ? 1 : Math.max(0, 1 - (t - BUBBLE_MS) / FADE_MS);
  if (a <= 0) return [];
  return neighbours.map((n) => ({ type: "Feature", properties: { a },
    geometry: { type: "LineString", coordinates: [[from.lng, from.lat], [n.lng, n.lat]] } }));
}

// B-347: the transmitter's own flash at time t after it sends: a white-hot core at full strength
// while the bubbles travel, then a fade (a), its growth over the bubble time (t), and a ring that
// spreads over the bubbles and half the fade (r) as it fades (ra). Strong enough to read over the
// blurred repeater glow zoomed out. null before it starts and once gone. Pure, for tests.
export function flashAt(t) {
  if (t < 0 || t > BUBBLE_MS + FADE_MS) return null;
  const a = t <= BUBBLE_MS ? 1 : Math.max(0, 1 - (t - BUBBLE_MS) / FADE_MS);
  const r = Math.min(1, t / (BUBBLE_MS + FADE_MS / 2));
  return { a, t: Math.min(1, t / BUBBLE_MS), r, ra: Math.max(0, 1 - r) };
}

// B-349: the white centre must stay above the node layers, which are added again after a theme
// switch and on every redraw. True when it exists but is not the top layer. Pure, for tests.
export const FLASH_TOP = "flow-flash-white";
export function needsRaise(order) {
  const i = (order || []).indexOf(FLASH_TOP);
  return i >= 0 && i !== order.length - 1;
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
    this.linksOnTop = false;
    const before = map.getLayer("node-points") ? "node-points" : undefined;
    map.addSource("flow-trails", { type: "geojson", data: empty });
    map.addSource("flow-heads", { type: "geojson", data: empty });
    map.addSource("flow-glow", { type: "geojson", data: empty });
    map.addSource("flow-flash", { type: "geojson", data: empty });
    map.addSource("flow-bubbles", { type: "geojson", data: empty });
    map.addSource("flow-links", { type: "geojson", data: empty });
    // One line layer for the link flash (B-314): white, blurred for a faint glow, under the nodes.
    // White reads the same in the colour-blind palette.
    map.addLayer({ id: "flow-links", type: "line", source: "flow-links", layout: { "line-cap": "round" },
      paint: { "line-color": "#ffffff", "line-width": 3.5, "line-blur": 1.5, "line-opacity": ["*", 0.85, ["get", "a"]] } }, before);
    map.addLayer({ id: "flow-glow", type: "circle", source: "flow-glow",
      paint: { "circle-color": "#f97316", "circle-radius": 14, "circle-blur": 0.6, "circle-opacity": ["get", "a"] } }, before);
    // The transmitter's flash (B-347, stronger in B-349): a yellow halo, a yellow core with a white
    // edge and an amber ring that spreads out, all larger zoomed out, where the repeaters' blurred
    // glow would swallow them. Yellow and amber hold on the light map as well as the dark one.
    const byZoom = (far, near) => ["interpolate", ["linear"], ["zoom"], 5, far, 11, near];
    map.addLayer({ id: "flow-flash-halo", type: "circle", source: "flow-flash",
      paint: { "circle-color": "#facc15", "circle-blur": 1,
        "circle-radius": byZoom(["+", 24, ["*", 18, ["get", "t"]]], ["+", 16, ["*", 12, ["get", "t"]]]),
        "circle-opacity": ["*", 0.95, ["get", "a"]] } });
    map.addLayer({ id: "flow-flash", type: "circle", source: "flow-flash",
      paint: { "circle-color": "#facc15", "circle-blur": 0.1,
        "circle-radius": byZoom(["+", 11, ["*", 8, ["get", "t"]]], ["+", 9, ["*", 7, ["get", "t"]]]),
        "circle-opacity": ["get", "a"], "circle-stroke-color": "#ffffff", "circle-stroke-width": 3, "circle-stroke-opacity": ["get", "a"] } });
    map.addLayer({ id: "flow-flash-ring", type: "circle", source: "flow-flash",
      paint: { "circle-opacity": 0, "circle-stroke-color": "#f59e0b", "circle-stroke-width": 4,
        "circle-radius": byZoom(["+", 12, ["*", 44, ["get", "r"]]], ["+", 10, ["*", 30, ["get", "r"]]]),
        "circle-stroke-opacity": ["get", "ra"] } });
    map.addLayer({ id: "flow-bubbles", type: "circle", source: "flow-bubbles",
      paint: { "circle-color": "#fde047", "circle-radius": 4, "circle-opacity": ["get", "a"],
        "circle-stroke-color": "#ffffff", "circle-stroke-width": 1, "circle-stroke-opacity": ["get", "a"] } });
    map.addLayer({ id: "flow-trails", type: "line", source: "flow-trails", layout: { "line-cap": "round" },
      paint: { "line-color": "#f97316", "line-width": 2.5, "line-dasharray": [2, 1.5], "line-opacity": ["get", "a"] } });
    map.addLayer({ id: "flow-heads", type: "circle", source: "flow-heads",
      paint: { "circle-color": "#f97316", "circle-radius": 5, "circle-stroke-color": "#fff", "circle-stroke-width": 1.5,
        "circle-opacity": ["get", "a"], "circle-stroke-opacity": ["get", "a"] } });
    // B-349: a white blurred centre on top of everything, the repeater's own marker included, so
    // the marker is covered at the flash's peak and shows again as the flash fades.
    map.addLayer({ id: FLASH_TOP, type: "circle", source: "flow-flash",
      paint: { "circle-color": "#ffffff", "circle-blur": 0.7,
        "circle-radius": byZoom(["+", 12, ["*", 4, ["get", "t"]]], ["+", 10, ["*", 4, ["get", "t"]]]),
        "circle-opacity": ["*", 0.95, ["get", "a"]] } });
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
    // The link layer is often added after this one: keep the flash above the links, under the nodes.
    if (!this.linksOnTop && this.map.getLayer("links")) {
      this.map.moveLayer("flow-links", this.map.getLayer("node-points") ? "node-points" : undefined);
      this.linksOnTop = true;
    }
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
    const flash = [], bubbles = [], links = [];
    this.transmits = this.transmits.filter((x) => {
      const t = now - x.t0;
      if (t < 0) return true; // scheduled for a later hop
      if (t > BUBBLE_MS + FADE_MS) return false;
      flash.push({ type: "Feature", properties: flashAt(t), geometry: { type: "Point", coordinates: [x.p.lng, x.p.lat] } });
      links.push(...linkFlash(x.p, x.neighbours, t));
      if (t <= BUBBLE_MS) {
        for (const c of bubblePositions(x.p, x.neighbours, t)) bubbles.push({ type: "Feature", properties: { a: 0.95 }, geometry: { type: "Point", coordinates: c } });
      }
      return true;
    });
    const fc = (features) => ({ type: "FeatureCollection", features });
    if (flash.length && needsRaise(this.map.getLayersOrder?.())) this.map.moveLayer(FLASH_TOP);
    this.map.getSource("flow-flash").setData(fc(flash));
    this.map.getSource("flow-bubbles").setData(fc(bubbles));
    this.map.getSource("flow-links").setData(fc(links));
    this.map.getSource("flow-trails").setData(fc(trails));
    this.map.getSource("flow-heads").setData(fc(heads));
    this.map.getSource("flow-glow").setData(fc(glows));
    return trails.length > 0 || glows.length > 0 || this.transmits.length > 0;
  }
}
