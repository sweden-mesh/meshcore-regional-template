// What the live-traffic effects may draw (B-313). A node hidden by "Utanför regionen" (Beacon's
// possiblyForeign, or outside the county on a national county page) must not light up, flash or
// send bubbles, or it blinks into view; it shows again once the toggle is on.
//   hidden(n) → true while the node is not shown.

const placed = (n) => n && Number.isFinite(n.lat) && Number.isFinite(n.lng) && !(n.lat === 0 && n.lng === 0);

// Hops through nodes that are not shown (companions, hidden foreign nodes) become gaps.
export function visibleOnly(nodes, chain, hidden = () => false) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  return chain.map((p) => (p && byId.has(p.id) && !hidden(byId.get(p.id)) ? p : null));
}

// The observer's own node (and position), matched by public key: observer display names often
// differ from the node's advertised name. Null when unknown or hidden.
export function observerPoint(nodes, key, hidden = () => false) {
  if (!key) return null;
  const k = key.toLowerCase();
  const n = nodes.find((x) => (x.publicKey || "").toLowerCase() === k);
  return placed(n) && !hidden(n) ? { id: n.id, lat: n.lat, lng: n.lng } : null;
}

// Where a transmitting node's bubbles go: its shown neighbours.
export function neighbourPoints(nodes, id, hidden = () => false) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  return (byId.get(id)?.neighborIds || []).map((x) => byId.get(x)).filter((m) => placed(m) && !hidden(m))
    .map((m) => ({ lng: m.lng, lat: m.lat }));
}

// The predicate for a map: hidden while "Utanför regionen" is off and the node is foreign, or
// outside the county (isOutside, national county pages).
export function hiddenBy(state, isOutside) {
  return (n) => !state.showForeign && (!!n.possiblyForeign || (typeof isOutside === "function" && placed(n) && isOutside(n)));
}
