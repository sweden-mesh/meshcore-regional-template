#!/usr/bin/env node
// The header at every width (B-338): from 768 to 1600 px in steps of 32, at 100, 110 and 125 %
// zoom, nothing in the header row overlaps, wraps, reaches past the header's edge or is clipped
// (the search button holds its label and the "/" hint). Zoom is taken as the CSS width it leaves.
// And the opened ☰ menu from 320 px up (B-341): under the button, inside the viewport, focus in it.
// National mode, nothing stored (B-343/B-344): no dialog opens by itself, and "Välj din region här!"
// points at the county button from 245 px up, only at scroll position 0 and not while ☰ is open.
// The sticky header (B-366) at 320, 390, 768, 1280 and 1600 px: at the top of the viewport after a
// scroll, compact (logo and ☰ only), opaque and at least 24 px slimmer there and clear at the top of the page, no sideways scroll, ☰ opens under its
// button while scrolled, and a jump to a heading lands below the header.
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
  const shown = [...h.children].filter((c) => c.getClientRects().length && getComputedStyle(c).visibility !== "hidden" && c.getBoundingClientRect().width > 0 && !c.matches("[popover], template, script, .lan-tip"));
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

// The ☰ menu opened and closed once: null when ☰ is not shown, else a list of findings.
const menuCase = async () => {
  const t = document.querySelector(".nav-toggle");
  if (!t || !t.getClientRects().length) return null;
  for (const d of document.querySelectorAll("dialog[open]")) d.close();
  scrollTo(0, 0);
  const menu = document.getElementById(t.getAttribute("popovertarget"));
  const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const out = [];
  t.focus();
  t.click();
  await frames();
  if (!menu.matches(":popover-open")) return ["☰ does not open the menu"];
  const b = t.getBoundingClientRect(), p = menu.getBoundingClientRect(), vw = document.documentElement.clientWidth;
  if (Math.abs(p.right - b.right) > 1) out.push(`the menu's right edge is ${Math.round(p.right - b.right)} px from the button's`);
  if (p.top < b.bottom - 0.5 || p.top > b.bottom + 12) out.push(`the menu starts ${Math.round(p.top - b.bottom)} px below the button`);
  if (b.left < 0 || b.right > vw + 0.5) out.push(`☰ is outside the viewport (${Math.round(b.left)}–${Math.round(b.right)} of ${vw})`);
  if (p.left < 0 || p.right > vw + 0.5) out.push(`the menu is outside the viewport (${Math.round(p.left)}–${Math.round(p.right)} of ${vw})`);
  if (!menu.contains(document.activeElement)) out.push("focus does not move into the menu");
  return out;
};
// After Escape: the menu closed and focus back on ☰.
const menuClosed = () => {
  const t = document.querySelector(".nav-toggle"), menu = document.getElementById(t.getAttribute("popovertarget"));
  const out = [];
  if (menu.matches(":popover-open")) { out.push("Escape does not close the menu"); menu.hidePopover(); }
  if (document.activeElement !== t) out.push("Escape does not return focus to ☰");
  return out;
};

// The region pointer (B-344) at the current width: null in regional mode, else a list of findings.
const tipCase = async () => {
  const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const tip = document.getElementById("lan-tip"), b = document.querySelector(".site-header [data-lan-open]");
  if (!tip) return null;
  const out = [];
  if (document.querySelector("dialog[open]")) out.push("a dialog opened by itself");
  scrollTo(0, 0); await frames();
  if (tip.hidden) return [...out, "the pointer is not shown at the top"];
  const t = tip.getBoundingClientRect(), bb = b.getBoundingClientRect(), vw = document.documentElement.clientWidth;
  const arrow = t.left + parseFloat(tip.style.getPropertyValue("--arrow"));
  if (t.left < 0 || t.right > vw + 0.5) out.push(`the pointer is outside the viewport (${Math.round(t.left)}–${Math.round(t.right)} of ${vw})`);
  if (t.top < bb.bottom || t.top > bb.bottom + 20) out.push(`the pointer starts ${Math.round(t.top - bb.bottom)} px below the button`);
  if (arrow < bb.left || arrow > bb.right) out.push("the pointer's arrow is not under the button");
  scrollTo(0, 50); await frames();
  if (document.documentElement.scrollHeight > innerHeight + 50 && !tip.hidden) out.push("the pointer stays when scrolled");
  scrollTo(0, 0); await frames();
  if (tip.hidden) out.push("the pointer does not come back at the top");
  const t2 = document.querySelector(".nav-toggle");
  if (t2 && t2.getClientRects().length) {
    t2.click(); await frames();
    if (!tip.hidden) out.push("the pointer stays while ☰ is open");
    document.getElementById(t2.getAttribute("popovertarget")).hidePopover(); await frames();
  }
  return out;
};

// The sticky header (B-366) at the current width, page scrolled: a list of findings.
const stickyCase = async () => {
  const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const h = document.querySelector(".site-header"), out = [];
  const alpha = () => getComputedStyle(h).getPropertyValue("--hdr-a").trim();
  scrollTo(0, 0); await frames();
  const h0 = h.getBoundingClientRect().height;
  if (CSS.supports("animation-timeline", "scroll()") && alpha() !== "0%") out.push(`the header's background is ${alpha()} at the top`);
  if (document.documentElement.scrollHeight < innerHeight + 400) return [...out, "the page is too short to test"];
  scrollTo(0, 400); await frames(); await frames(); // the size settles a frame after the scroll
  const r = h.getBoundingClientRect();
  if (Math.abs(r.top) > 0.5) out.push(`the header is at ${Math.round(r.top)} px after scrolling`);
  const hv = parseFloat(document.documentElement.style.getPropertyValue("--header-h"));
  if (Math.abs(hv - r.height) > 1) out.push(`--header-h is ${hv} px, the header ${Math.round(r.height)} px`);
  if (alpha() !== "100%") out.push(`the header's background is ${alpha()} after scrolling`);
  if (CSS.supports("animation-timeline", "scroll()") && h0 - r.height < 24) out.push(`the header shrinks only ${Math.round(h0 - r.height)} px when scrolled`);
  if (document.documentElement.scrollWidth > document.documentElement.clientWidth) out.push("the page scrolls sideways");
  const extra = [...h.children].filter((c) => c.getClientRects().length && c.getBoundingClientRect().width > 0 && !c.matches(".brand, .nav-narrow, [popover], template, script, .lan-tip"));
  if (extra.length) out.push(`compact, the header still shows ${extra.map((c) => c.className || c.tagName).join(", ")}`);
  if (!h.querySelector(".nav-toggle")?.getClientRects().length) out.push("compact, ☰ is not shown");
  else { const hc = h.getBoundingClientRect(), tb = h.querySelector(".nav-toggle").getBoundingClientRect();
    if (hc.right - parseFloat(getComputedStyle(h).paddingRight) - tb.right > 2) out.push(`compact, ☰ is ${Math.round(hc.right - parseFloat(getComputedStyle(h).paddingRight) - tb.right)} px from the right edge`); }
  if (document.elementFromPoint(innerWidth / 2, r.bottom - 2)?.closest(".site-header") !== h) out.push("something covers the header");
  const t = document.querySelector(".nav-toggle");
  if (t && t.getClientRects().length) {
    t.click(); await frames();
    const m = document.getElementById(t.getAttribute("popovertarget")), b = t.getBoundingClientRect(), p = m.getBoundingClientRect();
    if (p.top < b.bottom - 0.5 || p.top > b.bottom + 12) out.push(`scrolled, the menu starts ${Math.round(p.top - b.bottom)} px below ☰`);
    m.hidePopover(); await frames();
  }
  const target = [...document.querySelectorAll("main h2[id], main h3[id]")].find((e) => e.getBoundingClientRect().top + scrollY > innerHeight);
  if (target) {
    location.hash = target.id; await frames();
    const tt = target.getBoundingClientRect().top, hb = h.getBoundingClientRect().bottom;
    if (tt < hb) out.push(`a jump to #${target.id} lands ${Math.round(hb - tt)} px under the header`);
    history.replaceState(null, "", location.pathname);
  }
  scrollTo(0, 0); await frames();
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
      // The opened ☰ menu (B-341), wherever ☰ shows from 320 px up: directly below the button, its
      // right edge on the button's, both inside the viewport; focus in the menu, Escape closes it and
      // hands focus back to ☰. Light and dark at 100 and 125 % zoom.
      let mbad = 0, seen = 0;
      for (const scheme of ["light", "dark"]) for (const zoom of [1, 1.25]) {
        await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }]);
        for (let w = 320; w <= 1600; w += 16) {
          await page.setViewport({ width: Math.round(w / zoom), height: 900 });
          await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
          const m = await page.evaluate(menuCase);
          if (!m) continue;
          seen++;
          await page.keyboard.press("Escape");
          m.push(...(await page.evaluate(menuClosed)));
          for (const f of m) { console.log(`FAIL ${root} ${path} ${w}px at ${zoom * 100}% ${scheme}: ${f}`); mbad = 1; }
        }
      }
      await page.emulateMediaFeatures([]);
      if (!seen) { console.log(`FAIL ${root} ${path}: ☰ never shows from 320 px up`); mbad = 1; }
      console.log(`${mbad ? "FAIL" : "ok  "} ☰ menu ${root.replace(/.*\/(example\w+|[^/]+)\/public\/$/, "$1")} ${path}: under the button at ${seen} widths`);
      fail ||= mbad;
      // The region pointer (B-344), on a fresh visit with nothing stored, 245–1600 px, light and dark.
      let tbad = 0, tseen = 0;
      for (const scheme of ["light", "dark"]) {
        const ctx = await browser.createBrowserContext();
        const fresh = await ctx.newPage();
        fresh.on("pageerror", (e) => { console.log(`FAIL page error: ${e.message}`); fail = 1; });
        await fresh.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }]);
        await fresh.setViewport({ width: 1280, height: 900 });
        await fresh.goto(base + path, { waitUntil: "networkidle0" });
        await fresh.waitForFunction(() => !document.getElementById("lan-tip") || !document.getElementById("lan-tip").hidden, { timeout: 5000 }).catch(() => {});
        for (let w = 245; w <= 1600; w += 45) {
          await fresh.setViewport({ width: w, height: 900 });
          const m = await fresh.evaluate(tipCase);
          if (!m) break;
          tseen++;
          for (const f of m) { console.log(`FAIL ${root} ${path} ${w}px ${scheme}: ${f}`); tbad = 1; }
        }
        await ctx.close();
      }
      if (tseen) console.log(`${tbad ? "FAIL" : "ok  "} region pointer ${root.replace(/.*\/(example\w+|[^/]+)\/public\/$/, "$1")} ${path}: at ${tseen} widths`);
      fail ||= tbad;
      // The sticky header (B-366).
      let sbad = 0;
      for (const w of [320, 390, 768, 1280, 1600]) {
        await page.setViewport({ width: w, height: 800 });
        await page.goto(base + path, { waitUntil: "networkidle0" });
        await page.evaluate(() => { for (const d of document.querySelectorAll("dialog[open]")) d.close(); });
        for (const f of await page.evaluate(stickyCase)) { console.log(`FAIL ${root} ${path} ${w}px: ${f}`); sbad = 1; }
      }
      console.log(`${sbad ? "FAIL" : "ok  "} sticky header ${root.replace(/.*\/(example\w+|[^/]+)\/public\/$/, "$1")} ${path}: 320–1600 px`);
      fail ||= sbad;
    }
  }
} finally {
  await browser.close();
  server.close();
}
process.exit(fail);
