import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createClient, buildUrl, BeaconError } from "../assets/js/beacon/rest.js";

const fixture = (n) => JSON.parse(readFileSync(new URL(`./data/${n}`, import.meta.url)));
const res = (status, body, headers = {}) => ({
  status, ok: status >= 200 && status < 300,
  headers: { get: (h) => headers[h] ?? null },
  json: async () => body,
});
const noSleep = async () => {};

test("buildUrl joins lists, drops empties, trims slashes", () => {
  assert.equal(buildUrl("https://b.example/", "/nodes", { iatas: ["JKG", "XYZ"], cursor: undefined, x: "" }),
    "https://b.example/api/v1/nodes?iatas=JKG%2CXYZ");
});

test("getAll follows nextCursor and nextPageCursor until hasMore is false", async () => {
  const page1 = fixture("observers-page.json");
  const page2 = { items: [{ id: "b" }], hasMore: false };
  const seen = [];
  const c = createClient("https://b.example", { sleep: noSleep, fetch: async (url) => {
    seen.push(new URL(url).searchParams);
    return res(200, seen.length === 1 ? page1 : page2);
  }});
  const items = await c.getAll("/observers", { iatas: ["JKG"] });
  assert.equal(items.length, page1.items.length + 1);
  assert.equal(seen[1].get("pageCursor"), page1.nextPageCursor);
  assert.equal(seen[1].get("cursor"), String(page1.nextCursor));
});

test("a 429 with Retry-After is retried after that many seconds", async () => {
  const waits = [];
  let n = 0;
  const c = createClient("https://b.example", { sleep: async (ms) => waits.push(ms), fetch: async () =>
    ++n === 1 ? res(429, { code: "rate_limited" }, { "Retry-After": "1" }) : res(200, fixture("iata-jkg.json")) });
  assert.equal((await c.get("/iatas/JKG")).iata, "JKG");
  assert.deepEqual(waits, [1000]);
});

test("retries are bounded and the error carries status and code", async () => {
  const c = createClient("https://b.example", { sleep: noSleep, retries: 2, fetch: async () =>
    res(503, { code: "deadline_exceeded" }, { "Retry-After": "5" }) });
  await assert.rejects(c.get("/packets"), (e) => e instanceof BeaconError && e.status === 503 && e.code === "deadline_exceeded");
});

test("a 400 on pageCursor restarts the walk once from the first page", async () => {
  const calls = [];
  const c = createClient("https://b.example", { sleep: noSleep, fetch: async (url) => {
    const p = new URL(url).searchParams; calls.push(p.get("pageCursor"));
    if (calls.length === 1) return res(200, { items: [{ id: 1 }], hasMore: true, nextCursor: 5, nextPageCursor: "v1:x" });
    if (calls.length === 2) return res(400, { code: "bad_request" });
    return res(200, { items: [{ id: 1 }, { id: 2 }], hasMore: false });
  }});
  assert.deepEqual((await c.getAll("/nodes")).map((i) => i.id), [1, 2]);
  assert.deepEqual(calls, [null, "v1:x", null]);
});

test("204 is null (e.g. an IATA without a border)", async () => {
  const c = createClient("https://b.example", { fetch: async () => res(204) });
  assert.equal(await c.get("/iatas/XXX/border"), null);
});

test("no URL configured is an error, not a request", () => {
  assert.throws(() => createClient(""), BeaconError);
});
