// Map state in the URL, so a view can be shared: ?live=0&links=0&foreign=0&focus=0
// &z=11.2&ll=57.78,14.16 (zoom, then lat,lng). Only non-default values are
// written; anything unparseable is ignored.

const TOGGLES = ["live", "links", "foreign", "focus"];

export function parseState(search) {
  const q = new URLSearchParams(search);
  const out = {};
  for (const k of TOGGLES) if (q.has(k)) out[k] = q.get(k) !== "0";
  const z = Number(q.get("z"));
  const ll = (q.get("ll") || "").split(",").map(Number);
  if (Number.isFinite(z) && z >= 0 && z <= 22 && ll.length === 2 && ll.every(Number.isFinite)
    && Math.abs(ll[0]) <= 90 && Math.abs(ll[1]) <= 180) out.view = { zoom: z, center: [ll[1], ll[0]] };
  return out;
}

export function writeState(search, state) {
  const q = new URLSearchParams(search);
  for (const k of TOGGLES) {
    if (state[k] === false) q.set(k, "0"); else if (state[k] === true) q.delete(k);
  }
  if (state.view) {
    q.set("z", state.view.zoom.toFixed(1));
    q.set("ll", `${state.view.center[1].toFixed(4)},${state.view.center[0].toFixed(4)}`);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}
