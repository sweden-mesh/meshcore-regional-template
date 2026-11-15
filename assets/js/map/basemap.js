// MapLibre and the basemap. MapLibre (BSD-3-Clause) is served as static files
// from /lib/ and loaded with a runtime import, so it stays out of the bundle
// and its worker file resolves next to it.

import { startCamera, trackUserMoves } from "./camera.js";
import { effectiveTheme } from "../theme.js";

// The basemap follows the site's theme: the system setting, the header toggle, or dark.
export function styleUrl(ds, dark = effectiveTheme() === "dark") {
  return dark ? ds.styleDark : ds.styleLight;
}

export async function createMap(el) {
  const ds = el.dataset;
  // MapLibre's stylesheet comes with the map, not with the page: it is only needed once the
  // map starts. Both are awaited, so the controls never show unstyled.
  const css = ds.maplibreCss && !document.querySelector(`link[href="${ds.maplibreCss}"]`)
    ? Object.assign(document.createElement("link"), { rel: "stylesheet", href: ds.maplibreCss }) : null;
  const cssReady = css ? new Promise((done) => { css.onload = css.onerror = done; document.head.append(css); }) : null;
  const [maplibregl] = await Promise.all([import(/* @vite-ignore */ ds.maplibre), cssReady]);
  el.textContent = "";
  const map = new maplibregl.Map({
    container: el,
    style: styleUrl(ds),
    ...startCamera(ds),
    attributionControl: { compact: true },
    cooperativeGestures: true,
  });
  trackUserMoves(map);
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  document.addEventListener("themechange", (e) => map.setStyle(styleUrl(ds, e.detail === "dark")));
  // Colour-blind mode (cvd-toggle.js): the same style again, reloaded in full, so every layer is
  // re-added on style.load with the mode's colours (palette.js).
  document.addEventListener("cvdchange", () => map.setStyle(styleUrl(ds), { diff: false }));
  return { map, maplibregl };
}
