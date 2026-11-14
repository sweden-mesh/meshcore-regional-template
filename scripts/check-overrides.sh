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
# Every link to another site opens in a new tab (operator's review, 2026-11-12).
missing=$(grep -rhoE '<a [^>]*href="?https?://[^>]*>' "$P" | grep -vc 'target=' || true)
if [ "$missing" = "0" ]; then echo "ok   every external link has target=_blank"; else echo "FAIL $missing external links without target=_blank"; fail=1; fi
exit $fail
