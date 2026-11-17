#!/bin/sh
# B-321: every page in the search index carries one scope filter (common, national, region:<scope>
# or paired:<key>). Run after the example builds; site directories may be given (their public/).
cd "$(dirname "$0")/.."
fail=0
for d in exampleSite/public exampleNational/public "$@"; do
  [ -d "$d" ] || continue
  bad=0
  for f in $(grep -rl 'data-pagefind-body' "$d" --include=*.html); do
    n=$(grep -oE 'data-pagefind-filter="?scope:(common|national|region:se[-a-z0-9]*|paired:[-a-z0-9]+)[" >]' "$f" | wc -l)
    if [ "$n" != "1" ]; then echo "FAIL $f: $n scope filters"; bad=1; fi
  done
  if [ $bad = 0 ]; then echo "ok   every indexed page in $d has one scope filter"; else fail=1; fi
done
exit $fail
