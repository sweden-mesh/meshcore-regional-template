// The header's "stop motion" button (WCAG 2.2.2): one motion state for the whole page, on
// <html data-motion="on|off">. It starts from the system's setting (prefers-reduced-motion) and
// the button shows that state; a press overrides it either way for this visitor, remembered across
// pages, and applies to the background, the parallax, the map's traffic animation, its camera
// moves and the eased scroll (operator 2026-11-22). The state is set before paint by an inline
// script in head.html. Only a choice that differs from the system's is stored, so a visitor who
// goes back to the system's setting follows it again.
// The header button is a toggle: aria-pressed="true" while stopped, under the fixed name "stop
// motion"; its tooltip says what a press does. On a phone the header has no room for it, and a
// link in the footer (whose text says what a press does) stands in (main.css).
const root = document.documentElement;
const button = document.querySelector(".motion-toggle");
const link = document.querySelector(".motion-link");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const system = () => (reduce.matches ? "off" : "on");
const stored = () => { try { const m = localStorage.getItem("motion"); return m === "on" || m === "off" ? m : null; } catch { return null; } };

function show() {
  const off = root.dataset.motion === "off";
  const says = off ? button?.dataset.start : button?.dataset.stop;
  if (button) { button.setAttribute("aria-pressed", String(off)); button.title = says; }
  if (link && says) link.textContent = says;
}

function follow() { root.dataset.motion = stored() || system(); show(); }

function toggle() {
  const next = root.dataset.motion === "off" ? "on" : "off";
  root.dataset.motion = next;
  try { if (next === system()) localStorage.removeItem("motion"); else localStorage.setItem("motion", next); } catch { /* storage blocked: this page only */ }
  show();
}

if (button) {
  button.hidden = false;
  if (link) link.parentElement.hidden = false;
  follow();
  button.addEventListener("click", toggle);
  link?.addEventListener("click", toggle);
}
// Another tab changed it, or the system's setting changed: follow.
addEventListener("storage", (e) => { if (button && (e.key === "motion" || e.key === null)) follow(); });
reduce.addEventListener?.("change", () => { if (button) follow(); });
