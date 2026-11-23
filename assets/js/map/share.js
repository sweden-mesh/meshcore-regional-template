// The map's share button (operator 2026-11-22), last in the column of map buttons. A click opens a
// dialog with a link to this map as it is now: the four switches, the zoom and position, and
// whether it fills the window (full=1), with a button that copies it. The dialog sits inside the
// map's element, so it also shows while the map is in the browser's fullscreen.
import { t } from "./texts.js";
import { writeState } from "./urlstate.js";

// The link to the map as it is. Pure, for tests: `loc` is { origin, pathname, search }, `state` the
// same object writeState takes, with the view always present. Ends in #map, so the visitor lands on it.
export function shareLink(loc, state, defaults = {}) {
  return loc.origin + loc.pathname + writeState(loc.search, state, defaults) + (loc.hash ?? "#map");
}

// Where the link points, so it also says which region the map shows (operator 2026-11-22). The
// address bar cannot be trusted for that in national mode: / shows a saved county's page under the
// address /, and ?lan= is taken out of the address at load. `sharePage` is the region's share
// address (/karta/, /<county>/karta/; layouts/mapshare), which carries the map's own link preview
// and sends the visitor on to the map. A page without one gets ?lan=<the chosen county, or se for
// Sverige>, which the receiver's page applies. Outside national mode the address is used as it is.
// Pure, for tests.
export function shareLoc(loc, { sharePage = null, lan = null } = {}) {
  const q = new URLSearchParams(loc.search);
  q.delete("lan");
  if (sharePage) {
    const u = new URL(sharePage, loc.origin);
    return { origin: loc.origin, pathname: u.pathname, search: q.size ? `?${q}` : "", hash: "" };
  }
  if (lan) q.set("lan", lan);
  return { origin: loc.origin, pathname: loc.pathname, search: q.size ? `?${q}` : "" };
}

const ICON = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="10" r="2.2"/><circle cx="14.5" cy="4.5" r="2.2"/><circle cx="14.5" cy="15.5" r="2.2"/><path d="M7 8.9l5.5-3.2M7 11.1l5.5 3.2"/></svg>';

export function shareButton(el, link) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "map-share-open";
  b.title = t("share");
  b.setAttribute("aria-label", t("share"));
  b.innerHTML = ICON;
  let dialog = null;
  const build = () => {
    dialog = document.createElement("dialog");
    dialog.className = "map-share";
    dialog.setAttribute("aria-labelledby", "map-share-title");
    const h = document.createElement("p"); h.id = "map-share-title"; h.className = "map-share-title"; h.textContent = t("share_title");
    const p = document.createElement("p"); p.textContent = t("share_text");
    const input = document.createElement("input");
    input.type = "text"; input.readOnly = true; input.setAttribute("aria-label", t("share_url"));
    input.addEventListener("focus", () => input.select());
    const copy = document.createElement("button"); copy.type = "button"; copy.className = "map-share-copy"; copy.textContent = t("share_copy");
    const status = document.createElement("span"); status.className = "map-share-status"; status.setAttribute("role", "status");
    const close = document.createElement("button"); close.type = "button"; close.className = "map-share-close"; close.textContent = t("share_close");
    copy.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(input.value); status.textContent = t("share_copied"); }
      catch { input.focus(); input.select(); status.textContent = t("share_copy_failed"); }
    });
    close.addEventListener("click", () => dialog.close());
    // A click on the backdrop closes it, as Esc does.
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    const row = document.createElement("div"); row.className = "map-share-row"; row.append(copy, status, close);
    dialog.append(h, p, input, row);
    el.append(dialog);
    Object.assign(dialog, { input, status, copy });
  };
  b.addEventListener("click", () => {
    if (!dialog) build();
    dialog.input.value = link();
    dialog.status.textContent = "";
    dialog.showModal();
    dialog.copy.focus(); // not the field: a selected long link scrolls to its end
  });
  return b;
}
