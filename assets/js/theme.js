// Light/dark (operator 2026-11-13). The system setting decides by default, dark when the
// browser reports nothing; the header button overrides it and the choice is remembered.
// The saved choice is applied before paint by an inline script in head.html; the button is
// wired in theme-toggle.js. Modules read effectiveTheme() and listen for the "themechange"
// event on document. No side effects here: this file is bundled into several scripts.

const root = typeof document !== "undefined" ? document.documentElement : null;
const lightQuery = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: light)") : null;

export function resolveTheme(saved, systemLight, forcedDark = false) {
  if (forcedDark) return "dark";
  if (saved === "light" || saved === "dark") return saved;
  return systemLight ? "light" : "dark";
}

export function effectiveTheme() {
  if (!root) return "dark";
  return resolveTheme(root.dataset.theme, lightQuery?.matches, document.body?.classList.contains("style-console"));
}
