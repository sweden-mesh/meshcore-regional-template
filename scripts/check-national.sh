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
exit $fail
