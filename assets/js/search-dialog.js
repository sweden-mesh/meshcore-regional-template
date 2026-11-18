// The header's search (UX-SV-5): the same Pagefind search as /sok/ (search.js), in a modal dialog
// opened by the header's search link or by "/" outside a text field. Without script the link
// goes to /sok/. On /sok/ itself both just focus the page's own field.
import { start } from "./search.js";

const link = document.querySelector("[data-search-open]");
const tpl = document.getElementById("search-tpl");
const closeText = document.querySelector("script[data-close]")?.dataset.close || "Stäng";
let dialog = null;

function open() {
  const own = document.getElementById("search");
  if (own) { own.querySelector("input")?.focus(); return; }
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.className = "search-dialog";
    dialog.setAttribute("closedby", "any");
    dialog.setAttribute("aria-label", link.getAttribute("aria-label"));
    const close = document.createElement("button");
    close.type = "button"; close.className = "search-dialog-close"; close.textContent = "×";
    close.setAttribute("aria-label", closeText);
    close.addEventListener("click", () => dialog.close());
    dialog.append(close, tpl.content.cloneNode(true));
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); }); // light dismiss where closedby is missing
    document.body.append(dialog);
    start(dialog.querySelector(".search-box"));
  }
  dialog.showModal();
  const input = dialog.querySelector("input");
  if (!input.disabled) { input.focus(); input.select(); }
}

if (link && tpl && "HTMLDialogElement" in window) {
  link.addEventListener("click", (e) => { e.preventDefault(); open(); });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
    const t = e.target;
    if (t.closest?.("input, textarea, select, [contenteditable=''], [contenteditable='true']") || document.querySelector("dialog[open]")) return;
    e.preventDefault();
    open();
  });
}
