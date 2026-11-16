// National mode: the county modal (plan §6.2.4, Q4.2, Q4b, Q7.2). Drawn by script only, so
// crawlers and visitors without JavaScript never see it. Forced on a visit where nothing has chosen
// a county (no county address, no ?lan=, nothing stored) unless storage is blocked; otherwise
// opened by the header's county button. A county with its own site is never saved: picking it
// shows a choice between going there and picking another county.
import { modalModel, fillTemplate } from "./lan.js";

const lan = window.meshcoreLan;
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
  dialog.addEventListener("cancel", (e) => { if (dialog.dataset.forced === "1") e.preventDefault(); });
  document.body.append(dialog);
  return t;
}

function showList(forced) {
  const t = lan.data.texts;
  const model = modalModel(lan.data, lan.get());
  const list = el("ul", { class: "lan-modal-list", "aria-label": t.list });
  for (const item of model.items) {
    const b = el("button", { type: "button", "data-lan": item.v, "aria-current": item.current ? "true" : false },
      el("span", { class: "lan-modal-name", text: item.name }));
    if (item.own) b.append(el("span", { class: "lan-modal-own", text: `${t.own}: ${item.domain}` }));
    if (item.current) b.append(el("span", { class: "lan-modal-own", text: t.current }));
    b.addEventListener("click", () => pick(item));
    list.append(el("li", {}, b));
  }
  const head = el("h2", { id: "lan-modal-title", tabindex: "-1", text: t.title });
  const body = [head, el("p", { id: "lan-modal-intro", text: t.intro }), el("div", { class: "lan-modal-body" }, el("div", { class: "lan-modal-map", "data-lan-map": "" }), list)];
  if (!forced) {
    const close = el("button", { type: "button", class: "lan-modal-close", "aria-label": t.close, text: "×" });
    close.addEventListener("click", () => dialog.close());
    body.unshift(close);
  }
  dialog.replaceChildren(...body);
  dialog.dispatchEvent(new CustomEvent("lan:list", { bubbles: true, detail: { pick: (v) => { const it = model.items.find((i) => i.v === v); if (it) pick(it); } } }));
  return head;
}

function showOwn(item) {
  const t = lan.data.texts;
  const head = el("h2", { id: "lan-modal-title", tabindex: "-1", text: fillTemplate(t.ownTitle, { name: item.name }) });
  const go = el("a", { class: "button ext", href: item.site, target: "_blank", rel: "noopener", text: fillTemplate(t.ownGo, { site: item.domain }) });
  const other = el("button", { type: "button", class: "button button-secondary", text: t.ownOther });
  other.addEventListener("click", () => showList(dialog.dataset.forced === "1").focus());
  dialog.replaceChildren(head, el("p", { id: "lan-modal-intro", text: fillTemplate(t.ownText, { name: item.name }) }), el("p", { class: "hero-actions" }, go, other));
  head.focus();
}

function pick(item) {
  if (item.own) { showOwn(item); return; }
  dialog.dataset.forced = "0";
  dialog.close();
  lan.set(item.v);
}

export function open(forced) {
  if (!dialog) build();
  dialog.dataset.forced = forced ? "1" : "0";
  if (forced) dialog.setAttribute("closedby", "none"); else dialog.setAttribute("closedby", "any");
  const head = showList(forced);
  if (!dialog.open) dialog.showModal();
  head.focus();
}

if (lan) {
  window.meshcoreLan.open = open;
  for (const a of document.querySelectorAll("[data-lan-open]")) {
    a.addEventListener("click", (e) => { e.preventDefault(); open(false); });
  }
  // /lan/ is the chooser itself and works as plain links; an own-site page offers its two choices.
  const quiet = document.querySelector(".lan-elsewhere") || location.pathname.replace(/\/$/, "").endsWith("/lan");
  if (!root.getAttribute("data-lan") && root.getAttribute("data-lan-store") !== "0" && !quiet) open(true);
}
