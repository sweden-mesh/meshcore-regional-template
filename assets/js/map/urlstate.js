// Map state in the URL, so a view can be shared: ?live=0&links=0&foreign=0&focus=0
// &cov=1&want=1&se=1&full=1&z=11.2&ll=57.78,14.16 (zoom, then lat,lng). Only non-default values are
// written; anything unparseable is ignored. A page may say that one of its switches starts the
// other way (`defaults`, e.g. { want: true } on a county's map, B-382): that switch is then written
// only when it differs from the page's own start.

const TOGGLES = ["live", "links", "foreign", "focus"]; // on by default
const OFF_TOGGLES = ["cov", "want", "se", "full"];     // off by default (se: B-370; full: the map fills the window)

export function parseState(search) {
  const q = new URLSearchParams(search);
  const out = {};
  for (const k of TOGGLES) if (q.has(k)) out[k] = q.get(k) !== "0";
  for (const k of OFF_TOGGLES) if (q.has(k)) out[k] = q.get(k) !== "0";
  const z = Number(q.get("z"));
  const ll = (q.get("ll") || "").split(",").map(Number);
  if (Number.isFinite(z) && z >= 0 && z <= 22 && ll.length === 2 && ll.every(Number.isFinite)
    && Math.abs(ll[0]) <= 90 && Math.abs(ll[1]) <= 180) out.view = { zoom: z, center: [ll[1], ll[0]] };
  return out;
}

export function writeState(search, state, defaults = {}) {
  const q = new URLSearchParams(search);
  for (const k of [...TOGGLES, ...OFF_TOGGLES]) {
    if (typeof state[k] !== "boolean") continue;
    const start = typeof defaults[k] === "boolean" ? defaults[k] : TOGGLES.includes(k);
    if (state[k] === start) q.delete(k); else q.set(k, state[k] ? "1" : "0");
  }
  if (state.view) {
    q.set("z", state.view.zoom.toFixed(1));
    q.set("ll", `${state.view.center[1].toFixed(4)},${state.view.center[0].toFixed(4)}`);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}
