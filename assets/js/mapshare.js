// The map's share address (layouts/mapshare/single.html): send the visitor on to the real map,
// with the link's settings kept. data-target is the map's page, data-lan the region to set for
// the Sverige map (a county's page says its own).
const s = document.currentScript;
const q = new URLSearchParams(location.search);
if (s.dataset.lan) q.set("lan", s.dataset.lan);
const query = q.toString();
location.replace(s.dataset.target + (query ? `?${query}` : "") + "#map");
