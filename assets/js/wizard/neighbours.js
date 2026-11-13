// Neighbouring regions from the picked position (operator 2026-11-12): a county whose
// border lies within 40 km (80 km over water) gets its region added automatically,
// with the reason shown; the user can untick it. Pure geometry first, DOM last.

const R = 6371; // km

// Distance in km from (lat, lon) to the segment a–b, on a local flat projection
// around the point (fine at these distances).
function segKm(lat, lon, a, b) {
  const kx = (Math.PI / 180) * R * Math.cos((lat * Math.PI) / 180), ky = (Math.PI / 180) * R;
  const ax = (a[0] - lon) * kx, ay = (a[1] - lat) * ky, bx = (b[0] - lon) * kx, by = (b[1] - lat) * ky;
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / l2)) : 0;
  return Math.hypot(ax + t * dx, ay + t * dy);
}

function inside(lat, lon, ring) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

// km from the point to the area (MultiPolygon coordinates, outer rings); 0 inside it.
export function distanceKm(lat, lon, polygons) {
  let best = Infinity;
  for (const poly of polygons || []) {
    const ring = poly[0];
    if (!ring?.length) continue;
    if (inside(lat, lon, ring)) return 0;
    for (let i = 1; i < ring.length; i++) best = Math.min(best, segKm(lat, lon, ring[i - 1], ring[i]));
  }
  return best;
}

// [{ scope, lan, km (limit), dist, near }] for each neighbour.
export function nearNeighbours(lat, lon, areas) {
  return areas.map((a) => {
    const dist = distanceKm(lat, lon, a.rings);
    return { scope: a.scope, lan: a.lan, km: a.km, dist, near: dist <= a.km };
  });
}

// Wire the edge-repeater box and the neighbour list; returns { scopes(), setPosition(lat, lon) }.
// No neighbour is carried unless the user says the repeater is an edge repeater; the list
// then starts with the counties near the position ticked.
export function initNeighbours(root, onChange) {
  if (!root) return { scopes: () => [], setPosition: () => {} };
  const areas = JSON.parse(root.dataset.areas || "[]");
  const t = JSON.parse(root.dataset.texts || "{}");
  const edge = root.querySelector("input[data-edge]");
  const list = root.querySelector(".wz-nb-list");
  const hint = root.querySelector("[data-nb-hint]");
  const boxes = [...list.querySelectorAll('input[type="checkbox"]')];
  for (const b of boxes) b.addEventListener("change", onChange);
  edge.addEventListener("change", () => { list.hidden = hint.hidden = !edge.checked; onChange(); });
  return {
    scopes: () => (edge.checked ? boxes.filter((b) => b.checked).map((b) => b.value) : []),
    setPosition(lat, lon) {
      // The box is offered everywhere (operator 2026-11-13): over a large lake a repeater
      // can reach a county far beyond the 40/80 km rule. Only the preselection follows it.
      const res = nearNeighbours(lat, lon, areas);
      for (const r of res) {
        const box = boxes.find((b) => b.value === r.scope);
        if (!box) continue;
        box.checked = r.near;
        const km = Math.round(r.dist);
        box.closest("li").querySelector("[data-why]").textContent = !Number.isFinite(r.dist) ? ""
          : r.dist === 0 ? t.inside : (r.near ? t.near : t.far).replace("{km}", km).replace("{limit}", r.km);
      }
      onChange();
    },
  };
}
