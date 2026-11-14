// The "Nätet" card: live counts from Beacon. Both node counts come from one
// list, /nodes for the region, nodes not placed elsewhere: the repeaters, and
// the observers of any type, counted on their own (a companion can be an
// observer too; visitor feedback 2026-11-14). (The earlier /stats/node-types + /observers pair counted different
// populations: observers that had not yet advertised as nodes, and all node
// types; two equal numbers looked wrong. Operator's review, 2026-11-12.)
// Packets in the last 24 h come from /stats/payload-breakdown.

export function summarize(nodes, breakdown) {
  const local = (nodes || []).filter((n) => !n.possiblyForeign);
  const repeaters = local.filter((n) => n.nodeType === 2).length;
  const online = local.filter((n) => n.isObserver).length;
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
  const [nodes, breakdown] = await Promise.all([
    client.getAll("/nodes", { iatas, limit: 2000 }),
    client.get("/stats/payload-breakdown", { iatas }),
  ]);
  const s = summarize(nodes, breakdown);
  for (const [key, value] of Object.entries(s)) {
    for (const target of document.querySelectorAll(`[data-stat="${key}"]`)) target.textContent = formatCount(value);
  }
  const badge = document.getElementById("online-badge");
  if (badge && s.repeaters > 0) badge.hidden = false;
  el.classList.add("stats-live");
  return s;
}
