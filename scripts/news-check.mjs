#!/usr/bin/env node
// What is newer than the last "Nytt i MeshCore" post, per source (CONTENT-SV-31), so a sprint can see
// what to write. Reads `release: {product, version}` from content/nytt/*.md and asks, politely, four
// places: MeshCore's GitHub releases, agessaman's rolling MQTT Observer release (the version is the
// "MQTT Observer vX" line in its body, not the date: rebuilt assets alone are not news), EasySkyMesh's
// releases (tags PowerSavingNN[.N]) and the MeshMapper wiki's sitemap (app and server release notes).
// Four requests a run, at most once a day (a stamp in ~/.cache; --force skips it). Prints, never writes
// content. A MeshMapper server patch (v1.5.x) is listed but meant for at most one post a month.
//   node scripts/news-check.mjs [--force]        GITHUB_TOKEN is used when set
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const dir = new URL("../content/nytt/", import.meta.url);
const stampDir = join(process.env.XDG_CACHE_HOME || join(homedir(), ".cache"), "meshcore-regional-template");
const stamp = join(stampDir, "news-check.stamp");
const DAY = 24 * 3600 * 1000;

// The newest version we have a post for, per product.
export function postedVersions(files) {
  const have = {};
  for (const text of files) {
    const m = /^release:\s*\{\s*product:\s*([\w-]+),\s*version:\s*"([^"]+)"\s*\}/m.exec(text);
    if (m && (!have[m[1]] || cmp(m[2], have[m[1]]) > 0)) have[m[1]] = m[2];
  }
  return have;
}
export function cmp(a, b) {
  const x = a.split(".").map(Number), y = b.split(".").map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d; }
  return 0;
}
const newest = (list) => list.reduce((m, v) => (!m || cmp(v, m) > 0 ? v : m), "");

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();

async function main() {
if (!process.argv.includes("--force") && existsSync(stamp) && Date.now() - Number(readFileSync(stamp, "utf8")) < DAY) {
  console.log("news-check: ran less than a day ago; --force to run anyway");
  return;
}

  const headers = { "User-Agent": "meshcore-regional-template news-check", Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const get = async (url, json = true) => {
    const r = await fetch(url, { headers, signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw new Error(`${url}: ${r.status}`);
    return json ? r.json() : r.text();
  };

  const have = postedVersions(readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => readFileSync(new URL(f, dir), "utf8")));
  const found = {};
  const sources = [
    ["meshcore", async () => newest((await get("https://api.github.com/repos/meshcore-dev/MeshCore/releases?per_page=30"))
      .map((r) => /-v(\d+\.\d+\.\d+)$/.exec(r.tag_name)?.[1]).filter(Boolean))],
    ["observer", async () => /MQTT Observer v(\d+\.\d+\.\d+)/.exec((await get("https://api.github.com/repos/agessaman/MeshCore/releases/tags/observer-mqtt-latest")).body || "")?.[1] || ""],
    ["easyskymesh", async () => newest((await get("https://api.github.com/repos/IoTThinks/EasySkyMesh/releases?per_page=10"))
      .map((r) => /^PowerSaving(\d+(?:\.\d+)?)$/.exec(r.tag_name)?.[1]).filter(Boolean))],
    ["meshmapper", async () => {
      const xml = await get("https://wiki.meshmapper.net/sitemap.xml", false);
      const all = (kind) => [...xml.matchAll(new RegExp(`/release-notes/${kind}/v(\\d+\\.\\d+\\.\\d+)/`, "g"))].map((m) => m[1]);
      found["meshmapper-web"] = newest(all("server"));
      return newest(all("app"));
    }],
  ];
  let failed = 0;
  for (const [key, fn] of sources) {
    try { const v = await fn(); found[key === "meshmapper" ? "meshmapper-app" : key] = v; }
    catch (e) { console.log(`?    ${key}: ${e.message}`); failed++; }
  }
  for (const [product, v] of Object.entries(found)) {
    const h = have[product] || "";
    if (!v) console.log(`?    ${product}: no version found`);
    else if (!h || cmp(v, h) > 0) console.log(`NEW  ${product}: ${v} (last post: ${h || "none"})${product === "meshmapper-web" ? "; server builds: at most one post a month" : ""}`);
    else console.log(`ok   ${product}: ${v} has its post`);
  }
  if (!failed) { mkdirSync(stampDir, { recursive: true }); writeFileSync(stamp, String(Date.now())); }
}
