// The map's signal colours for the current theme and colour-blind mode (operator 2026-11-15).
// Default: the colours the map has always had. Colour-blind mode (html[data-cvd="1"], header
// button, cvd-toggle.js) swaps every red/green signal for Okabe–Ito colours: blue for "good" or
// "heard", orange or vermillion for "rare", purple for the observer ring, so the pairs
// differ in hue and lightness for deuteranopia, protanopia and tritanopia alike. Pure: tests in
// tests/palette.test.mjs. The layers read it when they are added; a mode switch reloads the style
// (basemap.js), which re-adds them.
import { effectiveTheme } from "../theme.js";

export function cvdMode() {
  return typeof document !== "undefined" && document.documentElement.dataset.cvd === "1";
}

const BASE = {
  // Links by how often they are heard: [rare, middle, often] (neighbours.js STOPS).
  linkRamp: ["#dc2626", "#eab308", "#16a34a"],
  linkNone: "#64748b",
  nodeActive: "#2f8a5f",
  nodeStale: "#9aa7b0",
  observer: "#1f5d82",
  pick: "#2f8a5f",        // the wizards' pin and repeaters
  hostCover: "#2f8a5f",   // the host wizard's "near a repeater" field
  routes: ["#16a34a", "#0ea5e9", "#a855f7", "#f59e0b", "#ef4444", "#14b8a6", "#64748b"],
};

// Okabe–Ito: blue #0072B2, sky #56B4E9, orange #E69F00, vermillion #D55E00, purple #CC79A7.
const CVD = {
  light: {
    linkRamp: ["#0072b2", "#cc79a7", "#d55e00"],
    nodeActive: "#0072b2", observer: "#cc79a7", pick: "#0072b2", hostCover: "#0072b2",
  },
  dark: {
    linkRamp: ["#56b4e9", "#cc79a7", "#e69f00"],
    nodeActive: "#0072b2", observer: "#cc79a7", pick: "#0072b2", hostCover: "#56b4e9",
  },
};
const CVD_ROUTES = ["#0072b2", "#e69f00", "#cc79a7", "#56b4e9", "#d55e00", "#f0e442", "#64748b"];

export function palette(theme = effectiveTheme(), cvd = cvdMode()) {
  const t = theme === "dark" ? "dark" : "light";
  // The links not touching a selected node: grey, drawn faint (neighbours.js linkStyle).
  const linkMuted = t === "dark" ? "#94a3b8" : "#64748b";
  if (!cvd) return { ...BASE, linkMuted };
  return { ...BASE, ...CVD[t], linkMuted, routes: CVD_ROUTES };
}
