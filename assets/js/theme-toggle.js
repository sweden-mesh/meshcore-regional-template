// The header's light/dark button (loaded once, from header.html). See theme.js.
// Two states: follow the system (nothing stored) or the opposite of it (stored). Toggling back to
// what the system shows removes the stored value, so the site follows the system again.
import { effectiveTheme } from "./theme.js";

const root = document.documentElement;
const lightQuery = matchMedia("(prefers-color-scheme: light)");
const meta = document.querySelector('meta[name="color-scheme"]');

function announce() {
  root.dataset.themeNow = effectiveTheme();
  document.dispatchEvent(new CustomEvent("themechange", { detail: root.dataset.themeNow }));
}

// theme: "light" | "dark" | null (null = follow the system).
function apply(theme) {
  if (theme) root.dataset.theme = theme; else delete root.dataset.theme;
  if (meta) meta.content = theme || "light dark";
  announce();
}

root.dataset.themeNow = effectiveTheme();
const button = document.querySelector(".theme-toggle");
if (button) {
  button.hidden = false;
  button.addEventListener("click", () => {
    const next = effectiveTheme() === "light" ? "dark" : "light";
    const stored = next === (lightQuery.matches ? "light" : "dark") ? null : next;
    try { if (stored) localStorage.setItem("theme", stored); else localStorage.removeItem("theme"); } catch { /* storage blocked: this page only */ }
    apply(stored);
  });
}
lightQuery.addEventListener("change", () => { if (!root.dataset.theme) announce(); });
// Another tab toggled (or cleared storage): follow it.
addEventListener("storage", (e) => {
  if (e.key === "theme" || e.key === null) apply(e.newValue === "light" || e.newValue === "dark" ? e.newValue : null);
});
