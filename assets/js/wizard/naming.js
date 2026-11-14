// Build a repeater name from the region's suggestion (params.naming.pattern,
// e.g. "SE-JKP-Plats"): the prefix before "Plats" and the place typed by the
// user (spaces → nothing, å/ä/ö kept unless too long). The first 4 hex
// characters of the node's key are added only when the owner ticks it: they are
// needed only when several repeaters stand at the same place (operator
// 2026-11-14). A pattern ending in "ABCD" (older region configs) ticks it by default.

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

export function buildName(pattern, place, publicKey, withKey = wantsKeySuffix(pattern)) {
  const p = cleanPlace(place);
  if (!p) return "";
  let name = namePrefix(pattern) + p;
  if (withKey && publicKey) name += "-" + publicKey.slice(0, 4).toUpperCase();
  return name;
}
