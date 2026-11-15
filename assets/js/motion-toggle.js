// The footer's "stop background motion" button (WCAG 2.2.2): pauses the drifting background and
// the parallax for this visitor, remembered across pages. The choice is applied before paint by
// an inline script in head.html; main.css pauses everything under html[data-motion="off"].
// The label says what a press does, so no aria-pressed.
const root = document.documentElement;
const button = document.querySelector(".motion-toggle");

function label() {
  button.textContent = root.dataset.motion === "off" ? button.dataset.start : button.dataset.stop;
}

if (button) {
  button.parentElement.hidden = false;
  label();
  button.addEventListener("click", () => {
    const off = root.dataset.motion !== "off";
    if (off) root.dataset.motion = "off"; else delete root.dataset.motion;
    try { if (off) localStorage.setItem("motion", "off"); else localStorage.removeItem("motion"); } catch { /* storage blocked: this page only */ }
    label();
  });
}
// Another tab changed it: follow.
addEventListener("storage", (e) => {
  if (!button || (e.key !== "motion" && e.key !== null)) return;
  if (e.newValue === "off") root.dataset.motion = "off"; else delete root.dataset.motion;
  label();
});
