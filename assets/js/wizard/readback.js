// Read the device's current settings first, so the wizard starts from what the
// node has. `get <x>` replies "> <value>"; `region` lists the regions.

const strip = (r) => (r || "").replace(/^>\s*/, "").trim();

export function parseRadio(s) {
  const [freq, bw, sf, cr] = strip(s).split(",").map(Number);
  return [freq, bw, sf, cr].every(Number.isFinite) ? { freq, bw, sf, cr } : null;
}

export async function readBack(link) {
  const out = {};
  const get = async (cmd) => { try { return await link.send(cmd); } catch { return ""; } };
  out.name = strip(await get("get name")) || null;
  out.radio = parseRadio(await get("get radio"));
  const lat = Number(strip(await get("get lat"))), lon = Number(strip(await get("get lon")));
  out.position = Number.isFinite(lat) && Number.isFinite(lon) && !(lat === 0 && lon === 0) ? { lat, lon } : null;
  out.regions = strip(await get("region")) || null;
  return out;
}
