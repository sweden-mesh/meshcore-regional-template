// The map's "SE" toggle (B-370): from a county's map (a county page, or a regional site that knows the
// national map areas) the whole country's live mesh, exactly as the Sverige map shows it, without
// moving the camera; off, back to the county. Only the map changes: the county choice, the page and
// what is stored stay. Pure helpers here, for tests; main.js does the switching.

// The national map areas from data-se-iatas, or [] when the toggle does not apply: none given, or
// the same set as the map's own (the Sverige map itself).
export function seIatasOf(ds, own) {
  let se = [];
  try { se = JSON.parse(ds?.seIatas || "[]"); } catch { return []; }
  if (!Array.isArray(se)) return [];
  se = se.filter((x) => typeof x === "string" && x);
  const mine = new Set(own || []);
  return se.length && !(se.length === mine.size && se.every((x) => mine.has(x))) ? se : [];
}

// The map areas the map reads now.
export function scopeIatas(on, own, se) {
  return on && se?.length ? se : own;
}

// Replace the live feed with one for the new map areas: the old socket is closed first, so a toggle
// never leaves two open; the new one starts only while Live-trafik is on.
export function switchFeed(feed, make, live) {
  feed?.stop();
  const next = make();
  if (live) next.start();
  return next;
}

// The button: "SE", a toggle (aria-pressed), the same size as the fit and fullscreen buttons.
export function seButton(label, on, onToggle) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "map-se";
  b.textContent = "SE";
  b.title = label;
  b.setAttribute("aria-label", label);
  b.setAttribute("aria-pressed", on ? "true" : "false");
  b.addEventListener("click", () => {
    const next = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", next ? "true" : "false");
    onToggle(next);
  });
  return b;
}
