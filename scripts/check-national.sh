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
check index.html "MeshCore" "national: the site builds"
exit $fail
