// MapLibre and the basemap. MapLibre (BSD-3-Clause) is served as static files
// from /lib/ and loaded with a runtime import, so it stays out of the bundle
// and its worker file resolves next to it.

import { startCamera, trackUserMoves } from "./camera.js";
import { effectiveTheme } from "../theme.js";
import { t } from "./texts.js";

// The basemap follows the site's theme: the system setting, the header toggle, or dark.
export function styleUrl(ds, dark = effectiveTheme() === "dark") {
  return dark ? ds.styleDark : ds.styleLight;
}

// Is the base map missing (B-389)? Yes when the style itself could not be fetched, or when four
// of its tiles failed and none has arrived: a content blocker stops the tile host that way, and
// the nodes are then drawn on nothing. One base tile arriving takes the note away.
export function basemapMissing({ styleFailed = false, tileErrors = 0, tilesLoaded = 0 } = {}) {
  return tilesLoaded === 0 && (styleFailed || tileErrors >= 4);
}

function watchBasemap(map, el, host) {
  const seen = { styleFailed: false, tileErrors: 0, tilesLoaded: 0 };
  let note = null;
  const show = () => {
    const missing = basemapMissing(seen);
    if (missing && !note) {
      note = Object.assign(document.createElement("p"), { className: "map-basemap-note", textContent: t("basemap_failed", { host }) });
      note.setAttribute("role", "status");
      el.append(note);
    }
    if (note) note.hidden = !missing;
  };
  const base = (id) => { const s = id && map.getSource(id); return !!s && s.type !== "geojson"; };
  map.on("error", (e) => {
    if (e.sourceId ? base(e.sourceId) : false) seen.tileErrors += 1;
    else if (!e.sourceId && !map.isStyleLoaded()) seen.styleFailed = true;
    show();
  });
  map.on("data", (e) => { if (e.tile && base(e.sourceId)) { seen.tilesLoaded += 1; show(); } });
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
    // The "Ctrl + scroll" hint in the site's language (MapLibre's own text is English).
    locale: {
      "CooperativeGesturesHandler.WindowsHelpText": t("gesture_win"),
      "CooperativeGesturesHandler.MacHelpText": t("gesture_mac"),
      "CooperativeGesturesHandler.MobileHelpText": t("gesture_touch"),
    },
  });
  trackUserMoves(map);
  let host = ""; try { host = new URL(styleUrl(ds), location.href).host; } catch { /* a relative or odd address: no host named */ }
  watchBasemap(map, el, host);
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  document.addEventListener("themechange", (e) => map.setStyle(styleUrl(ds, e.detail === "dark")));
  // Colour-blind mode (cvd-toggle.js): the same style again, reloaded in full, so every layer is
  // re-added on style.load with the mode's colours (palette.js).
  document.addEventListener("cvdchange", () => map.setStyle(styleUrl(ds), { diff: false }));
  return { map, maplibregl };
}
