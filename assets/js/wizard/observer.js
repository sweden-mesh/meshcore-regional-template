// The Observer section of the repeater wizards (wizard-observer.html). Pure part: which
// county's map code a position gets. DOM part: the box, the fields, and the code filled from
// the picked position until the owner types their own.
import { distanceKm } from "./neighbours.js";

// areas: [{ iata, lan, rings }]. Inside a county → its code; otherwise the nearest county
// within 25 km (a repeater just across the border); otherwise null.
export function iataFor(lat, lon, areas) {
  let best = null;
  for (const a of areas || []) {
    const d = distanceKm(lat, lon, a.rings);
    if (d === 0) return { iata: a.iata, lan: a.lan };
    if (d <= 25 && (!best || d < best.d)) best = { iata: a.iata, lan: a.lan, d };
  }
  return best && { iata: best.iata, lan: best.lan };
}

// Returns { get() → { ssid, pwd, iata, preset } | undefined, setPosition(lat, lon) }.
export function initObserver(root, onChange) {
  if (!root) return { get: () => undefined, setPosition: () => {} };
  const cfg = JSON.parse(root.dataset.observer || "{}");
  const t = JSON.parse(root.dataset.texts || "{}");
  const q = (s) => root.querySelector(s);
  const on = q("[data-obs-on]"), fields = q("[data-obs-fields]");
  const ssid = q("[data-obs-ssid]"), pwd = q("[data-obs-pwd]"), iata = q("[data-obs-iata]"), why = q("[data-obs-iata-why]");
  let typed = false;
  on.addEventListener("change", () => { fields.hidden = !on.checked; onChange(); });
  for (const el of [ssid, pwd]) el.addEventListener("input", onChange);
  iata.addEventListener("input", () => { typed = true; why.textContent = ""; onChange(); });
  return {
    get: () => (on.checked
      ? { ssid: ssid.value, pwd: pwd.value, iata: iata.value.trim().toUpperCase(), preset: cfg.preset }
      : undefined),
    setPosition(lat, lon) {
      if (typed) return;
      const hit = iataFor(lat, lon, cfg.areas);
      iata.value = hit?.iata || cfg.fallback || "";
      why.textContent = hit ? `${t.from} ${hit.lan}` : t.none;
      onChange();
    },
  };
}
