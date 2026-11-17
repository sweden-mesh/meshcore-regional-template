#!/bin/sh
# National mode (params.national), checked on the built exampleNational site: three counties, one
# with its own site. Run by scripts/check.sh after the regional checks.
set -eu
cd "$(dirname "$0")/../exampleNational"
rm -rf public
hugo --gc --minify --panicOnWarning >/dev/null
P=public
fail=0
check() { if grep -q "$2" "$P/$1"; then echo "ok   $3"; else echo "FAIL $3"; fail=1; fi; }
check index.html "<title>MeshCore i Sverige – karta" "strings: the front page's title names Sverige"
check index.html "<h1>MeshCore i Sverige</h1>" "strings: the hero names Sverige"
check guider/regioner/index.html "<title>Regioner (scope) – MeshCore Sverige</title>" "strings: a guide's title ends in MeshCore Sverige"
check guider/regioner/index.html "<span data-r=name>Sverige</span> · Regionens scope: <code class=scope data-r=scope>se</code>" "strings: the footer holds the county spans, Sverige and se"
# County front pages (§6.2.2): one per county without its own site, with its values at build time.
check kalmar/index.html "<title>MeshCore i Kalmar – karta" "county page: its own title"
check kalmar/index.html "<h1>MeshCore i Kalmar län</h1>" "county page: the hero names the county"
check kalmar/index.html "<link rel=canonical href=https://national.example.org/kalmar/>" "county page: its own canonical URL"
check kalmar/index.html "data-iatas='\\[\"KLR\"\\]'" "county page: the stats and map read its map area"
check kalmar/index.html "<dt><code>#test-se08</code></dt>" "county page: the test channel is derived from the scope"
check kalmar/index.html '<p class=ch-ar><a href="https://sweden-mesh.github.io/firmware/#f=ar&amp;install=update"' "county page: the test channel's auto-reply footnote (B-301)"
check kalmar/index.html 'testa i den vanliga <code>#test</code>' "county page: without auto-reply repeaters, test in #test (B-302)"
check kalmar/index.html "<dt><code>#kalmar-exempel</code></dt>" "county page: the county's own channel is listed"
check kalmar/index.html "Skrivet av Exempelgruppen" "county page: the own paragraph is signed"
check kalmar/index.html "kontrollerades senast 2026-11-16" "county page: the checked date"
check kalmar/index.html "<p class=lan-checked>" "county page: the checked date in its own small style (B-308)"
check kalmar/index.html "<h2>I Kalmar</h2><p>Sidorna här gäller" "county page: the local pages' column opens with a sentence (B-307)"
check kalmar/index.html "<h2>Gemenskap</h2><p>Här finns de som använder MeshCore i Kalmar" "county page: the groups' column opens with a sentence (B-307)"
check kalmar/index.html "<span data-r=name>Kalmar län</span>" "county page: the footer names the county"
check kalmar/index.html 'class="button button-secondary ext" href=https://example.org/grupp target=_blank rel=noopener>Exempelgruppen</a>' "county page: the community site beside Se kartan (B-306)"
if grep -q 'button-secondary ext' "$P/skåne/index.html"; then echo "FAIL county page: a community button without a community"; fail=1; else echo "ok   county page: no community, no button"; fi
check index.html "<dt><code>#test-se</code></dt>" "Sverige: the channels card shows #test-se (B-316)"
check index.html "svarar inte automatiskt här än" "Sverige: #test-se is not promised auto-replies (B-316)"
if grep -q 'class=ch-ar' "$P/index.html"; then echo "FAIL Sverige: an auto-reply footnote on #test-se"; fail=1; else echo "ok   Sverige: no auto-reply footnote (B-316)"; fi
check skåne/index.html "Rikschatten" "county page: no groups, the national chats stand in"
check sitemap.xml "/sk%C3%A5ne/</loc>" "county page: in the sitemap, address with åäö"
if grep -q "id=karta" "$P/jönköping/index.html" || [ -e "$P/jönköping/kom-igang" ]; then echo "FAIL county page: a county with its own site got a front page"; fail=1; else echo "ok   county page: none for a county with its own site"; fi
# The county's local pages (Q7.7), modelled on meshcore-jkp.se's four.
check kalmar/kom-igang/index.html "<h1>Kom igång med MeshCore i Kalmar</h1>" "local: Kom igång has the county's title"
check kalmar/kom-igang/index.html "Lägg till kanalerna</strong> <code class=nobreak>#kalmar-exempel</code> och <code class=nobreak>#test-se08</code>" "local: Kom igång lists the county's channels and test channel"
check kalmar/kom-igang/index.html "regionen (scope) <code class=scope>se08</code>" "local: a numeric scope (se08) is styled as a scope"
check kalmar/kom-igang/index.html "<strong>Exempelberget</strong>: högt läge mot havet" "local: Kom igång lists the wanted places"
check kalmar/kom-igang/index.html "SE08-Exempelberget" "local: the name example uses the prefix and the county's place"
check kalmar/kom-igang/index.html "<dd><code class=scope>se08</code></dd>" "local: the settings box shows the county's scope"
check skåne/kom-igang/index.html "Ingen lista över platser finns för länet än" "local: no wanted places, the general advice"
check skåne/ingen-svar-pa-test/index.html "<h1>Ingen svarar på test i #test-se12</h1>" "local: the troubleshooting page names the test channel"
check skåne/ingen-svar-pa-test/index.html "#test-mmx" "local: the troubleshooting page names the old channel from the IATA"
check skåne/fragor/index.html "Var får jag hjälp i Skåne län?" "local: the county's questions"
check kalmar/index.html 'href=/kalmar/kom-igang/>Kom igång med MeshCore i Kalmar</a>' "local: the county page links its local pages"
check sitemap.xml "/kalmar/fragor/</loc>" "local: the local pages are in the sitemap"
# /lan/, the own-site page and the åäö-free addresses (Q7.1, Q7.2).
check lan/index.html 'href=/kalmar/ data-lan-pick=08>Kalmar län</a>' "lan: /lan/ links a county page"
check lan/index.html 'href=https://example.org/egen-sida/ class=ext target=_blank rel=noopener>Jönköpings län</a> <span class=muted>egen sida: example.org' "lan: /lan/ links an own site, marked"
check lan/index.html 'data-lan-pick=se>Sverige (hela landet)' "lan: /lan/ offers Sverige"
check jönköping/index.html 'href=https://example.org/egen-sida/ target=_blank rel=noopener data-lan-away>Gå till example.org' "own site: the county's address offers its site"
check jönköping/index.html 'href=/lan/>Välj ett annat län' "own site: and another county"
check jönköping/index.html 'name=robots content="noindex, follow"' "own site: the page is not indexed"
if grep -q "j%C3%B6nk" "$P/sitemap.xml"; then echo "FAIL own site: in the sitemap"; fail=1; else echo "ok   own site: not in the sitemap"; fi
check _redirects '^/skane/ /sk%C3%A5ne/ 301$' "redirects: the address without åäö answers 301"
check _redirects '^/skane/\* /sk%C3%A5ne/:splat 301$' "redirects: and its local pages"
if grep -q "^/kalmar/" "$P/_redirects"; then echo "FAIL redirects: a name without åäö redirects to itself"; fail=1; else echo "ok   redirects: none for a name without åäö"; fi
# The pre-paint county script (§6.2.3, §6.2.5); its behaviour is checked in a browser (Sprint 16 T-11).
check index.html 'localStorage.getItem("lan")' "prepaint: the script is in the head"
check index.html '<html [^>]*data-lan-page>' "prepaint: a shared page names no county"
check kalmar/index.html '<html [^>]*data-lan-page=08>' "prepaint: a county page names its county"
check jönköping/index.html '<html [^>]*data-lan-page>' "prepaint: an own-site county's page is not saved as the choice"
# The data island and the apply script (§6.2.2, §6.2.3); behaviour in tests/lan.test.mjs and a browser.
check guider/regioner/index.html '<script type=application/json id=lan-data>{"counties":\[' "island: every page carries the county data"
check guider/regioner/index.html 'src=/js/lan/apply' "island: and the apply script"
size=$(sed -n 's/.*id=lan-data>\([^<]*\)<\/script>.*/\1/p' "$P/index.html" | gzip -c | wc -c)
if [ "$size" -lt 10240 ]; then echo "ok   island: $size bytes gzipped, under 10 KB"; else echo "FAIL island: $size bytes gzipped, over 10 KB (move it to lan.json)"; fail=1; fi
# County values in the shared guides (G3): spans with a neutral form, and the "välj län" note.
check guider/regioner/index.html '<code><span data-r=scope>se-&lt;län></span></code>' "spans: a guide's scope is a span, neutral se-<län>"
check guider/regioner/index.html 'Trafik inom <span data-r=name>ditt län</span>' "spans: a guide's county name is a span, neutral ditt län"
check guider/forsta-meddelandet/index.html '<code data-r=test>#test-se-&lt;län></code>' "spans: the test channel is a span"
check guider/regioner/index.html '<p class=lan-note>.*<a href=/lan/ data-lan-open>Välj ditt län</a>' "spans: the page carries the välj län note"
if grep -q 'class=lan-note' "$P/guider/antenner/index.html"; then echo "FAIL spans: a page without county values got the note"; fail=1; else echo "ok   spans: no note on a page without county values"; fi
check guider/namnge-noden/index.html '<code><span data-r=prefix>SE-&lt;LÄN></span>-Plats</code>' "spans: the naming tip from the county's prefix"
check guider/companion/index.html '<code class=scope><span data-r=scope>se-&lt;län></span></code></dd></div><div><dt>IATA för observatörer</dt><dd><code><span data-r=iata>XXX</span></code>' "spans: the settings box's scope and map code"
check kalmar/index.html '<code class=scope>se08</code></dd></div><div><dt>IATA för observatörer</dt><dd><code>KLR</code>' "spans: a county page's settings box has its values in the HTML"
# Channels, groups and contact from the county (G13, G14).
check guider/kanaler/index.html '<tbody data-r-channels><tr><td><code data-r=test>#test-se-&lt;län></code>' "channels: a guide's table holds the county's test channel row"
check index.html '<ul data-r-groups=list><li><a href=https://example.org/chat' "groups: the footer list takes the county's groups, national chats after"
check kalmar/index.html '<ul data-r-groups=list><li><a href=https://example.org/grupp class=ext target=_blank rel=noopener>Exempelgruppen</a>' "groups: a county page's footer lists its group"
check bli-nodvard/index.html '<span data-r-groups=inline><a href=https://example.org/chat' "contact: shared pages name the national chats until a county is chosen"
# Proposed scopes (P2) and the solar guide's reference (G17).
check guider/regioner/index.html '<p class=lan-proposal data-r-proposal hidden>Regionen <code><span data-r=scope>' "proposal: the page has the hidden proposal line"
check guider/solnoder/index.html 'Jönköping som referens' "solar: the tables are labelled as the Jönköping reference"
check guider/solnoder/index.html 'href=/wizard/solcell/>Solcells' "solar: and point to the calculator"
# The header's county button (M5): a link to /lan/ without JavaScript, labelled with the county.
if sed -n '/<header/,/<\/header>/p' "$P/index.html" | grep -q '<a class=lan-toggle href=/lan/ data-lan-open aria-label="Län: Välj län"'; then echo "ok   header: the county button links /lan/"; else echo "FAIL header: no county button"; fail=1; fi
check kalmar/index.html '<span data-r=label>Kalmar</span>' "header: a county page's button names the county"
# The county modal (M6) is drawn by script only: no dialog in the HTML; its behaviour is checked in a browser.
if grep -q '<dialog' "$P/guider/regioner/index.html"; then echo "FAIL modal: a dialog is in the HTML"; fail=1; else echo "ok   modal: not in the HTML (crawlers and no-JS never see it)"; fi
check guider/regioner/index.html 'src=/js/lan/modal' "modal: the script is loaded"
check lan/pages.json '{"08":"/kalmar/","12":"/sk%C3%A5ne/"}' "function: /lan/pages.json maps each county with a page (not an own-site one)"
# Wanted places (Q6.6): a county page shows its own; the Sverige map every county's, named.
check kalmar/index.html 'data-wanted=.*"name":"Exempelberget","note":"högt läge mot havet"' "wanted: a county page's map has its places"
check index.html 'data-wanted=.*"name":"Exempelberget","note":"Kalmar: högt läge mot havet"' "wanted: the Sverige map has every county's, with the county's name"
if grep -q 'data-wanted=' "$P/skåne/index.html"; then echo "FAIL wanted: a county without places got some"; fail=1; else echo "ok   wanted: a county without places has none"; fi
# Outside-county marks on a county's map (P3): the map carries the county and the polygon file, and a
# small national script marks the nodes outside it; the shared map bundle is unchanged.
check kalmar/index.html 'data-lan-scb=08 data-geo=/se-lan\.' "outside: a county page's map names its county and the polygons"
check kalmar/index.html 'src=/js/lan/map-county' "outside: and loads the marking script"
if grep -q 'map-county' "$P/index.html"; then echo "FAIL outside: the Sverige map marks counties"; fail=1; else echo "ok   outside: the Sverige map marks nothing"; fi
# MeshMapper (G18, Q5.2): a county's own map linked under its map; no coverage layer nationally.
check kalmar/index.html 'map-mm">[^<]*<a href=https://example.org/meshmapper/' "meshmapper: a county page links the county's MeshMapper map"
if grep -q 'data-coverage=' "$P/kalmar/index.html" "$P/index.html"; then echo "FAIL meshmapper: a coverage layer nationally"; fail=1; else echo "ok   meshmapper: no coverage layer nationally"; fi
# The wizards follow the county (G15, G16, Q4.1, Q4.2): the selector's slot, all county shapes and
# the national script before the wizard's own; the neighbour box is there, hidden, to be filled.
check wizard/repeater-snabb/index.html '<div class=lan-wizard data-lan-wizard hidden' "wizards: the county selector's slot"
check wizard/repeater-snabb/index.html '<script type=application/json id=lan-shapes>{"01":' "wizards: all county shapes for the neighbour box"
if tr -d '\n' < "$P/wizard/repeater-snabb/index.html" | grep -q 'js/lan/wizard-county[^>]*></script>.*js/wizard/quick'; then echo "ok   wizards: the national script runs before the wizard's"; else echo "FAIL wizards: the national script is not before the wizard's"; fail=1; fi
check wizard/repeater-snabb/index.html '<div class=wz-neighbours hidden data-areas=\[\]' "wizards: the neighbour box waits, empty and hidden"
check wizard/repeater-guidad/index.html 'js/lan/wizard-county' "wizards: the guided wizard too"
check wizard/solcell/index.html 'js/lan/wizard-county' "wizards: the solar calculator starts on the county"
check wizard/companion/index.html '<code class=scope><span data-r=scope>se-&lt;län></span></code>' "wizards: the companion steps name the county's scope"
# Descriptions and structured data (G22): every national page has its own description.
check kalmar/index.html '<meta name=description content="MeshCore i Kalmar län: länets region se08' "seo: a county page's own description"
check kalmar/kom-igang/index.html '<meta name=description content="Kom igång med MeshCore i Kalmar län' "seo: a local page's own description"
check lan/index.html '<meta name=description content="MeshCore i Sveriges 21 län' "seo: /lan/ has its description"
check index.html '"@type":"Organization"[^}]*"name":"MeshCore Exempellandet"' "seo: the Organization is the site"
# Plausible (G23, Q6.5): the chosen county travels as the custom property lan.
check index.html 'plausible.init({endpoint:"/p/event",customProperties:function(){return{lan:document.documentElement.getAttribute("data-lan")||"se"}}})' "analytics: every event carries the county as lan"
# The footer's link (G25): the county-data guide instead of "start a site for your region".
check index.html '<a href=https://example.org/county-data class=ext target=_blank rel=noopener>Bidra med uppgifter om ditt län</a>' "footer: the county-data guide is linked"
if sed -n '/<footer/,/<\/footer>/p' "$P/index.html" | grep -q 'egen-regional-sida'; then echo "FAIL footer: still invites a site of one's own"; fail=1; else echo "ok   footer: no start-a-site link"; fi
# Privacy (P8): the stored county is named; "inga kakor" is gone.
check integritet/index.html 'Sidan använder <strong>en kaka</strong>, <code class=nobreak>lan</code>' "privacy: the county cookie and storage are named"
if grep -q 'inga kakor</strong>' "$P/integritet/index.html"; then echo "FAIL privacy: still says no cookies"; fail=1; else echo "ok   privacy: no claim of no cookies"; fi
exit $fail
