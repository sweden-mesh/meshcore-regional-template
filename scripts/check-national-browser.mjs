#!/usr/bin/env node
// National mode in a browser (backlog NATIONAL-7al): on every shared page of the built
// exampleNational site that prints county values, choose Kalmar, switch to Skåne in place, then
// to Sverige, and check that no value of the previous county is left anywhere on the page (text,
// title, the header button) and that the new county's values are there.
// Needs Puppeteer and Chrome: PUPPETEER=<path to puppeteer> CHROME=/usr/bin/google-chrome
//   node scripts/check-national-browser.mjs        (after scripts/check-national.sh built the site)
import { createServer } from "node:http";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../exampleNational/public/", import.meta.url));
const mod = await import(process.env.PUPPETEER || "puppeteer");
const puppeteer = mod.default || mod;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".geojson": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2" };

const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const f = join(ROOT, p);
  if (!f.startsWith(ROOT) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "Content-Type": TYPES[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

// Every shared page with county spans (county pages carry their own values and switch by opening
// the other county's page, so they are not switched in place).
const pages = [];
(function walk(dir, rel) {
  for (const name of readdirSync(dir)) {
    const f = join(dir, name);
    if (statSync(f).isDirectory()) walk(f, `${rel}${name}/`);
    else if (name === "index.html") {
      const html = readFileSync(f, "utf8");
      if (/<html[^>]*data-lan-page>/.test(html) && /data-r=|data-r-channels|data-r-groups/.test(html)) pages.push(rel || "");
    }
  }
})(ROOT, "");

const KALMAR = ["Kalmar län", "se08", "#test-se08", "#kalmar-exempel", "Exempelgruppen", "SE08"];
const SKANE = ["Skåne län", "se12"];
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
// A switch applies in place on most pages; the front page opens the county's page and a wizard
// reloads (it reads its values once). Either way, read the page the switch leaves.
const choose = async (v) => {
  const moves = await page.evaluate(() => location.pathname === "/" || !!document.documentElement.getAttribute("data-lan-page") || !!document.querySelector("script[src*=wizard-county]"));
  if (!moves) { await page.evaluate((x) => window.meshcoreLan.set(x), v); return; }
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 10000 }),
    page.evaluate((x) => window.meshcoreLan.set(x), v).catch(() => {}),
  ]);
};
const visible = () => page.evaluate(() => {
  // Lists of every county (the modal, /lan/, the wizard selector, Sverige's list of every county's
  // groups, B-318; the IATA table and Gemenskap's county list, .lan-every) name them all on purpose.
  for (const d of document.querySelectorAll("dialog, .lan-list, [data-lan-wizard], .lan-all-groups, .lan-every")) d.remove();
  return `${document.title}\n${document.body.innerText}`;
});
let fail = 0;
for (const p of pages) {
  if (process.env.DEBUG) console.log("page", p);
  await page.goto(`${base}/${p}?lan=08`, { waitUntil: "networkidle0" });
  const before = await visible();
  if (!KALMAR.slice(0, 2).some((v) => before.includes(v))) { console.log(`FAIL /${p}: Kalmar's values not shown`); fail = 1; continue; }
  await choose("12");
  const after = await visible();
  const left = KALMAR.filter((v) => after.includes(v));
  const got = SKANE.some((v) => after.includes(v));
  await choose("se");
  const sverige = await visible();
  const leftSe = [...KALMAR, ...SKANE].filter((v) => sverige.includes(v));
  if (left.length || !got || leftSe.length) { console.log(`FAIL /${p}: after Skåne left ${JSON.stringify(left)}, Skåne shown ${got}; after Sverige left ${JSON.stringify(leftSe)}`); fail = 1; }
  else console.log(`ok   /${p}: Kalmar → Skåne → Sverige, nothing left over`);
}
if (errors.length) { console.log(`FAIL page errors: ${errors.join("; ")}`); fail = 1; }
console.log(`${pages.length} pages checked`);
await browser.close();
server.close();
process.exit(fail);
