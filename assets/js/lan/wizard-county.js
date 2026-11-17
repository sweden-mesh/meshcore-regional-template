// National mode: the wizards follow the chosen county (plan G15, G16, Q4.1, Q4.2, §6.8). Loaded
// before the wizard's own module (module scripts run in document order), it writes the county's
// values into the attributes the wizard reads once (data-scope, data-pattern, the neighbour box,
// the Observer fallback, the solar calculator's data-own), so the wizards' own code is untouched.
// Without a county it shows a county selector; a later choice reloads the page. A picked position
// in another county shows a warning with a one-click switch, and a position in a county with its
// own site a line that links it.
import { countyAt } from "./geo.js";
import { wizardValues, neighbourAreas, posFromText } from "./wizard-values.js";

const root = document.documentElement;
const island = document.getElementById("lan-data");
const box = document.querySelector("[data-lan-wizard]");
const data = island ? JSON.parse(island.textContent) : null;
const chosen = root.getAttribute("data-lan");
const county = data && chosen && chosen !== "se" ? data.counties.find((c) => c.scb === chosen) : null;
const t = box ? JSON.parse(box.dataset.texts || "{}") : {};

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (k === "text") e.textContent = v; else if (v !== false && v != null) e.setAttribute(k, v); }
  e.append(...kids);
  return e;
}

function choose(v) {
  if (window.meshcoreLan) window.meshcoreLan.set(v);
  else { try { localStorage.setItem("lan", v); } catch (e) { /* blocked */ } document.cookie = `lan=${v}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`; }
  reloadClean();
}

// Reload without a ?lan= that would win over the new choice.
function reloadClean() {
  const u = new URL(location.href);
  u.searchParams.delete("lan");
  if (u.href === location.href) location.reload(); else location.assign(u.href);
}

function applyCounty(c) {
  const v = wizardValues(c);
  for (const form of document.querySelectorAll("#wizard-quick, #wizard-guided")) {
    form.dataset.scope = v.scope;
    form.dataset.pattern = v.pattern;
  }
  // The position picker opens on the county and reads its map area.
  for (const m of document.querySelectorAll(".map-pick")) {
    if (v.iata) m.dataset.iatas = JSON.stringify([v.iata]);
    if (Array.isArray(c.center)) m.dataset.center = JSON.stringify(c.center);
    if (c.zoom) m.dataset.zoom = String(c.zoom);
  }
  const solar = document.getElementById("solar-calc");
  if (solar && v.iata) solar.dataset.own = v.iata;
  for (const o of document.querySelectorAll(".wz-observer")) {
    try { const cfg = JSON.parse(o.dataset.observer || "{}"); cfg.fallback = v.iata || cfg.fallback; o.dataset.observer = JSON.stringify(cfg); } catch (e) { /* keep */ }
  }
  const shapesEl = document.getElementById("lan-shapes");
  const shapes = shapesEl ? JSON.parse(shapesEl.textContent) : {};
  for (const nb of document.querySelectorAll(".wz-neighbours")) {
    const areas = neighbourAreas(c, data.counties, shapes);
    nb.dataset.areas = JSON.stringify(areas);
    const list = nb.querySelector(".wz-nb-list");
    list.replaceChildren(...areas.map((a) => {
      const input = el("input", { type: "checkbox", value: a.scope });
      const code = el("code", { class: "scope", text: a.scope });
      return el("li", {}, el("label", { class: "wz-check" }, input, ` ${a.lan} `, code), " ", el("span", { class: "muted", "data-why": "" }));
    }));
    nb.hidden = !areas.length;
  }
}

function selector() {
  const sel = el("select", { id: "lan-wizard-select" }, el("option", { value: "", text: t.pick }));
  for (const c of data.counties) sel.append(el("option", { value: c.scb, text: c.site ? `${c.name} (${t.own})` : c.name }));
  const out = el("p", { class: "wz-status", "aria-live": "polite" });
  sel.addEventListener("change", () => {
    const c = data.counties.find((x) => x.scb === sel.value);
    if (!c) return;
    if (c.site) { out.replaceChildren(`${t.ownLine} `, el("a", { href: c.site, class: "ext", target: "_blank", rel: "noopener", text: c.site.replace(/^https?:\/\/([^/]+).*$/, "$1") })); return; }
    choose(c.scb);
  });
  box.replaceChildren(el("label", { for: "lan-wizard-select", text: t.label }), sel, el("p", { class: "muted", text: t.why }), out);
  box.hidden = false;
  // The solar calculator needs the county's sun data (B-319): hidden until one is chosen. Without
  // script this never runs, so the calculator stays visible.
  const solar = document.getElementById("solar-calc");
  if (solar) solar.hidden = true;
}

// The picked position, read from the wizard's own status line ("Vald plats: 57.78, 14.16").
function watchPosition(geoUrl) {
  const outs = document.querySelectorAll("#wz-pos, [data-out='pos']");
  if (!outs.length || !geoUrl) return;
  let geo = null;
  const warn = el("div", { class: "lan-wizard-warn", "aria-live": "polite", hidden: "" });
  outs[0].after(warn);
  const check = async (text) => {
    const p = posFromText(text);
    if (!p) { warn.hidden = true; return; }
    geo ||= await fetch(geoUrl).then((r) => r.json()).catch(() => null);
    if (!geo) return;
    const at = countyAt(geo, p.lon, p.lat);
    const c = at && data.counties.find((x) => x.scb === at);
    if (!c || (county && c.scb === county.scb)) { warn.hidden = true; return; }
    if (c.site) {
      warn.replaceChildren(`${t.ownPos.replace("{name}", c.name)} `, el("a", { href: c.site, class: "ext", target: "_blank", rel: "noopener", text: c.site.replace(/^https?:\/\/([^/]+).*$/, "$1") }));
    } else {
      const b = el("button", { type: "button", class: "button button-secondary", text: t.switchTo.replace("{short}", c.short) });
      b.addEventListener("click", () => choose(c.scb));
      warn.replaceChildren(el("p", { text: county ? t.mismatch.replaceAll("{name}", c.name).replaceAll("{chosen}", county.name) : t.posIn.replace("{name}", c.name) }), b);
    }
    warn.hidden = false;
  };
  for (const o of outs) new MutationObserver(() => check(o.textContent)).observe(o, { childList: true, characterData: true, subtree: true });
}

if (data && box) {
  if (county) applyCounty(county); else selector();
  watchPosition(box.dataset.geo);
  // A county chosen later (the header's button): the wizard reads its values once, so reload.
  document.addEventListener("lan:change", (e) => { if ((e.detail.lan || "se") !== (chosen || "se")) reloadClean(); });
}
