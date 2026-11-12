// Build a node name from the region's naming rule (params.naming.pattern,
// e.g. "SE-JKP-Plats-ABCD"): the prefix before "Plats", the place typed by the
// user (spaces → nothing, å/ä/ö kept unless too long), and "ABCD" replaced by
// the first 4 hex characters of the node's key when known.

export function namePrefix(pattern) {
  const i = (pattern || "").indexOf("Plats");
  return i > 0 ? pattern.slice(0, i) : "";
}

export function wantsKeySuffix(pattern) {
  return /ABCD$/.test(pattern || "");
}

export function cleanPlace(place) {
  return (place || "").trim().replace(/\s+/g, "").replace(/[^\p{L}\p{N}-]/gu, "");
}

export function buildName(pattern, place, publicKey) {
  const p = cleanPlace(place);
  if (!p) return "";
  let name = namePrefix(pattern) + p;
  if (wantsKeySuffix(pattern) && publicKey) name += "-" + publicKey.slice(0, 4).toUpperCase();
  return name;
}
