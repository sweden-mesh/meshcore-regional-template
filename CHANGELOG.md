# Changelog

Semantic versioning: a region pins a tag in its `go.mod`. **Major** = a region has to change
something (a param renamed or removed, a layout path moved). **Minor** = new features and
params with safe defaults. **Patch** = fixes and text.

## v0.46.3 — 2026-11-17

- Solar calculator, battery cell note: "men vi har inte hittat några mätvärden för den" instead of
  "men ingen har mätt den" (operator); English to match.

## v0.46.2 — 2026-11-17

- **Heltec V3/V4 and RAK4631 in the solar calculator drawn after the real boards** (operator's
  reference photos): Heltec with 2 × 18 header pins, PRG and RST beside the USB-C, the OLED over most
  of the board, mounting holes and the antenna plug at the far end, a white "V4" mark on V4 (V4.3 with
  a green dot); the WisBlock base black with gold mounting holes, white battery and solar plugs, the
  RAK4631 module with its white label and two sensor slots.

## v0.46.1 — 2026-11-17

- **The two Seeed XIAO boards in the solar calculator look like the real ones** (operator): a small
  black board with USB-C out past one edge, 7 castellated pads per side and the white "seeed studio"
  label on the shield; the ESP32-S3 with its board-to-board connector and antenna plug, the nRF52840
  with its blue button; the Wio-SX1262 underneath shows as an edge with its LoRa antenna plug.

## v0.46.0 — 2026-11-17

Regional output changes on purpose (COMPARE_BASE moves here).

- **Solar calculator: a generic board last in each family (B-322).** For a board not in the list:
  the family's highest sourced load (nRF52 6/8.6 mA, ESP32 13.4 mA, Raspberry Pi 190 mA), marked
  less certain, with its own pixel-art board; the method page names the figures.

## v0.45.2 — 2026-11-17

- **County picker: short names** (anti-AI-design review 17). The buttons cut long county names
  ("Södermanland…"); they now show the short name ("Södermanland", "Västra Götaland"), the full
  name in the tooltip, and the rows no longer stretch to the map's height. National only.

## v0.45.1 — 2026-11-17

- **Sverige's list of every county's groups** is marked (`lan-all-groups`), so the national browser
  check knows it names other counties on purpose. No change to regional output.

## v0.45.0 — 2026-11-17

Regional output changes on purpose (COMPARE_BASE moves here).

- **Landowners (B-305).** `/markagare/`, "Till dig som äger platsen": what is put up, power and
  cost, the radio in plain numbers, ownership and insurance, access and removal; linked both ways
  with Bli nodvärd and from the footer; prints on one A4 (a print stylesheet for every page).
- **Community site beside Se kartan (B-306).** National county files take `community = {name,
  url}`; a regional site sets `params.community.hero = true` (off by default). The hero's secondary
  buttons get a visible thin border.
- **Front page.** The three ways in open the Kom igång card (B-311); county list columns open with
  a sentence (B-307); the checked-date line smaller and fainter (B-308).
- **Region selector (B-312).** `params.regionSwitch.on` (off by default): a county button in the
  header, every county from `data/county_sites.toml` (own site, else its national page).
- **County picker (B-315).** Own-site counties green on the map with a legend (Jönköping was grey),
  one-line buttons, Sverige as its own button.
- **Sverige (B-316, B-318).** The channels card stays with `#test-se` (no auto-reply promised yet),
  and the three text columns get national content.
- **Footer (B-317).** Each community link once; a county's groups were listed twice.
- **Map.** One `/nodes` request for statistics and map (B-310); live traffic no longer lights up
  hidden out-of-region nodes (B-313); a transmitting repeater's links flash white (B-314).
- **Solar.** Board list with pixel-art boards on a load grid, one data file per county, Pi Zero
  limits only while chosen, method page board table and sources (B-291); Li-ion only, explained
  (B-295); prebuilt solar repeaters in one data file and a box (B-296); the national solar page
  explains the county and waits for one (B-319).
- **Search (B-321).** A scope filter on every page; search shows common, national and the
  visitor's region. `searchScope` / `searchPair` in front matter.
- **Site flasher (B-298), off by default.** `params.firmware.flash`, `flashIndex`; `/flasha/` with
  ESP32 (esptool-js) and nRF52 serial DFU, official-first box, Update by default. Not to be turned
  on before the bench tests.
- **Guides.** No colon in a guide title; Etikett is "Sändningstid är gemensam" (B-320).

## v0.44.0 — 2026-11-17

- **The map's link colours in one request (B-309).** The counts behind the link colours came from
  `/nodes/{id}/neighbors`, one request per node with neighbours, again every 10 minutes: 35
  requests per page load on meshcore-jkp.se and 307 on a county page (Halland) on
  meshcoresverige.se, against Beacon's 600 per minute per address. Now they come from Beacon's
  neighbour files: `<beacon.url>/static/neighbors/{iata}.json`, one request per IATA (a 404 is an
  area with no links yet), and the national `<beacon.url>/static/neighbors.json` if those fail.
  Measured: 1 request per page load on both. New params: `beacon.links` (a file URL, `{iata}` for
  one per IATA, `""` for none) and `beacon.links_from` (the Beacons that serve the files; by
  default the national Beacon and beacon.meshcore-jkp.se).
- **Without a file, fewer per-node requests.** Only nodes on the map (outside the region only
  while "Utanför regionen" is on) and in or near the view; a node again after 30 minutes, or 10
  if its neighbour list changed; never while the tab is hidden or the links are off.

## v0.43.2 — 2026-11-17

- **The shared national Beacon is the default** (`params.beacon.url` =
  `https://beacon.meshcoresverige.se`, the same Beacon under a national name). A site that sets its
  own `beacon.url` is unchanged; set `url = ""` for no live data.

## v0.43.1 — 2026-11-17

- **Test messages: "helst inte" instead of "aldrig"** (operator). The test channel's note now says
  "Använd helst inte de vanliga chattkanalerna (Public, `#…`) för testmeddelanden." In national
  mode it names Public and the county's own chat channels (those whose purpose says chat);
  `lan_test_note` takes `.Chat`, and shared pages say "Public och länets chattkanal"
  (`lan_test_note_chat`). The channels guide and the example site use the same wording; a site
  with its own `note` in `params.channels` keeps its own text.

## v0.43.0 — 2026-11-17

Copy and map behaviour.

- **Test channel wording (B-302).** Every guide, wizard step and county text that sends a reader
  to the region's test channel now says: test in `#test-<scope>` if the region has repeaters with
  auto-reply firmware (linked to the firmware picker's auto-reply update), otherwise in the
  standard `#test`. Changed: `wzc_6_text`, `lan_test_note`, `lan_net_text`, `ch_requires_ar`
  ("Svar kräver repeatrar med auto-reply-firmware"), the county pages' Kom igång and
  troubleshooting text (`assets/lan/`, which now get `.Picker`), and the guides etikett,
  forsta-meddelandet, kanaler, companion and three troubleshooting pages. A region's own
  `params.channels` note is its own to update.
- **The auto-reply footnote on county pages (B-301).** In national mode the derived test channel
  carries `autoreply = true`, so the county pages' channel box (and the shared pages' channel
  table) shows "* Svar kräver repeatrar med auto-reply-firmware" with its firmware link.
- **A warmer invitation (B-303).** `lan_data_link` reads "Vet du något om MeshCore i länet som
  saknas här? Du kan enkelt bidra med mer information", `lan_footer_data` "Bidra med uppgifter
  om ditt län" (English to match).
- **"Utanför regionen" no longer re-zooms the map (B-304).** Switching it on, or opening with
  `foreign=1`, leaves the camera alone; only the fit button frames what is shown. "Önskade
  platser" still widens when switched on (`togglesWiden()` in camera.js, tested).

## v0.42.5 — 2026-11-17

- **The "Ctrl + scroll" hint no longer dims the map** (operator). It is a small pill at the top
  centre with a yellow border (`--caution`), and in Swedish: "Håll Ctrl och scrolla för att zooma
  kartan", "Håll ⌘ …" on a Mac, "Använd två fingrar för att flytta kartan" on touch (map texts
  `gesture_win`, `gesture_mac`, `gesture_touch`, passed to MapLibre's `locale`).

## v0.42.4 — 2026-11-17

- **County maps in national mode hide links to nodes outside the county too (B-299).** The county
  page marked those nodes only on the drawn dots, so v0.42.3's link filter never saw them; it now
  hands the map the same test (`el.isOutside`), and the links redraw once it is in place.
  Regional sites: unchanged behaviour.

## v0.42.3 — 2026-11-17

Two map and page fixes.

- **Links to hidden nodes are hidden too (B-299).** With "Utanför regionen" turned off, the links
  that end at a node outside the region now disappear with the node, and come back with it.
  `allLinks()` takes `foreign` (default on).
- **The scope in the front-page lead is styled as a scope (B-300).** In national mode a county's
  lead ("… länets region se13, …") shows the scope in the same fixed-width style as elsewhere;
  the meta description stays plain text. The bare `se` is never marked up.

## v0.42.2 — 2026-11-16

Removes a Python cache file that v0.42.1 carried by mistake (`assets/solar/__pycache__/`, never
published); `__pycache__/` is now ignored. No change to any site.

## v0.42.1 — 2026-11-16

Map: a node popup that opens under the corner controls (the toggles and the legend, which cover the
top of the map on a phone) moves the map down until it is clear (anti-AI-design review, iteration 16).

## v0.42.0 — 2026-11-16

Changes regional output.

- **Map:** repeater site details from MeshMapper (antenna, height above ground, power source) in the
  node popups, with a credit line. New params `meshmapper.sites` (off by default) and
  `meshmapper.sites_fixture`; the build keeps only those three fields, never the admins' names or the
  notes. README: **MeshMapper coverage**.
- **Background:** the gradient moves by a transform on a fixed layer instead of `background-position`,
  so it no longer repaints the page every frame (same look, measured in the commit).
- **Scopes:** numeric scopes (`se08`, `se12`, …) are styled as scopes like `se-<county>`.
- **Channels guide:** the heading "Kanaler i <region>" has the fixed id `kanaler-i-regionen` (it was
  numbered per build); a link to the old id needs updating.
- **Release step:** `scripts/lastmod.mjs` ignores national-only lines, so they no longer move a
  wizard's date.

## v0.41.2 — 2026-11-16

National mode only (anti-AI-design review, iteration 15): the wizards' position picker opens on the
chosen county (it opened on the whole country's map areas); the county selector is styled as a
field; the välj län note hides while the wizard's own selector is shown. Regional output unchanged.

## v0.41.1 — 2026-11-16

The wizards' dates back to their last real change: v0.41.0's release step moved them because the
wizard shortcodes gained national-only lines, which changed `dateModified` on regional sites.

## v0.41.0 — 2026-11-16

National mode, phases 3–4 (NATIONAL-7). Regional output unchanged.

- **Maps:** a Beacon snapshot and wanted places per county front page, every county's wanted places
  on the Sverige map, nodes outside the county marked as outside the region (`js/lan/map-county.js`,
  `js/lan/geo.js`), the no-observers note, the county's MeshMapper link; no coverage layer.
- **Wizards:** the county's scope, prefix, neighbours, Observer fallback and solar starting point
  (`js/lan/wizard-county.js`), a county selector without a county, a warning when the position is in
  another county, a line for a county with its own site.
- **Pages:** own descriptions for county, local and `/lan/` pages; the footer links the county-data
  guide; the privacy text names the county cookie; Plausible events carry `lan`.
- **Checks:** `scripts/check-national-browser.mjs` (in CI) and a 21-of-21 wizard test.
- README: **National mode**.

## v0.40.1 — 2026-11-16

National mode only (anti-AI-design review, iteration 14): the välj län note loses its coloured left
stripe (a plain muted line); Kom igång says "kanalen … för den" when a county has only its test
channel. Regional output unchanged.

## v0.40.0 — 2026-11-16

National mode, phases 1–2 (NATIONAL-7, the national site meshcore-swe.se). Everything sits behind
`params.national` (default `false`): with it false a regional site's output is byte-identical
(checked for the example site and meshcore-jkp.se by `scripts/compare-regional.sh`). A regional site
needs no change.

- **`params.national`**, off by default, and **`params.lanData`** (the county-data guide's URL).
- **`scripts/compare-regional.sh`** builds the example site (and any site in `COMPARE_SITES`)
  against a base tag and the working tree and compares `public/`; CI job `regional-unchanged`.
- **`exampleNational/`** and **`scripts/check-national.sh`** (run by `check.sh`): three counties,
  one with its own site.
- **The county registry** `lan.html`: the site's `data/lan/<scb>.toml` merged with the region list,
  the neighbour list and each county's bounding box from `se-lan.geojson`.
- **County front pages** at `/<slug>/` (content adapter `content/_content.gotmpl`, layout
  `lan/county.html`, the front page's body moved to `home-main.html`), and **three local pages**
  per county (`kom-igang`, `ingen-svar-pa-test`, `fragor`; text in `assets/lan/*.md`).
- **`/lan/`** (the county list), a page for a county with its own site (two choices, no redirect),
  a published `_redirects` (åäö-free addresses, 301) and `/lan/pages.json`.
- **The county switch:** a pre-paint inline script (URL, localStorage `lan`, cookie `lan`), the
  data island and `js/lan/apply.js` (fills `data-r` spans, `lan:change`), region shortcodes as spans
  on shared pages, the välj län note, the proposal line, the county's channels, groups and contact,
  the header's county button, and the county modal with its SVG map (`js/lan/modal.js`).
- **`css/national.css`**, loaded only in national mode.
- New i18n keys `lan_*` (sv and en). The national pre-paint script is one more inline script: a
  national site with a script-src CSP lists its hash.

## v0.39.0 — 2026-11-16

For people new to MeshCore (NEWCOMER-3 and NEWCOMER-4): the beginner, the radio amateur and the maker.

- **The front page has three ways in** under the hero buttons: *Ny här?* (to Skaffa hårdvara),
  *Radioamatör?* (to För radioamatörer) and *Vill du bygga?* (to Bygg en repeater). A plain list,
  one line each; a region that removes a target page loses that line. New i18n keys
  `audience_label`, `audience_new`, `audience_new_link`, `audience_ham`, `audience_ham_link`,
  `audience_maker`, `audience_maker_link` (sv and en).
- **"Skaffa hårdvara" becomes a device ladder**: ready-made companions, devices with screen, GPS or
  keyboard, and a repeater to build or buy, with named models and prices dated November 2026 (in
  kronor where a Swedish shop had the model, otherwise as the European source gave it); where to buy
  (Pileup, Limmared, amazon.se, AliExpress, the makers' own shops); battery life in days per device
  type, with sources. No affiliate links.
- **New guides**: *Första meddelandet* (`/guider/forsta-meddelandet/`, Kom igång): adverts,
  contacts, the test channel, direct message vs channel, receipts, and why silence is usually normal.
  *Bygg en repeater* (`/guider/bygg-en-repeater/`, Repeater): a Seeed XIAO nRF52840 with
  Wio-SX1262 for battery and sun, and a Heltec V4 for mains power, including the V4's transmit power
  against the ERP limit. *För radioamatörer* and *Antenner* in a new hub group **Radio och
  antenner** (`radio`): the 868 MHz SRD rules, ERP with antenna gain, duty cycle, the LoRa
  parameters, flooding; antenna types, gain, connectors, cable loss and placement.
- **Test channels**: the new shortcode `{{< testchannel >}}` prints the region's own
  `#test-<scope>` (from the region partial). The companion, channel and etiquette guides now say to
  test there or in the general `#test`.
- **Companion flashing fixed**: the firmware picker offers only repeaters, so *Flasha firmware*,
  *Kom igång med en companion* and the companion wizard's intro now send companions to the official
  web flasher (`params.firmware.flasher`).
- **The app per platform** (Android, iPhone, Windows, macOS, web) in the companion guide. FAQ:
  `licens` gets the numbers and "not amateur radio", `batteritid` figures, `vad-kostar-det` and
  `vilken-radio` point to the ladder.
- `scripts/check-overrides.sh` checks the audience list, the new hub group and guides, the derived
  test channel and the companion link to the web flasher.
- No inline script changes: **no CSP hash changes**.

## v0.38.0 — 2026-11-16

- New guide **"En egen broker för regionen"** (`/guider/egen-broker/`, group *Regioner och
  kanaler*, weight 85): a region does not need its own command broker, because the shared one
  (`params.backend.host`, rendered from the param) serves every region; what a region gets with
  its own (remote commands in its own hands, its own packet feed for a map) and what it costs (a
  small VPS, upkeep); links mccontrol. `scripts/check-overrides.sh` checks the host is rendered.

## v0.37.2 — 2026-11-16

- `[params.contact] email`: optional; shown in the footer as "Kontakt: <address>" (a `mailto:` link,
  no new tab). New i18n key `footer_contact`.

## v0.37.1 — 2026-11-16

- The guide "MeshCore eller Meshtastic?" moves to the end of the guide list (weight 95), so the home
  page's "Kom igång" block lists only MeshCore guides again ("Skaffa hårdvara" is back).

## v0.37.0 — 2026-11-16

Search engines (the SEO review of 2026-11-15, items SEO-T1 to SEO-T25).

- **A per-page `noindex`** (SEO-T2, SEO-T15): `noindex: true` in front matter, or for many pages
  through a `[[cascade]]` in `hugo.toml`, writes robots `noindex, follow` and leaves the page out
  of the sitemap. The site-wide `params.noindex` (staging) still writes `noindex, nofollow`. README
  "Search engines" shows the cascade a site uses to opt out of the shared guides. `/sok/` is now
  `noindex` and out of the sitemap. New `layouts/sitemap.xml`: a region that has its own replaces
  the noindex filter and the date guard too.
- **Real dates, never year 1** (SEO-T1, SEO-T4): `scripts/lastmod.mjs`, run at each release,
  writes each template page's `date` (first commit) and `lastmod` (last change to its text) from
  git, and the wizard pages' dates to `data/lastmod.toml`. JSON-LD gets `dateModified` and
  `datePublished`, and the sitemap `<lastmod>`, only where the page has a date. Before, 47 of 59
  pages said `"dateModified":"0001-01-01"`.
- **Structured data** (SEO-T3, SEO-T13, SEO-T14, SEO-T25): `sameAs` only from the new
  `params.sameAs` (profiles the site owns); **`community.url` and chat invites are no longer put
  in `sameAs`**. Every page but the 404 gets a BreadcrumbList and its type: TechArticle (now with
  author, image and publisher with url and logo) on guides, CollectionPage on sections, WebPage on
  the rest. WebSite gets `alternateName` (the host).
- **Layout shift on desktop** (SEO-T5): the background blobs no longer move in layout when
  `parallax.js` sets `--extra` (they sit in `vh` and follow it with `translate`), the header
  reserves the toggles' 44 px, and the two body weights of IBM Plex Sans are preloaded with a
  metric-matched Arial fallback (`"Plex Fallback"`). CLS measured on the example site (Chrome,
  cold cache, CPU 4×, Slow 4G): / 0.116 → 0.000 at 1366 px and 0.163 → 0.001 at 1024 px;
  /guider/flasha-firmware/ 0.324 → 0.002 and 0.468 → 0.002; at 390 px 0.538 → 0.216 and
  0.615 → 0.217 (what is left is the example's long site name re-wrapping when the toggles appear).
- **Titles and descriptions** (SEO-T6 to SEO-T9, SEO-T24): a new `seoTitle` front-matter key
  replaces the title in `<title>` and `og:title` only; one that names MeshCore ends in
  "– <short>". Shorter titles for 10 troubleshooting pages, "guide" in the titles of the guide hub
  and the three entry guides, descriptive ones for Kanaler, Ordlista and Solnoder, and Swedish ones
  for the wizard and troubleshooting hubs. 19 descriptions rewritten to 120–155 characters.
- **The guide hub groups its guides** under H2s (SEO-T9): Kom igång, Repeater, Regioner och
  kanaler, Sol och ström, from `groups` in `content/guider/_index.md` and `group` on each guide
  (`layouts/section.html`). A region's own guide without a group is listed last under "Fler
  guider" (new i18n key `guide_group_more`).
- **New guide "MeshCore eller Meshtastic?"** (SEO-T10), linked from "Vad är MeshCore?" and the
  Meshtastic question. "Vad är MeshCore?" gets a section on MeshCore in Sweden: the band and the
  region's preset, the rules and the cost (SEO-T19).
- **Content** (SEO-T11, SEO-T12, SEO-T16): five short troubleshooting pages get check commands
  with the expected reply and a "Fungerade inte?" step; every guide but the glossary, naming and
  the new comparison links its likely problems; companion, repeater and Skaffa hårdvara link "Vad
  är MeshCore?" and the glossary in the first paragraph; the solar method page is in the sitemap
  and linked from Solnoder.
- **Smaller fixes**: the 404 is titled in Swedish and has no canonical or Open Graph tags
  (SEO-T21); sections and the home page declare `og:type` `website`, `og:image:width`/`height` only
  for the template's own image, and a new `og:image:alt` from `imageAlt` or `params.ogImageAlt`
  (SEO-T17); the quick repeater wizard's review heading is an H2 (SEO-T18); the sections' RSS
  feeds are off, and a region switches off the home page's with `"rss"` in `disableKinds`
  (SEO-T22).
- A region that overrides `head.html`, `jsonld.html`, `seo-title.html`, `section.html`,
  `wizard-quick.html` or `main.css` takes the same changes.
- No inline script changes: **no CSP hash changes**.

## v0.36.0 — 2026-11-15

- **"Döda zoner" is gone from the home map** (B-290, operator: not useful right now): the toggle,
  its legend entry and the muted-red hatch layer (and its colour-blind orange) are removed.
  **The `dead` URL key is gone**: `?dead=1` in an old link is ignored. The **Täckning** layer is
  unchanged; a square where nothing got through is now left empty, and the map guide
  (`mm_layer`) and the hint under the map (`map_coverage_hint`) say so. Removed i18n keys:
  `map_dead`, `mt_lg_cov_dead`, `mt_cov_dead_heading`, `mt_cov_DEAD`, `mt_cov_DROP`. A region
  that overrides `map.html`, `main.css`, `mm_layer` or `map_coverage_hint` drops the same parts.
- **The region's command broker is a setting** (RB-3): `[params.backend] host`, default
  `mqtt-meshcore.louie.se`, the shared broker every region uses unless it runs its own. The
  repeater wizards' Observer section gets a **Fjärrstyrning** option (lou `rc` builds) with an
  optional field for the owner's public key: for the shared broker it sends the bare
  `set mqtt.cmd on` (lou-17's `mccontrol` preset names that host); for a region's own broker a
  custom slot `backend.slot` (default 3) with server `mqtts://<host>:8883`, audience `<host>` and
  `filter all`, then `set mqtt.cmd.slot`. The firmware guide names the broker and shows the same
  lines (shortcode `{{</* region-control */>}}`). New i18n keys: `wz_ctl_label`, `wz_ctl_help`,
  `wz_ctl_key`, `wz_ctl_key_help`, `wz_f_control`, `wz_rv_control`, `rc_key`, `rc_cmds`.
- **Fix: the regional MQTT slot no longer defaults to 3** (`observer.mqtt.slot`, now 6): on a
  board with PSRAM `set mqtt.cmd on` takes slot 3 first, so the two collided. A board without
  PSRAM has only slots 1–3; `wz_mqtt_help` and `rm_note` now say so.
- No inline script changes: **no CSP hash changes**.

## v0.35.0 — 2026-11-15

- **Fit button on the home map**: a button directly under + / − (MapLibre's own control style, a
  dashed square; new i18n key `mt_fit_all`, "Visa allt" / "Fit all", as tooltip and
  `aria-label`) frames everything shown: the nodes, the foreign ones while "Utanför regionen" is
  on, the wanted places' circles while "Önskade platser" is on. Not the region's border. Unlike
  the toggles' widening it zooms in as well as out (to zoom 12 at most, as the first framing),
  with the same padding; short animation, none with reduced motion. Works without Beacon (wanted
  places only). New pure helpers in `camera.js`: `fitItems`, `fitTo`, `FIT_MAX_ZOOM`.
- **Fix: a toggle no longer zooms out to the whole region** (B-289): switching on "Önskade
  platser" or "Utanför regionen" (and opening with `want=1` / `foreign=1`) widened the view to
  take in the region's border too, so a zoomed-in map jumped out to the whole county. It now
  takes in only the objects shown, the same ones the fit button frames: the nodes, the foreign
  ones while on, the wanted places' circles while on. Still widen-only: it never zooms in and
  leaves the view alone when everything fits.
- **Legend pills look like the map's**: "repeater, hörd nyligen", "repeater, inte hörd på länge"
  and "observatör" each show a miniature of the map's label: a sample id ("AB12") in the pill,
  with the map's fill, border and text colour per state (the stale pill grey on grey), in both
  themes and in colour-blind mode. The observer's ◉ now sits inside its pill, so
  **`mt_lg_observer` loses its leading "◉ "** ("observatör (rapporterar till kartan)"); a region
  that overrides that key drops it too.
- **"Stoppa bakgrundsrörelse" is a header button**: an icon button next to the light/dark and
  colour-blind ones, same size and style (a wave; a pause sign while stopped), a toggle with
  `aria-pressed` under the name `motion_stop`, the tooltip following the state (`motion_stop` /
  `motion_start`). Below 27em (432 px) a fourth header button squeezed the site's name until it
  broke mid-word ("Jönköpin g" at 390 px), so there the header leaves it out and the footer keeps a
  link (`motion-link`, text following the state); from 27em up the footer link is gone. Same
  behaviour: remembered per visitor, applied before the first paint by the unchanged inline motion
  script, so **no CSP hash changes**. A region that overrides `header.html` copies the button and
  its script in; one that overrides `footer.html` replaces the old `motion-toggle` list item and
  script with the new `motion-foot` item.

## v0.34.1 — 2026-11-15

- Solar method page: "who did the checks" no longer names the AI product ("separata sessioner mellan
  september och november 2026").
- README: a region with MeshMapper coverage should set `timeout = "40s"`, so a refused call (429) is
  retried at most 9 times instead of about 14.

## v0.34.0 — 2026-11-15

- **The home map widens to what a toggle switches on**: switching on "Önskade platser" or
  "Utanför regionen" zooms out and/or pans, once, so that everything shown fits (the nodes shown,
  the wanted places' circles while on, the region's border), padded as the first framing. If it
  all fits already the map stays put; it never zooms in, and switching off leaves the view as it
  is. Short animation, none with reduced motion. Opening with `want=1` (or `foreign=1`) frames
  everything too, unless the URL also gives a view (`z`, `ll`). Works without Beacon (wanted
  places only). Data refreshes never re-fit. New pure helpers in `camera.js` (`nodePoints`,
  `pointsBounds`, `expandBounds`, `needsWiden`, `widenToFit`) and `wantedBounds` in `wanted.js`.
- **Every link coloured by traffic**: with no node selected, all neighbour links now use the
  red → yellow → green ramp the selected node's links had, from `observationCount` in
  `/nodes/{id}/neighbors`, fetched once per node with neighbours after the map is drawn (three at
  a time, 150 ms apart; 34 requests on Jönköping's map), kept for the session and fetched again at
  most every 10 minutes. A link's two directions are summed (separate receptions: A hearing B and
  B hearing A). The scale stays absolute (log10, as before), so a link has the same colour with
  and without a selection. A link without a count yet, or whose requests failed, stays neutral
  grey. **With a node selected**, its links keep their colours and all others turn faint grey.
  Traffic focus keeps the colours, a little thinner. The separate `links-selected` layer is gone.
  Legend: `mt_lg_link_strong` is now "länk: röd sällan, grön ofta", `mt_lg_link` "länk, antal
  inte känt än", new `mt_lg_link_bg`. **A region behind a Beacon proxy must allow
  `/api/v1/nodes/{id}/neighbors`.**
- **Colour-blind mode**: an eye button in the header next to the light/dark one ("Färgblindsläge",
  new i18n key `cvd_toggle`) switches the site to Okabe–Ito colours, remembered per visitor
  (`localStorage` "cvd", `html[data-cvd="1"]`) and applied before the first paint. In both themes:
  OK/heard/online blue instead of green, warnings orange, caution yellow, danger purple instead of
  red (text at least 4.5:1 on the page and surface colours); tip and warning boxes; on the maps the
  link ramp blue → purple → orange, active nodes blue, the observer ring purple, the dead-zone
  hatch orange, route colours without red and green, and the host wizard's field and pin blue
  (its help text then says "Det blå fältet", new key `hp_where_help_cvd`). The coverage ramp stays
  violet: it differs in lightness. The maps redraw when the mode changes, like a theme switch;
  the legend's colour words follow (`mt_lg_link_strong_cvd`). New `assets/js/cvd-toggle.js`,
  `assets/js/map/palette.js` (`palette(theme, cvd)`), the CSS at the end of `main.css`. The
  wizard pickers now also redraw their repeaters, border and field after a theme switch.
- **For sites with a CSP: the motion inline script in `head.html` changed** (it now also sets
  colour-blind mode, in every style). In `static/_headers` replace
  `'sha256-TqMKj+v8C5EDDfQu3sqNM75+V004RIrc0fWJ7sfhpqw='` with
  `'sha256-baA9qojJ3UDpPMd2+kFcIgQNuTH5DT4LpY+8TMIdh40='` (minified build). The theme script's hash
  is unchanged.

## v0.33.0 — 2026-11-15

- **Places wanted for new repeaters**: new optional `[[params.wanted]]` with `name`, `lat`, `lon`
  and an optional `note` (inline Markdown). "Bli nodvärd" lists the places by name (a name moves
  the wizard's map to the place) and its map shows them; the home map gets a toggle "Önskade
  platser" (off by default, `want=1` in the URL, a legend entry while on) drawing a circle 1 km
  across with a small gold star at each place, and a popup with the name and note. Works with and
  without Beacon. Unset: nothing changes. New partial `wanted.html`, module
  `assets/js/map/wanted.js`, i18n keys `map_wanted`, `mt_lg_wanted`, `mt_want_popup`,
  `hp_wanted`, `hp_wanted_help`. A region with its own `map.html`, `mappick.html` or
  `wizard-host.html` override copies the new `data-wanted` lines to get the feature.

## v0.32.0 — 2026-11-15

- **Region borders on the wizard maps without a live Beacon**: new optional `params.region.borders`
  (a Beacon base URL, e.g. `"https://beacon.meshat.se"`). With it and no `params.beacon.url`, the
  build fetches the borders of `region.iatas` and the repeaters' positions (`beacon-snapshot.html`)
  and the position picker (quick, guided and host wizards) reads them from one small fingerprinted
  file, `region/pick.json` (`data-pick`): the dashed border, the repeaters as dots, the map locked to
  the region, and the host wizard's inside/edge/outside verdict. A failed fetch warns once and the
  wizards work as before. Unset: nothing is fetched. A site with `beacon.url` is unchanged.
- `params.naming.place`: the example in the wizards' place field. The Swedish placeholder no longer
  names Taberg for every region: "en välkänd plats, till exempel {place}", or "en välkänd plats"
  without one (`wz_place_ph` takes `.Place`, sv and en). **Jönköping: add `place = "Taberg"` to
  `[params.naming]` to keep the text.**
- **No Jönköping examples where the region's own belong.** The firmware guide's test channel
  example is the region's (`#test-{{</* region "scope" */>}}`). The naming guide's "skip å, ä and ö"
  tip takes its example from `params.naming.place_accented` and `place_ascii` (new shortcode
  `{{</* naming-ascii */>}}`, i18n `naming_ascii_example`), and gives none without them
  (**Jönköping: `place_accented = "Bråneryd"`, `place_ascii = "Braneryd"`**). The solar guide's
  method names the region's own calculation point (`{{%/* solar "point" */%}}`), and the numbers
  that really are Jönköping's (the December bullets, the cold-panel table, the 47 days) say
  "referensfallet Jönköping".
- **The old IATA test channel (`#test-<iata>`) is named only where it is used.** The troubleshooting
  entry on auto-replies outside the county's test channel (now titled "Auto-svaret svarar inte i
  länets testkanal") names it through the new shortcode `{{</* legacy-test */>}}` only when
  `params.channels` lists `#test-<first iata>` (Jönköping's `#test-jkg`: no change needed); other
  regions read "i en äldre kanal som ingen här lyssnar på". New i18n keys `legacy_test_named`,
  `legacy_test_unnamed`.
- The wizards' name prefix falls back to the region's scope when `params.naming.pattern` is unset
  (`se-vgr` → `SE-VGR-`, `se05` → `SE05-`; not for the bare `se`). New partial `name-pattern.html`.
- The channel lists (landing page and `{{</* channels */>}}`) no longer put a `*` after a channel with
  `autoreply = true`; newcomers read it as part of the name. Only the footnote line "* Kräver
  auto-reply firmware ↗" stays. The `.ch-ar-mark` rule is gone: **a region whose `home.html`
  override copied the `<span class="ch-ar-mark">` from v0.31.0 removes it.**
- The guided wizard's nine steps stay on one line at every width: when the labels do not fit, only the
  step numbers show, evenly spread, with each label kept for screen readers and as a tooltip; a wide one
  shows number and label, tighter than before. Which one is measured (`.wz-compact`), so it holds for
  any language.

## v0.31.0 — 2026-11-15

- The auto-reply notice is now **one line under the channel list** (landing page box and
  `{{</* channels */>}}`), "* Kräver auto-reply firmware ↗", not underlined, with a `*` after each
  channel that has `autoreply = true`. `channel-autoreply.html` now takes the channel list: a region
  whose `home.html` override called it per channel calls it once after `</dl>` with
  `site.Params.channels`.

## v0.30.0 — 2026-11-15

- `params.channels`: `autoreply = true` on a channel adds a small, muted line **Kräver auto-reply
  firmware** under its text, on the landing page and in `{{</* channels */>}}`, linking the firmware
  picker's auto-reply update (`params.firmware.picker` + `#f=ar&install=update`). New i18n key
  `ch_requires_ar`; new partial `channel-autoreply.html` (a region that overrides `home.html` calls
  it after the note).

## v0.29.0 — 2026-11-15

- **MeshMapper coverage on the map** (README "MeshMapper coverage"): with
  `[params.meshmapper] coverage = true` and the region's MeshMapper key in `HUGO_MESHMAPPER_KEY`,
  the build fetches the region's measured coverage (last `days`, default 180, the region's radio
  setting) into one compact file, and the map gets a **Täckning** toggle, off by default and
  loaded on first use (`?cov=1`): four reliability bands in one violet ramp per theme, squares
  older than 90 days fainter, a **Döda zoner** toggle with a muted-red hatch (`?dead=1`), a popup
  per square, legend entries and the credit "Täckning: MeshMapper" while it is on, and a line
  under the map with the date measured. Works without Beacon. No key or no `coverage`: nothing is
  fetched. `params.meshmapper.fixture` reads a saved response (tests, the example site).
- `params.meshmapper.url`: the region's MeshMapper map, linked under the map and in a new section
  of the guide "Visa på kartan" (`{{</* meshmapper */>}}`), which also explains the coverage and
  how to contribute.
- `MapPanel`: toggles shown only while another is on (`showWhen`), legend entries shown only while
  their layers are on (`when`); the legend hides when empty.
- New i18n keys: `map_coverage`, `map_dead`, `map_coverage_measured`, `map_coverage_hint`,
  `map_meshmapper_note`, `mm_title`, `mm_text`, `mm_link`, `mm_layer`, `mm_contribute`,
  `mt_cov_*`, `mt_lg_cov`, `mt_lg_cov_old`, `mt_lg_cov_dead`. A region that overrides
  `i18n/*.toml` gets the template's texts for them until it adds its own.
- Map pills wrap before the zoom buttons; the coverage ramp is lighter on the dark map.

## v0.28.0 — 2026-11-15

A modern-web-guidance pass (Google Chrome's guides for coding agents) over the whole template;
`legacy-scan` goes from 2 findings to 0. Nothing changes what the wizards produce.

- **Theme and type:** contrast fixes for text on the accent colour, error text, light-mode
  warnings and text-field borders (new `--field-border` token); `<meta name="color-scheme">`
  kept in step with the toggle, which can now return to following the system; body text in
  rem; em breakpoints; text-wrap balance/pretty; accent-color; forced-colours support.
- **Wizards:** Enter no longer reloads the solar calculator; steps, sliders and radio
  questions are announced properly; quieter live regions; Send shows what to fix instead of
  being greyed out; no autocorrect on passwords and codes.
- **Navigation and components:** the menu folds into ☰ when it no longer fits (measured);
  the phone menu is a native popover (`@oddbird/popover-polyfill` 0.7.3 where missing);
  focus no longer changes corners; breadcrumbs as a list; Markdown tables in a focusable,
  named scroll box (render hook, new i18n key `table`); a loading ring for the map; no
  sideways scroll at 200 % text.
- **Motion and loading:** reduced motion honoured on the live map and the background; a
  footer button pauses the background motion (new i18n keys `motion_stop`, `motion_start`);
  MapLibre's stylesheet loads with the map; scroll-driven parallax; lower priority for
  analytics and background fetches; preconnect to Beacon.
- **For sites with a CSP:** the inline scripts in `head.html` changed (theme script, new
  motion script); update their sha256 hashes.

## v0.27.2 — 2026-11-15

- Regions guide links to meshcore-se-regioner (contributed by Fredrik Melén, PR #1). v0.27.1 was
  tagged before that merge and lacks it.

## v0.27.1 — 2026-11-15

- Region list copy refreshed from meshcore-se-regioner db6cfa7: Skåne is `se12` (measured; the
  share rule now leaves out international traffic), was `se-ska` (proposal).

## v0.27.0 — 2026-11-14

- Region photos: `{{< region-photo "key" >}}` shows a photo from `params.photos.<key>` (src under
  the site's assets, alt, caption, credit) as WebP at up to two widths, never enlarged, metadata
  dropped; nothing when the region has none. Spots added on Bli nodvärd (`host`) and in the
  repeater guide under "Välj plats" (`mount`).

## v0.26.0 — 2026-11-14

- New wizard "Bli nodvärd: testa din plats" (/wizard/nodvard/): questions about height, view,
  power, Wi-Fi and radio shadow plus a map step. Coverage is drawn as a circle of
  `params.host.edge_km` (default 2 km) around each repeater; outside them all is the edge. The
  result lists strengths and tips, never a grade, and ends with a summary to copy into the
  region's chat (position rounded to about 1 km), the contact links and the setup guide.
  Linked from the Bli nodvärd page.
- The map picker takes an `onNodes` callback; the contact links are a partial
  (`contact-links.html`) shared by `{{< contact >}}` and the wizard.

## v0.25.1 — 2026-11-14

- Solar calculator data v4: Jönköping is computed at the rounded public point 57.78, 14.16 (317
  need values moved by at most 8.3 mAh; no table figure and no calculator result changed). The
  reference script (v2) reproduces it exactly. The methods page now says so.

## v0.25.0 — 2026-11-14

- Solar calculator: a methods and verification page at /wizard/solcell/metod/ (B.1–B.16: model,
  data, checks, limitations, test vectors, sources), linked only from the calculator, kept out of
  lists and the sitemap. Downloads the reference script and the calculator data with their sha256,
  computed at build time.
- Solar guide: the ±15 % claim and the "independent rewrite" paragraph corrected to match the
  methods page.
- Long bare URLs in page text now wrap instead of widening the page on phones.

## v0.24.1 — 2026-11-14

- Privacy: Jönköping's point in the solar data is rounded to 57.78, 14.16 (it was the project's own
  site to about 100 m) in the served calculator data and data/solar.toml. No calculation uses it.
- Solar calculator sizes to the larger of the central and the high value (for a few 0.5–3 W panels
  "high" was the smaller), and shows "not enough" when either says no battery is enough.
- A note at the panel slider: the figures hold for a 6 V panel with the charger at 5.0 V.

## v0.24.0 — 2026-11-14

- Solar calculator: smaller panel steps. The slider is 0.15, 0.5, 1, 1.5, 3, 5, 10 … 100 W (default
  still 10 W), from the solar session's data v3 (solar-009, sha256 f95a993f…6b9a; values for the sizes
  already there are unchanged). 0.15 W is "not enough even in summer" everywhere. Decimal comma in
  the panel figure.

## v0.23.7 — 2026-11-14

- "Starta en sida för din region" shows no lead line under the title.

## v0.23.6 — 2026-11-14

- "Bli nodvärd" shows no lead line under the title.

## v0.23.5 — 2026-11-14

- Scopes, channel names and other short code items without spaces never break across lines.

## v0.23.3 — 2026-11-14

- Every table aligns its cells to the top, not the middle (checked: 238 cells on all pages; the
  guided wizard's comparison table follows too).

## v0.23.2 — 2026-11-14

- Solar calculator: no map. The data has one point per county, so a position inside the county
  changed nothing; the calculator uses the region's own county and says which (three steps now).
- Troubleshooting entries show no lead line under the title (cascade in content/felsokning/_index.md);
  the list keeps each description.

## v0.23.1 — 2026-11-14

- The map guide (now "Din repeater på kartan, och som observatör") says first that a repeater does
  not have to be an Observer to show on the map: it shows once an Observer hears its advert (checked
  on Beacon: several JKG repeaters on the map have `isObserver: false`). Being an Observer adds what
  it hears. The FAQ answers say the same; links follow the new title.

## v0.23.0 — 2026-11-14

- Notice boxes show their level with an icon at the start of the title: blue information (NOTE, TIP),
  yellow warning (IMPORTANT, WARNING), red critical (CAUTION), shape and colour both, always with
  the text; critical boxes get a red tint. Three boxes' types corrected to match their content.
  Fold-out notices put their open/closed marker at the end of the title line.
- "Solnoder" opens with a pointer to the solar calculator.

## v0.22.0 — 2026-11-14

- Guide lists: the number on the title's line ("01 Vad är MeshCore?"), long titles wrap under the title.
- Front page: the text columns share the boxes' and the map's width; one column per "##" laid out by
  count (all side by side from 1200 px, two by two from 720 px); the community box is gone (its links
  are in the footer, and a region can add a "Gemenskap" column); four boxes with "Nätet" last and widest.
- "Vad är MeshCore?": Observatör before Room server, and room servers explained, including that they
  are hard to get working reliably (known MeshCore faults, autumn 2026).
- Code boxes: a copy button, top right, on hover, keyboard focus and always on touch screens.
- Swedish compounds get hidden break points (soft hyphens) from `data/hyphenate.toml`, applied in the
  content pass (`scopes.html`); search still finds the words. `scripts/long-words.sh` lists long words
  still without one.
- `site.Data` → `hugo.Data` (deprecated in Hugo 0.156).

## v0.21.0 — 2026-11-14

- `{{< contributors >}}`: one list of the people behind the site's content (backlog B-258), from the
  GitHub contributors of `params.contributors.repos` at build time, plus `params.contributors.people`
  for work outside git. Bots and AI agents are left out (`data/contributor_deny.toml`, about 80
  entries, matched on the login and its parts; GitHub's bot type), and `exclude` honours opt-outs.
  A person in two repos appears once. Tested offline on the example site with a fixed list.

## v0.20.2 — 2026-11-14

- Solar guide corrections from the solar session: the sun dates behind 20° and 15° tree lines
  (to mid-February; about 10 November to early February), the panel-voltage step without the
  12–13 V / 10.0 V branch, and "daily need" defined in the formula.

## v0.20.1 — 2026-11-14

- Solar: the Norrbotten notice no longer quotes a figure from the first calculation.

## v0.20.0 — 2026-11-14

Solar figures corrected (the solar session's model v2, `solar-006`, sha256 6d7b57f2…9b2d):
- The first figures were too optimistic everywhere: the guide's CN3791 set-point of 5.6 V starts
  the charger only in fairly bright light with this panel (about 6.4–6.6 V open circuit, not 7 V).
  Everything is now modelled hour by hour at **5.0 V**; expected values rise 5–20 % with an open
  horizon and 23–55 % behind a 20° tree line, the pessimistic end about doubles.
- Calculator: new data; snow and frost allowance (2/4 days south of 60° N, 5/8 north, sheltered /
  exposed) added before the margin, with an "utsatt höjd" option; a notice north of 63° N; the
  5.0 V setting in the build notes; cell maximum from tree lines up to 30° at the default margin.
- Guide: tables at 50 % margin, rounded up, with a 50° row; the short answer recommends for the
  pessimistic case; 5.0 V (and how to trim it by measurement), panel voltage 6.0–6.6 V, an
  optional dim-light measurement, a snow and frost section, the corrected formula.

## v0.19.3 — 2026-11-14

- Solar calculator: the margin starts at 50 % instead of 20 %.

## v0.19.2 — 2026-11-14

- Solar guide: never fewer than two cells, like the calculator. The short answer recommends at
  least 6 000 mAh, the requirements say "minst två celler", and the old "3 000 mAh is the practical
  floor" is replaced.

## v0.19.1 — 2026-11-14

- Solar calculator: never fewer than 2 cells (the charger gives up to 2 A, a Biltema cell takes
  1.5 A), and the result says when that minimum decides the count.

## v0.19.0 — 2026-11-14

- New wizard **Räkna på solcell** (`/wizard/solcell/`): pick the place (→ county), tree line
  (inga träd, 10, 15, 20, 30, 50°), firmware, and whether someone brushes snow (only then 60°/40°
  tilt). Sliders: panel 1–100 W real output, Biltema 3000 mAh cells (max follows the county's worst
  case), margin 0–100 %. The slider touched last is held, the other follows; when it cannot, a
  red warning says what is needed ("kräver en panel på 150 W", "kräver 27 celler", "ingen
  panelstorlek räcker", "panelen räcker inte ens på sommaren"). Sized to the model's pessimistic
  value × margin; capacity per cell editable. Data: `assets/data/solar-calc.json` from the solar
  session (sha256 2deb946d…fe8b), never extrapolated. Logic in `wizard/solar.js`, tested,
  including that 10 W reproduces the published Jönköping table.
- New colour token `--danger` for warnings. The solar guide links to the calculator.

## v0.18.2 — 2026-11-14

- Solar guide: the Clas Ohlson panel's stated and measured figures, and what to look for in another
  panel (real output, voltage that suits the charger, measure it yourself).

## v0.18.1 — 2026-11-14

- The solar guide is published (no longer a draft).

## v0.18.0 — 2026-11-14

- Solar guide (still a draft): battery figures for all 20 county map codes in `data/solar.toml`,
  from the same simulation as Jönköping's (sha256 66f16a36…0391), unchanged. Each county is told
  the point and latitude its numbers are for; Norrbotten is marked as another data source
  (PVGIS-ERA5), and the four northern counties and Dalarna get a caveat (cold below −20 °C, rime,
  snow height; Norrbotten: solar not practical). New label *inte ens utan träd* where a battery
  does not survive even without trees; the no-trees row means the local terrain only.
- The YYCMesh note is corrected: a Meshtastic network in Calgary; about 6 % capacity loss on one
  cell; useful for cold tolerance, not for sizing (51° N).

## v0.17.0 — 2026-11-14

- New guide **Solnoder** (`/guider/solnoder/`), still a draft: why a repeater on solar, why winter
  is hard, what it needs (panel, battery, charger, firmware), battery tables, a field test.
- The region-specific numbers come from `data/solar.toml`, keyed by the region's first map code,
  through `{{%/* solar "where|short|irradiation|trees|capacity" */%}}`. Only Jönköping (JKG) has
  figures so far; other regions are shown those, with a notice saying so. Numbers are never scaled
  or interpolated in the template.

## v0.16.0 — 2026-11-14

**Breaking:** the wizards moved from `/verktyg/` to `/wizard/` (content/wizard/), with no
redirect. Regions: change the menu entry's `pageRef = "/verktyg"` to `pageRef = "/wizard"`.

## v0.15.2 — 2026-11-14

- *Skaffa hårdvara*: "en antenn gjord för 868 MHz".

## v0.15.1 — 2026-11-14

- Region names (`se`, `eu`, `europe`, `se-<county>`) are fixed width and in the strongest text
  colour wherever they are named: in content (a `<code>` holding just the name gets
  `class="scope"`, partial `scopes.html`), and in the settings card, footer, channel table and
  wizards. `naming.explain` may now hold Markdown.
- The tools section is called *Wizards* (menu, section title, mentions); its address stays
  `/verktyg/`.

## v0.15.0 — 2026-11-14

- Front page: *Vad är MeshCore?* and the region's own text now come above the map, not below.
- Each `##` section of the region's `content/_index.md` is a column of its own beside *Vad är
  MeshCore?* (three side by side from about 64rem, stacked on a phone). A region adds a column by
  adding a heading; text before the first heading is a column too. Class `about-two` → `about-cols`.

## v0.14.3 — 2026-11-14

- Every clickable element shows the pointing hand: one rule for summaries (fold-outs such as
  *Kommandona, för att klistra in själv*), buttons, labels, checkboxes and the wizard's step
  list; text fields keep the text cursor. 23 elements lacked it, most in the guided wizard.
- The guided wizard's password step has an optional **guest password**: what a guest can do
  (read status, basic telemetry and neighbours, change nothing), that it is empty by default
  (anyone can then log in as a guest), and that guest access is considered safe. Sent as
  `set guest.password`, up to 15 characters.
- "Med administratörslösenordet kan man ändra inställningar i repeatern".
- *Testa innan montering*: if the repeater does not show, a flood advert from a companion near
  it makes the repeaters around hear it, and lets nearby Observers discover a repeater that is
  not one itself.

## v0.14.2 — 2026-11-14

- Duty cycle, in the guided wizard and the repeater guide: 10 % is an EU requirement in
  869.4–869.65 MHz, and a repeater that transmits too much drowns out its neighbours.

## v0.14.1 — 2026-11-14

- Wizard checkboxes sit at the first line of a long label, and the label is normal weight with only
  its lead word bold (*Kantrepeater*, *Off-grid*).

## v0.14.0 — 2026-11-14

- Both repeater wizards have an **Observatör** step (step 5 in the quick one, step 5 of 9 in the
  guided one): a short explanation with a link to the map guide, a box, and, when it is ticked,
  wifi name and password and the map code. The wizard then sends `set wifi.ssid`,
  `set wifi.pwd` (not for an open network), `set mqtt.iata` and `set mqtt1.preset
  <params.observer.preset>`, checked against the Observer firmware's limits (31, 63, 7).
- The map code is filled from the county the picked position lies in (or within 25 km of),
  from the new `params.observer.iatas` (Beacon's code per county; the region's own
  `region.iatas` wins for its county). The owner can type another.
- The regional-broker option moved into the Observer step; it reports under the Observer's code.
- The text above the wizard maps says a click within 200–300 m is enough for privacy, and why
  not further.

## v0.13.1 — 2026-11-14

- The wizards name missing or wrong fields in the page's language (*Fyll i: namn, adminlösenord*),
  not by their code names.

## v0.13.0 — 2026-11-14

- No lead line under the title on Felsökning, Frågor, Verktyg and the three wizard pages (as on
  the guides since v0.12.12). `lead: false` now works on section pages too.
- `{{< domain >}}` prints the site's own address 5 % larger and in the strongest text colour
  (black in light mode, white in dark), new token `--strong`.
- Repeater names: the key's four characters are opt-in. Both wizards have a checkbox for them,
  off by default ("only needed when several repeaters stand at the same place"); a pattern that
  still ends in `ABCD` ticks it by default. The naming guide and the example site say to use a
  well-known place. Regions: drop `-ABCD` from `naming.pattern` and `naming.example`, and say
  in `naming.explain` when the key is needed.

## v0.12.12 — 2026-11-14

Visitor feedback:
- The "Nätet" card: one-line labels *Repeatrar*, *Observatörer*, *Paket/dygn*. Observers are
  counted on their own, of any node type (a companion can be an observer), not as a share of the
  repeaters. The three columns size to their labels.
- The narrow menu closes on a tap outside it, or on Escape.
- Guides show no lead line under the title (it repeated the first paragraph); the description
  still goes in the meta tags and the guide lists. Set by a cascade in `content/guider/_index.md`.

## v0.12.11 — 2026-11-13

- The firmware guide names `v1.18.0-lou-16` as the latest version.

## v0.12.10 — 2026-11-13

- The naming guide is *Namnge din repeater* (same address), with its own section *Namnge din
  companion* at the end. The naming box no longer carries the companion line.

## v0.12.9 — 2026-11-13

- The naming guide says once, not twice, that companions are named freely.

## v0.12.8 — 2026-11-13

- The naming suggestion is for repeaters: *Namnförslag för repeatrar i …*, and the box, the
  naming guide and the companion guide say a companion is named however its owner likes.
- `{{< namecheck kind="companion" >}}` no longer falls back to the repeater example; its
  placeholder is `naming.companion_example` or empty. Regions: drop the pattern from
  `companion_example` (the example site's is now `Kim`).

## v0.12.7 — 2026-11-13

- The region's naming pattern is a suggestion, not a rule: *Namnförslag i …* in the naming
  guide and *Namnförslag i regionen:* in the wizards (English: *Suggested names*).

## v0.12.6 — 2026-11-13

- The firmware guide's first sentence: *modifierade varianter av Louie*.

## v0.12.5 — 2026-11-13

- The firmware guide is titled *Firmwarevarianterna av Louie*.

## v0.12.4 — 2026-11-13

- The map opens with traffic focus on, like live traffic and neighbour links. A link can turn it
  off with `?focus=0`; old links with `?focus=1` still work.

## v0.12.3 — 2026-11-13

- Links inside FAQ answers stay in the text: they had been their own lines, the arrow and any
  full stop after them too (the list-row link style reached them).
- `lead: false` in a page's front matter hides the lead line under the title; the description
  still goes in the page's meta tags.

## v0.12.2 — 2026-11-13

- Troubleshooting entries page *Föregående*/*Nästa* within their own category.

## v0.12.1 — 2026-11-13

- FAQ page: the script that opens a linked question no longer throws when the URL has no
  `#anchor`.

## v0.12.0 — 2026-11-13

- **Troubleshooting** (`/felsokning/`): 27 entries in Swedish, one file each, grouped by category
  (flashing, radio, companion, repeater, regions, MQTT, power) with a filter box. A region adds an
  entry with its own file in `content/felsokning/`, replaces one with the same file name, and
  hides one with a same-named file holding `build: {render: never, list: never}`. Archetype:
  `hugo new felsokning/<name>.md`.
- **FAQ** (`/fragor/`): 23 questions, one file each, folded on one page, `#<name>` opens one;
  added, replaced and hidden the same way. The old page `/guider/fragor-och-ord/` redirects
  there; the glossary is now `/guider/ordlista/`.
- Menus are per site: add `/felsokning` and `/fragor` to your `menus.main` to show them.
- Flashing guide: the firmware page's *Flasha via USB* button, which file goes to which address,
  and what to do when the board restarts in a loop or still shows the old version.
- Dark map: repeater names white with a black halo; the off map buttons readable in both themes.

## v0.11.2 — 2026-11-13

- Map buttons show their state: on is a white background (80 %) with black text, off is
  transparent with dimmed text.

## v0.11.1 — 2026-11-13

- The front-page boxes and the map share one width from 640 px: `min(100rem, 94vw)` (the map
  was 80vw, the boxes up to 96vw).

## v0.11.0 — 2026-11-13

- **Front page: five boxes.** The guides and the guided settings are separate boxes, and so are
  the community links and the MeshCore channels. Five side by side from 1200 px, in a row up to
  96vw wide; fewer columns below that. A box with nothing to show is left out and the numbers
  follow.
- **Settings box:** frequency, bandwidth, spreading factor and coding rate are indented under the
  preset with italic labels: they are what the preset means.

## v0.10.0 — 2026-11-13

- **Wizards follow the updated wizard rules** (shared with meshat.se):
  - the admin password is **required** (a new repeater's is `password`);
  - `set flood.advert.interval 47` (the firmware default) is sent;
  - new **off-grid** box: adds the region `offgrid` under the county and sends `powersaving on`;
    unticked, power saving is left alone. New i18n key `wz_offgrid`.

## v0.9.0 — 2026-11-13

- **Page "Bli nodvärd"** (`/bli-nodvard/`): for people with a roof, a mast or a high spot who
  could host a repeater: what places are needed, what it means for the host (power, no
  internet, weak radio), who does what, and how to get in touch. Linked from the footer.
- **Shortcode `{{< contact >}}`:** the region's community and chat links as an inline list
  (from `params.community`, `params.chat`, `params.chats`). New i18n key `or`.

## v0.8.0 — 2026-11-13

- **The wizard rules** shared with meshat.se: the wizards send `set flood.max.unscoped 16`,
  `region allowf *`, `region def eu|* europe|eu se <county>` (neighbours under `se`),
  `region home <county>`, `region default se`, `region save`. The region and repeater guides
  say the same and name repeater firmware 1.16 as the minimum. `region home` is where
  auto-reply firmware (MeshCore-lou lou-16) takes its test channel from; `se` as the default
  lets a repeater's own adverts reach the whole country.
- **Edge repeater is a choice:** a box, unticked, on every position. Ticked, the neighbour list
  shows with the counties within 40 km (80 km over water) preselected (new i18n key
  `wz_nb_edge`).

## v0.7.0 — 2026-11-13

- **Guides wider.** The reading column is 56rem (was 46rem), still starting where the logo
  starts, so a wide screen is no longer a third empty.
- **Map 50 % taller:** `min(90vh, 54rem)`, at least 27rem.
- **Settings box:** one labelled row each for frequency, bandwidth, spreading factor and coding
  rate (new i18n keys `set_freq`, `set_bw`, `set_sf`, `set_cr`), and more space between rows.
- **Map pills ranked by traffic** when zooming out: known neighbours plus the packets seen
  passing through a node since the page loaded; stale nodes go first.
- **`params.beacon.seeds`:** other Beacons for the same IATAs. Their nodes inside the region's
  border that ours has not heard yet fill the map (marked as known from another Beacon) until
  ours hears them. For a young Beacon, which only knows nodes that have advertised since it
  started.
- **`params.links`:** plain links in the footer's community column, next to the chats.

## v0.6.0 — 2026-11-13

- **The region's own MQTT broker:** new `params.observer.mqtt` (server, port, audience or
  username/password, slot). When a server is set, the quick and guided wizards offer to point
  one of an Observer's `custom` slots at it (the commands from the Observer firmware; the
  audience is always sent), with the 2-slot limit of boards without PSRAM explained, and the
  observer guide shows the commands (`{{< region-mqtt >}}`). Empty server: nothing changes.
- **AI-design review, iteration 2:** the theme button draws its icons (the text glyphs became
  emoji on phones); no glyph before "Sök"; the map legend follows the theme.

## v0.5.0 — 2026-11-13

- **Light and dark:** dark is now the base. Light comes from the system setting (no JavaScript
  needed) or from a new ☾/☀ button in the header, which is remembered and applied before the
  page paints. The map's basemap follows the choice. The console style stays dark.
- **The map in the site's language:** the legend, the node popup and the packet list take their
  texts from i18n (`mt_*` keys, Swedish and English), passed in through `#map`'s `data-texts`.
- New i18n keys: `theme_toggle`, `mt_*`.

## v0.4.0 — 2026-11-13

- **Design:** a second pass after a review against 32 common signs of AI-made sites
  (planning: ai-design-tells.md):
  - fonts IBM Plex Sans and IBM Plex Mono (self-hosted, OFL) instead of Inter and Space Grotesk;
  - a left-aligned hero without the badge; the three landing boxes sized to their content;
  - solid cards instead of frosted glass; three corner radii (4, 6, 10 px); no violet;
  - page text aligned with the header; guide and tool cards three per row on desktop;
  - background blobs 2.5× faster, with a 20 % scroll parallax.
- **Landing:** "Vad är MeshCore?" beside the region's own text (the body of
  `content/_index.md`); "MeshCore-kanaler"; an eased scroll from "Se kartan".
- **Map:** 80 % of the window wide; the legend open on desktop, closed on phones; mini mode
  follows resizes.
- **Wizards:** neighbouring regions ticked automatically from the position (county borders from
  Natural Earth, 40 km over land, 80 km over water); a "Det här ställs in" summary in the quick
  wizard; the tool cards show their descriptions.
- **New params:** `naming.companion_example` (falls back to `naming.example`).
- **English:** `i18n/en.toml`; select it with `locale` and `defaultContentLanguage = "en"`.
- **Maintainers:** MAP.md (how the map works); `scripts/beacon-contract.mjs` and a weekly
  workflow checking a Beacon has every endpoint and field the map reads.
- Removed i18n key: `badge_online`.

## v0.3.0 — 2026-11-12

- **The region comes from its county code.** Set `params.region.scb` (e.g. `"06"`). The template
  fetches the county name, its region (scope) and its neighbours' regions from
  zombiefredrik/meshcore-se-regioner at build time, with a bundled copy as fallback. Explicit
  params still win.
- **Wizards** under /verktyg/, generated by the template:
  - quick and guided repeater wizards over Web Serial (read back, review, apply; the position
    map locked to the region; neighbouring regions offered for edge repeaters);
  - a companion page with the app's values.
- **Map:** traffic-focus mode (small nodes, bright links, yellow flashes with bubbles along links
  when a repeater transmits).
- **Background:** a slow gradient with lighter blurred blobs.
- **Content:**
  - new guides: lou firmware variants, hardware, FAQ and glossary;
  - a page for other regions; site search (Pagefind);
  - a selectable style (`params.style = "console"`).
- **The operator's review:**
  - "Förinställning"; settings always visible;
  - external links in new tabs with ↗ (checked in CI);
  - `test` highlighted;
  - consistent repeater/observer counts;
  - "Välj din firmware här";
  - named chat links (`params.chats`).
- **SEO:** place-name titles, JSON-LD (WebSite, Organization, BreadcrumbList, TechArticle).
- **Docs:** `CI.md`, tool versions, `V1.md`.

Breaking: none. Regions should switch from `region.scope`/`region.name` to `region.scb`.

## v0.2.1 — 2026-11-12

Operator's review of v0.2.0:
- **Pills no longer overlap.** Each node is a circle at its true position, and its pill is nudged
  to a free spot around it. A pill that can't be placed is left out, and the circle stays.
- **Mini mode.** At or below the zoom where the region fills the map's width, nodes are circles
  only: green when heard recently, grey when stale, a blue ring with a centre dot for observers.

## v0.2.0 — 2026-11-12

Design direction D and the operator's review of the first deploy.
- **Look:**
  - design tokens (Vättern blue, pine green; light and dark);
  - self-hosted Inter and Space Grotesk;
  - a new landing page (badge, hero, numbered cards above the map);
  - designed guide pages with previous/next;
  - header, ☰ mobile menu and footer;
  - logo, favicon and OpenGraph image slots.
- **Map:**
  - MeshMapper-style pills with no clustering; framed on the repeaters;
  - one panel of pill toggles with a legend;
  - live node updates; shareable URL state;
  - lazy start on phones; a node list as its text alternative.
- **Numbers:** the Nätet card shows live counts from Beacon.
- **Guides:** companion, flashing, repeater, USB console, naming (with a name checker), channels,
  etiquette, showing on the map. Shortcodes `settings`, `channels`, `naming`, `namecheck`,
  `iata`. New params `radio`, `firmware`, `observer`, `naming`; `channels` gains `scope`
  and `note`.
- **Optional Plausible**, with the current snippet, same-origin and never on staging. A privacy
  page built from what is switched on.
- **SEO basics:** canonical URLs, OpenGraph, meta descriptions. A 404 page.
- **Accessibility:** skip link, focus outlines; axe clean (WCAG 2 A/AA).
- **Wizards:** the command generator core (pages come later).
- **CI:** override checks; hook partials `head-end` / `body-end`; THIRD-PARTY.md.

Breaking: `params.analytics.domain` is gone (Plausible's new snippet does not use it).

## v0.1.2 — 2026-11-12

- Fix: the map threw `borders is not defined` after loading nodes, so it neither framed the
  region nor started the live feed (introduced with the Beacon-unreachable fallback). Found in
  the fresh-repo test.

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
