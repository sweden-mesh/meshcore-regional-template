// Map island entry point. Settings come from #map's data attributes, written
// by layouts/_partials/map.html from the site's params.
import { createMap } from "./basemap.js";
import { nodesBounds, frameNodes, widenToFit, togglesWiden, fitItems, fitTo, pointsBounds, needsWiden } from "./camera.js";
import { createClient } from "../beacon/rest.js";
import { nodesToGeoJSON, addNodeLayers, publicNodes, mergeNodeUpdate, setMiniZoom, withSeeded } from "./nodes.js";
import { attachPopups } from "./popup.js";
import { LiveFeed } from "../beacon/live.js";
import { FlowLayer, chainFromObservation, HOP_MS } from "./flow.js";
import { visibleOnly, observerPoint, neighbourPoints, hiddenBy } from "./visible.js";
import { packetRoutes, routesToGeoJSON, RecentPackets, recentListHtml, routesListHtml, addPathLayer, packetObservations, involved, channelName, applyPick } from "./packetpath.js";
import { allLinks, addLinkLayer, linkCountLoader, linksFile } from "./neighbours.js";
import { fullscreenButton } from "./fullscreen.js";
import { loadBorders, addBorderLayers, frameBorders, setForeignVisible, unionBbox } from "./region.js";
import { MapPanel } from "./panel.js";
import { parseState, writeState } from "./urlstate.js";
import { setTexts, t } from "./texts.js";
import { coverageControl, coverageLegend } from "./coverage.js";
import { wantedControl, wantedLegend, wantedBounds } from "./wanted.js";

const el = document.getElementById("map");

async function start() {
  const { map, maplibregl } = await createMap(el);
  el.mapInstance = map; // for debugging and browser tests
  const ds = el.dataset;
  try { setTexts(JSON.parse(ds.texts || "{}")); } catch { /* keep the defaults */ }
  const url = parseState(location.search);
  // MeshMapper coverage (data-coverage): off by default, loaded on first switch-on. Works
  // without Beacon too, with a panel of its own.
  // The line "measured up to and including …" under the map shows while the layer is on.
  const covAt = el.parentElement.querySelector(".map-cov-at");
  const cov = ds.coverage ? coverageControl(map, maplibregl, ds.coverage, { on: url.cov ?? false,
    link: ds.meshmapperUrl, onChange: (c) => { if (covAt) covAt.hidden = !c.on; } }) : null;
  el.coverage = cov; // for browser tests
  const covToggles = cov ? [{ key: "cov", label: ds.coverageLabel || "Täckning", on: cov.on }] : [];
  const covLegend = cov ? coverageLegend() : [];
  const covToggle = (key, on) => { if (key === "cov") cov.set(on); };
  // Places wanted for new repeaters (data-wanted, params.wanted): off by default, with or
  // without Beacon. No places, no toggle.
  let places = [];
  try { places = JSON.parse(ds.wanted || "[]"); } catch { /* none */ }
  const want = places.length ? wantedControl(map, maplibregl, places, { on: url.want ?? false }) : null;
  el.wanted = want; // for browser tests
  const extraToggles = [...covToggles, ...(want ? [{ key: "want", label: ds.wantedLabel || "Önskade platser", on: want.on }] : [])];
  const extraLegend = [...covLegend, ...(want ? wantedLegend() : [])];
  const extraToggle = (key, on) => { covToggle(key, on); if (key === "want") want.set(on); };
  // Switching on "Önskade platser" widens the view once, so every object shown (nodes, wanted
  // places; not the border) fits; switching off leaves the view alone. So does opening with
  // want=1, unless the URL also gives a view. "Utanför regionen" never moves the camera (B-304):
  // only the fit button does.
  const wantBox = want ? wantedBounds(places) : null;
  if (!ds.beacon) {
    if (want) map.addControl(fitControl(() => fitItems([], false, want.on ? wantBox : null)), "top-right");
    if (url.want && want && !url.view) {
      const fit = () => widenToFit(map, wantBox, { animate: false });
      if (map.loaded()) fit(); else map.once("load", fit);
    }
    if (extraToggles.length) map.addControl(new MapPanel({ toggles: extraToggles, legend: extraLegend, onToggle: (key, on) => {
      extraToggle(key, on);
      if (key === "want" && on) widenToFit(map, wantBox);
      history.replaceState(null, "", location.pathname + writeState(location.search, { cov: cov?.on, want: want?.on }) + location.hash);
    } }), "top-left");
    return;
  }
  const client = createClient(ds.beacon);
  const iatas = JSON.parse(ds.iatas || "[]");
  const opts = { companions: ds.companions === "true" };
  const state = { nodes: [], borders: [], showForeign: url.foreign ?? true, showLinks: url.links ?? true, live: url.live ?? true, focus: url.focus ?? true, selected: null, onLive: null, miniZoom: null, relays: new Map() };
  let live = true; // false once Beacon is unreachable and the map shows the snapshot
  const saveUrl = (extra = {}) => {
    const q = writeState(location.search, { live: state.live, links: state.showLinks, foreign: state.showForeign, focus: state.focus, cov: cov?.on, want: want?.on, ...extra });
    history.replaceState(null, "", location.pathname + q + location.hash);
  };
  if (url.view) { map.jumpTo(url.view); map.__userMoved = true; }
  map.on("moveend", (e) => { if (e.originalEvent) saveUrl({ view: { zoom: map.getZoom(), center: map.getCenter().toArray() } }); });
  // MeshMapper site details (data-sites): one small file, fetched on the first popup.
  let sitesP = null;
  const sites = () => (sitesP ??= ds.sites ? fetch(ds.sites).then((r) => (r.ok ? r.json() : {})).catch(() => ({})) : Promise.resolve({}));
  const popup = attachPopups(map, maplibregl, client, sites);
  const empty = { type: "FeatureCollection", features: [] };
  // Every link coloured by how often it is heard (toggle); with a node clicked (its popup open)
  // the other links turn faint grey. The counts come from the links file (data-links) in one
  // request, or else one node at a time after the first draw: only nodes on the map and in or
  // near the view, again after 30 minutes (10 if its neighbours changed), never while the tab is
  // hidden or the links are off (neighbours.js, B-309).
  // In national mode the county page adds its own "outside the county" test (el.isOutside, set by
  // lan/map-county.js), so links to nodes outside the county hide with them too (B-299).
  const linkNodes = () => (el.isOutside
    ? state.nodes.map((n) => (n.possiblyForeign || !Number.isFinite(n.lat) || !el.isOutside(n) ? n : { ...n, possiblyForeign: true }))
    : state.nodes);
  const drawLinks = () => addLinkLayer(map, state.showLinks
    ? allLinks(linkNodes(), linkCounts.counts(), { selected: state.selected, focus: state.focus, foreign: state.showForeign }) : empty);
  el.redrawLinks = () => { drawLinks(); sweepLinks(); }; // lan/map-county.js, once its test is in place
  let linkTimer = 0;
  const bulk = ds.links ? linksFile({ links: ds.links, all: ds.linksAll, iatas }) : null;
  const linkCounts = linkCountLoader(client, { bulk, iatas, stop: () => document.hidden,
    onUpdate: () => { if (!linkTimer) linkTimer = setTimeout(() => { linkTimer = 0; drawLinks(); }, 400); } });
  el.linkCounts = linkCounts; // for browser tests
  // The nodes worth a count: on the map (outside the region only while shown) and in the view
  // widened by half its size each way. A county page waits for its county test (map-county.js).
  const sweepLinks = () => {
    if (!live || !state.nodes.length || !state.showLinks || document.hidden || (ds.lanScb && !el.isOutside)) return;
    const b = map.getBounds(), dx = (b.getEast() - b.getWest()) / 2, dy = (b.getNorth() - b.getSouth()) / 2;
    const near = (n) => n.lng >= b.getWest() - dx && n.lng <= b.getEast() + dx && n.lat >= b.getSouth() - dy && n.lat <= b.getNorth() + dy;
    linkCounts.sweep(linkNodes(), { want: (n) => (state.showForeign || !n.possiblyForeign) && near(n) });
  };
  let sweepTimer = 0;
  map.on("moveend", () => { clearTimeout(sweepTimer); sweepTimer = setTimeout(sweepLinks, 500); });
  document.addEventListener("visibilitychange", sweepLinks);
  for (const id of ["node-points", "node-pills"]) map.on("click", id, (e) => { state.selected = e.features[0].properties.id; drawLinks(); });
  popup.on("close", () => { state.selected = null; drawLinks(); });
  map.addControl(new MapPanel({
    toggles: [
      { key: "live", label: ds.liveLabel || "Live-trafik", on: state.live },
      { key: "links", label: ds.linksLabel || "Grannlänkar", on: state.showLinks },
      { key: "foreign", label: ds.foreignLabel || "Utanför regionen", on: state.showForeign },
      { key: "focus", label: ds.focusLabel || "Trafikfokus", on: state.focus },
      ...extraToggles,
    ],
    legend: [
      // A miniature of the map's pill, with a sample id: the ◉ goes inside, as on the map.
      { swatch: "pill-active", text: "AB12", label: t("lg_active") },
      { swatch: "pill-stale", text: "AB12", label: t("lg_stale") },
      { swatch: "pill-observer", text: "◉ AB12", label: t("lg_observer") },
      { swatch: "link-strong", label: t("lg_link_strong"), labelCvd: t("lg_link_strong_cvd") },
      { swatch: "link", label: t("lg_link") },
      { swatch: "link-bg", label: t("lg_link_bg") },
      { swatch: "flow", label: t("lg_flow") },
      ...extraLegend,
    ],
    onToggle: (key, on) => {
      if (key === "links") { state.showLinks = on; drawLinks(); sweepLinks(); }
      if (key === "foreign") { state.showForeign = on; setForeignVisible(map, on); drawLinks(); sweepLinks(); }
      if (key === "live") { state.live = on; state.onLive?.(on); }
      if (key === "focus") { state.focus = on; applyFocus(map, state); drawLinks(); }
      extraToggle(key, on);
      if (togglesWiden(key, on)) widenToFit(map, shown());
      saveUrl();
    },
  }), "top-left");
  // The objects shown: the nodes (foreign ones while on) and the wanted places while on, never the
  // region's border (B-289). The fit button frames them; the "want" toggle's widening takes them in.
  const shown = () => fitItems(state.nodes, state.showForeign, want?.on ? wantBox : null);
  map.addControl(fitControl(shown), "top-right");
  const draw = () => {
    addNodeLayers(map, nodesToGeoJSON(state.nodes, state.relays));
    addBorderLayers(map, state.borders);
    setForeignVisible(map, state.showForeign);
    drawLinks();
    sweepLinks();
    state.miniZoom = setMiniZoom(map, unionBbox(state.borders) || nodesBounds(state.nodes));
    applyFocus(map, state);
    if (state.pathData) addPathLayer(map, state.pathData);
    applyPick(map, state.pickIds);
  };
  // The threshold depends on the map's width: recompute after a resize.
  let resizeTimer;
  map.on("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!map.getLayer("node-pills")) return;
      state.miniZoom = setMiniZoom(map, unionBbox(state.borders) || nodesBounds(state.nodes));
      applyFocus(map, state);
    }, 200);
  });
  // A style switch (dark mode) drops every layer; put them back.
  map.on("style.load", () => { if (state.nodes.length || state.borders.length) draw(); });
  try {
    const [nodes, borders, snap] = await Promise.all([
      client.getAll("/nodes", { iatas, neighbors: true, limit: 2000 }, { share: true }),
      loadBorders(client, iatas),
      loadSnapshot(ds.snapshot),
    ]);
    state.seeded = snap?.nodes || [];
    state.nodes = publicNodes(withSeeded(nodes, state.seeded, borders), opts); state.borders = borders;
  } catch (err) {
    // Beacon unreachable from this browser: fall back to the build-time snapshot.
    live = false;
    const snap = await loadSnapshot(ds.snapshot);
    state.nodes = publicNodes(snap?.nodes, opts); state.borders = snap?.borders || [];
    note(el, snap ? (ds.snapshotNote || "Beacon kan inte nås just nu; kartan visar läget från {at}.").replace("{at}", formatAt(snap.at))
      : (ds.offlineNote || "Beacon kan inte nås just nu."));
    console.warn("Beacon unreachable, using the snapshot", err);
  }
  const ready = () => {
    draw();
    if (!frameNodes(map, nodesBounds(state.nodes))) frameBorders(map, state.borders);
    if (!url.view && url.want && want?.on) widenToFit(map, shown(), { animate: false });
  };
  if (map.isStyleLoaded()) ready(); else map.once("load", ready);
  state.hidden = hiddenBy(state, (n) => el.isOutside?.(n)); // read at each event: isOutside comes later on county pages
  if (live) startLive(map, ds, client, iatas, state, draw);
  return { map, client, state };
}

// The fit button (B-286): a control group of its own, right under MapLibre's zoom buttons and
// styled like them. A click frames what `items()` returns; nothing shown, nothing happens. The
// fullscreen button (B-346, fullscreen.js) shares the group.
function fitControl(items) {
  let box;
  return {
    onAdd(map) {
      box = document.createElement("div");
      box.className = "maplibregl-ctrl maplibregl-ctrl-group map-fit";
      const b = document.createElement("button");
      b.type = "button";
      b.title = t("fit_all");
      b.setAttribute("aria-label", t("fit_all"));
      // A square drawn as its four corners only (B-346): "the frame around everything".
      b.innerHTML = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.5v-4h4M12.5 3.5h4v4M16.5 12.5v4h-4M7.5 16.5h-4v-4"/></svg>';
      b.addEventListener("click", () => fitTo(map, items()));
      box.append(b, fullscreenButton(map, map.getContainer()));
      return box;
    },
    onRemove() { box.remove(); },
  };
}

async function loadSnapshot(url) {
  if (!url) return null;
  try { const r = await fetch(url); return r.ok ? r.json() : null; } catch { return null; }
}

function formatAt(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" });
}

function note(el, text) {
  let p = el.parentElement.querySelector(".map-note:not(.map-mm)");
  if (!p) { p = document.createElement("p"); p.className = "map-note"; el.after(p); }
  p.textContent = text;
}

// Traffic focus (operator 2026-11-12): small circles, no pills or names, a dimmed
// basemap, bright links; transmissions flash yellow with bubbles along links.
function applyFocus(map, state) {
  if (!map.getLayer("node-points")) return;
  const on = state.focus;
  for (const id of ["node-pills", "node-labels"]) map.setLayoutProperty(id, "visibility", on ? "none" : "visible");
  if (on) {
    map.setPaintProperty("node-points", "circle-radius", 3.5);
    map.setPaintProperty("node-obs-dot", "circle-radius", 1.3);
  } else if (state.miniZoom) {
    map.setPaintProperty("node-points", "circle-radius", ["step", ["zoom"], 6, state.miniZoom, 3.5]);
    map.setPaintProperty("node-obs-dot", "circle-radius", ["step", ["zoom"], 2.2, state.miniZoom, 1.2]);
  }
  if (on && !map.getLayer("focus-dim")) {
    // Under the lowest of our layers, whichever order they were added in.
    const ours = ["region-fill", "coverage-fill", "wanted-area", "links", "node-points"];
    const first = map.getStyle().layers.find((l) => ours.includes(l.id))?.id;
    map.addLayer({ id: "focus-dim", type: "background", paint: { "background-color": "rgba(8, 18, 25, 0.55)" } }, first);
  } else if (!on && map.getLayer("focus-dim")) map.removeLayer("focus-dim");
}

function startLive(map, ds, client, iatas, state, draw) {
  if (!iatas.length || !("WebSocket" in window)) return;
  // "Senaste paket: 12 s sedan" under the map, and a notice once the live feed has been down for
  // 15 s (UX-SV-14). Paused (tab hidden) shows nothing new.
  let lastPacket = 0, feedStatus = "connecting", downSince = 0;
  const statusLine = el.parentElement.querySelector(".map-live-status");
  const ago = (ms) => { const s = Math.round(ms / 1000); return s < 60 ? `${s} s` : `${Math.round(s / 60)} min`; };
  const showStatus = () => {
    if (!statusLine) return;
    const sd = statusLine.dataset;
    let text = lastPacket ? sd.last.replace("{age}", ago(Date.now() - lastPacket)) : sd.wait;
    if (downSince && Date.now() - downSince > 15000) text = sd.down;
    statusLine.textContent = text;
    statusLine.classList.toggle("map-live-down", text === sd.down);
  };
  setInterval(showStatus, 5000);
  // Fewer simultaneous flows on small screens: less to draw on a phone.
  const flows = new FlowLayer(map, { maxFlows: window.innerWidth < 640 ? 40 : 120 });
  let redraw = 0;
  let recount = 0; // pills re-ranked by traffic at most every 10 s
  const recent = new RecentPackets(10);
  const panel = document.getElementById("packets");
  const list = document.getElementById("recent-packets");
  const pathBox = document.getElementById("packet-path");
  let pending = 0;
  const renderRecent = () => {
    if (pending || !list) return;
    pending = requestAnimationFrame(() => {
      pending = 0; panel.hidden = false;
      // Not under the visitor's focus or pointer: a redraw would drop the button they are on.
      if (list.contains(document.activeElement) || list.matches(":hover")) return;
      list.innerHTML = recentListHtml(recent.items, { selected: state.pick });
    });
  };
  list?.addEventListener("focusout", (e) => { if (!list.contains(e.relatedTarget)) renderRecent(); });
  list?.addEventListener("mouseleave", renderRecent);
  // Movement only on screen, and not for visitors who ask for reduced motion: then the
  // observer glow (a fade in place) stays, the travelling flows and bubbles do not.
  const calm = matchMedia("(prefers-reduced-motion: reduce)");
  let onScreen = true;
  if ("IntersectionObserver" in window) new IntersectionObserver((es) => { onScreen = es[es.length - 1].isIntersecting; }).observe(el);
  // A click on a packet (B-328): the map fits the nodes it touched and dims the rest, drawn at once
  // from the live feed's observations; then one /packets/{hash} adds the observations from before
  // the page opened, the channel and a decrypted sender. Esc, the same packet again or "Stäng" clear.
  const keyByName = (name) => {
    const k = String(name || "").trim();
    return k ? state.nodes.find((n) => (n.name || "").trim() === k)?.publicKey || null : null;
  };
  const show = (item, detail) => {
    const obs = packetObservations(item, detail);
    const end = (o) => observerPoint(state.nodes, o.observerPublicKey || recent.observerKeys.get(o.observerId) || keyByName(o.observerName), state.hidden);
    const routes = packetRoutes({ observations: obs }, end, (c) => visibleOnly(state.nodes, c, state.hidden));
    const { ids, points } = involved(routes, obs.map(end));
    state.pathData = routesToGeoJSON(routes);
    state.pickIds = ids;
    addPathLayer(map, state.pathData);
    applyPick(map, ids);
    pathBox.hidden = false;
    pathBox.querySelector(".routes").innerHTML = routesListHtml(routes);
    return pointsBounds(points);
  };
  const clearPick = () => {
    if (!state.pick) return;
    state.pick = null; state.pickIds = null; state.pathData = null;
    pathBox.hidden = true;
    addPathLayer(map, { type: "FeatureCollection", features: [] });
    applyPick(map, null);
    forceRender();
  };
  const forceRender = () => { if (list) list.innerHTML = recentListHtml(recent.items, { selected: state.pick }); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && state.pick) clearPick(); });
  list?.addEventListener("click", async (e) => {
    const hash = e.target.closest("button")?.dataset.hash;
    const item = hash && recent.get(hash);
    if (!item) return;
    if (state.pick === hash) { clearPick(); return; }
    state.pick = hash;
    forceRender();
    list.querySelector(`button[data-hash="${CSS.escape(hash)}"]`)?.focus();
    const first = show(item, null);
    if (first) fitTo(map, first);
    try {
      const detail = await client.get(`/packets/${encodeURIComponent(hash)}`);
      if (state.pick !== hash) return; // cleared or another packet picked meanwhile
      const sender = detail?.parsedPayload?.decrypted?.sender;
      if (sender && !item.facts.origin) item.sender = sender;
      const ch = detail?.channelHash ?? detail?.parsedPayload?.channelHash;
      if (ch) item.channel = (await channelName(ch, iatas)) || t("channel", { n: String(ch).toUpperCase() });
      const all = show(item, detail);
      // Only move again when the fetched observers reach outside the first framing.
      if (all && (!first || needsWiden(first, all))) fitTo(map, all);
      forceRender();
      list.querySelector(`button[data-hash="${CSS.escape(hash)}"]`)?.focus();
    } catch (err) { console.error(err); }
  });
  document.getElementById("packet-path-close")?.addEventListener("click", clearPick);
  setInterval(renderRecent, 30000); // the ages
  map.on("style.load", () => flows.install());
  function handle(name, data) {
      if (name === "nodeUpdate") {
        state.nodes = publicNodes(mergeNodeUpdate(state.nodes, data), { companions: ds.companions === "true" });
        if (!redraw) redraw = setTimeout(() => { redraw = 0; draw(); }, 2000); // batch bursts of adverts
        return;
      }
      if (name !== "packetObservation") return;
      lastPacket = Date.now();
      const o = data.observation;
      const obsPt = observerPoint(state.nodes, o.observerPublicKey, state.hidden);
      const animate = onScreen && !calm.matches;
      if (onScreen) flows.glow(obsPt);
      const chain = visibleOnly(state.nodes, chainFromObservation(o, obsPt), state.hidden);
      if (animate) flows.add(chain, { type: data.packet.payloadTypeName });
      for (const p of chain) if (p) state.relays.set(p.id, (state.relays.get(p.id) || 0) + 1);
      if (!recount) recount = setTimeout(() => {
        recount = 0;
        map.getSource("nodes")?.setData(nodesToGeoJSON(state.nodes, state.relays));
      }, 10000);
      if (state.focus && animate) {
        // Every node that sent this packet on flashes and sends bubbles to its neighbours.
        const seen = new Set();
        chain.forEach((p, i) => {
          if (!p || seen.has(p.id) || (obsPt && p.id === obsPt.id)) return;
          seen.add(p.id);
          flows.transmit(p, neighbourPoints(state.nodes, p.id, state.hidden), i * HOP_MS);
        });
      }
      recent.add(data);
      renderRecent();
  }
  const feed = new LiveFeed(ds.beacon, {
    iatas, events: ["packetObservation", "nodeUpdate"], resolvePath: true, includeObserverKey: true,
    onEvent: handle, onStatus: (s) => { feedStatus = s; if (s === "live") downSince = 0; else if (s === "reconnecting" && !downSince) downSince = Date.now(); showStatus(); },
    // Missed events are only in REST: refresh the nodes.
    onGap: async () => {
      try { state.nodes = publicNodes(withSeeded(await client.getAll("/nodes", { iatas, neighbors: true, limit: 2000 }, { priority: "low" }), state.seeded, state.borders), { companions: ds.companions === "true" }); draw(); } catch { /* next gap */ }
    },
  });
  el.mapDebug = { flows, inject: handle }; // browser tests replay captured events through the same path
  state.onLive = (on) => {
    flows.setEnabled(on);
    if (on) feed.start(); else feed.stop();
  };
  if (state.live) feed.start(); else flows.setEnabled(false);
  return feed;
}

// The map is the heaviest part of the page (MapLibre ≈ 440 kB compressed, then
// tiles). Below the cards on a phone it is often never seen, so it starts only
// when it comes within 400 px of the viewport.
function whenNear(target, fn) {
  if (!("IntersectionObserver" in window)) return fn();
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); fn(); }
  }, { rootMargin: "400px 0px" });
  io.observe(target);
}

if (el) whenNear(el, () => {
  start().catch((err) => {
    el.classList.add("map-failed");
    el.textContent = el.dataset.failText || "Kartan kunde inte laddas.";
    console.error(err);
  });
});
