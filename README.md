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
| a troubleshooting entry: add, replace or hide | `content/felsokning/<name>.md` (see below) |
| an FAQ question: add, replace or hide | `content/fragor/<name>.md` (see below) |
| the home page text | `content/_index.md` |
| a layout or part of one | `layouts/…`, e.g. `layouts/_partials/footer.html` |
| a UI string | `i18n/sv.toml` (only the keys you change) |
| styles or scripts | `assets/css/main.css`, `assets/js/…` |
| the logo (header) | `assets/images/logo.svg` (square, shown at 32 px) |
| extra tags in `<head>` / before `</body>` | `layouts/_partials/hooks/head-end.html`, `hooks/body-end.html` (empty in the template) |
| the favicon | `static/favicon.svg` |
| the social-card image (1200×630) | `static/images/og.png`, or `image:` in a page's front matter |

### Troubleshooting: add, replace or hide entries

`/felsokning/` lists one entry per file, grouped by `category`. The template ships the shared
entries; a region changes the list with files of its own in `content/felsokning/`:

- **Add:** a new file. Start from `hugo new felsokning/<name>.md` (the archetype has the
  headings). Use one of the template's categories (`flasha`, `radio`, `companion`, `repeater`,
  `regioner`, `mqtt`, `strom`) or your own, e.g. `lokalt`: it is listed after the template's,
  labelled from i18n `ts_cat_lokalt` or the name itself.
- **Replace:** a file with the same name as the template's.
- **Hide:** a file with the same name that holds only
  `build: {render: never, list: never}`. The entry is then not built, listed, in the sitemap or
  in search.

`exampleSite/content/felsokning/` does all three, and `scripts/check-overrides.sh` tests them.
Add a menu item in your `hugo.toml` if you want one (`pageRef = "/felsokning"`).

**The FAQ** (`/fragor/`) works the same way: one question per file in `content/fragor/`, the
title is the question, the body the answer, `category` one of `grunder`, `utrustning`, `natet`,
`integritet`, `regioner`, `bidra` or your own. Questions are shown folded on the one page (no page
of their own); `/fragor/#<file name>` links to one and opens it. The old combined page
`/guider/fragor-och-ord/` redirects there, and the glossary is `/guider/ordlista/`.

## Settings

`[params]` in the region's `hugo.toml`. A key the region leaves out falls back to the default in
this repository's `hugo.toml`.

| Key | Meaning |
|---|---|
| `style` | `product` (default: light, follows the OS dark mode) or `console` (dark, technical); a region can still override tokens in its own CSS |
| `noindex` | `true` on staging: a robots `noindex` meta tag and a `robots.txt` that disallows everything. Set it in CI with `HUGO_PARAMS_NOINDEX=true`; the site's config needs `enableRobotsTXT = true` |
| `region.scb` | **the county's SCB code, e.g. `"06"`**: the template fetches the county's name, its region (scope) and its neighbours' regions from [zombiefredrik/meshcore-se-regioner](https://github.com/zombiefredrik/meshcore-se-regioner) at build time (a copy in `assets/meshcore-se-regioner/` is the fallback) |
| `region.name` | optional: overrides the county name from the list |
| `region.short` | a short place name for page titles ("MeshCore i Jönköping"); empty = `region.name` |
| `region.iatas` | observer IATA codes (MQTT topic) whose traffic the map shows, e.g. `["JKG"]` |
| `region.scope` | optional: overrides the scope from the list (`se` = take it from the list) |
| `region.center`, `region.zoom` | where the map starts, `[lat, lng]` and zoom |
| `region.borders` | optional, for a site without `beacon.url`: a Beacon base URL (e.g. `"https://beacon.meshat.se"`) from which the build fetches the borders of `region.iatas` and the repeaters' positions, for the wizards' maps (one small fingerprinted file, `region/pick.json`). A failed fetch warns once and the maps show no border. With `beacon.url` set, the wizards use the live Beacon and this is not used |
| `firmware.picker`, `firmware.flasher` | where to get firmware (default the sweden-mesh firmware picker) and the web flasher (default meshcore.io/flasher); used by the landing page and the firmware guide |
| `naming.pattern`, `naming.example`, `naming.explain` | the region's suggested node names, shown in the naming guide; empty = general advice. The wizards take the name prefix from `pattern` (the part before `Plats`); without it, from the region's scope (`se-vgr` → `SE-VGR-`, `se05` → `SE05-`) |
| `naming.place` | a well-known place in the region, the example in the wizards' place field ("en välkänd plats, till exempel Taberg"); empty = no example |
| `naming.place_accented`, `naming.place_ascii` | a local place name with å, ä or ö and the same without (`"Bråneryd"`, `"Braneryd"`), the example in the naming guide's tip on leaving them out; either empty = no example |
| `observer.preset` | the Observer firmware's MQTT preset that feeds this region's Beacon (default `meshat.se`), used by the map guide |
| `radio.preset`, `radio.freq`, `radio.bw`, `radio.sf`, `radio.cr` | the region's radio preset (default EU/UK Narrow, 869.618 MHz, BW 62.5, SF8, CR8), shown by `{{</* settings */>}}` and on the landing page |
| `map.style_light`, `map.style_dark` | basemap style URLs; default OpenFreeMap `liberty` and `dark` (no key, attribution shown by the map) |
| `map.companions` | `false` (default): companion nodes (people's handsets) are left off the map, the snapshot and the packet routes, because their position can be a home |
| `map.maplibre` | the vendored MapLibre version under `static/lib/maplibre-gl/` |
| `beacon.url` | base URL of the Beacon backend; empty = no live data |
| `meshmapper.url`, `meshmapper.coverage`, `meshmapper.days`, `meshmapper.fixture` | MeshMapper: the region's map link, and its measured coverage on the map. See [MeshMapper coverage](#meshmapper-coverage) |
| `wanted` | places where the region wants a new repeater (`[[params.wanted]]` with `name`, `lat`, `lon` and an optional `note` in inline Markdown): listed on "Bli nodvärd" and drawn as a circle of about 1 km with a star on the maps. See [Wanted places](#wanted-places) |
| `links` | plain links in the footer's community column (`[[params.links]]` with `name`, `url`), for sites that are not chats |
| `beacon.seeds` | other Beacons that have heard the region longer (e.g. `["https://beacon.meshat.se"]`); their nodes inside the region's border fill the map until `beacon.url` has heard them |
| `community.name`, `community.url` | the local group |
| `chat.discord`, `chat.matrix` | invite links; empty ones are not shown |
| `chats` | more named chat links, a list of `{name, url}` (e.g. the local and the national Discord) |
| `channels` | a list of `{name, scope, purpose, note, autoreply}` (purpose and note take inline Markdown, e.g. `` `test` ``): the region's channels, shown on the landing page and by `{{</* channels */>}}`. `autoreply = true` adds a small line "Kräver auto-reply firmware" linking the firmware picker's auto-reply update (`params.firmware.picker`), for test channels in a region where few repeaters may run it yet. The old IATA test channel (`#test-<first iata>`) is named in the guides only when it is in this list |
| `analytics.plausible`, `analytics.script`, `analytics.api` | optional cookieless Plausible: the site's `pa-<id>.js` script and the event endpoint, both served from the site's own origin through a proxy; never loaded on a `noindex` build |

## Start a region site

1. Copy `exampleSite/` into a new repository.
2. Delete the `replacements` line and `go.mod` from the copy, then run
   `hugo mod init <your module path>` and
   `hugo mod get github.com/sweden-mesh/meshcore-regional-template@latest`.
3. Set `params.region.scb` (your county), `iatas`, `center`, `zoom` and `[params.beacon]`; the
   template derives the county name and region and generates the guides and wizards. Write
   `content/_index.md` for your own lead.
4. Build with `hugo --gc --minify`, then `pagefind --site public` for the search index (Pagefind ≥ 1.5). The output in `public/` is static and can be hosted
   anywhere; CI needs Hugo (extended not required) and Go.

Building on GitLab, Codeberg/Forgejo, Woodpecker or a plain web host: see `CI.md`.
How the map works, for maintainers: see `MAP.md`.

Update the template later with `hugo mod get -u` (newest tag) or
`hugo mod get github.com/sweden-mesh/meshcore-regional-template@v0.2.0` (a given one). Dependabot
can do it for you: add `.github/dependabot.yml` with the `gomod` ecosystem to the region repo.

## Versions of the tools

| Tool | Minimum | Tested in CI | Why the minimum |
|---|---|---|---|
| Hugo (standard or extended) | 0.146.0 (`module.hugoVersion` in `hugo.toml`) | 0.169.0 | the 0.146 layout structure (`layouts/_partials`, `_shortcodes`, `_markup`); `try` (0.141) and content adapters (0.126) are older |
| Go | any supported release | stable | `hugo mod` fetches the template |
| Pagefind | 1.5 | 1.5.2 | the search UI the template loads |
| Node (tests only) | 22 | 22 | `node --test`, global WebSocket in the live-feed smoke test |

Policy: CI pins exact versions; the minimum moves only when the template starts using a newer
feature, and that is a minor release noted in `CHANGELOG.md`. Hugo deprecations shown as warnings
are fixed promptly, since CI builds with `--panicOnWarning`.

## Releases

The criteria for 1.0 are in `V1.md`.

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
- `{{</* channels */>}}`: a table of the region's channels.
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

## Colour-blind mode

A header button next to the light/dark one (an eye, `cvd_toggle`) switches the site to a
colour-blind-safe scheme: `html[data-cvd="1"]`, remembered in the visitor's browser and set before
the first paint by the inline motion script in `head.html`. Every red/green signal moves to
Okabe–Ito colours: "good", "heard" and "OK" blue, warnings orange, caution yellow, danger purple,
the links' traffic ramp blue → purple → orange, dead zones orange, the observer ring purple. The
page colours are token overrides at the end of `assets/css/main.css`; the maps take theirs from
`assets/js/map/palette.js` and redraw when the mode changes. A region that overrides `main.css`
or `header.html` copies the new parts to get the feature. **A site with a CSP** puts the inline
script's new hash in its `_headers` (see the CHANGELOG).

## Links on the map

Every neighbour link is coloured by how often it is heard (`observationCount` from
`/nodes/{id}/neighbors`, one request per node with neighbours, three at a time, after the map is
drawn; each node again at most every 10 minutes). The two directions of a link are summed; the
scale is absolute (log10: about 1 red, 20 yellow, 160 and more green), so a link keeps its colour
when a node is selected, and the links that do not touch the selected node turn faint grey. A
Beacon proxy must let `/api/v1/nodes/{id}/neighbors` through.

## MeshMapper coverage

[MeshMapper](https://meshmapper.net/) collects measurements from people who drive or walk around
with its app (wardriving). The template can show a region's measurements as a **Täckning**
(coverage) toggle on the front-page map: ~300 m squares coloured by how reliably contact worked,
older squares fainter, a second toggle for dead zones, a popup per square, a legend and credit
while it is on, and a section in the guide "Visa på kartan". It is off by default and loads
only when a visitor switches it on (`?cov=1` opens with it on).

1. **Permission.** Publishing a region's coverage needs the permission of the region's
   MeshMapper admin; ask before turning it on.
2. **An integration key.** The region's MeshMapper admin creates one under *User Settings ›
   API Access*, with the Coverage API granted. The key decides the region. Keep it out of the
   repository.
3. **The secret.** Store it as a repository secret (e.g. `MESHMAPPER_API_KEY`) and give it to
   Hugo as the environment variable `HUGO_MESHMAPPER_KEY` in the build steps that deploy, never
   in pull-request builds:

   ```yaml
   env:
     HUGO_MESHMAPPER_KEY: ${{ github.event_name != 'pull_request' && secrets.MESHMAPPER_API_KEY || '' }}
   ```
4. **The params:**

   ```toml
   [params.meshmapper]
     url = "https://xxx.meshmapper.net/"  # the region's MeshMapper map: linked from the map, the guide and the credit
     coverage = true                       # the coverage layer
     days = 180                            # only pings from the last N days (default 180)
     # fixture = "meshmapper-fixture.json" # a saved response under assets/, read instead of the API
   ```

**Call budget.** The key allows 100 coverage calls per UTC day and every call counts. Each build
makes one (filtered to the region's radio setting, `params.radio`, any coding rate); a local
build reuses its download within the same 6-hour slot. Four scheduled builds a day plus pushes
stay well under it. A refused call (e.g. 429) gives a warning (`warning-meshmapper`) and a build
without the layer; Hugo retries a 429 for up to a minute first. Nothing is kept between builds,
so a revoked key means no layer from the next build on, as MeshMapper asks.

Without the key or `coverage = true` nothing is fetched and the map is as before; `url` alone
gives only the links. The example site shows the layer from a 32-square fixture of a real
Jönköping response.

## Licence

Code (layouts, assets, configuration): BSD 2-Clause, see `LICENSE`.
Content (`content/`): CC BY 4.0, see `LICENSE-CONTENT`. Parts are adapted from
[meshat.se](https://meshat.se), with permission and attribution.
Third-party code, fonts, map data and services: `THIRD-PARTY.md`.

## Region photos

Template pages have photo spots, `{{< region-photo "key" >}}`, that print nothing until the region
supplies a photo: `host` on Bli nodvärd and `mount` in the repeater guide. A region can use any
key on its own pages too. Put the source under the site's `assets/`; it is served only as WebP
(640 and 1000 px wide, never enlarged, metadata dropped).

```toml
[params.photos.host]
  src = "photos/utsikt.jpg"
  alt = "What the photo shows, for someone who cannot see it."
  caption = "Optional caption."
  credit = "Photographer"
```

## Host wizard

`/wizard/nodvard/` ("Bli nodvärd: testa din plats") asks about height, view, power, Wi-Fi and radio
shadow, and lets the visitor pick the spot on the map. Until real coverage data exists, a spot
farther than `params.host.edge_km` (default 2) from every repeater counts as the edge of the mesh.
Nothing is sent or stored; the visitor copies a summary, with the position rounded to about 1 km.

```toml
[params.host]
  edge_km = 2
```

## Wanted places

A region can point out places where a new repeater would help most:

```toml
[[params.wanted]]
  name = "Omberg"
  lat = 58.33
  lon = 14.65
  note = "högt läge med fri sikt mot **Vättern**"   # optional, inline Markdown
```

- **Bli nodvärd** (`/wizard/nodvard/`) lists the places by name, with the note after the name.
  A name is a button that moves the wizard's map to the place; the visitor's own pin stays put.
  The wizard's map always shows the places.
- **The home map** gets a toggle, "Önskade platser" (off by default, `?want=1` in the URL), that
  draws each place as a circle 1 km across (500 m radius, in real metres, so it scales with the
  zoom) with a small gold star at the centre. A click opens a popup with the name and the note
  (as plain text). With or without Beacon.

Places with no name or no usable `lat`/`lon` are left out. Without any places there is no list and
no toggle.

## Contributors list

`{{< contributors >}}` prints one list of everyone who contributed to the site's content, for the
whole site. It reads the GitHub contributors of `params.contributors.repos` at build time (the
template's repo by default; add your own site's repo), adds `params.contributors.people` for work
done outside git, and leaves out bots and AI agents (`data/contributor_deny.toml`, extend with
`params.contributors.deny`) and anyone listed in `params.contributors.exclude`. A login is dropped
when it, or any part of it split on `- _ . [ ]`, matches the deny list, or when GitHub marks it a bot.

```toml
[params.contributors]
  repos = ["sweden-mesh/meshcore-regional-template", "you/your-region-site"]
  exclude = []
  [[params.contributors.people]]
    name = "Kim"
    what = "fälttest av en solnod"
```
