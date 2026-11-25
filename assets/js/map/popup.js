// The node popup: details from /nodes/{id}, in the site's language (texts.js). Node names
// come from the radio network and are untrusted: everything is escaped.
import { t } from "./texts.js";

export function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

export function ago(ms, now = Date.now()) {
  if (!Number.isFinite(ms) || ms <= 0) return t("unknown");
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 90) return t("just_now");
  const m = Math.round(s / 60);
  if (m < 90) return t("min_ago", { n: m });
  const h = Math.round(m / 60);
  if (h < 36) return t("h_ago", { n: h });
  return t("d_ago", { n: Math.round(h / 24) });
}

// "869.618,62.5,8" → "869,618 MHz · BW 62,5 kHz · SF8"
export function formatRadio(radio) {
  const [f, bw, sf] = String(radio || "").split(",");
  if (!f || !bw || !sf) return "";
  const sv = (x) => x.replace(".", t("decimal"));
  return `${sv(f)} MHz · BW ${sv(bw)} kHz · SF${sf}`;
}

// MeshMapper site details (B-181, layouts/_partials/meshmapper-sites.html): antenna, height above
// ground and power source, keyed by the full public key. Entered by people: escaped like the name.
// No entry, or no field in it: no line.
export function siteHtml(site) {
  if (!site) return "";
  const rows = [];
  if (site.a) rows.push(`<p>${escapeHtml(t("site_antenna"))}: ${escapeHtml(site.a)}</p>`);
  if (site.h) rows.push(`<p>${escapeHtml(t("site_height"))}: ${escapeHtml(String(site.h).replace(".", t("decimal")))} m</p>`);
  if (site.p) {
    const k = `site_power_${String(site.p).toLowerCase()}`;
    const label = t(k) === k ? site.p : t(k);
    rows.push(`<p>${escapeHtml(t("site_power"))}: ${escapeHtml(label)}</p>`);
  }
  return rows.length ? `<div class="np-site">${rows.join("")}<p class="np-credit">${escapeHtml(t("site_credit"))}</p></div>` : "";
}

// `linked`: how many nodes the map knows a link to for this node (neighbours.js linkedCount); the
// larger of it and the node's own count is shown, so the number never contradicts the lines.
export function popupHtml(n, now = Date.now(), site = null, linked = null) {
  const rows = [];
  const type = (n.nodeType >= 1 && n.nodeType <= 4 ? t(`type_${n.nodeType}`) : "") || n.nodeTypeName || t("type_node");
  rows.push(`<p class="np-type">${escapeHtml(type)}${n.isObserver ? ` · ${escapeHtml(t("observer"))}` : ""}${n.stale ? ` · ${escapeHtml(t("stale"))}` : ""}${n.possiblyForeign ? ` · ${escapeHtml(t("foreign"))}` : ""}</p>`);
  const heard = (n.iatas || []).map((i) => `${escapeHtml(i.iata)} ${escapeHtml(ago(i.lastHeard, now))}`);
  rows.push(`<p>${escapeHtml(t("heard"))}: ${heard.length ? heard.join(", ") : escapeHtml(ago(n.lastSeen, now))}</p>`);
  const radio = formatRadio(n.radio);
  if (radio) rows.push(`<p>${escapeHtml(t("radio"))}: ${escapeHtml(radio)}</p>`);
  const known = Math.max(Number.isFinite(n.knownNeighborCount) ? n.knownNeighborCount : -1, Number.isFinite(linked) ? linked : -1);
  if (known >= 0) rows.push(`<p>${escapeHtml(t("neighbours"))}: ${known}</p>`);
  rows.push(siteHtml(site));
  if (n.publicKey) rows.push(`<p class="np-key"><code>${escapeHtml(n.publicKey.slice(0, 8).toUpperCase())}</code></p>`);
  return `<div class="node-popup"><h3>${escapeHtml(n.name || t("unnamed"))}</h3>${rows.join("")}</div>`;
}

// How far the map must move down so an open popup is not under the map's corner controls (the
// toggles and the legend; on a phone they cover the top of the map). Rects as from
// getBoundingClientRect; never so far that the popup leaves the map at the bottom. Pure.
export function revealShift(popup, blockers, map, gap = 8) {
  let dy = 0;
  for (const b of blockers) {
    if (popup.left < b.right && popup.right > b.left && popup.top < b.bottom + gap) dy = Math.max(dy, b.bottom + gap - popup.top);
  }
  return Math.max(0, Math.min(dy, map.bottom - gap - popup.bottom));
}

const reveal = (map, popup) => {
  const el = popup.getElement();
  if (!el) return;
  const box = map.getContainer();
  const blockers = [...box.querySelectorAll(".maplibregl-ctrl-top-left > *, .maplibregl-ctrl-top-right > *")].map((c) => c.getBoundingClientRect());
  const dy = revealShift(el.getBoundingClientRect(), blockers, box.getBoundingClientRect());
  const calm = typeof document !== "undefined" && document.documentElement.dataset.motion === "off";
  if (dy > 0) map.panBy([0, -dy], { duration: calm ? 0 : 200 });
};

// sites: an async function giving the site-details map (or {}), called on the first popup.
export function attachPopups(map, maplibregl, client, sites = async () => ({}), linked = null) {
  const popup = new maplibregl.Popup({ maxWidth: "18rem", closeButton: true });
  const open = async (e) => {
    const f = e.features[0];
    const coords = f.geometry.coordinates.slice();
    popup.setLngLat(coords).setHTML(`<div class="node-popup"><h3>${escapeHtml(f.properties.name)}</h3><p>${escapeHtml(t("loading"))}</p></div>`).addTo(map);
    if (f.properties.seeded) {
      // Known only from another Beacon: our own has no details for it yet.
      popup.setHTML(`<div class="node-popup"><h3>${escapeHtml(f.properties.name)}</h3><p>${escapeHtml(t("seeded"))}</p></div>`);
      return;
    }
    try {
      const [n, s] = await Promise.all([client.get(`/nodes/${encodeURIComponent(f.properties.id)}`), sites().catch(() => ({}))]);
      if (popup.isOpen()) { popup.setHTML(popupHtml(n, Date.now(), (s || {})[String(n.publicKey || "").toUpperCase()], linked ? linked(f.properties.id) : null)); reveal(map, popup); }
    } catch {
      if (popup.isOpen()) popup.setHTML(`<div class="node-popup"><h3>${escapeHtml(f.properties.name)}</h3><p>${escapeHtml(t("load_failed"))}</p></div>`);
    }
  };
  for (const id of ["node-points", "node-pills"]) map.on("click", id, open);
  return popup;
}
