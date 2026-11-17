// National mode (params.national): the chosen county, pure helpers shared by the apply script,
// the header button and the county modal. No DOM here, so the tests run in Node.

export const VALID = /^(se|\d\d)$/;
export const COOKIE = "lan";

// The county record for a choice: a county object from the data island, or null for "se" or
// an unknown code.
export function countyFor(data, v) {
  if (!v || v === "se") return null;
  return data.counties.find((c) => c.scb === v) || null;
}

// The text for every [data-r] key, for a county or for "Sverige" (null): what the spans show.
// Keys a county lacks (no place), and every key for Sverige, fall back to the neutral text the
// page was built with ("ditt län", "se-<län>"; the footer's "Sverige" and "se").
export function valuesFor(data, c) {
  if (!c) return {};
  const v = {
    name: c.name, short: c.short, scope: c.scope, test: c.test, prefix: c.prefix,
    iata: c.iata, proposal: c.decision === "forslag" ? data.texts.proposal : "",
    channels: [...c.channels.map((ch) => ch.name), c.test].join(", "),
  };
  if (c.place) v.place = c.place;
  return v;
}

// A page title with the national suffix ("… – MeshCore Sverige") turned to the county's short
// name; titles without the suffix (the county pages' own) are left as they are.
export function titleFor(title, sweden, c) {
  const from = ` – MeshCore ${sweden}`;
  if (!c || !title.endsWith(from)) return title;
  return title.slice(0, -from.length) + ` – MeshCore ${c.short}`;
}

// The cookie line written for a choice (plan §6.2.5).
export function cookieLine(v) {
  return `${COOKIE}=${v}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
}

// The county's groups as links ({name, url}), https only; none for Sverige.
export function groupsFor(c) {
  if (!c) return [];
  return (c.groups || []).filter((g) => g && g.name && /^https:\/\//.test(g.url || ""));
}

// The county's own chat channels as table rows ({name, scope, purpose}); the test channel is a
// row the page already has.
export function channelRows(c) {
  if (!c) return [];
  return (c.channels || []).map((ch) => ({ name: ch.name, scope: c.scope, purpose: ch.purpose || "" }));
}

// "{name} har en egen sida" with values; unknown keys stay as written.
export function fillTemplate(s, values) {
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
}

// The modal's list: the 21 counties in SCB order, then Sverige. A county with its own site is
// marked with its domain and is never a saved choice.
export function modalModel(data, current) {
  const items = data.counties.map((c) => ({
    v: c.scb, name: c.name, label: c.short || c.name, own: !!c.site, site: c.site || "",
    domain: c.site ? c.site.replace(/^https?:\/\/([^/]+).*$/, "$1") : "",
    current: c.scb === current,
  }));
  items.push({ v: "se", name: data.texts.sweden, own: false, site: "", domain: "", current: current === "se" });
  return { items };
}

// The county map for the modal: one SVG path per county from se-lan.geojson ([lon, lat]
// rings), in a plain equirectangular projection squeezed by cos(62°) so Sweden keeps its shape.
// Returns { viewBox, paths: [{ scb, name, d }] }, coordinates rounded to 0.01.
export function geoToPaths(geo, width = 300) {
  const k = Math.cos((62 * Math.PI) / 180);
  let w = 180, e = -180, s = 90, n = -90;
  const polys = (g) => (g.type === "Polygon" ? [g.coordinates] : g.coordinates);
  for (const f of geo.features) for (const poly of polys(f.geometry)) for (const ring of poly) for (const [x, y] of ring) {
    if (x < w) w = x; if (x > e) e = x; if (y < s) s = y; if (y > n) n = y;
  }
  const scale = width / ((e - w) * k);
  const height = Math.round((n - s) * scale);
  const r = (v) => Math.round(v * 100) / 100;
  const paths = geo.features.map((f) => ({
    scb: f.properties.scb, name: f.properties.name,
    d: polys(f.geometry).map((poly) => poly.map((ring) => "M" + ring.map(([x, y]) => `${r((x - w) * k * scale)},${r((n - y) * scale)}`).join("L") + "Z").join("")).join(""),
  }));
  return { viewBox: `0 0 ${width} ${height}`, paths };
}
