# meshcore-regional-template

A Hugo module for regional MeshCore websites. A region's own repository holds only what is
local to it: settings, its own pages, and any file it wants to change. Everything else comes
from this template, pinned by git tag.

## How a region overrides the template

Hugo merges the template and the region site into one file tree. **A file at the same path in
the region site wins.** That works for every kind of file:

| To change | Put a file at |
|---|---|
| a shared guide | `content/guider/<name>.md` |
| the home page text | `content/_index.md` |
| a layout or part of one | `layouts/…`, e.g. `layouts/_partials/footer.html` |
| a UI string | `i18n/sv.toml` (only the keys you change) |
| styles or scripts | `assets/css/main.css`, `assets/js/map.js` |

Settings (region name, IATA, scope, map centre, Beacon URL) are `[params]` in the region's
`hugo.toml`; the defaults are in this repository's `hugo.toml`.

## Start a region site

1. Copy `exampleSite/` into a new repository.
2. Delete the `replacements` line in `hugo.toml`, set your `module` path in `go.mod`, then run
   `hugo mod get github.com/sweden-mesh/meshcore-regional-template@latest`.
3. Fill in `[params.region]` and `[params.beacon]`, and write `content/_index.md`.
4. Build with `hugo --gc --minify`. The output in `public/` is static and can be hosted
   anywhere; CI needs Hugo (extended not required) and Go.

Update the template later with `hugo mod get -u`.

## Develop the template

Hugo ≥ 0.146 and Go. `cd exampleSite && hugo server` builds the example site against the
template in the parent directory.

`scripts/check.sh` is what CI runs: the example site built with warnings as errors, then
[htmltest](https://github.com/wjdp/htmltest) over the output (internal links, HTML5).

## Live data

The map talks to a [Beacon](https://github.com/MeshCore-Beacon) backend over its public REST
API and WebSocket. **No Beacon code is part of this repository**; it is a separate service
under its own licence.

## Licence

Code (layouts, assets, configuration): BSD 2-Clause, see `LICENSE`.
Content (`content/`): CC BY 4.0, see `LICENSE-CONTENT`. Parts are adapted from
[meshat.se](https://meshat.se), with permission and attribution.
