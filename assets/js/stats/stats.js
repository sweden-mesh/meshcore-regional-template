// The "Nätet" card: live counts from Beacon. Repeaters from /stats/node-types,
// observers online from /observers, packets in the last 24 h from
// /stats/payload-breakdown (its default window). Counts only: no positions,
// names or message content.

export function summarize(nodeTypes, observers, breakdown) {
  const repeaters = (nodeTypes || []).filter((t) => t.nodeType === 2).reduce((n, t) => n + (t.count || 0), 0);
  const online = (observers || []).filter((o) => o.status === "online").length;
  const packets = (breakdown || []).reduce((n, b) => n + (b.count || 0), 0);
  return { repeaters, online, packets };
}

export function formatCount(n) {
  if (!Number.isFinite(n)) return "–";
  if (n >= 10000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".", ",")}k`;
  return String(n);
}

export async function fillStats(el, client, iatas) {
  const [types, observers, breakdown] = await Promise.all([
    client.get("/stats/node-types", { iatas }),
    client.getAll("/observers", { iatas, limit: 200 }),
    client.get("/stats/payload-breakdown", { iatas }),
  ]);
  const s = summarize(types, observers, breakdown);
  for (const [key, value] of Object.entries(s)) {
    const target = el.querySelector(`[data-stat="${key}"]`);
    if (target) target.textContent = formatCount(value);
  }
  el.classList.add("stats-live");
  return s;
}
