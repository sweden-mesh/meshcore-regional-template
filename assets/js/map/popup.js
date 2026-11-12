// The node popup: details from /nodes/{id}, formatted in Swedish. Node names
// come from the radio network and are untrusted: everything is escaped.

const TYPE_LABELS = { 1: "Companion", 2: "Repeater", 3: "Rumsserver", 4: "Sensor" };

export function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

export function ago(ms, now = Date.now()) {
  if (!Number.isFinite(ms) || ms <= 0) return "okänt";
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 90) return "nyss";
  const m = Math.round(s / 60);
  if (m < 90) return `${m} min sedan`;
  const h = Math.round(m / 60);
  if (h < 36) return `${h} h sedan`;
  return `${Math.round(h / 24)} d sedan`;
}

// "869.618,62.5,8" → "869,618 MHz · BW 62,5 kHz · SF8"
export function formatRadio(radio) {
  const [f, bw, sf] = String(radio || "").split(",");
  if (!f || !bw || !sf) return "";
  const sv = (x) => x.replace(".", ",");
  return `${sv(f)} MHz · BW ${sv(bw)} kHz · SF${sf}`;
}

export function popupHtml(n, now = Date.now()) {
  const rows = [];
  const type = TYPE_LABELS[n.nodeType] || n.nodeTypeName || "Nod";
  rows.push(`<p class="np-type">${escapeHtml(type)}${n.isObserver ? " · observatör" : ""}${n.stale ? " · inaktuell" : ""}${n.possiblyForeign ? " · troligen utanför regionen" : ""}</p>`);
  const heard = (n.iatas || []).map((i) => `${escapeHtml(i.iata)} ${escapeHtml(ago(i.lastHeard, now))}`);
  rows.push(`<p>Senast hörd: ${heard.length ? heard.join(", ") : escapeHtml(ago(n.lastSeen, now))}</p>`);
  const radio = formatRadio(n.radio);
  if (radio) rows.push(`<p>Radio: ${escapeHtml(radio)}</p>`);
  if (Number.isFinite(n.knownNeighborCount)) rows.push(`<p>Kända grannar: ${n.knownNeighborCount}</p>`);
  if (n.publicKey) rows.push(`<p class="np-key"><code>${escapeHtml(n.publicKey.slice(0, 8).toUpperCase())}</code></p>`);
  return `<div class="node-popup"><h3>${escapeHtml(n.name || "Namnlös nod")}</h3>${rows.join("")}</div>`;
}

export function attachPopups(map, maplibregl, client) {
  const popup = new maplibregl.Popup({ maxWidth: "18rem", closeButton: true });
  map.on("click", "node-points", async (e) => {
    const f = e.features[0];
    const coords = f.geometry.coordinates.slice();
    popup.setLngLat(coords).setHTML(`<div class="node-popup"><h3>${escapeHtml(f.properties.name)}</h3><p>Hämtar…</p></div>`).addTo(map);
    try {
      const n = await client.get(`/nodes/${encodeURIComponent(f.properties.id)}`);
      if (popup.isOpen()) popup.setHTML(popupHtml(n));
    } catch {
      if (popup.isOpen()) popup.setHTML(`<div class="node-popup"><h3>${escapeHtml(f.properties.name)}</h3><p>Kunde inte hämta detaljer.</p></div>`);
    }
  });
  return popup;
}
