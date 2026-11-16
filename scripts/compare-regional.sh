#!/bin/sh
# Proves that a regional site's output does not change with this template (operator 2026-11-16:
# everything national sits behind params.national, off by default). Builds the example site, and
# every site directory given in COMPARE_SITES, twice: against the template at BASE (a tag or
# commit) and against the working tree, then compares the two public/ trees byte for byte.
#   scripts/compare-regional.sh [BASE]        BASE default: $COMPARE_BASE, else the latest tag
#   COMPARE_SITES="../meshcore-jkp.se" scripts/compare-regional.sh v0.39.0
# Both builds share one Hugo cache, so remote data (Beacon, the region list) is fetched once and
# is the same in both. A release that changes regional output on purpose moves COMPARE_BASE in
# .github/workflows/ci.yml to that release.
set -eu
cd "$(dirname "$0")/.."
ROOT=$(pwd)
BASE=${1:-${COMPARE_BASE:-$(git describe --tags --abbrev=0)}}
TMP=$(mktemp -d)
trap 'git worktree remove --force "$TMP/base" >/dev/null 2>&1 || true; rm -rf "$TMP"' EXIT
git worktree add --detach --quiet "$TMP/base" "$BASE"
MOD=github.com/sweden-mesh/meshcore-regional-template
fail=0
build() { # site-dir template-dir out-dir
  HUGO_MODULE_REPLACEMENTS="$MOD -> $2" hugo --quiet --minify --source "$1" --destination "$3" \
    --cacheDir "$TMP/cache" --environment production >/dev/null
}
# Two things differ between any two builds of the same site, so they are normalised first: Hugo's
# shortcode placeholders in heading ids (hahahugoshortcode…hbhb, numbered per build) and the Beacon
# snapshot's build time (its "at", the time under the node list, and so its fingerprint).
normalise() {
  find "$1" -path '*/beacon/snapshot*.json' | while read -r f; do
    perl -pi -e 's/"at":"[^"]*"/"at":"-"/g' "$f"; mv "$f" "$(dirname "$f")/snapshot.json"
  done
  find "$1" -name '*.html' -o -name '*.xml' | xargs perl -pi -e \
    's/hahahugoshortcode\w+?hbhb/HS/g; s/snapshot\.min\.[0-9a-f]{64}\.json/snapshot.json/g; s/\d{4}-\d\d-\d\d \d\d:\d\d (UTC|CET|CEST)\b/T/g'
}
for site in "$ROOT/exampleSite" ${COMPARE_SITES:-}; do
  site=$(cd "$site" && pwd)
  name=$(basename "$site")
  build "$site" "$TMP/base" "$TMP/out/$name-base"
  build "$site" "$ROOT" "$TMP/out/$name-head"
  normalise "$TMP/out/$name-base"; normalise "$TMP/out/$name-head"
  if diff -r -q "$TMP/out/$name-base" "$TMP/out/$name-head" >"$TMP/diff-$name"; then
    echo "ok   $name: identical to $BASE ($(find "$TMP/out/$name-head" -type f | wc -l) files)"
  else
    echo "FAIL $name: differs from $BASE"; head -20 "$TMP/diff-$name"; fail=1
  fi
done
exit $fail
