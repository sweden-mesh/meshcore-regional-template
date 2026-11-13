# Changelog

Semantic versioning: a region pins a tag in its `go.mod`. **Major** = a region has to change
something (a param renamed or removed, a layout path moved). **Minor** = new features and
params with safe defaults. **Patch** = fixes and text.

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
