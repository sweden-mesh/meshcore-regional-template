#!/usr/bin/env node
// The header at every width (B-338): from 768 to 1600 px in steps of 32, at 100, 110 and 125 %
// zoom, nothing in the header row overlaps, wraps, reaches past the header's edge or is clipped
// (the search button holds its label and the "/" hint). Zoom is taken as the CSS width it leaves.
// Needs Puppeteer and Chrome: PUPPETEER=<path to puppeteer> CHROME=/usr/bin/google-chrome
//   node scripts/check-header-browser.mjs [built site dir ...]
// Default: exampleSite/public and exampleNational/public, as scripts/check.sh leaves them.
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const roots = process.argv.slice(2).length ? process.argv.slice(2).map((p) => resolve(p) + "/") : [here("../exampleSite/public/"), here("../exampleNational/public/")];
const mod = await import(process.env.PUPPETEER || "puppeteer");
const puppeteer = mod.default || mod;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2" };

let ROOT = "";
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

// What is wrong with the header as it stands, as a list of findings (empty = fine).
const inspect = () => {
  const h = document.querySelector(".site-header");
  const cs = getComputedStyle(h);
  const r = h.getBoundingClientRect();
  const left = r.left + parseFloat(cs.paddingLeft) - 0.5, right = r.right - parseFloat(cs.paddingRight) + 0.5;
  const shown = [...h.children].filter((c) => c.getClientRects().length && getComputedStyle(c).visibility !== "hidden" && c.getBoundingClientRect().width > 0 && !c.matches("[popover], template, script"));
  const out = [];
  const name = (c) => c.className || c.tagName.toLowerCase();
  const boxes = shown.map((c) => [c, c.getBoundingClientRect()]);
  for (const [c, b] of boxes) {
    if (b.left < left || b.right > right) out.push(`${name(c)} reaches past the header (${Math.round(b.left)}–${Math.round(b.right)} of ${Math.round(left)}–${Math.round(right)})`);
    if (c.scrollWidth > c.clientWidth + 1 && getComputedStyle(c).overflow !== "visible") out.push(`${name(c)} clips its content`);
  }
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const [a, A] = boxes[i], [b, B] = boxes[j];
    if (A.left < B.right - 0.5 && B.left < A.right - 0.5 && A.top < B.bottom - 0.5 && B.top < A.bottom - 0.5) out.push(`${name(a)} overlaps ${name(b)}`);
  }
  // One row: every item's middle within the tallest item's height.
  const mids = boxes.map(([, b]) => (b.top + b.bottom) / 2);
  if (mids.length && Math.max(...mids) - Math.min(...mids) > 4) out.push("the header wraps onto two rows");
  // Inside the row: the menu's links on one line, the search button's label and hint whole.
  const nav = h.querySelector(".nav-wide");
  if (nav && nav.getClientRects().length) {
    const tops = new Set([...nav.querySelectorAll("a")].map((a) => Math.round(a.getBoundingClientRect().top)));
    if (tops.size > 1) out.push("the menu wraps");
    for (const a of nav.querySelectorAll("a")) if (a.getClientRects().length > 1) out.push(`menu item "${a.textContent}" breaks`);
    const links = [...nav.querySelectorAll("a")].map((a) => a.getBoundingClientRect());
    for (let i = 1; i < links.length; i++) if (links[i].left < links[i - 1].right + 4) out.push("menu items crowd each other");
  }
  const s = h.querySelector(".search-open");
  if (s && s.getClientRects().length) {
    const sb = s.getBoundingClientRect();
    for (const part of s.querySelectorAll(".search-open-label, kbd, svg")) {
      if (!part.getClientRects().length) continue;
      const pb = part.getBoundingClientRect();
      if (pb.left < sb.left || pb.right > sb.right + 0.5) out.push(`the search button clips its ${part.tagName.toLowerCase()}`);
      if (part.getClientRects().length > 1 || part.scrollWidth > Math.ceil(pb.width) + 1) out.push(`the search button's ${part.tagName.toLowerCase()} wraps or overflows`);
    }
  }
  return out;
};

const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
let fail = 0;
try {
  const page = await browser.newPage();
  page.on("pageerror", (e) => { console.log(`FAIL page error: ${e.message}`); fail = 1; });
  for (const root of roots) {
    ROOT = root;
    for (const path of ["/", "/guider/"]) {
      await page.setViewport({ width: 1600, height: 900 });
      await page.goto(base + path, { waitUntil: "networkidle0" });
      let bad = 0;
      for (const zoom of [1, 1.1, 1.25]) {
        for (let w = 768; w <= 1600; w += 32) {
          await page.setViewport({ width: Math.round(w / zoom), height: 900 });
          // Two frames: the ResizeObserver in menu.js folds the menu, then layout settles.
          await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
          for (const f of await page.evaluate(inspect)) { console.log(`FAIL ${root} ${path} ${w}px at ${zoom * 100}%: ${f}`); bad = 1; }
        }
      }
      console.log(`${bad ? "FAIL" : "ok  "} header ${root.replace(/.*\/(example\w+|[^/]+)\/public\/$/, "$1")} ${path}: 768–1600 px, 100/110/125 %`);
      fail ||= bad;
    }
  }
} finally {
  await browser.close();
  server.close();
}
process.exit(fail);
