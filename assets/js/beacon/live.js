// Beacon's live feed over WebSocket (/ws), written from Beacon's API
// contract. One connection; the region's IATAs as the only subscription;
// reconnects with backoff; tells the caller about gaps so it can refetch over
// REST (the server has no replay). Everything environmental is injectable.

export const BACKOFF_S = [1, 2, 5, 10, 30];

export function wsUrl(base) {
  const u = new URL(base.replace(/\/+$/, "") + "/ws");
  u.protocol = u.protocol === "http:" ? "ws:" : "wss:";
  return u.toString();
}

// Delay before reconnect attempt n (0-based), ±25 % jitter; straight to the cap
// after the server said "go away for now" (1008 policy, 1013 try again later).
export function backoffMs(attempt, closeCode, rand = Math.random) {
  const cap = BACKOFF_S[BACKOFF_S.length - 1];
  const base = closeCode === 1008 || closeCode === 1013 ? cap : BACKOFF_S[Math.min(attempt, BACKOFF_S.length - 1)];
  return Math.round(base * 1000 * (0.75 + 0.5 * rand()));
}

export class LiveFeed {
  constructor(base, { iatas, events, payloadTypes, resolvePath = false, includeObserverKey = false, onEvent = () => {}, onGap = () => {},
    onStatus = () => {}, WebSocketImpl = globalThis.WebSocket, timers = globalThis, doc = globalThis.document,
    rand = Math.random } = {}) {
    if (!Array.isArray(iatas) || iatas.length === 0) {
      // An empty list means "every IATA" to Beacon: never send one.
      throw new Error("LiveFeed needs at least one IATA");
    }
    Object.assign(this, { url: wsUrl(base), iatas, events, payloadTypes, resolvePath, includeObserverKey, onEvent, onGap, onStatus,
      WebSocketImpl, timers, doc, rand });
    this.attempt = 0;
    this.seq = 0;
    this.stopped = true;
    this.ws = null;
    this.hadConnection = false;
    this.onVisibility = () => (this.doc.hidden ? this.pause() : this.resume());
  }

  start() {
    this.stopped = false;
    this.doc?.addEventListener?.("visibilitychange", this.onVisibility);
    if (!this.doc?.hidden) this.connect();
  }

  stop() {
    this.stopped = true;
    this.doc?.removeEventListener?.("visibilitychange", this.onVisibility);
    this.teardown();
  }

  pause() { this.teardown(); this.onStatus("paused"); }
  resume() { if (!this.stopped && !this.ws) { this.attempt = 0; this.connect(); } }

  configure(resolvePath) {
    this.resolvePath = resolvePath;
    this.send({ type: "configure", resolvePath, includeObserverKey: this.includeObserverKey, includeRepeats: false });
  }

  send(msg) {
    if (this.ws && this.ws.readyState === 1) this.ws.send(JSON.stringify({ v: 1, id: `m${++this.seq}`, ...msg }));
  }

  connect() {
    this.timers.clearTimeout(this.retryTimer);
    this.onStatus("connecting");
    const ws = new this.WebSocketImpl(this.url);
    this.ws = ws;
    ws.onmessage = (e) => this.handle(e.data);
    ws.onclose = (e) => {
      if (this.ws !== ws) return; // an old socket we already replaced
      this.ws = null;
      this.timers.clearInterval(this.pingTimer);
      if (this.stopped || this.doc?.hidden) return;
      this.onStatus("reconnecting");
      this.retryTimer = this.timers.setTimeout(() => this.connect(), backoffMs(this.attempt++, e?.code, this.rand));
    };
    ws.onerror = () => {}; // onclose follows
  }

  teardown() {
    this.timers.clearTimeout(this.retryTimer);
    this.timers.clearInterval(this.pingTimer);
    const ws = this.ws;
    this.ws = null;
    if (ws) try { ws.close(1000); } catch { /* already closing */ }
  }

  handle(raw) {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    switch (msg.type) {
      case "hello": {
        this.attempt = 0;
        const scope = { iatas: this.iatas };
        if (this.events?.length) scope.events = this.events;
        if (this.payloadTypes?.length) scope.payloadTypes = this.payloadTypes;
        this.send({ type: "subscribe", scope });
        this.configure(this.resolvePath);
        this.timers.clearInterval(this.pingTimer);
        this.pingTimer = this.timers.setInterval(() => this.send({ type: "ping" }), 30000);
        this.onStatus("live");
        // Anything that happened while we were away is only in REST.
        if (this.hadConnection) this.onGap("reconnected");
        this.hadConnection = true;
        break;
      }
      case "event":
        this.onEvent(msg.event, msg.data);
        break;
      case "lagged":
        this.onGap("lagged");
        break;
      default:
        break; // subscribed, configured, pong
    }
  }
}
