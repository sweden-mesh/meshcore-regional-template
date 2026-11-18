// The map's fullscreen button (B-346), beside the fit button. The Fullscreen API on the map's own
// element where the browser has it (prefixed in older Safari); where it has none (an iPhone), the
// element is pinned over the whole viewport instead and the page under it stops scrolling. Esc
// leaves either way, the button says which way it goes, and the map is resized in and out.
import { t } from "./texts.js";

// Which way this browser goes fullscreen with this element. Pure, for tests.
export function fullscreenMode(doc, el) {
  if (doc.fullscreenEnabled && typeof el.requestFullscreen === "function") return "api";
  if (doc.webkitFullscreenEnabled && typeof el.webkitRequestFullscreen === "function") return "webkit";
  return "pseudo";
}

const ENTER = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 3.5h5v5M16.5 3.5l-5 5M8.5 16.5h-5v-5M3.5 16.5l5-5"/></svg>';
const EXIT = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 8.5h-5v-5M11.5 8.5l5-5M3.5 11.5h5v5M8.5 11.5l-5 5"/></svg>';

export function fullscreenButton(map, el) {
  const mode = fullscreenMode(document, el);
  const b = document.createElement("button");
  b.type = "button";
  const isOn = () => mode === "api" ? document.fullscreenElement === el
    : mode === "webkit" ? document.webkitFullscreenElement === el : el.classList.contains("map-pseudo-full");
  const show = () => {
    const on = isOn();
    const label = t(on ? "fs_exit" : "fs_enter");
    b.title = label;
    b.setAttribute("aria-label", label);
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.innerHTML = on ? EXIT : ENTER;
    map.resize();
  };
  const pseudo = (on) => {
    el.classList.toggle("map-pseudo-full", on);
    document.documentElement.classList.toggle("map-pseudo-full-open", on);
    show();
  };
  b.addEventListener("click", () => {
    const on = isOn();
    if (mode === "api") { (on ? document.exitFullscreen() : el.requestFullscreen()).catch(() => pseudo(!on)); return; }
    if (mode === "webkit") { if (on) document.webkitExitFullscreen(); else el.webkitRequestFullscreen(); return; }
    pseudo(!on);
  });
  document.addEventListener("fullscreenchange", show);
  document.addEventListener("webkitfullscreenchange", show);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && el.classList.contains("map-pseudo-full")) pseudo(false); });
  show();
  return b;
}
