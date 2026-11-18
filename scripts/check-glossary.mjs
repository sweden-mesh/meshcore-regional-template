#!/usr/bin/env node
// Glossary links (layouts/_partials/glossary.html), checked on a built site (default the example
// site that scripts/check.sh builds): every guide links the glossary, each entry at most once per
// page, never from a heading, a link, code or a button, every link lands on a heading of the
// glossary, no other page carries one, and the common words that only sometimes mean the term are
// linked only in that sense.  Usage: node scripts/check-glossary.mjs [public-dir]
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.argv[2] || fileURLToPath(new URL("../exampleSite/public/", import.meta.url));
const md = readFileSync(fileURLToPath(new URL("../content/guider/ordlista.md", import.meta.url)), "utf8");
const terms = [...md.matchAll(/^ {2}- \{ id: ([a-z-]+),/gm)].map((m) => m[1]);
let fail = 0;
const ok = (cond, what) => { console.log(`${cond ? "ok  " : "FAIL"} glossary: ${what}`); if (!cond) fail = 1; };

const glossary = readFileSync(join(root, "guider/ordlista/index.html"), "utf8");
const anchors = new Set([...glossary.matchAll(/<h2 id="?([a-z-]+)"?[ >]/g)].map((m) => m[1]));
ok(terms.length >= 30 && terms.every((t) => anchors.has(t)), `all ${terms.length} terms in the front matter are headings of the glossary`);
ok(!/class="?gloss/.test(glossary), "the glossary links nothing to itself");

const pages = [];
(function walk(dir) {
  for (const n of readdirSync(dir)) {
    const f = join(dir, n);
    if (statSync(f).isDirectory()) walk(f);
    else if (n === "index.html") pages.push(f);
  }
})(root);
const link = /<a class="?gloss"? href="?[^"> ]*\/guider\/ordlista\/#([a-z-]+)"?[^>]*>([^<]*)<\/a>/g;
const guides = pages.filter((f) => /\/guider\/.+\/index\.html$/.test(f.slice(root.length - 1)) && !f.includes("/ordlista/"));
const real = guides.filter((f) => !/http-equiv="?refresh/.test(readFileSync(f, "utf8")));
let linked = 0, twice = [], wrongPlace = [], unknown = [], outside = [];
for (const f of pages) {
  const html = readFileSync(f, "utf8");
  const ids = [...html.matchAll(link)].map((m) => m[1]);
  if (!real.includes(f)) { if (ids.length) outside.push(f); continue; }
  if (ids.length) linked++;
  const seen = new Set();
  for (const id of ids) { if (seen.has(id)) twice.push(`${f} #${id}`); seen.add(id); if (!anchors.has(id)) unknown.push(id); }
  for (const tag of ["h1", "h2", "h3", "h4", "a", "code", "pre", "button", "summary", "kbd"]) {
    for (const m of html.matchAll(new RegExp(`<${tag}(?:>|\\s(?![^>]*class="?gloss)[^>]*>)(?:(?!</${tag}>).)*?<a class="?gloss`, "gs"))) wrongPlace.push(`${f}: in <${tag}> ${m[0].slice(0, 60)}`);
  }
}
ok(linked === real.length && real.length > 10, `every guide links the glossary (${linked} of ${real.length})`);
ok(!twice.length, `each entry at most once per page${twice.length ? ": " + twice.slice(0, 5).join(", ") : ""}`);
ok(!wrongPlace.length, `no link inside a heading, link, code or button${wrongPlace.length ? ": " + wrongPlace.slice(0, 3).join(" | ") : ""}`);
ok(!unknown.length, `every link lands on a glossary heading${unknown.length ? ": " + unknown.join(", ") : ""}`);
ok(!outside.length, `only guide pages carry glossary links${outside.length ? ": " + outside.slice(0, 3).join(", ") : ""}`);

// The words that are also plain Swedish: "direkt" only before "längs", "väg" only after "längs".
const all = real.map((f) => readFileSync(f, "utf8")).join("\n");
const texts = (id) => [...all.matchAll(link)].filter((m) => m[1] === id).map((m) => m.index);
ok(texts("direkt").every((i) => /^<a[^>]*>direkt<\/a>\s+längs/i.test(all.slice(i))), "\"direkt\" is linked only as \"direkt längs\"");
ok(texts("vag").every((i) => /längs\s+(den\s+)?$/i.test(all.slice(Math.max(0, i - 20), i))), "\"väg\" is linked only after \"längs\"");
const companion = join(root, "guider/companion/index.html");
if (existsSync(companion)) ok(!/#vag/.test(readFileSync(companion, "utf8")), "\"vägen på Linux\" (the companion guide) is not linked");
const what = join(root, "guider/vad-ar-meshcore/index.html");
if (existsSync(what)) ok(/<a class="?gloss"?[^>]*#lora[^>]*title="[^"]+">LoRa<\/a>/.test(readFileSync(what, "utf8")), "a link carries its entry's short definition as its title");
process.exit(fail);
