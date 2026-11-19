// The host wizard page (wizard-host.html). DOM only; the logic is in host.js.
import { createPicker } from "./mappick.js";
import { palette } from "../map/palette.js";
import { assess, placeKind, nearestKm, coverageGeoJSON, borderPolygons, coarse, DEFAULT_EDGE_KM } from "./host.js";

const form = document.getElementById("host-wizard");
if (form) init(form);

function init(form) {
  const t = JSON.parse(document.getElementById("hp-texts").dataset.texts);
  const km = Number(form.dataset.edgeKm) || DEFAULT_EDGE_KM;
  const q = (sel) => form.querySelector(sel);
  const val = (name) => form.querySelector(`input[name="hp-${name}"]:checked`)?.value || null;
  const label = (name, v) => (t.q[name].find((o) => o[0] === v) || [])[1] || "";
  const st = { pos: null, repeaters: null, polygons: [] };
  const comma = (document.documentElement.lang || "sv").startsWith("sv");
  const dec = (x) => (comma ? String(x).replace(".", ",") : String(x));

  const place = () => (st.pos && st.repeaters ? placeKind(st.pos.lat, st.pos.lon, st.repeaters, st.polygons, km) : null);

  const showPlace = (kind) => {
    const out = q('[data-out="place"]');
    if (!st.pos) { out.textContent = t.place.none; return; }
    if (!kind) { out.textContent = ""; return; }
    const d = nearestKm(st.pos.lat, st.pos.lon, st.repeaters);
    out.textContent = t.place[kind].replace("{D}", Number.isFinite(d) ? dec(d.toFixed(1)) : "–");
  };

  const summary = (a, kind) => {
    const lines = [t.sum.intro];
    for (const k of ["height", "view", "power", "wifi"]) if (a[k]) lines.push(`${t.heads[k]}: ${label(k, a[k])}`);
    if (st.pos) lines.push(`${t.sum.pos} ${dec(coarse(st.pos.lat))}, ${dec(coarse(st.pos.lon))}${kind ? ` (${t.sum[kind]})` : ""}`);
    if (a.shadow === "yes") lines.push(t.sum.shadow);
    return lines.join("\n");
  };

  const update = () => {
    const kind = place();
    showPlace(kind);
    const a = { height: val("height"), view: val("view"), power: val("power"), wifi: val("wifi"), shadow: val("shadow"), place: kind };
    const { strengths, tips } = assess(a);
    const any = strengths.length + tips.length > 0;
    q('[data-out="empty"]').hidden = any;
    q('[data-out="lists"]').hidden = !any;
    const fill = (key, items, texts) => {
      q(`[data-out="${key}"]`).innerHTML = items.map((k) => `<li>${texts[k]}</li>`).join("");
      q(`[data-out="${key}"]`).hidden = q(`[data-head="${key}"]`).hidden = !items.length;
    };
    fill("strengths", strengths, t.s);
    fill("tips", tips, t.t);
    q('[data-out="summary"]').textContent = summary(a, kind);
  };

  for (const el of form.querySelectorAll('input[type="radio"]')) el.addEventListener("change", update);
  // The wanted places' names pan the picker to the place; the pin stays where the visitor put it.
  let picker = null;
  form.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-want-lat]");
    if (!b || !picker) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    picker.map.easeTo({ center: [Number(b.dataset.wantLon), Number(b.dataset.wantLat)], zoom: Math.max(picker.map.getZoom(), 12), duration: calm ? 0 : 600 });
  });
  createPicker(q(".map-pick"), {
    onChange: (p) => { st.pos = p; update(); },
    onNodes: (map, nodes, borders) => {
      st.repeaters = nodes.filter((n) => Number.isFinite(n.lat) && Number.isFinite(n.lng));
      st.polygons = borderPolygons(borders);
      const before = ["wanted-area", "pick-nodes"].find((id) => map.getLayer(id));
      map.addSource("hp-cover", { type: "geojson", data: coverageGeoJSON(st.repeaters, km) });
      map.addLayer({ id: "hp-cover", type: "fill", source: "hp-cover",
        paint: { "fill-color": palette().hostCover, "fill-opacity": 0.18 } }, before);
      update();
    },
  }).then((p) => { picker = p; }).catch(() => {});
  update();
}
