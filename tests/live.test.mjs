import { test } from "node:test";
import assert from "node:assert/strict";
import { LiveFeed, wsUrl, backoffMs } from "../assets/js/beacon/live.js";

function harness(opts = {}) {
  const sockets = [], timeouts = [], intervals = [];
  class FakeWS {
    constructor(url) { this.url = url; this.sent = []; this.readyState = 1; sockets.push(this); }
    send(s) { this.sent.push(JSON.parse(s)); }
    close() { this.readyState = 3; }
    serverSays(m) { this.onmessage({ data: JSON.stringify(m) }); }
    drop(code) { this.readyState = 3; this.onclose({ code }); }
  }
  const timers = {
    setTimeout: (fn, ms) => { timeouts.push({ fn, ms }); return timeouts.length; },
    clearTimeout: () => {}, setInterval: (fn, ms) => { intervals.push({ fn, ms }); return intervals.length; },
    clearInterval: () => {},
  };
  const got = { events: [], gaps: [], status: [] };
  const doc = { hidden: false, l: null, addEventListener(_, f) { this.l = f; }, removeEventListener() {} };
  const feed = new LiveFeed("https://b.example/", { iatas: ["JKG"], WebSocketImpl: FakeWS, timers, doc, rand: () => 0.5,
    onEvent: (n, d) => got.events.push([n, d]), onGap: (r) => got.gaps.push(r), onStatus: (s) => got.status.push(s), ...opts });
  return { feed, sockets, timeouts, intervals, got, doc };
}

test("wsUrl maps https to wss and appends /ws", () => {
  assert.equal(wsUrl("https://beacon.example/"), "wss://beacon.example/ws");
  assert.equal(wsUrl("http://localhost:8080"), "ws://localhost:8080/ws");
});

test("an empty IATA list is refused: Beacon would send every region", () => {
  assert.throws(() => new LiveFeed("https://b", { iatas: [] }));
});

test("after hello: subscribe with the region's IATAs, configure, ping every 30 s", () => {
  const h = harness({ resolvePath: true });
  h.feed.start();
  h.sockets[0].serverSays({ v: 1, type: "hello" });
  const [sub, cfg] = h.sockets[0].sent;
  assert.equal(sub.type, "subscribe");
  assert.deepEqual(sub.scope, { iatas: ["JKG"] });
  assert.equal(cfg.type, "configure");
  assert.equal(cfg.resolvePath, true);
  assert.equal(h.intervals[0].ms, 30000);
  assert.deepEqual(h.got.status, ["connecting", "live"]);
});

test("events are passed on; lagged is a gap", () => {
  const h = harness();
  h.feed.start();
  h.sockets[0].serverSays({ v: 1, type: "hello" });
  h.sockets[0].serverSays({ v: 1, type: "event", event: "nodeUpdate", data: { nodeId: "x" } });
  h.sockets[0].serverSays({ v: 1, type: "lagged", droppedCount: 2 });
  assert.deepEqual(h.got.events, [["nodeUpdate", { nodeId: "x" }]]);
  assert.deepEqual(h.got.gaps, ["lagged"]);
});

test("a drop reconnects with backoff, and the new hello is a gap", () => {
  const h = harness();
  h.feed.start();
  h.sockets[0].serverSays({ v: 1, type: "hello" });
  h.sockets[0].drop(1006);
  assert.equal(h.timeouts[0].ms, 1000);
  h.timeouts[0].fn();
  assert.equal(h.sockets.length, 2);
  h.sockets[1].serverSays({ v: 1, type: "hello" });
  assert.deepEqual(h.got.gaps, ["reconnected"]);
});

test("backoff grows to the cap, and 1013 goes straight to it", () => {
  const mid = () => 0.5;
  assert.deepEqual([0, 1, 2, 3, 4, 9].map((a) => backoffMs(a, 1006, mid)), [1000, 2000, 5000, 10000, 30000, 30000]);
  assert.equal(backoffMs(0, 1013, mid), 30000);
  assert.equal(backoffMs(0, 1008, mid), 30000);
  assert.equal(backoffMs(0, 1006, () => 0), 750);
});

test("a hidden tab closes the socket and does not reconnect until visible", () => {
  const h = harness();
  h.feed.start();
  h.sockets[0].serverSays({ v: 1, type: "hello" });
  h.doc.hidden = true; h.doc.l();
  assert.equal(h.sockets[0].readyState, 3);
  assert.equal(h.timeouts.length, 0);
  h.doc.hidden = false; h.doc.l();
  assert.equal(h.sockets.length, 2);
});
