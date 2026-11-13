// The header's light/dark button (loaded once, from header.html). See theme.js.
import { effectiveTheme } from "./theme.js";

const root = document.documentElement;
const lightQuery = matchMedia("(prefers-color-scheme: light)");

function announce() {
  root.dataset.themeNow = effectiveTheme();
  document.dispatchEvent(new CustomEvent("themechange", { detail: root.dataset.themeNow }));
}

root.dataset.themeNow = effectiveTheme();
const button = document.querySelector(".theme-toggle");
if (button) {
  button.hidden = false;
  button.addEventListener("click", () => {
    const next = effectiveTheme() === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch { /* storage blocked: this page only */ }
    announce();
  });
}
lightQuery.addEventListener("change", () => { if (!root.dataset.theme) announce(); });
