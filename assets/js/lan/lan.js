// National mode (params.national): the chosen county, pure helpers shared by the apply script,
// the header button and the county modal. No DOM here, so the tests run in Node.

export const VALID = /^(se|\d\d)$/;
export const COOKIE = "lan";

// The county record for a choice: a county object from the data island, or null for "se" or
// an unknown code.
export function countyFor(data, v) {
  if (!v || v === "se") return null;
  return data.counties.find((c) => c.scb === v) || null;
}

// The text for every [data-r] key, for a county or for "Sverige" (null): what the spans show.
// Keys a county lacks (no place) fall back to the neutral text the page was built with.
export function valuesFor(data, c) {
  if (!c) return { name: data.sweden.name, short: data.sweden.short, scope: "se" };
  const v = {
    name: c.name, short: c.short, scope: c.scope, test: c.test, prefix: c.prefix,
    iata: c.iata, proposal: c.decision === "forslag" ? data.texts.proposal : "",
    channels: [...c.channels, c.test].join(", "),
  };
  if (c.place) v.place = c.place;
  return v;
}

// A page title with the national suffix ("… – MeshCore Sverige") turned to the county's short
// name; titles without the suffix (the county pages' own) are left as they are.
export function titleFor(title, sweden, c) {
  const from = ` – MeshCore ${sweden}`;
  if (!c || !title.endsWith(from)) return title;
  return title.slice(0, -from.length) + ` – MeshCore ${c.short}`;
}

// The cookie line written for a choice (plan §6.2.5).
export function cookieLine(v) {
  return `${COOKIE}=${v}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
}
