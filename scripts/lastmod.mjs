#!/usr/bin/env node
// Real dates for the template's own pages (SEO-T1). Run at each release, before the release commit:
//   node scripts/lastmod.mjs
// A region gets the template's content from the Go module cache, where Hugo's git dates do not
// reach and file times are the download time. So this writes each content file's dates into its
// front matter: `lastmod` = the day its text last changed (a commit that only touched `date` or
// `lastmod` does not count; uncommitted changes count as today), and `date` = the day it was first
// committed, written once. The wizard pages are made by content/wizard/_content.gotmpl, so their
// dates go to data/lastmod.toml: the last change of the wizard's shortcode or of assets/js/wizard/.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const DATE_LINE = /^[+-](lastmod|date):/;

// Does a unified diff change anything but the date lines? Pure, for the tests.
export function changesContent(diff) {
  return diff.split("\n").some((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)( |$)/.test(l) && !DATE_LINE.test(l));
}

// `git log -p --format=@@C%cs` output, newest first -> the newest date whose diff changes content.
export function lastContentDate(log) {
  for (const chunk of log.split(/^@@C/m).slice(1)) {
    const nl = chunk.indexOf("\n");
    if (changesContent(chunk.slice(nl + 1))) return chunk.slice(0, nl).trim();
  }
  return "";
}

// Set `key: value` in a Markdown file's YAML front matter. onlyIfMissing keeps an existing value.
export function setFrontMatter(text, key, value, onlyIfMissing = false) {
  const m = text.match(/^---\n([\s\S]*?\n)---\n/);
  if (!m) return text;
  const re = new RegExp(`^${key}:.*$`, "m");
  let fm = m[1];
  if (re.test(fm)) { if (onlyIfMissing) return text; fm = fm.replace(re, `${key}: ${value}`); }
  else fm += `${key}: ${value}\n`;
  return `---\n${fm}---\n` + text.slice(m[0].length);
}

const git = (root, ...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 64 << 20 });
const today = () => new Date().toISOString().slice(0, 10);

const lastDate = (root, path) => changesContent(git(root, "diff", "HEAD", "--", path)) ? today()
  : lastContentDate(git(root, "log", "-p", "--format=@@C%cs", "--", path)) || today();
const firstDate = (root, file) => git(root, "log", "--follow", "--format=%cs", "--", file).trim().split("\n").pop() || today();

function main(root) {
  const files = git(root, "ls-files", "content").split("\n").filter((f) => f.endsWith(".md"));
  let changed = 0;
  for (const f of files) {
    const p = join(root, f);
    const last = lastDate(root, f), first = firstDate(root, f);
    const before = readFileSync(p, "utf8");
    const after = setFrontMatter(setFrontMatter(before, "date", first, true), "lastmod", last);
    if (after !== before) { writeFileSync(p, after); changed++; }
  }
  // The wizards: "path" "x" ... "shortcode" "y" in the content adapter.
  const adapter = readFileSync(join(root, "content/wizard/_content.gotmpl"), "utf8");
  const lines = ["# Written by scripts/lastmod.mjs at each release: the day each wizard page last changed (SEO-T1).", "[wizard]"];
  for (const [, path, sc] of adapter.matchAll(/"path" "([^"]+)".*?"shortcode" "([^"]+)"/g)) {
    const dates = [`layouts/_shortcodes/${sc}.html`, "assets/js/wizard"].map((f) => lastDate(root, f)).sort();
    lines.push(`${path} = "${dates.pop()}"`);
  }
  writeFileSync(join(root, "data/lastmod.toml"), lines.join("\n") + "\n");
  console.log(`lastmod: ${changed} of ${files.length} content files updated; data/lastmod.toml written`);
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) main(join(dirname(fileURLToPath(import.meta.url)), ".."));
