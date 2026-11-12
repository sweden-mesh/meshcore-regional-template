# Changelog

Semantic versioning: a region pins a tag in its `go.mod`. **Major** = a region has to change
something (a param renamed or removed, a layout path moved). **Minor** = new features and
params with safe defaults. **Patch** = fixes and text.

## v0.1.1 — 2026-11-12

- Fix: MapLibre moved from `static/vendor/` to `static/lib/`. Go module downloads leave out
  every `vendor/` directory, so region sites built from v0.1.0 had no MapLibre and no map.
  Found by building a fresh region repo from the tag.

## v0.1.0 — 2026-11-12

First release.

- Hugo module with `exampleSite/` as the starter; regions override any file by path, and set
  params (`region`, `map`, `beacon`, `community`, `chat`, `channels`, `analytics`, `noindex`)
  with defaults deep-merged from the template.
- Landing page: hero, map above the fold, Kom igång / Nätet / Gemenskap.
- Live map from a Beacon backend:
  - MapLibre 6.16.0 (vendored) on OpenFreeMap;
  - nodes with popups, the region border, nodes heard here but placed elsewhere;
  - neighbour links;
  - live packet flows along resolved hops;
  - recent packets with the route to every observer;
  - a build-time snapshot used when Beacon is unreachable.
- Privacy: companion nodes are left off the map unless `map.companions = true`.
- Staging: `noindex` → robots meta and a disallow-all `robots.txt`.
- Content components: alerts (foldable), titled code blocks, tabs, a CC BY source credit.
- Guides: Vad är MeshCore?, Regioner (scope).
- CI: unit tests (`node --test`), a build with warnings as errors, htmltest.
