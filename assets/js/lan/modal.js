// National mode: the county modal (plan §6.2.4, Q4.2, Q4b, Q7.2). Drawn by script only, so
// crawlers and visitors without JavaScript never see it. It opens only from the header's county
// button: a visit where nothing has chosen a county (no county address, no ?lan=, nothing stored)
// reads Sverige and is not interrupted (B-343, operator 2026-11-18; replaces the automatic opening
// of UX-SV-D1). It always closes (the × button, Esc, a click outside); closed without a choice, the
// page stays on Sverige. A county with its own site: from the
// front page or a county page, picking it goes to that site (B-327); from any other page the choice
// is saved and the visitor stays, with a link to the county's site in the page's county line (UX-SV-2).
// Regional mode (B-324, #lan-data with mode "regional"): the same modal behind a regional site's
// county button. Every choice is a link (its own site, or its page on the national site), nothing
// is stored, and the modal never opens by itself.
import { modalModel, fillTemplate, geoToPaths, tipShown, tipPlace } from "./lan.js";

const island = document.getElementById("lan-data");
const regionalData = island && !window.meshcoreLan ? JSON.parse(island.textContent) : null;
const regional = !!(regionalData && regionalData.mode === "regional");
const lan = regional ? { data: regionalData, get: () => regionalData.here } : window.meshcoreLan;
const root = document.documentElement;

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "text") e.textContent = v; else if (v !== false && v != null) e.setAttribute(k, v === true ? "" : v);
  }
  e.append(...kids);
  return e;
}

let dialog = null;

function build() {
  const t = lan.data.texts;
  dialog = el("dialog", { class: "lan-modal", "aria-labelledby": "lan-modal-title", "aria-describedby": "lan-modal-intro" });
  dialog.setAttribute("closedby", "any");
  document.body.append(dialog);
  return t;
}

function showList() {
  const t = lan.data.texts;
  const model = modalModel(lan.data, lan.get());
  const list = el("ul", { class: "lan-modal-list", "aria-label": t.list });
  // One line per button (B-315): the name only. A county with its own site is tinted on the map
  // (legend under it) and named in the button's tooltip; Sverige is its own button below the list.
  const button = (item) => {
    // A county with its own site shows its domain under the name, as /lan/ does (UX-SV-2).
    const label = () => [el("span", { class: "lan-modal-name", text: item.label || item.name }),
      ...(item.own ? [el("span", { class: "lan-modal-own", text: `↗ ${item.domain}` })] : [])];
    if (regional) return el("a", { href: item.href, "aria-current": item.current ? "page" : false,
      title: item.own ? `${item.name}, ${t.own}: ${item.domain}` : item.name }, ...label());
    const b = el("button", { type: "button", "data-lan": item.v, "aria-current": item.current ? "true" : false,
      title: item.own ? `${item.name}, ${t.own}: ${item.domain}` : item.name }, ...label());
    b.addEventListener("click", () => pick(item));
    return b;
  };
  let all = null;
  for (const item of model.items) {
    if (item.v === "se") { all = el("p", { class: "lan-modal-all" }, button(item)); continue; }
    list.append(el("li", {}, button(item)));
  }
  const head = el("h2", { id: "lan-modal-title", tabindex: "-1", text: t.title });
  const mapCol = el("div", { class: "lan-modal-mapcol" }, el("div", { class: "lan-modal-map", "data-lan-map": "" }),
    el("p", { class: "lan-modal-legend" }, el("span", { class: "lan-modal-swatch", "aria-hidden": "true" }), t.ownLegend || ""));
  // The county buttons and, centred under them, Sverige share one column beside the map (B-325).
  const pickCol = el("div", { class: "lan-modal-pick" }, list);
  if (all) pickCol.append(all);
  // With a map, its column is laid out before the map arrives, so nothing moves when it does (SEO-SV-2).
  const close = el("button", { type: "button", class: "lan-modal-close", "aria-label": t.close, text: "×" });
  close.addEventListener("click", () => dialog.close());
  dialog.replaceChildren(close, head, el("p", { id: "lan-modal-intro", text: t.intro }),
    el("div", { class: lan.data.geo ? "lan-modal-body has-map" : "lan-modal-body" }, mapCol, pickCol));
  drawMap(dialog.querySelector("[data-lan-map]"), model);
  dialog.dispatchEvent(new CustomEvent("lan:list", { bubbles: true, detail: { pick: (v) => { const it = model.items.find((i) => i.v === v); if (it) pick(it); } } }));
  return head;
}

// The county map beside the list: fetched when the modal first opens. The shapes are clickable but
// not tab stops and hidden from screen readers; the list is the keyboard and screen-reader path.
let geoPromise = null;
const SVG = "http://www.w3.org/2000/svg";
function drawMap(slot, model) {
  if (!lan.data.geo || !slot) return;
  geoPromise ||= fetch(lan.data.geo).then((r) => r.json()).then((g) => geoToPaths(g, 300)).catch(() => null);
  geoPromise.then((m) => {
    if (!m || !slot.isConnected) return;
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("viewBox", m.viewBox); svg.setAttribute("aria-hidden", "true"); svg.setAttribute("class", "lan-map");
    for (const p of m.paths) {
      const item = model.items.find((i) => i.v === p.scb);
      const path = document.createElementNS(SVG, "path");
      path.setAttribute("d", p.d);
      path.setAttribute("class", [item && item.own ? "own" : "", item && item.current ? "current" : ""].join(" ").trim());
      const t = document.createElementNS(SVG, "title"); t.textContent = item ? item.name : p.name; path.append(t);
      if (item) path.addEventListener("click", () => pick(item));
      svg.append(path);
    }
    const cur = svg.querySelector(".current"); if (cur) svg.append(cur); // drawn last, so its outline is whole
    slot.replaceChildren(svg);
  });
}

// A click that leaves the page takes a moment before the next one paints: blur the page at once
// so the visitor sees the click landed (operator 2026-11-17). Undone if the page comes back from
// the back-forward cache.
function leaving() {
  root.classList.add("lan-leaving");
  document.body.setAttribute("aria-busy", "true");
}
addEventListener("pageshow", (e) => { if (e.persisted) { root.classList.remove("lan-leaving"); document.body.removeAttribute("aria-busy"); } });

function pick(item) {
  if (regional) { if (item.href) { leaving(); location.assign(item.href); } return; }
  if (item.own && (root.getAttribute("data-lan-page") || location.pathname === (root.dataset.home || "/"))) { leaving(); location.assign(item.site); return; }
  dialog.close();
  lan.set(item.v);
}

export function open() {
  if (!dialog) build();
  const head = showList();
  if (!dialog.open) dialog.showModal();
  head.focus();
}

if (regional) {
  // The header button opens the modal; its popover list is the chooser without JavaScript only.
  for (const b of document.querySelectorAll("[data-lan-open]")) {
    b.removeAttribute("popovertarget"); b.removeAttribute("aria-controls");
    b.setAttribute("aria-haspopup", "dialog");
    b.addEventListener("click", (e) => { e.preventDefault(); open(); });
  }
} else if (lan) {
  window.meshcoreLan.open = open;
  for (const a of document.querySelectorAll("[data-lan-open]")) {
    a.addEventListener("click", (e) => { e.preventDefault(); open(); });
  }
  pointer();
}

// "Välj din region här!" (B-344): a large pointer under the header's county button for a visitor
// who never chose a county (nothing stored: <html> has no data-lan; choosing Sverige stores "se").
// Only at scroll position 0; hidden while the ☰ menu, a dialog or a focused control outside the
// header is around, gone once a county is chosen. Drawn by script, absolutely placed in the header (no
// layout shift) and under the top layer, so it never covers the opened menu or the search dialog.
// Not on /lan/, which is the chooser itself. A click on it opens the modal like the button does.
function pointer() {
  const btn = document.querySelector(".site-header [data-lan-open]");
  const text = lan.data.texts.tip;
  if (!btn || !text || root.getAttribute("data-lan") || location.pathname.replace(/\/$/, "").endsWith("/lan")) return;
  const tip = el("div", { class: "lan-tip", id: "lan-tip", role: "tooltip", hidden: true }, el("span", { text }));
  tip.addEventListener("click", () => open());
  const header = btn.closest(".site-header");
  header.append(tip); // inside the banner landmark; placed relative to the header (position: relative)
  btn.setAttribute("aria-describedby", "lan-tip");
  const menuOpen = () => { try { return !!document.querySelector(".site-header [popover]:popover-open"); } catch (e) { return !!document.querySelector(".site-header .\\:popover-open"); } };
  const covered = () => !!document.querySelector("dialog[open]") || menuOpen()
    || !!(document.activeElement && document.activeElement !== document.body && !header.contains(document.activeElement) && !tip.contains(document.activeElement));
  let ready = false; // first shown once the header has settled (fonts, the toggles), so it never moves
  const update = () => {
    if (!tip.isConnected || !ready) return;
    const show = tipShown({ chosen: !!root.getAttribute("data-lan"), scrollY: window.scrollY, covered: covered() }) && btn.getClientRects().length > 0;
    tip.hidden = !show;
    if (!show) return;
    const b = btn.getBoundingClientRect(), h = header.getBoundingClientRect();
    const p = tipPlace(b, document.documentElement.clientWidth, tip.offsetWidth);
    tip.style.left = `${Math.round(p.left - h.left)}px`;
    tip.style.top = `${Math.round(b.bottom - h.top)}px`;
    tip.style.setProperty("--arrow", `${p.arrow}px`);
  };
  const done = () => { tip.remove(); btn.removeAttribute("aria-describedby"); };
  document.addEventListener("lan:change", (e) => { if (e.detail && e.detail.lan) done(); });
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  document.addEventListener("toggle", () => requestAnimationFrame(update), true);
  document.addEventListener("focusin", update);
  document.addEventListener("focusout", () => requestAnimationFrame(update));
  new ResizeObserver(update).observe(btn);
  // menu.js folds the header after a resize (class nav-collapsed): the button moves, keeping its size.
  new MutationObserver(update).observe(header, { attributes: true, attributeFilter: ["class"] });
  const loaded = document.readyState === "complete" ? Promise.resolve() : new Promise((r) => addEventListener("load", r, { once: true }));
  Promise.all([loaded, document.fonts ? document.fonts.ready : null])
    .then(() => requestAnimationFrame(() => requestAnimationFrame(() => { ready = true; update(); })));
}
