// Search over the Pagefind index (B-321): Pagefind's JS API, limited to the visitor's region.
// Every page carries one filter "scope" (layouts/_partials/search-scope.html): "common",
// "national", "region:<scope>" or "paired:<key>". A regional site shows common + national + its
// region; the national site common + national + the chosen county (Sverige: common + national).
// A paired page is the common or national version of an article the region may have its own
// version of; it is shown only when the region has none.

// Pure, for tests: the scope values to search in.
export function allowedScopes({ region, pairs = {}, allPairs = [] }) {
  const out = ["common", "national"];
  const own = region ? pairs[region] || [] : [];
  if (region) out.push(region);
  for (const k of allPairs) if (!own.includes(k)) out.push(`paired:${k}`);
  return out;
}

// The region a visitor has: the site's own, or on the national site the chosen county's scope
// (html[data-lan] holds its SCB code; "se" or nothing = Sverige).
export function regionFor(ds, chosen) {
  if (ds.national !== "true") return ds.region || null;
  const counties = JSON.parse(ds.counties || "{}");
  return chosen && counties[chosen] ? `region:${counties[chosen]}` : null;
}

const box = globalThis.document?.getElementById("search");
if (box) start(box);

async function start(box) {
  const t = JSON.parse(box.dataset.texts || "{}");
  const input = box.querySelector("input"), status = box.querySelector(".search-status"), list = box.querySelector(".search-results");
  let pf;
  try {
    pf = await import(box.dataset.bundle + "pagefind.js");
    await pf.options({ excerptLength: 24 });
  } catch {
    status.textContent = t.missing; return;
  }
  const pairs = JSON.parse(box.dataset.pairs || "{}");
  const filters = await pf.filters();
  const allPairs = Object.keys(filters.scope || {}).filter((k) => k.startsWith("paired:")).map((k) => k.slice(7));
  const region = regionFor(box.dataset, document.documentElement.getAttribute("data-lan"));
  const any = allowedScopes({ region, pairs, allPairs });
  input.disabled = false;
  input.focus();
  let seq = 0;
  const run = async () => {
    const q = input.value.trim(), my = ++seq;
    if (!q) { list.replaceChildren(); status.textContent = ""; return; }
    const r = await pf.debouncedSearch(q, { filters: { scope: { any } } }, 250);
    if (!r || my !== seq) return;
    const items = await Promise.all(r.results.slice(0, 20).map((x) => x.data()));
    if (my !== seq) return;
    status.textContent = items.length ? t.count.replace("{n}", r.results.length) : t.none;
    list.replaceChildren(...items.map((d) => {
      const li = document.createElement("li"), a = document.createElement("a"), p = document.createElement("p");
      a.href = d.url; a.textContent = d.meta?.title || d.url;
      p.innerHTML = d.excerpt; // Pagefind's excerpt: our own page text, with <mark> around the hits
      li.append(a, p);
      return li;
    }));
  };
  input.addEventListener("input", run);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") e.preventDefault(); });
}
