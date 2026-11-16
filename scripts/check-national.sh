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
if [ -e "$P/jönköping/index.html" ]; then echo "FAIL county page: a county with its own site got a front page"; fail=1; else echo "ok   county page: none for a county with its own site"; fi
exit $fail
