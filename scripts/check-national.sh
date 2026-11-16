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
check kalmar/index.html "<dt><code>#kalmar-exempel</code></dt>" "county page: the county's own channel is listed"
check kalmar/index.html "Skrivet av Exempelgruppen" "county page: the own paragraph is signed"
check kalmar/index.html "kontrollerades senast 2026-11-16" "county page: the checked date"
check kalmar/index.html "<span data-r=name>Kalmar län</span>" "county page: the footer names the county"
check skåne/index.html "Rikschatten" "county page: no groups, the national chats stand in"
check sitemap.xml "/sk%C3%A5ne/</loc>" "county page: in the sitemap, address with åäö"
if grep -q "id=karta" "$P/jönköping/index.html" || [ -e "$P/jönköping/kom-igang" ]; then echo "FAIL county page: a county with its own site got a front page"; fail=1; else echo "ok   county page: none for a county with its own site"; fi
# The county's local pages (Q7.7), modelled on meshcore-jkp.se's four.
check kalmar/kom-igang/index.html "<h1>Kom igång med MeshCore i Kalmar</h1>" "local: Kom igång has the county's title"
check kalmar/kom-igang/index.html "Lägg till kanalerna</strong> <code class=nobreak>#kalmar-exempel</code> och <code class=nobreak>#test-se08</code>" "local: Kom igång lists the county's channels and test channel"
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
exit $fail
