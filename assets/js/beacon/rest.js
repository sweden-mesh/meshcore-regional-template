// A small client for Beacon's public REST API (/api/v1). No dependencies;
// `fetch` and `sleep` are injectable so tests run on captured responses.
//
// Rules from Beacon's API contract (beacon-docs/docs/api-contract.md):
// - 429 and 503 carry Retry-After (1–60 s): wait and retry, a bounded number of times.
// - Lists page with `cursor` = nextCursor and, when present, `pageCursor` = nextPageCursor.
// - A 400 "invalid pageCursor" means start again from the first page.

export class BeaconError extends Error {
  constructor(message, { status = 0, code = "", retryAfter = 0 } = {}) {
    super(message);
    this.name = "BeaconError";
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

const defaultSleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function buildUrl(base, path, params = {}) {
  const url = new URL(base.replace(/\/+$/, "") + "/api/v1" + path);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    url.searchParams.set(k, Array.isArray(v) ? v.join(",") : String(v));
  }
  return url.toString();
}

export function createClient(base, opts = {}) {
  if (!base) throw new BeaconError("no Beacon URL configured");
  const fetchFn = opts.fetch || globalThis.fetch.bind(globalThis);
  const sleep = opts.sleep || defaultSleep;
  const timeoutMs = opts.timeoutMs ?? 15000;
  const retries = opts.retries ?? 2;
  const maxWaitS = opts.maxWaitS ?? 30;

  async function get(path, params) {
    const url = buildUrl(base, path, params);
    for (let attempt = 0; ; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeoutMs);
      let res;
      try {
        res = await fetchFn(url, { signal: ctrl.signal, headers: { Accept: "application/json" } });
      } catch (err) {
        throw new BeaconError(err.name === "AbortError" ? "timeout" : "network error", { code: "network" });
      } finally {
        clearTimeout(timer);
      }
      if (res.status === 204) return null;
      if (res.ok) return res.json();
      const retryAfter = Number(res.headers.get("Retry-After")) || 0;
      let code = "";
      try { code = (await res.json()).code || ""; } catch { /* not JSON */ }
      const retryable = (res.status === 429 || res.status === 503) && retryAfter > 0 && retryAfter <= maxWaitS;
      if (retryable && attempt < retries) {
        await sleep(retryAfter * 1000);
        continue;
      }
      throw new BeaconError(`HTTP ${res.status}`, { status: res.status, code, retryAfter });
    }
  }

  // Walk a paged list. Returns every item, at most maxPages pages.
  async function getAll(path, params = {}, { maxPages = 20 } = {}) {
    const items = [];
    let cursor, pageCursor, restarted = false;
    for (let page = 0; page < maxPages; page++) {
      let body;
      try {
        body = await get(path, { ...params, cursor, pageCursor });
      } catch (err) {
        if (err.status === 400 && pageCursor && !restarted) {
          restarted = true; items.length = 0; cursor = pageCursor = undefined; page = -1;
          continue;
        }
        throw err;
      }
      const list = Array.isArray(body) ? body : body?.items || [];
      items.push(...list);
      if (Array.isArray(body) || !body?.hasMore) break;
      cursor = body.nextCursor;
      pageCursor = body.nextPageCursor || undefined;
      if (cursor === undefined && pageCursor === undefined) break;
    }
    return items;
  }

  return { get, getAll };
}
