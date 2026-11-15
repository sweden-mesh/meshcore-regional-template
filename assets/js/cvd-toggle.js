// The header's colour-blind mode button (operator 2026-11-15). On: html[data-cvd="1"], which
// main.css turns into a colour-blind-safe scheme (Okabe–Ito) and the map reads through
// map/palette.js. Remembered in localStorage ("cvd") and applied before paint by the inline
// script in head.html. Announces "cvdchange" on document; the maps reload their layers on it.
const root = document.documentElement;
const button = document.querySelector(".cvd-toggle");

function apply(on) {
  if (on) root.dataset.cvd = "1"; else delete root.dataset.cvd;
  button?.setAttribute("aria-pressed", String(on));
  document.dispatchEvent(new CustomEvent("cvdchange", { detail: on }));
}

if (button) {
  button.hidden = false;
  button.setAttribute("aria-pressed", String(root.dataset.cvd === "1"));
  button.addEventListener("click", () => {
    const on = root.dataset.cvd !== "1";
    try { if (on) localStorage.setItem("cvd", "1"); else localStorage.removeItem("cvd"); } catch { /* storage blocked: this page only */ }
    apply(on);
  });
}
// Another tab switched it: follow.
addEventListener("storage", (e) => {
  if (e.key === "cvd" || e.key === null) { const on = e.newValue === "1"; if (on !== (root.dataset.cvd === "1")) apply(on); }
});
