// National mode: fills the page with the chosen county (plan §6.2.3). Reads the data island
// (#lan-data) and html[data-lan] (set before paint), fills every [data-r] element by
// textContent, turns the title suffix and dispatches "lan:change" with the county (or null for
// Sverige). window.meshcoreLan.set(v) changes the choice in place; the header button and the
// county modal use it.
import { VALID, countyFor, valuesFor, titleFor, cookieLine, groupsFor, channelRows } from "./lan.js";

const root = document.documentElement;
const island = document.getElementById("lan-data");
const data = island ? JSON.parse(island.textContent) : null;
const baseTitle = document.title;

function fill(v) {
  const c = countyFor(data, v);
  const values = valuesFor(data, c);
  if (c) values.label = c.short; else if (v === "se") values.label = data.sweden.short;
  for (const el of document.querySelectorAll("[data-r]")) {
    if (!("rNeutral" in el.dataset)) el.dataset.rNeutral = el.textContent;
    const val = values[el.dataset.r];
    el.textContent = val === undefined ? el.dataset.rNeutral : val;
  }
  renderLists(c);
  for (const el of document.querySelectorAll("[data-r-proposal]")) el.hidden = !(c && c.decision === "forslag");
  document.title = titleFor(baseTitle, data.sweden.short, c);
  for (const a of document.querySelectorAll(".lan-toggle")) a.setAttribute("aria-label", `${a.title}: ${values.label || a.querySelector("[data-r=label]").textContent}`);
  if (v) root.setAttribute("data-lan", v); else root.removeAttribute("data-lan");
  document.dispatchEvent(new CustomEvent("lan:change", { detail: { lan: v || null, county: c } }));
}

function link(g) {
  const a = document.createElement("a");
  a.href = g.url; a.textContent = g.name; a.className = "ext"; a.target = "_blank"; a.rel = "noopener";
  return a;
}

// The county's groups and channels: [data-r-groups="list"] gets one <li> per group at the top,
// [data-r-groups="inline"] the groups as "a, b eller c" in place of its neutral links,
// [data-r-channels] (a tbody) one row per chat channel before the test channel's row.
function renderLists(c) {
  const groups = groupsFor(c);
  for (const ul of document.querySelectorAll('[data-r-groups="list"]')) {
    ul.querySelectorAll("[data-r-item]").forEach((n) => n.remove());
    groups.slice().reverse().forEach((g) => { const li = document.createElement("li"); li.dataset.rItem = ""; li.append(link(g)); ul.prepend(li); });
  }
  for (const el of document.querySelectorAll('[data-r-groups="inline"]')) {
    if (!el.rNeutral) el.rNeutral = [...el.childNodes].map((n) => n.cloneNode(true));
    if (!groups.length) { el.replaceChildren(...el.rNeutral.map((n) => n.cloneNode(true))); continue; }
    const parts = [];
    groups.forEach((g, i) => { if (i) parts.push(i === groups.length - 1 ? ` ${data.texts.or} ` : ", "); parts.push(link(g)); });
    el.replaceChildren(...parts);
  }
  const rows = channelRows(c);
  for (const tb of document.querySelectorAll("[data-r-channels]")) {
    tb.querySelectorAll("[data-r-item]").forEach((n) => n.remove());
    const first = tb.firstElementChild;
    for (const r of rows) {
      const tr = document.createElement("tr"); tr.dataset.rItem = "";
      for (const [text, code] of [[r.name, true], [r.scope, true], [r.purpose, false]]) {
        const td = document.createElement("td");
        if (code) { const k = document.createElement("code"); k.textContent = text; td.append(k); } else td.textContent = text;
        tr.append(td);
      }
      tb.insertBefore(tr, first);
    }
  }
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
  if (v) fill(v);
  else document.dispatchEvent(new CustomEvent("lan:change", { detail: { lan: v || null, county: null } }));
}
