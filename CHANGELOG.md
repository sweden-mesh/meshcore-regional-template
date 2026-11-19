# Changelog

Semantic versioning: a region pins a tag in its `go.mod`. **Major** = a region has to change
something (a param renamed or removed, a layout path moved). **Minor** = new features and
params with safe defaults. **Patch** = fixes and text.

## v0.71.0 — 2026-11-19

- Compact sticky header (operator 2026-11-19): scrolled past 48 px (off again under 32), only the logo
  and ☰ stay (menu.js `.is-compact`); search, county and the toggles come back at the top. The header
  browser check asserts it.
- Removed (operator 2026-11-19): "Största orterna" on the county front pages (CONTENT-SV-27; the
  `lan-towns.html` partial and its strings), and the county list under "Nätet i Sverige" on the national
  front page (SEO-SV-9; /lan/ lists them). The town data stays for the new-repeaters page.

## v0.70.2 — 2026-11-19

- `--header-h` follows the slim scrolled header (menu.js observes the border box; scrolled, only the
  padding shrinks, so the content box never changed), so a jump to a heading lands right under it. Checked
  in the header browser check.

## v0.70.1 — 2026-11-19

- The sticky header is slimmer once scrolled (operator 2026-11-19): 84 -> 56 px, padding 20 -> 6 px, over
  the same first 48 px of scroll; a matching margin below keeps the page from moving. The header browser
  check asserts it shrinks by at least 24 px.

## v0.70.0 — 2026-11-19

- The header is sticky (B-366, operator 2026-11-19, on trial): it stays at the top while the page
  scrolls. Its background (the page's base colour, full window width, with a hairline) fades in over
  the first 48 px of scroll where scroll-driven animations exist, so the top of the page looks as
  before. menu.js keeps `--header-h` at the header's real height, so jumps to a heading
  (`scroll-padding-top`) and the side table of contents clear it. The ☰ menu is `position: fixed`, so
  it opens under its button while scrolled. `scripts/check-header-browser.mjs` checks it at 320–1600 px.

## v0.69.1 — 2026-11-19

- The map's flash when a repeater transmits is 80 % transparent at its peak (`FLASH_OPACITY` in
  js/map/flow.js), so it no longer covers the map (operator 2026-11-19).

## v0.69.0 — 2026-11-19

- **The rest of the English version** (B-364): the solar method page in English
  (`/en/wizard/solcell/method/`); text fields in data carry their English beside them as `<field>_en`,
  read on English pages with the Swedish field as fallback (`data/solar.toml` `note_en`,
  `data/solar_boards.toml` `name_en`, and a national site's `data/lan` `text_en`, channels'
  `purpose_en`/`note_en`, `wanted` and `regions_extra` `note_en`, `naming.format_en`); the wizards write
  numbers with the page's decimal sign and digit grouping (`decimal()` in js/wizard/commands.js).
- **Translation status**: `scripts/translation-status.mjs [root] [--strict]` lists each Swedish page's
  translation as current, outdated (its Swedish `lastmod` is later) or missing; `check.sh` prints it,
  `--strict` runs before a release. README: Languages.
- **MECP** in "MeshCore när el och mobilnät går ner" and its English page (CONTENT-SV-32).
- Tables: a table's region name takes up to six column headings (two tables on the method page shared
  the first three: axe landmark-unique).
- CI: `COMPARE_BASE` moved to v0.69.0 (regional output changes on purpose: the crisis guide, table names,
  wizard scripts).

## v0.68.1 — 2026-11-18

- Anti-AI-design review 22: /nytt/ lists its posts without running numbers (`numbered: false` on a
  section); the radio values' and the packet counts' decimal sign follows the page's language
  ("869.618 MHz" in English, `mt_decimal`; `formatCount` in js/stats/stats.js).
- CI: `COMPARE_BASE` moved to v0.68.1 (regional output changes on purpose: /nytt/).

## v0.68.0 — 2026-11-18

- **Languages** (B-337): a site can add English under `/en/` with a `[languages]` block; Swedish stays at
  `/` with every address unchanged, and a site without English builds exactly as before. The template
  ships English translations of its guides, troubleshooting, questions, news and site pages in
  `content.en/` (mounted only for `en`), the county local pages' texts in `assets/lan/en/`, hardware and
  prebuilt-solar data in `data/*_en.toml`, and English variants of the privacy and solar shortcodes. The
  county and wizard pages are generated in every language. hreflang (sv, en, x-default → sv) in the head
  and in `/sitemap.xml`, which stays one urlset of every language (`sitemapindex.xml` overridden); a
  language link in the header and the ☰ menu (`css/lang.css`, multilingual sites only); links written as
  Swedish paths go to the reader's language; `og:locale` and JSON-LD `inLanguage` per language; national
  `_redirects` include `/en/` county addresses. README: Languages. **Hugo ≥ 0.153** (`sites.matrix`).
- **New repeaters** (B-363): a node without a position stays in its county's list (the county of its first
  map area) with the position "Okänd" and no map marker; no "Utan position" group.
- **Nytt i MeshCore** (CONTENT-SV-31): grouped by source (MeshCore, MeshMapper, MQTT Observer,
  EasySkyMesh), posts for MQTT Observer 1.18, MeshMapper app 1.4.2 and EasySkyMesh PowerSaving 18;
  `scripts/news-check.mjs` lists releases newer than the last post (four requests, at most daily).
- CI: `COMPARE_BASE` moved to v0.68.0 (regional output changes on purpose: the news posts).

## v0.67.0 — 2026-11-18

- **Map: "SE" toggle** (B-370): on a county's map (a county page in national mode, or a regional site
  with `params.map.seIatas`) a button "SE" under fit and fullscreen shows every map area's nodes,
  links and live traffic, as the Sverige map does (the soft overview and the dimmed borders follow),
  without moving the camera; off goes back to the county, also without moving. Only the map changes;
  `se=1` in the map's URL state. The live WebSocket is closed before the new subscription opens
  (`switchFeed`), so a toggle never leaves two. Pure helpers in `js/map/sescope.js`, unit-tested.
- **Snabbstart** (B-371..B-374): three short guides, `guider/snabbstart-companion`,
  `guider/snabbstart-forsta-meddelandet` and `guider/snabbstart-repeater`, in a new group "Snabbstart"
  above "Kom igång" on /guider/, linked from /kom-igang/.
- CI: `COMPARE_BASE` moved to v0.67.0 (regional output changes on purpose: the new guides and the map).

## v0.66.0 — 2026-11-18

- **New repeaters page** (B-362): the shortcode `{{< new-repeaters >}}` lists `data/new_repeaters.json`
  (written by the site's build; on meshcoresverige.se by `scripts/new-repeaters.mjs`) newest first, one
  section per county (`#lan-<scb>`; a node outside the simplified outlines goes to its nearest town's
  county, a possibly foreign one is left out), each node with its nearest SCB tätort, distance and
  direction ("3 km NV om Habo", "i Habo"), first heard, observer, firmware and hardware where known,
  and a map of the same nodes (`js/map/newmap.js`, no Beacon calls). National mode: each county page
  links "Nya repeatrar i länet" with its count, and the Sverige page links the page.
- **Sitemap**: a page with front matter `lastmodData: <data file>` is dated by that file's `at`.
- **County pages: the numbers in the HTML** (CONTENT-SV-30): repeaters, observers, packets per day and
  "Senast hörd nod" are rendered at build from the snapshot (`stats-build.html`), the live numbers
  replace them; the last-heard line is updated live in the visitor's time (`lastHeard`, unit-tested).
- **County pages: the largest towns** (CONTENT-SV-27): up to five SCB tätorter with the repeaters on the
  map within 10 km, linked to an area page where the site has one.
- **Data**: `assets/data/tatorter.json`, SCB's tätorter 2023 (name, county, municipality, population,
  centroid, radius of equal area), made by `scripts/tatorter.py`; credited in THIRD-PARTY.md.
- **Structured data** (SEO-SV-31): a county's local page has the county as its second breadcrumb.
- **Header on phones**: the county button now gives way with an ellipsis, so a long county name
  (Västra Götaland, Västernorrland, Södermanland) no longer pushes ☰ off screen at 320–460 px.
- CI: `COMPARE_BASE` moved to v0.66.0 (regional output changes on purpose: the header CSS and the
  build-time numbers); the new-repeaters page is left out of the county-switch browser check.

## v0.65.3 — 2026-11-18

- CI only: `COMPARE_BASE` moved to v0.65.2, whose header CSS changes regional output on purpose. No
  site output changes.

## v0.65.2 — 2026-11-18

- **Header on narrow phones** (B-351 follow-up): "Välj region" is wider than "Välj län", so at 346 to
  358 px (352 px, or 432 px at 125 % zoom) ☰ ended 1 to 7 px outside the screen. The search button
  (also in the ☰ menu) now folds below 22.4em instead of 21em. Caught by `check-header-browser.mjs`.

## v0.65.1 — 2026-11-18

- CI: `scripts/check-national-browser.mjs` leaves area pages (B-360) out of the county-switch check:
  they name their county's values on purpose, whatever county is chosen. No site output changes.

## v0.65.0 — 2026-11-18

- **Map: a stronger transmit flash with a white blurred centre** (B-349): halo, core and ring larger
  and brighter, and a white blurred centre (`flow-flash-white`) drawn above every node layer, kept on
  top after a theme switch or redraw (`needsRaise`, unit-tested).
- **Map: muted links in live traffic** (B-350): while Live-trafik runs, links with nothing selected are
  drawn at 0.35 of their opacity (`linkStyle` `muted`, `MUTE`); a selected node's own links keep full
  strength. When a repeater transmits, every drawn link of it flashes in its own colour brightened
  toward white (`linkEnds`, `brighten`); with the links off, its neighbours in white as before.
- **Map: the soft Sverige overview somewhat stronger on the light basemap** (B-352): 0.3 for nodes and
  0.15 for links below zoom 7; the dark map keeps 0.12/0.06 (`softLevels`).
- **"Region" in the header** (B-351): the county button reads "Välj region", its label "Region: …", the
  dialog "Välj din region" (i18n `lan_pick`, `lan_toggle`, `lan_modal_title`, sv and en). County names
  are unchanged.
- **Area pages** (B-360, national mode): a page with an `area` key (SCB code) is listed on /lan/
  ("Söker du en stad eller ett område?", i18n `lan_areas`) and has no pager; shortcode
  `{{< lan-area "14" … >}}` lists each county's page, region and test channel. Aliases with å/ä/ö are
  written percent-encoded in `_redirects`, and `params.redirects` ([[from, to], …]) adds more 301s.
- **New guide: Room server** (CONTENT-SV-24): what it is, when it fits, set-up, login, the known
  limits, alternatives; linked from the glossary, and the note on Vad är MeshCore? matches it.
- **No layout shifts from late content** (UX-SV-15): the wizards' county selector is in the page from
  the start and shown before paint when no county is chosen (`@media (scripting: enabled)`), the solar
  calculator hidden before paint in that case (CLS 0.114 → 0 at 390 px); the packet list under the map
  is in the layout from the start with a fixed height and "Väntar på första paketet…" (front page CLS
  0.095 → 0 at 390 px); a metric-matched mono fallback ("Plex Mono Fallback") and no
  `font-size-adjust` on code.
- **Header links at least 24 px tall** (UX-SV-16), header height unchanged.
- Content: titles within 60 and descriptions within 70–160 characters on 16 pages (SEO-SV-17); the
  solar guide's LiFePO4 datasheet link moved off a dead staging host (SEO-SV-18).
- No inline script changes: **no CSP hash changes**. Map script changes: `COMPARE_BASE` moved to v0.65.0.

## v0.64.1 — 2026-11-18

- **Map: the national overview drawn soft** (B-347, operator 2026-11-18): the look the operator saw
  after picking a packet in the list under the map (every other node at 0.12 opacity, every link at
  0.06, `applyPick`), and wanted as the normal look, is now the Sverige view's look below zoom 7 when
  no packet and no node is picked: faint nodes and links, so the transmission flashes stand out. From
  zoom 7 in, and on a county page or a regional site (one border), nothing changes. `pickPaint` takes a
  `soft` flag.
- No inline script changes: **no CSP hash changes**. The map's script changes (a regional site draws
  as before, one border): `COMPARE_BASE` moved to v0.64.1.

## v0.64.0 — 2026-11-18

- **No county dialog by itself** (B-343): a visit where nothing has chosen a county reads Sverige and
  is not interrupted; the county dialog opens only from the header's county button (replaces the
  automatic opening of UX-SV-D1; sessionStorage `lan-skip` is gone).
- **"Välj din region här!"** (B-344): national mode, for a visitor who never chose a county (nothing
  stored; choosing Sverige in the dialog counts), a large pointer under the header's county button,
  only at scroll position 0. Hidden while the ☰ menu, a dialog or a focused control outside the header
  is around; gone once a county is chosen. Placed by script inside the header (no layout shift, first
  shown once the header has settled), from 245 px up; a click opens the dialog. New i18n `lan_tip`.
  `menu.js` ignores it when deciding to fold the header. `scripts/check-header-browser.mjs` checks it
  on a fresh visit from 245 to 1600 px, light and dark.
- **Sverige Gemenskap column** (B-345): the national chats and links tagged "Nationell" (i18n
  `lan_se_national_tag`), and between the text and the links a paragraph pointing at this template
  (`lan_se_template`). `[[params.links]]` take an optional `footer` name, used in the footer and the
  `gemenskap` shortcode where `name` is short.
- **Map: fullscreen** (B-346): a fullscreen button under the fit button (i18n `mt_fs_enter`,
  `mt_fs_exit`): the Fullscreen API on the map's element, prefixed where needed, else the map pinned
  over the viewport (an iPhone), Esc leaves; the map resizes in and out. The fit button's icon is a
  square drawn as its four corners.
- **Map: a stronger transmit flash** (B-347, operator 2026-11-18): a yellow halo, a yellow core with a
  white edge at full strength and an amber ring that spreads out, all larger zoomed out, so a
  transmission reads over the repeaters' blurred glow at national zoom. The glow itself is unchanged.
- **Map: dimmer county borders when more than one is drawn** (B-348): the national Sverige view draws
  its borders at 0.3 opacity and 1 px; one border (a county page, a regional site) stays 0.7 and 1.5 px.
- **Kolla platsen**: landscape screenshots, the sources section removed (operator 2026-11-18).
- No inline script changes: **no CSP hash changes**. Regional output changes (map JS, menu.js, CSS):
  `COMPARE_BASE` moved to v0.64.0.

## v0.63.1 — 2026-11-18

- **The ☰ menu opens under its button** (B-341): the panel was placed against the viewport's right
  edge, and below about 370 px (a 320–360 px phone, or 125 % zoom under 460 px) the header row was
  wider than the screen, so ☰ sat past the edge and the menu opened up to 156 px to its left. The
  panel is now anchored to ☰ (CSS anchor positioning, flipped to the button's left edge at the screen
  edge; `menu.js` places it the same way where anchor positioning is missing), and the narrow header
  fits down to 245 px: tighter gaps below 24em, the search button left to the menu's Sök below 21em,
  the county button's label (still its accessible name) below 19em. Opening moves focus to the first
  link; Escape closes and returns focus to ☰. `scripts/check-header-browser.mjs` checks the opened
  menu from 320 px up at 100/125 % zoom, light and dark.
- **The region-proposal note only on the regions guide** (B-342): no longer on every guide with county
  values, nor in the county page's region box or the /lan/ list; the remaining line is neutral
  ("Regionen … är ett förslag från listan över regioner."). `lan_proposal_note` removed.
- No inline script changes: **no CSP hash changes**. Regional output changes (header CSS and JS):
  `COMPARE_BASE` moved to v0.63.1.

## v0.63.0 — 2026-11-18

- **Kolla platsen med MeshMapper** (B-339): a new guide `/guider/kolla-platsen/` in the repeater group:
  the Tools menu, Antenna Coverage step by step (27 dBm/500 mW ERP the most allowed, never 30 dBm/1 W),
  reading the coverage map, Line of Sight, Scope Finder, Coverage Timeline and wardriving afterwards;
  from MeshMapper's wiki in our own words, with three screenshots. Linked from Sätt upp en repeater.
- New shortcode `{{</* screenshot src alt caption credit */>}}`: an image under `assets/`, served as
  WebP at two widths with a caption.
- No script changes: **no CSP hash changes**. Regional output changes (a new guide): `COMPARE_BASE`
  moved to v0.63.0.

## v0.62.1 — 2026-11-18

- `scripts/check-national-browser.mjs` matches a county value only as a whole token, so the Regioner
  guide's `se0880` no longer reads as Kalmar's `se08` left over after a county switch. No site output
  changes.

## v0.62.0 — 2026-11-18

- **A county group's own naming format** (national mode): county files take an optional
  `naming = {format, example, source, group}`; the county's Kom igång shows it first, crediting the
  group, then the national `SE<NN>-Plats` as the suggestion for counties without one.
- **Local municipality regions**: an optional `[[regions_extra]]` list (`scope`, `note`, `source`,
  `group`) notes a region a group adds beside the county's (Kalmar-Mesh's `se0880`) on Kom igång.
- **Regioner**: "Kommunregioner använder vi inte" softened to "Vi föreslår länets region som grund;
  vissa grupper lägger till en kommunregion, som `se0880` i Kalmar."
- No script changes: **no CSP hash changes**. Regional output changes (Regioner): `COMPARE_BASE`
  moved to v0.62.0.

## v0.61.0 — 2026-11-18

- **Glossary links**: on every guide page the first use of each glossary word links to its entry on
  `/guider/ordlista/`, with the entry's first sentence as the link's title; dotted underline in the
  text's own colour. Built at render time (`_partials/glossary.html`, before `scopes.html`) from the
  glossary's front matter `terms` (anchor, word forms, optional `before`/`after` context for plain
  Swedish words like *direkt* and *väg*). Headings, links, code, buttons, `<dt>` labels and county
  spans are never touched. Checked by `scripts/check-glossary.mjs` (in `check.sh`).
- **Header at mid widths** (B-338): header text 12.5 % smaller; the search button and the county
  button no longer shrink while the menu is unfolded, so the menu folds to ☰ instead of clipping
  "Sök" and its "/" hint. A regional site with the county switch no longer overlaps the theme and
  colour-blind buttons below 40em. New `scripts/check-header-browser.mjs` (CI): 768–1600 px in
  32 px steps at 100/110/125 % zoom, nothing overlaps, wraps or clips.
- T-Deck: transmit power 22 dBm (SX1262), from LilyGO's T-Deck UnitTest source.
- No script changes: **no CSP hash changes**. Regional output changes (guides, header CSS):
  `COMPARE_BASE` moved to v0.61.0.

## v0.60.0 — 2026-11-18

- **Länets kort** (CONTENT-SV-17): `/kort/`, noindex and out of the sitemap, one A4 in Chrome: radio
  values, region, channels, test channel, five steps, 112 and P4, a blank date line. Values from the
  shortcodes (national mode: the chosen county; county pages link `/kort/?lan=<scb>`). Linked from the
  preparedness page's step 6.
- **Nytt i MeshCore** (CONTENT-SV-20): a new section `/nytt/`, one page per firmware release from 1.18,
  with only what changes for users here, each linking its guide; in the footer.
- **Press hook** (SEO-SV-11): front matter `press: [{type, name, url, date, publisher}]` adds schema.org
  `mentions` (NewsArticle or VideoObject) to the page's JSON-LD; the footer links `/press/` when a site
  has that page.
- No script changes: **no CSP hash changes**.

## v0.59.0 — 2026-11-18

- **Gemenskap** (CONTENT-SV-15): a new page `/gemenskap/` with the site's chats and links, every
  county's groups in national mode (from the county files), ways to help without a radio, and how to
  add a group (when `params.lanData` is set). New shortcode `{{</* gemenskap "sverige|lan|lagg-till" */>}}`;
  linked from the footer and Sverige's community column.
- **"Kontrollerad mot MeshCore 1.18 (november 2026)"** (CONTENT-SV-18): front matter `checkedFirmware`
  and `checkedOn`, printed beside the update date; set on every guide and troubleshooting entry the
  content plan touched. The Källor convention and the quarterly re-check are in the README.
- **Ordlista** (CONTENT-SV-19): 37 terms, each a heading with a stable anchor (`#duty-cycle`, `#erp`,
  `#sf`, `#bw`, `#cr`, `#iata` …), linking the guide that explains it.
- **RAK WisBlock picture** in the repeater table.
- Fix: the national browser check skips lists that name every county on purpose (`.lan-every`: the IATA
  table and Gemenskap's county list); v0.58.0's CI failed on that.
- No script changes: **no CSP hash changes**.

## v0.58.0 — 2026-11-18

- **Kartan och observatörer** (CONTENT-SV-11), the retitled `/guider/visa-pa-kartan/` (URL kept): the
  observer drawing, what the map shows (FAQ `kartan` now one sentence + link), what an observer sends,
  three ways (Observer firmware from its own flasher, meshcoretomqtt with a repeater on USB,
  meshcore-packet-capture with a companion), the IATA table and other maps. New shortcode
  `{{</* iata-table */>}}`: every county's region and IATA code in national mode, the region's own on a
  regional site (i18n `iata_*`).
- **Felsökning** (CONTENT-SV-12): five new entries (CR 5 against the network's CR, the name is cut, the
  message is cut, the app's admin wait, a repeater left at 50 % duty cycle) and "Vanligaste felen" at the
  top of the hub.
- **MeshCore eller Meshtastic?** (CONTENT-SV-13): Meshtastic's managed flooding, hop limits 64 vs 3/7,
  two phone-width tables, encryption described from the code, "Och Reticulum?", "Vad används i
  Sverige?", Källor.
- **Skaffa hårdvara** (CONTENT-SV-4): "Modellerna i jämförelse" (chip, transmit power, battery, one
  source per figure), "Bäst till", the Heltec V4 power warning, "ESP32 eller nRF52?".
- **Product pictures** in the hardware tables (operator 2026-11-18): Heltec V3, V4, T114, T096, LilyGO
  T-Deck and T-Beam, Elecrow ThinkNode M1, M5 and M9, with Swedish alt text (new optional `image.alt`).
  Four new companion rows with sourced specs: ThinkNode M9, Heltec T096, ThinkNode M1, ThinkNode M5.
  `{{</* hw-credits */>}}` lists only pictures with a licence.
- Observer firmware is flashed from the Observer project's own flasher (flasha-firmware, bygg-en-repeater).
- No script changes: **no CSP hash changes**.

## v0.57.0 — 2026-11-18

- **New shortcode `{{</* diagram "region|fresnel|observer" */>}}`** (CONTENT-SV-23): inline SVG drawn
  360 units wide, theme tokens only (light and dark), `role="img"` with title and description, and the
  same text as a visible caption. Texts in i18n (`diagram_*`). CSS: `.diagram` in `main.css`.
- **Vad är MeshCore?** (CONTENT-SV-1): what it is for, Fakta i korthet, "Exakt hur" (flood, direct,
  64/32/21 hops), what it does not do, the TV4 report, app cost corrected; "Vanliga ord" now links the
  glossary; Källor.
- **Companion** (CONTENT-SV-3): "Kostar appen något?", step 7 "Testa med två radior", "Flashern hittar
  inte radion". Screenshots not added (they need a radio connected to the app).
- **Sätt upp en repeater** (CONTENT-SV-5): wizard links, the default-value warning (50 % duty cycle,
  CR 5, password `password`), Finjustera (txdelay table from meshat.se, path.hash.mode, agc, multi.acks,
  rxdelay, flood advert 47 h vs the FAQ's 12 h), test before mounting, checklist; the meshat.se delay
  link replaced.
- **Antenner** (CONTENT-SV-6): "Fri sikt är mer än en linje" with the Fresnel drawing and table,
  LMR-195 and datasheet sources, "Åska och jordning". Solnoder: BU-410 and an LiFePO4 datasheet in its
  sources.
- **Regioner** (CONTENT-SV-9, -D1): the region drawing, "Kommuner och offgrid" (what they are, why the
  county), two new questions, region commands since 1.10.
- **Kanaler** (CONTENT-SV-10): why hashtag channels are readable, 160 bytes with a byte table, how to
  create a private channel.
- **Namnge din repeater, USB-konsolen** (CONTENT-SV-16): why 23/31 bytes, two Swedish name formats,
  MrBengt666's convention; config.meshcore.io.
- **Bygg en repeater** (B-336g): flashes from the official web flasher (Xiao nRF52 WIO, Heltec v4),
  Observer as the option, lou as an add-on; new "Spara ström" (`powersaving on`, from the CLI
  reference). Välj och flasha firmware: the flasher has no separate low-power firmware.
- No script changes: **no CSP hash changes**.

## v0.56.0 — 2026-11-18

- **Six new questions** (CONTENT-SV-21) under `/fragor/`: how long a message can be (160 bytes), whether
  the app costs anything, how many hops, whether you need line of sight, which frequency MeshCore uses in
  Sweden, and abroad; each links its guide and its source.
- No layout or script changes: **no CSP hash changes**.

## v0.55.0 — 2026-11-18

- **Administrera repeatern från appen** (B-336j): a new guide, `/guider/fjarradministration/`: log in as
  admin over radio, also through other repeaters (the login goes as flood when no path is known), the
  admin password, what stays USB-only per the CLI reference; linked from the USB console and the
  repeater guide.
- **The lou guide** (B-336h): the latest release (lou-18) and what lou-20 and lou-21 bring.
- **Verktyg för dig som har en nod** (B-336o, B-336p): one heading per tool with a link and 2–3
  sentences; MeshMapper added.
- **The solar calculator** as a box at the top and the end of the solar guide (B-336e), new shortcode
  `{{</* solar-cta */>}}`.
- **The example hashtag channel follows the county** (B-336l): new shortcode `{{</* chat-example */>}}`
  (a county's first channel, a regional site's first chat channel, else `#exempel`); national mode fills
  it for the chosen county.
- Första meddelandet: a flood advert at first start and after a rename, and why (B-336a); tests interrupt
  the conversation (B-336b); shorter definitions (B-336c); "say roughly where you are" (B-336d).
  Etikett: the 47-hour flood advert is the default and the recommendation (B-336n).
- Guide order: naming before "Sätt upp en repeater" (B-336k), the own broker just before the glossary
  (B-336m); `wideTables: true` in front matter makes a page's tables as wide as the text (B-336i, on
  "Bygg en repeater").
- Defaults: `firmware.picker` is `https://sweden-mesh.github.io/firmware/?lang=sv` (the lou picker, which
  links the official flasher), `firmware.flasher` is `https://flasher.meshcore.io`.
- No inline script changes: **no CSP hash changes**.

## v0.54.0 — 2026-11-18

- **Hardware in three pages with one table** (B-332…B-335): `/guider/skaffa-hardvara/` is a short hub;
  `…/companion/`, `…/repeater/` and `…/antenn/` each show a product table from the new
  `data/hardware.toml` (shortcodes `{{</* hw "companion|repeater|antenna" */>}}` and `{{</* hw-credits */>}}`):
  maker's product page, maker, type, figures, price, pros, cons and warnings, each with its sources; cards
  below 48em. Pictures only with a recorded reuse licence (four Seeed wiki images, CC BY-SA 4.0),
  resized and served from the site, opened larger in a `<dialog>` (new `js/lightbox.js`).
- **The Antenner guide moved** into `/guider/skaffa-hardvara/antenn/`; `/guider/antenner/` is an alias
  (301 on the national site). A region that links `/guider/antenner/` keeps working.
- **Kom igång med MeshCore** (CONTENT-SV-2): a new page `/kom-igang/`, five steps; the hero's "Kom igång"
  leads there (a county page: the county's own).
- **MeshCore-inställningar i Sverige** (CONTENT-SV-7): `/guider/radioinstallningar/` with the values,
  PTSFS 2025:1's sub-bands, ERP (moved from the radio-amateur guide), duty cycle, default traps.
- **MeshCore när el och mobilnät går ner** (CONTENT-SV-14): `/guider/nar-natet-gar-ner/`.
- **Välj och flasha firmware** (B-336g): standard MeshCore firmware first; the lou picker is named as
  such; the home page's firmware link goes to the guide. Flashing comes right after the hardware in
  "Kom igång" (B-336f).
- Legal wording names PTSFS 2025:1 § 146, "LBT or 10 %" (CONTENT-SV-8); node names 23 bytes with a
  position, 31 without, in the checker, the wizards and the text (CONTENT-SV-D2); the radio-amateur
  guide gets "a repeater that is up beats a perfect one" (B-331).
- No inline script changes: **no CSP hash changes**.

## v0.53.0 — 2026-11-18

- **"Steg för steg"** replaces "Wizards" (UX-SV-D2): the hub's title, the home box and the link labels.
  A site's menu entry is its own: rename it in `hugo.toml`.
- **The lou guide's title names no person** (UX-SV-D3): "Specialfirmware lou med fjärrstyrning och
  autosvar"; the author is named in the text.
- **Verktyg för dig som har en nod** (UX-SV-7): a new guide, `/guider/for-nodagare/`, that lists every
  tool for node owners with one sentence on when to use it; linked from the home page's Steg för steg box.
- **A message from phone to phone** (UX-SV-11): a new shortcode `{{</* flow */>}}`, an ordered list
  drawn as a chain with the region hop marked, on "Vad är MeshCore?". New texts `flow_*`.
- **"Uppdaterad <datum> · Rätta sidan"** (UX-SV-6) at the end of guides and troubleshooting pages: the
  page's lastmod and an edit link to its file, in this repository or, for a site's own file, under the
  new `params.editURL`.
- **The map's data age** (UX-SV-14): a line under the map, "Senaste paket: 12 s sedan", and "Kartdata
  kan inte hämtas just nu" once the live feed has been down for 15 s. New texts `map_last_packet`,
  `map_wait_packet`, `map_live_down`.
- **heroLead** front matter (UX-SV-9): a hero lead that differs from the description (the search
  snippet); county pages get "Se nätet i <län>, ställ in din radio med länets värden …".
- National mode: the Sverige front page shows "Region och IATA beror på länet · Välj län" instead of
  placeholder values (UX-SV-8) and lists every county page (SEO-SV-9); on a phone a county page shows
  the network's numbers first (UX-SV-13); a seoTitle naming MeshCore ends in "– MeshCore Sverige"
  within 60 characters (SEO-SV-12); every page alias answers 301 in `_redirects` (SEO-SV-13).
- 20 px radios and checkboxes on touch screens (UX-SV-12).
- No inline script changes: **no CSP hash changes**.

## v0.52.2 — 2026-11-18

- **"På sidan" links match their headings again**: the titles are read from the page after the long
  words get their soft hyphens, which also go into the heading ids (v0.52.1 linked one id without
  them; the link check caught it).

## v0.52.1 — 2026-11-18

- **"På sidan" with a shortcode in a heading**: the list read its titles from Hugo's fragments, where
  a heading such as "Kanaler i {{</* region */>}}" still held Hugo's placeholder text; it now reads
  them from the rendered page. That placeholder also made two builds of the same commit differ, which
  failed v0.52.0's regional-comparison check.

## v0.52.0 — 2026-11-18

- **A county's groups as buttons** (operator 2026-11-18, replacing B-326's single community button): a
  national county page shows every group in its file's `[[groups]]`, in that order, as buttons after
  "Kom igång" and "Se kartan"; the old `community` key is folded in when it names another address.
  More than 4: the first 3 and "Fler grupper", which leads to the Gemenskap column (`#grupper`). One
  bar, drawn by CSS at the start of the group list, separates the site's buttons from the groups; it
  is clipped when the list starts a line. Screen readers get a named list ("Grupper i <län>").
  Regional sites unchanged. New texts `lan_groups_label`, `lan_more_groups`.
- **"På sidan"** (UX-SV-4): a page with 4 or more H2s gets a list of them, closed under the lead on
  narrow screens, open and sticky in the empty right column from 80em; the section in view is marked
  (`scroll-target-group`, IntersectionObserver otherwise) and has `aria-current`. New `js/toc.js`,
  text `toc_title`.
- **Search from the header** (UX-SV-5): the menu's "Sök" link becomes a field-shaped link beside the
  county button (an icon once the menu folds), opening the same Pagefind search in a dialog; `/` opens
  it outside text fields; without script it goes to `/sok/`. The search box is now the partial
  `search-box.html`, used by the shortcode and the header. The national site's placeholder values
  (`se-<län>`, `#test-se-<län>`, `XXX`, `SE-<LÄN>`) are left out of the search index and its excerpts.
  A region that overrides `header.html` copies the search link and its `<template>`.
- No inline script changes: **no CSP hash changes**.

## v0.51.1 — 2026-11-18

- **`?lan=` leaves the address bar** (operator): national mode's prepaint script, after storing the
  county from a valid `?lan=<scb|se>`, removes the parameter with `history.replaceState` (no reload, no
  history entry; other parameters and the `#hash` stay). Links that carry it, such as the retired
  regional sites' redirects, end on a clean address. An invalid value is left alone. With storage
  blocked it is still removed. The inline script changed: **the national site's CSP hash for it
  changes** (the county list in the script also changes the hash whenever a county gains or loses its
  own site).

## v0.51.0 — 2026-11-18

- **The county dialog always closes** (UX-SV-1, SEO-SV-2, operator decision UX-SV-D1): national mode still
  opens it by itself on a first visit, but it now always has a × button and closes with Esc or a click
  outside. Closed without a choice, the page stays on Sverige and the dialog does not open by itself again
  in that visit (sessionStorage `lan-skip`). The map's column is laid out before the county map is
  fetched, so nothing moves when it arrives: first-visit CLS on a guide at 1280 px 0.322 → 0.000
  (headless, map data delayed 600 ms). Below 48em, "Sverige (hela landet)" comes before the county list.
- **A county with its own site** (UX-SV-2): its button shows "↗ domain" under the name (regional sites'
  picker too). Picked on a shared page, the choice is saved and the visitor stays, with a line "<län> har
  en egen MeshCore-sida med länets värden: domain" where the county note was (shown before paint by an
  inline `<style>` rule on `html[data-lan]`, national only; no script, so **no CSP hash changes**); from
  the front page or a county page it goes to that site as before. New text `lan_own_site`.
- **County subpages noindex** (SEO-SV-3): the three generated pages per county (`kom-igang`,
  `ingen-svar-pa-test`, `fragor`) are `noindex, follow` and out of the sitemap; the county front pages
  stay indexed.
- **Kom igång step 7** (UX-SV-3): a county without a chat channel read "Säg hej, eller i …"; now "Säg
  hej i …".
- README: the national site is the reference copy of the shared content; a regional site forks it.

## v0.50.0 — 2026-11-18

- **County pages count only the county** (B-330): national mode's county front page counted every node
  in the county's map area (its IATA), which reaches into the neighbouring counties (Halland: 201
  repeaters). The "Nätet" card now counts repeaters and observers inside the county's outline, the same
  test the map hides them by (`assets/js/lan/geo.js`), and shows the rest as a smaller figure under each
  count ("+ 128 i grannlänen"); a node without a position counts as inside, as on the map. The no-JS
  repeater list and the "no observers here" note count only nodes inside the county too (new partial
  `lan-inside.html`). Packets per day stay per map area: Beacon does not say where a packet was heard.
  Regional sites and the Sverige page are unchanged. New text `stat_outside`.

## v0.49.0 — 2026-11-17

- **"Senaste paket" says more, and a click frames the packet** (B-328): on wider screens each packet in
  the live list shows its origin (name and the key's first 3 bytes, when Beacon resolved it), type,
  channel once known, hop count with the relays (names where resolved, the hop's byte otherwise), the
  last hop's SNR/RSSI, how often heard and its age; phones keep one line. Clicking a packet fits the map
  to the nodes it touched (origin, relays, the observers that heard it) and dims every other node and
  link, at once from the live feed; one `/packets/{hash}` request then adds earlier observations, the
  channel (Public and the derivable hashtag channels by name) and a decrypted sender. No `/observers`
  lookups any more. Esc, the same packet again or "Stäng" clears it. Hidden nodes ("Utanför
  regionen", a county page's outside nodes) stay hidden and are not framed; reduced motion jumps.
  New text `mt_channel`.

## v0.48.1 — 2026-11-17

- **The page blurs at once when a county is chosen** (operator): picking a county in the picker or on
  its map, on meshcoresverige.se or a regional site, blurs and dims the page (and the open picker) right
  away while the next page loads, so the click is seen to have landed; `aria-busy` on the body; undone
  if the page returns from the back-forward cache; no transition with reduced motion.

## v0.48.0 — 2026-11-17

- **A county with its own site goes straight there, no notice** (B-327, reversing plan §7 Q3): on the
  national site, picking such a county in the county modal (button or map) navigates to its site at
  once, and its address `/<county>/` (with and without åäö, and anything below it) is a 302 to that site
  in the generated `_redirects`; the "har en egen sida" page is gone. `/lan/pages.json` maps an own-site
  county to its site's absolute address, so a site's `/` function can send a saved county there. The
  green "egen sida" tint in the list and on the map stays. Texts `lan_own_title`, `lan_own_desc`,
  `lan_own_text`, `lan_own_go` and `lan_own_other` removed. The regional modal already linked
  straight to a county's own site; unchanged.

## v0.47.0 — 2026-11-17

- **A regional site's county button opens the national county modal** (B-324, with
  `params.regionSwitch.on`): the same map and county buttons as meshcoresverige.se, counties with a
  site of their own tinted green, the site's own county marked. Every county is a link to its own site
  (`data/county_sites.toml`) or its page on the national site, "Sverige (hela landet)" to the national
  site; nothing is stored and the modal never opens by itself. One component (`lan/modal.js`, regional
  mode from `region-island.html`); without JavaScript the popover list stays the chooser. The modal's
  CSS moved from `national.css` to `lan-modal.css`, loaded in both modes. New text `lan_region_intro`.
- **"Sverige (hela landet)" sits in the county buttons' column, centred under them** (B-325), on
  meshcoresverige.se and in the regional modal; on a phone directly under the buttons.
- **The Sverige view's Gemenskap column lists one community site per county** (B-326): the county
  file's `community`, no longer every group, and never one of our own regional sites (a county's `site`).
- Test: every repeater setup the wizard writes defines `eu` (B-323).

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
