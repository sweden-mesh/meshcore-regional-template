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

export function popupHtml(n, now = Date.now()) {
  const rows = [];
  const type = (n.nodeType >= 1 && n.nodeType <= 4 ? t(`type_${n.nodeType}`) : "") || n.nodeTypeName || t("type_node");
  rows.push(`<p class="np-type">${escapeHtml(type)}${n.isObserver ? ` · ${escapeHtml(t("observer"))}` : ""}${n.stale ? ` · ${escapeHtml(t("stale"))}` : ""}${n.possiblyForeign ? ` · ${escapeHtml(t("foreign"))}` : ""}</p>`);
  const heard = (n.iatas || []).map((i) => `${escapeHtml(i.iata)} ${escapeHtml(ago(i.lastHeard, now))}`);
  rows.push(`<p>${escapeHtml(t("heard"))}: ${heard.length ? heard.join(", ") : escapeHtml(ago(n.lastSeen, now))}</p>`);
  const radio = formatRadio(n.radio);
  if (radio) rows.push(`<p>${escapeHtml(t("radio"))}: ${escapeHtml(radio)}</p>`);
  if (Number.isFinite(n.knownNeighborCount)) rows.push(`<p>${escapeHtml(t("neighbours"))}: ${n.knownNeighborCount}</p>`);
  if (n.publicKey) rows.push(`<p class="np-key"><code>${escapeHtml(n.publicKey.slice(0, 8).toUpperCase())}</code></p>`);
  return `<div class="node-popup"><h3>${escapeHtml(n.name || t("unnamed"))}</h3>${rows.join("")}</div>`;
}

export function attachPopups(map, maplibregl, client) {
  const popup = new maplibregl.Popup({ maxWidth: "18rem", closeButton: true });
  const open = async (e) => {
    const f = e.features[0];
    const coords = f.geometry.coordinates.slice();
    popup.setLngLat(coords).setHTML(`<div class="node-popup"><h3>${escapeHtml(f.properties.name)}</h3><p>${escapeHtml(t("loading"))}</p></div>`).addTo(map);
    try {
      const n = await client.get(`/nodes/${encodeURIComponent(f.properties.id)}`);
      if (popup.isOpen()) popup.setHTML(popupHtml(n));
    } catch {
      if (popup.isOpen()) popup.setHTML(`<div class="node-popup"><h3>${escapeHtml(f.properties.name)}</h3><p>${escapeHtml(t("load_failed"))}</p></div>`);
    }
  };
  for (const id of ["node-points", "node-pills"]) map.on("click", id, open);
  return popup;
}
