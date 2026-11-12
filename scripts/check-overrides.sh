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
# Every link to another site opens in a new tab (operator's review, 2026-11-12).
missing=$(grep -rhoE '<a [^>]*href="?https?://[^>]*>' "$P" | grep -vc 'target=' || true)
if [ "$missing" = "0" ]; then echo "ok   every external link has target=_blank"; else echo "FAIL $missing external links without target=_blank"; fail=1; fi
exit $fail
