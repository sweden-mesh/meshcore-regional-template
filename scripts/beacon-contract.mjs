#!/usr/bin/env node
// Beacon API contract check: do the endpoints and fields this template reads still
// exist on a given Beacon? Run before moving to a new Beacon version:
//   node scripts/beacon-contract.mjs https://beacon.example.org JKG
// Exit 0 when every field is there, 1 otherwise. The same SPEC is checked against
// the captured responses in tests/data by tests/beacon-contract.test.mjs, so the
// spec cannot drift from what the unit tests assume.

// "a.b" = field; "items[].x" = field on every element; a leading "[]" = top-level array.
export const SPEC = {
  info: ["serverVersion"],
  nodes: ["items[].id", "items[].publicKey", "items[].nodeType", "items[].name", "items[].isObserver",
    "items[].iatas", "items[].lastSeen", "items[].stale", "hasMore"],
  node: ["id", "publicKey", "nodeType", "name", "isObserver", "lastSeen"],
  neighbors: ["[].id", "[].lastSeen", "[].observationCount"],
  border: ["type", "geometry.type", "geometry.coordinates"],
  observers: ["items[].id", "items[].iata"],
  packet: ["packetHash", "observations[].observerId", "observations[].resolvedPath"],
  breakdown: ["[].payloadTypeName", "[].count"],
};

// Every element of an array must have the rest of the path; an empty array passes.
function has(v, parts) {
  if (!parts.length) return true;
  const [p, ...rest] = parts;
  if (p === "[]") return Array.isArray(v) && v.every((x) => has(x, rest));
  if (p.endsWith("[]")) {
    const k = p.slice(0, -2);
    return v != null && Array.isArray(v[k]) && v[k].every((x) => has(x, rest));
  }
  return v != null && typeof v === "object" && p in v && has(v[p], rest);
}
const split = (path) => path.replace(/^\[\]\./, "[].").split(/\.|(?<=^\[\])/).filter(Boolean);

export function missingFields(obj, spec) {
  return spec.filter((p) => !has(obj, split(p)));
}

async function main([base, iata]) {
  if (!base || !iata) { console.error("usage: beacon-contract.mjs <beacon url> <IATA>"); process.exit(2); }
  const api = base.replace(/\/+$/, "") + "/api/v1";
  const get = async (p) => {
    const r = await fetch(api + p, { headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error(`${p}: HTTP ${r.status}`);
    return r.json();
  };
  let bad = 0;
  const check = (name, body) => {
    const miss = missingFields(body, SPEC[name]);
    console.log(`${miss.length ? "FAIL" : "ok  "} ${name}${miss.length ? ": missing " + miss.join(", ") : ""}`);
    bad += miss.length ? 1 : 0;
  };
  const step = async (name, p) => { try { const b = await get(p); check(name, b); return b; } catch (e) { console.log(`FAIL ${name}: ${e.message}`); bad++; return null; } };
  const info = await step("info", "/info");
  if (info) console.log(`     Beacon ${info.serverVersion}`);
  const nodes = await step("nodes", `/nodes?iatas=${encodeURIComponent(iata)}&limit=50`);
  const first = nodes?.items?.[0];
  if (first) {
    await step("node", `/nodes/${encodeURIComponent(first.id)}`);
    await step("neighbors", `/nodes/${encodeURIComponent(first.id)}/neighbors`);
  } else console.log("skip node, neighbors: no nodes in this IATA");
  await step("border", `/iatas/${encodeURIComponent(iata)}/border`);
  const obs = await step("observers", `/observers?iatas=${encodeURIComponent(iata)}`);
  await step("breakdown", `/stats/payload-breakdown?iatas=${encodeURIComponent(iata)}`);
  const pk = await get(`/packets?iatas=${encodeURIComponent(iata)}&limit=1`).catch(() => null);
  const hash = pk?.items?.[0]?.packetHash;
  if (hash) await step("packet", `/packets/${encodeURIComponent(hash)}`);
  else console.log("skip packet: no recent packet to look up");
  void obs;
  process.exit(bad ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) main(process.argv.slice(2));
