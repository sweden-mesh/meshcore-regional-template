#!/usr/bin/env node
// Translation status (B-364): for each Swedish page in <root>/content/, is there an English page at
// the same path in <root>/content.en/, and is it as new as the Swedish one?
//   node scripts/translation-status.mjs [root] [--strict]
// A translation is "outdated" when the Swedish page's lastmod (or date) is later than the English
// page's: the Swedish text changed after the translation was last brought in line. Whoever updates
// the English text sets its lastmod to that day. `--strict` exits 1 on any outdated page; a missing
// translation is only listed (a page without one has no /en/ version, which is allowed).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

// The page's dates from its front matter (YAML between --- lines): { lastmod, date } as YYYY-MM-DD.
export function frontMatterDates(text) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const out = {};
  if (!fm) return out;
  for (const k of ["lastmod", "date"]) {
    const m = fm[1].match(new RegExp(`^${k}:\\s*["']?(\\d{4}-\\d\\d-\\d\\d)`, "m"));
    if (m) out[k] = m[1];
  }
  return out;
}

// "missing", "outdated" or "current", from the two pages' texts (en = null when there is none).
export function status(sv, en) {
  if (en == null) return "missing";
  const s = frontMatterDates(sv), e = frontMatterDates(en);
  const sd = s.lastmod || s.date || "", ed = e.lastmod || e.date || "";
  return sd && (!ed || sd > ed) ? "outdated" : "current";
}

function pages(dir) {
  return readdirSync(dir, { recursive: true }).filter((f) => f.endsWith(".md")).map(String).sort();
}

export function report(root) {
  const sv = join(root, "content"), en = join(root, "content.en");
  const rows = [];
  for (const f of pages(sv)) {
    const e = join(en, f);
    rows.push({ file: f, state: status(readFileSync(join(sv, f), "utf8"), existsSync(e) ? readFileSync(e, "utf8") : null),
      sv: frontMatterDates(readFileSync(join(sv, f), "utf8")), en: existsSync(e) ? frontMatterDates(readFileSync(e, "utf8")) : {} });
  }
  const orphans = existsSync(en) ? pages(en).filter((f) => !existsSync(join(sv, f))) : [];
  return { rows, orphans };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const root = args.find((a) => !a.startsWith("--")) || ".";
  const { rows, orphans } = report(root);
  const count = (s) => rows.filter((r) => r.state === s).length;
  console.log(`translations in ${relative(process.cwd(), root) || "."}: ${count("current")} current, ${count("outdated")} outdated, ${count("missing")} missing, ${orphans.length} English-only`);
  for (const r of rows.filter((r) => r.state === "outdated")) console.log(`outdated  ${r.file} (sv ${r.sv.lastmod || r.sv.date}, en ${r.en.lastmod || r.en.date || "no date"})`);
  for (const r of rows.filter((r) => r.state === "missing")) console.log(`missing   ${r.file}`);
  for (const f of orphans) console.log(`en only   ${f}`);
  if (args.includes("--strict") && count("outdated")) process.exit(1);
}
