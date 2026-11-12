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
| styles or scripts | `assets/css/main.css`, `assets/js/…` |
| the logo (header) | `assets/images/logo.svg` (square, shown at 32 px) |
| the favicon | `static/favicon.svg` |
| the social-card image (1200×630) | `static/images/og.png`, or `image:` in a page's front matter |

## Settings

`[params]` in the region's `hugo.toml`. A key the region leaves out falls back to the default in
this repository's `hugo.toml`.

| Key | Meaning |
|---|---|
| `noindex` | `true` on staging: a robots `noindex` meta tag and a `robots.txt` that disallows everything. Set it in CI with `HUGO_PARAMS_NOINDEX=true`; the site's config needs `enableRobotsTXT = true` |
| `region.name` | the region's name, shown in the header and hero |
| `region.iatas` | observer IATA codes (MQTT topic) whose traffic the map shows, e.g. `["JKG"]` |
| `region.scope` | the region's MeshCore scope, e.g. `se-jkp` |
| `region.center`, `region.zoom` | where the map starts, `[lat, lng]` and zoom |
| `radio.preset`, `radio.freq`, `radio.bw`, `radio.sf`, `radio.cr` | the region's radio preset (default EU/UK Narrow, 869.618 MHz, BW 62.5, SF8, CR8), shown by `{{</* settings */>}}` and on the landing page |
| `map.style_light`, `map.style_dark` | basemap style URLs; default OpenFreeMap `liberty` and `dark` (no key, attribution shown by the map) |
| `map.companions` | `false` (default): companion nodes (people's handsets) are left off the map, the snapshot and the packet routes, because their position can be a home |
| `map.maplibre` | the vendored MapLibre version under `static/lib/maplibre-gl/` |
| `beacon.url` | base URL of the Beacon backend; empty = no live data |
| `community.name`, `community.url` | the local group |
| `chat.discord`, `chat.matrix` | invite links; empty ones are not shown |
| `channels` | a list of `{name, purpose}`: the region's channels |
| `analytics.*` | optional Plausible: `plausible`, `domain`, `script`, `api` (same-origin paths) |

## Start a region site

1. Copy `exampleSite/` into a new repository.
2. Delete the `replacements` line and `go.mod` from the copy, then run
   `hugo mod init <your module path>` and
   `hugo mod get github.com/sweden-mesh/meshcore-regional-template@latest`.
3. Fill in `[params.region]` and `[params.beacon]`, and write `content/_index.md`.
4. Build with `hugo --gc --minify`. The output in `public/` is static and can be hosted
   anywhere; CI needs Hugo (extended not required) and Go.

Update the template later with `hugo mod get -u` (newest tag) or
`hugo mod get github.com/sweden-mesh/meshcore-regional-template@v0.2.0` (a given one). Dependabot
can do it for you: add `.github/dependabot.yml` with the `gomod` ecosystem to the region repo.

## Releases

Tags `vX.Y.Z` on `main`, described in `CHANGELOG.md`; the version rules are at the top of that
file. To release: update `CHANGELOG.md`, commit, `git tag -a vX.Y.Z -m "…"`, push the tag.

## Develop the template

Hugo ≥ 0.146 and Go. `cd exampleSite && hugo server` builds the example site against the
template in the parent directory.

To develop against a live Beacon without editing the example config, override params by
environment (lists as JSON):

```sh
cd exampleSite
HUGO_PARAMS_REGION_IATAS='["JKG"]' HUGO_PARAMS_BEACON_URL=https://beacon.meshcore-jkp.se hugo server
```

`scripts/check.sh` is what CI runs: the unit tests of the browser modules (`node --test`, no
dependencies), the example site built with warnings as errors, then
[htmltest](https://github.com/wjdp/htmltest) over the output (internal links, HTML5).

## Writing content

Plain Markdown plus:

- Alerts: `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`, an optional
  title after the marker, folded with `[!NOTE]-` (closed) or `[!NOTE]+` (open).
- Code-block titles: ```` ```sh {title="Konsol"} ````.
- Tabs: `{{</* tabs */>}}{{</* tab "Rubrik" */>}}…{{</* /tab */>}}{{</* /tabs */>}}`, no JavaScript.
- `{{</* settings */>}}`: a box with the radio preset, region and IATA codes.
- Region values: `{{</* region "scope" */>}}`, `{{</* region "name" */>}}`; never write a region's
  name or scope into a shared guide.
- A page adapted from elsewhere names its source in front matter
  (`source: {title, url, license, changes}`); the page prints the credit that CC BY requires.

`exampleSite/content/om-regionen.md` shows every component.

## Live data

At build time the template also fetches a **snapshot** of the region's nodes and borders from
Beacon (cached for the hour) and publishes it as a JSON file next to the page. The map uses it
when Beacon is unreachable from a visitor's browser. If the build cannot reach Beacon, it warns
(`warning-beacon-snapshot`, which `ignoreLogs` can silence) and uses
`data/beacon_snapshot.json` from the site, if one exists. Don't build with `--panicOnWarning`
in a region's deploy pipeline, or a Beacon outage will block deploys.

The map talks to a [Beacon](https://github.com/MeshCore-Beacon) backend over its public REST
API and WebSocket. **No Beacon code is part of this repository**; it is a separate service
under its own licence.

## Licence

Code (layouts, assets, configuration): BSD 2-Clause, see `LICENSE`.
Content (`content/`): CC BY 4.0, see `LICENSE-CONTENT`. Parts are adapted from
[meshat.se](https://meshat.se), with permission and attribution.
