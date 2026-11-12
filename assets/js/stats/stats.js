// The "Nätet" card: live counts from Beacon. Both node counts come from one
// list, /nodes for the region, so they are consistent: repeaters heard in the
// region and not placed elsewhere, and how many of those are observers (a
// subset). (The earlier /stats/node-types + /observers pair counted different
// populations: observers that had not yet advertised as nodes, and all node
// types; two equal numbers looked wrong. Operator's review, 2026-11-12.)
// Packets in the last 24 h come from /stats/payload-breakdown.

export function summarize(nodes, breakdown) {
  const reps = (nodes || []).filter((n) => n.nodeType === 2 && !n.possiblyForeign);
  const repeaters = reps.length;
  const online = reps.filter((n) => n.isObserver).length;
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
