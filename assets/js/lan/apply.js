// National mode: fills the page with the chosen county (plan §6.2.3). Reads the data island
// (#lan-data) and html[data-lan] (set before paint), fills every [data-r] element by
// textContent, turns the title suffix and dispatches "lan:change" with the county (or null for
// Sverige). window.meshcoreLan.set(v) changes the choice in place; the header button and the
// county modal use it.
import { VALID, countyFor, valuesFor, titleFor, cookieLine } from "./lan.js";

const root = document.documentElement;
const island = document.getElementById("lan-data");
const data = island ? JSON.parse(island.textContent) : null;
const baseTitle = document.title;

function fill(v) {
  const c = countyFor(data, v);
  const values = valuesFor(data, c);
  for (const el of document.querySelectorAll("[data-r]")) {
    if (!("rNeutral" in el.dataset)) el.dataset.rNeutral = el.textContent;
    const val = values[el.dataset.r];
    el.textContent = val === undefined ? el.dataset.rNeutral : val;
  }
  document.title = titleFor(baseTitle, data.sweden.short, c);
  if (v) root.setAttribute("data-lan", v); else root.removeAttribute("data-lan");
  document.dispatchEvent(new CustomEvent("lan:change", { detail: { lan: v || null, county: c } }));
}

function store(v) {
  let ok = false;
  try { localStorage.setItem("lan", v); ok = true; } catch (e) { /* blocked */ }
  try { document.cookie = cookieLine(v); ok = ok || document.cookie.includes(`lan=${v}`); } catch (e) { /* blocked */ }
  if (!ok) root.setAttribute("data-lan-store", "0"); else root.removeAttribute("data-lan-store");
  return ok;
}

if (data) {
  window.meshcoreLan = {
    data,
    get: () => root.getAttribute("data-lan"),
    county: (v) => countyFor(data, v),
    // Choose a county ("se" for Sverige). Saved, then applied in place on a shared page; on a
    // county page or / the county's own page (or / for Sverige) opens instead (§6.2.3).
    set(v) {
      if (!VALID.test(v)) return;
      store(v);
      const page = root.getAttribute("data-lan-page");
      const c = countyFor(data, v);
      if (page || location.pathname === "/") {
        const to = c && c.url ? c.url : "/?lan=se";
        if (location.pathname + location.search !== to) { location.assign(to); return; }
      }
      fill(v);
    },
  };
  const v = root.getAttribute("data-lan");
  if (v && v !== "se") fill(v);
  else document.dispatchEvent(new CustomEvent("lan:change", { detail: { lan: v || null, county: null } }));
}
