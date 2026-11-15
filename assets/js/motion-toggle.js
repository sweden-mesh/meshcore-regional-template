// The header's "stop background motion" button (WCAG 2.2.2): pauses the drifting background and
// the parallax for this visitor, remembered across pages. The choice is applied before paint by
// an inline script in head.html; main.css pauses everything under html[data-motion="off"].
// The header button is a toggle: aria-pressed="true" while stopped, under the fixed name "stop
// background motion"; its tooltip says what a press does. On a phone the header has no room for
// it, and a link in the footer (whose text says what a press does) stands in (main.css).
const root = document.documentElement;
const button = document.querySelector(".motion-toggle");
const link = document.querySelector(".motion-link");

function show() {
  const off = root.dataset.motion === "off";
  const says = off ? button?.dataset.start : button?.dataset.stop;
  if (button) { button.setAttribute("aria-pressed", String(off)); button.title = says; }
  if (link && says) link.textContent = says;
}

function toggle() {
  const off = root.dataset.motion !== "off";
  if (off) root.dataset.motion = "off"; else delete root.dataset.motion;
  try { if (off) localStorage.setItem("motion", "off"); else localStorage.removeItem("motion"); } catch { /* storage blocked: this page only */ }
  show();
}

if (button) {
  button.hidden = false;
  if (link) link.parentElement.hidden = false;
  show();
  button.addEventListener("click", toggle);
  link?.addEventListener("click", toggle);
}
// Another tab changed it: follow.
addEventListener("storage", (e) => {
  if (!button || (e.key !== "motion" && e.key !== null)) return;
  if (e.newValue === "off") root.dataset.motion = "off"; else delete root.dataset.motion;
  show();
});
