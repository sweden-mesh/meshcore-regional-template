// True when the text contains every word of the query, in any order and case. å, ä and ö stay
// letters of their own, as in Swedish: "strom" does not find "ström".
const fold = (s) => s.toLocaleLowerCase("sv").normalize("NFC");

export function matches(text, query) {
  const t = fold(text);
  return fold(query).split(/\s+/).filter(Boolean).every((w) => t.includes(w));
}
