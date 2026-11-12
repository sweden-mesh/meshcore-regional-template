// MapLibre and the basemap. MapLibre (BSD-3-Clause) is served as static files
// from /vendor/ and loaded with a runtime import, so it stays out of the bundle
// and its worker file resolves next to it.

const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

export function styleUrl(ds, dark = darkQuery.matches) {
  return dark ? ds.styleDark : ds.styleLight;
}

export async function createMap(el) {
  const ds = el.dataset;
  const maplibregl = await import(/* @vite-ignore */ ds.maplibre);
  el.textContent = "";
  const center = JSON.parse(ds.center || "[62,16]"); // [lat, lng]
  const map = new maplibregl.Map({
    container: el,
    style: styleUrl(ds),
    center: [center[1], center[0]],
    zoom: Number(ds.zoom || 5),
    attributionControl: { compact: true },
    cooperativeGestures: true,
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  darkQuery.addEventListener("change", (e) => map.setStyle(styleUrl(ds, e.matches)));
  return { map, maplibregl };
}
