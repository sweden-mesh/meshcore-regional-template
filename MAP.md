# How the map works

For maintainers of the template. The map is plain ES modules on MapLibre GL, fed by a Beacon
server's public API. No build step beyond Hugo's `js.Build`; no Beacon code is in this repository.

## From params to a map

1. `layouts/_partials/map.html` writes everything the map needs into `#map`'s `data-*`
   attributes: the MapLibre path, the basemap styles, the Beacon URL, the region's IATA codes,
   its centre and zoom, and the texts.
2. At build time `layouts/_partials/beacon-snapshot.html` fetches the region's nodes and IATA
   borders from Beacon and publishes them as `beacon/snapshot.json`. The cache key changes every
   hour, so the 6-hourly rebuild gets fresh data. The snapshot also feeds the no-JS repeater list.
3. In the browser, `assets/js/map/main.js` starts when the map scrolls into view
   (IntersectionObserver), loads MapLibre from `static/lib/` with a runtime import
   (`basemap.js`), and asks Beacon for the nodes and borders. If Beacon cannot be reached it
   falls back to the snapshot and says so on the map.

## The modules

| File | Does |
|---|---|
| `map/main.js` | Wires everything; holds the state (toggles, selected node, mini-mode zoom) |
| `map/basemap.js` | Loads MapLibre and the OpenFreeMap style (light or dark) |
| `map/camera.js` | Start view and framing the region (pure, tested) |
| `map/nodes.js` | Repeaters as pills with name and a dot at the exact position; companions hidden unless `params.map.companions`; mini mode (circles only) below the zoom where the region fills the map's width, recomputed on resize |
| `map/region.js` | The IATA border (`/iatas/{iata}/border`) and the "outside the region" toggle (`possiblyForeign`) |
| `map/neighbours.js` | Neighbour links: all known edges, or the selected node's edges coloured by how often they were seen |
| `map/flow.js` | Live packets drawn along their path; only high-confidence hops with a position, runs of resolved hops when the chain is incomplete; traffic-focus flashes and bubbles |
| `map/packetpath.js` | The route one packet took to every observer that heard it (`/packets/{hash}`) |
| `map/popup.js` | Node details (`/nodes/{id}`); names are untrusted and escaped |
| `map/panel.js` | The pill toggles and the legend (open on desktop, closed under 640 px) |
| `map/urlstate.js` | Toggles and view in the URL (`?live=0&links=0&foreign=0&focus=0&z=…&ll=…`) |
| `beacon/rest.js` | REST client: retries on 429/503 with `Retry-After`, cursor paging |
| `beacon/live.js` | The WebSocket feed (`/ws`), see below |

## The live feed

`beacon/live.js` opens one WebSocket to `/ws`: `hello`, then `subscribe` with the region's IATA
codes as the only scope (never empty: an empty scope means everything), then `configure` with
`resolvePath` and `includeObserverKey`. It pings every 30 s and reconnects with backoff. Beacon
has no replay: a `lagged` message, or a reconnect, means packets were missed, and the map refetches
the node list over REST instead of guessing.

Traffic is bursty. A quiet minute on the map is usually a quiet minute on the air, not a fault.

## Which Beacon

Each region runs or chooses its own Beacon (`params.beacon.url`). The browser calls it directly,
so it must allow the site's origin (CORS for REST, the Origin allowlist for `/ws`).
`scripts/beacon-contract.mjs` checks that a Beacon has every endpoint and field the map reads
(see [CI.md](CI.md#checking-a-beacon)).

## Changing the map

- Pure logic lives in exported functions with tests in `tests/` (`node --test tests/*.test.mjs`);
  keep it that way, and test against the captured responses in `tests/data/`.
- A new Beacon field: add it to `SPEC` in `scripts/beacon-contract.mjs`, and a capture to
  `tests/data/` if the tests need it.
- MapLibre is vendored per version under `static/lib/maplibre-gl/<version>/` (not `vendor/`: Go
  module downloads drop vendor directories); bump `params.map.maplibre` with it.
- Check in the browser at 1440 and 390 px, light and dark, before tagging.
