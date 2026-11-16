#!/bin/sh
# The override model, checked on the built example site: a region's own page,
# partial and i18n key must win over the template's.
set -eu
P="$(dirname "$0")/../exampleSite/public"
fail=0
check() { if grep -q "$2" "$P/$1"; then echo "ok   $3"; else echo "FAIL $3"; fail=1; fi; }
check index.html "Regionens egen ingress" "page: exampleSite/content/_index.md replaces the template's"
check index.html 'x-override-check' "partial: exampleSite hooks/head-end.html replaces the template's"
check index.html "Exempelregionens egen slogan" "i18n: exampleSite i18n/sv.toml hero_tagline replaces the template's"
check guider/regioner/index.html "Regioner (scope)" "a template page the region does not override is still there"
check guider/egen-broker/index.html "mqtt-meshcore.louie.se" "backend: the broker guide renders params.backend.host"
# Troubleshooting: a region adds, replaces and hides entries with files of its own.
check felsokning/index.html "Exempelregionens lokala felsökning" "felsokning: a region's own entry is listed"
check felsokning/index.html "Regionens egen version: webbläsaren hittar ingen port" "felsokning: a region's file replaces the template's entry"
check felsokning/index.html "Radion startar om hela tiden" "felsokning: the template's entries the region leaves alone are listed"
if grep -q "gammal-version-efter-flashning" "$P/felsokning/index.html" "$P/sitemap.xml" || [ -e "$P/felsokning/gammal-version-efter-flashning" ] || grep -rqs "fortfarande den gamla versionen" "$P/pagefind/"; then
  echo "FAIL felsokning: a hidden entry is still built, listed or in the sitemap"; fail=1
else echo "ok   felsokning: a hidden entry is not built, listed or in the sitemap"; fi
if grep -q 'pager-prev' "$P/felsokning/hor-inga-repeatrar/index.html"; then echo "FAIL felsokning: the first radio entry's pager reaches into another category"; fail=1; else echo "ok   felsokning: an entry's pager stays in its category"; fi
check felsokning/kort-rackvidd/index.html 'pager-prev' "felsokning: entries in the same category still page to each other"
# FAQ: the same three ways, and the old combined page still leads here.
check fragor/index.html "Exempelregionen: när ses vi?" "fragor: a region's own question is listed"
check fragor/index.html "Regionens egen version: vem äger nätet?" "fragor: a region's file replaces the template's question"
check fragor/index.html "Behöver jag licens för att sända?" "fragor: the template's questions the region leaves alone are listed"
if grep -q "Meshtastic prata" "$P/fragor/index.html"; then echo "FAIL fragor: a hidden question is still listed"; fail=1; else echo "ok   fragor: a hidden question is not listed"; fi
if [ -e "$P/fragor/licens/index.html" ]; then echo "FAIL fragor: questions get pages of their own"; fail=1; else echo "ok   fragor: questions are shown only on the list page"; fi
check guider/fragor-och-ord/index.html "/fragor/" "fragor: the old FAQ URL redirects"
# Contributors list (B-258): humans kept (once, across repos), bots and AI agents filtered, opt-outs honoured.
check om-regionen/index.html 'github.com/exempel-person' "contributors: a human is listed"
check om-regionen/index.html 'Exempeltestaren' "contributors: the hand-kept list is shown"
if [ "$(grep -oE 'github.com/exempel-person[" >]' "$P/om-regionen/index.html" | wc -l)" = "1" ]; then echo "ok   contributors: a person in two repos is listed once"; else echo "FAIL contributors: a person is listed twice"; fail=1; fi
for who in 'dependabot' 'github.com/claude' 'copilot-swe-agent' 'team-claude-helper' 'vill-inte-synas'; do
  if grep -q "$who" "$P/om-regionen/index.html"; then echo "FAIL contributors: $who is listed"; fail=1; else echo "ok   contributors: $who is filtered out"; fi
done
# MeshMapper coverage (MMAP): the fixture becomes one compact file the map points at.
cov=$(grep -oE 'data-coverage="?/meshmapper/coverage\.[0-9a-f]+\.json' "$P/index.html" | sed 's/.*="\{0,1\}//' || true)
if [ -n "$cov" ] && [ "$(grep -o '\],\[' "$P$cov" | wc -l)" = "31" ]; then echo "ok   meshmapper: the map points at a 32-square coverage file"; else echo "FAIL meshmapper: no coverage file, or not 32 squares"; fail=1; fi
check index.html 'map-mm">[^<]*<a href=https://meshmapper.net/' "meshmapper: the map links the region's MeshMapper map"
check guider/visa-pa-kartan/index.html 'href=https://meshmapper.net/' "meshmapper: the map guide links the region's MeshMapper map"
check guider/visa-pa-kartan/index.html 'app_getting_started' "meshmapper: the map guide explains the coverage and how to contribute"
check index.html 'map-cov-at" hidden>' "meshmapper: the measured-until line waits under the map"
# Places wanted for new repeaters (B-285): the example's two places on Bli nodvärd, on the home
# map's toggle and on the host picker; not on the other wizards' pickers.
check wizard/nodvard/index.html 'class=hp-want data-want-lat=57.7012 data-want-lon=14.2471>Utsikten</button>: högt läge med fri sikt mot <strong>söder' "wanted: Bli nodvärd lists a place with its note"
check wizard/nodvard/index.html '>Västra höjden</button></li>' "wanted: Bli nodvärd lists a place without a note"
check wizard/nodvard/index.html 'map-pick[^>]*data-wanted=.*"name":"Västra höjden"' "wanted: the host picker gets the places"
check index.html 'data-wanted=.*"name":"Utsikten","note":"högt läge med fri sikt mot söder"' "wanted: the home map gets the places, the note as plain text"
check index.html 'data-wanted-label="Önskade platser"' "wanted: the home map's toggle has its label"
if grep -q 'data-wanted' "$P/wizard/repeater-snabb/index.html"; then echo "FAIL wanted: the quick wizard's picker draws the places"; fail=1; else echo "ok   wanted: only the host wizard's picker draws the places"; fi
# The fit button (B-286) and the header's motion button (B-288).
check index.html 'fit_all":"Visa allt"' "map: the fit button gets its label"
if sed -n '/<header/,/<\/header>/p' "$P/index.html" | grep -q '<button type=button class=motion-toggle hidden aria-pressed=false aria-label="Stoppa bakgrundsrörelse"'; then echo "ok   header: the motion button is a toggle in the header"; else echo "FAIL header: no motion toggle in the header"; fail=1; fi
if sed -n '/<footer/,/<\/footer>/p' "$P/index.html" | grep -q '<li class=motion-foot hidden><button type=button class=motion-link>Stoppa bakgrundsrörelse'; then echo "ok   footer: the phone-only motion link stands in"; else echo "FAIL footer: no stand-in motion link"; fail=1; fi
# B-290: no dead-zone toggle, key or legend on the map.
if grep -qE 'data-dead-label|lg_cov_dead|cov_dead_heading' "$P/index.html"; then echo "FAIL map: the dead-zone toggle is back"; fail=1; else echo "ok   map: no dead-zone toggle"; fi
check index.html 'data-coverage-label=.\{0,1\}Täckning' "map: the coverage toggle is still there"
# RB-3: the command broker follows params.backend; the template's default is the shared broker's bare line.
check wizard/repeater-snabb/index.html 'data-mqtt=.*"slot":6' "observer.mqtt: the regional slot defaults to 6, clear of the command slot"
check wizard/repeater-snabb/index.html 'data-control=.{"host":"mqtt-meshcore\.louie\.se"' "backend: the quick wizard offers remote control through the shared broker"
check guider/firmware-lou/index.html 'set mqtt.cmd on' "backend: the firmware guide shows the command lines"
if grep -q 'mqtt.cmd.slot' "$P/guider/firmware-lou/index.html"; then echo "FAIL backend: the shared broker got the custom-slot lines"; fail=1; else echo "ok   backend: the shared broker gets the bare line"; fi
# SEO (v0.37.0): the per-page noindex switch, real dates only, the search page out of the sitemap.
check guider/etikett/index.html 'name=robots content="noindex, follow"' "noindex: a page marked by the site's cascade gets noindex, follow"
if grep -q 'name=robots' "$P/guider/regioner/index.html"; then echo "FAIL noindex: an unmarked page got a robots tag"; fail=1; else echo "ok   noindex: an unmarked page stays indexable"; fi
if grep -q '/guider/etikett/' "$P/sitemap.xml"; then echo "FAIL noindex: a noindex page is in the sitemap"; fail=1; else echo "ok   noindex: a noindex page is left out of the sitemap"; fi
check sok/index.html 'name=robots content="noindex, follow"' "noindex: the search page is noindex"
if grep -q '/sok/' "$P/sitemap.xml"; then echo "FAIL sitemap: /sok/ is in the sitemap"; fail=1; else echo "ok   sitemap: /sok/ is left out"; fi
check sitemap.xml '/wizard/solcell/metod/' "sitemap: the solar method page is in it"
if grep -rqs '0001-01-01' "$P"; then echo "FAIL dates: 0001-01-01 is in the output"; fail=1; else echo "ok   dates: no 0001-01-01 anywhere"; fi
check guider/flasha-firmware/index.html '"dateModified":"20[0-9][0-9]-' "dates: a template guide has a real dateModified"
check sitemap.xml '/guider/flasha-firmware/</loc><lastmod>20' "dates: the sitemap has lastmod for a template guide"
check guider/index.html '<h2 class=guide-group>Kom igång' "guides: the hub groups its guides under H2s"
# NEWCOMER-3 (2026-11-16): the three audience ways in on the home page, the new guides in their
# groups, the region's own test channel derived from the scope, and companions sent to the web flasher.
check index.html '<nav class=audience aria-label="Var börjar du?">' "newcomer: the home page has the audience list"
check index.html '<strong>Ny här?</strong> <a href=/guider/skaffa-hardvara/>' "newcomer: Ny här? leads to the device ladder"
check index.html '<strong>Radioamatör?</strong> <a href=/guider/for-radioamatorer/>' "newcomer: Radioamatör? leads to the radio amateurs' guide"
check index.html '<strong>Vill du bygga?</strong> <a href=/guider/bygg-en-repeater/>' "newcomer: Vill du bygga? leads to the build guide"
check guider/index.html '<h2 class=guide-group>Radio och antenner' "newcomer: the hub has the Radio och antenner group"
for g in forsta-meddelandet for-radioamatorer antenner bygg-en-repeater; do check guider/index.html "href=/guider/$g/" "newcomer: the hub lists $g"; done
check guider/forsta-meddelandet/index.html '>#test-se-xxx</code>' "newcomer: the test channel is #test-<scope> from the region"
check guider/companion/index.html '>#test-se-xxx</code>' "newcomer: the companion guide names the region's test channel"
check guider/flasha-firmware/index.html 'id=companion' "newcomer: the flashing guide has a companion section"
check guider/companion/index.html 'href=https://meshcore.io/flasher' "newcomer: the companion guide sends companions to the web flasher"
check guider/skaffa-hardvara/index.html 'november 2026' "newcomer: the device ladder dates its prices"
# Every link to another site opens in a new tab (operator's review, 2026-11-12).
missing=$(grep -rhoE '<a [^>]*href="?https?://[^>]*>' "$P" | grep -vc 'target=' || true)
if [ "$missing" = "0" ]; then echo "ok   every external link has target=_blank"; else echo "FAIL $missing external links without target=_blank"; fail=1; fi
exit $fail
