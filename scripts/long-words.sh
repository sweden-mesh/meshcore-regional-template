#!/bin/sh
# Lists long Swedish words in the built site that have no hidden break point yet (backlog B-262),
# most frequent first. Not a failing check: it says which words to add to data/hyphenate.toml.
#   scripts/long-words.sh [public-dir] [min-length]
P="${1:-$(dirname "$0")/../exampleSite/public}"; N="${2:-16}"
find "$P" -name '*.html' -print0 | xargs -0 cat \
  | sed -e 's/<script.*<\/script>//g' -e 's/<code[^>]*>[^<]*<\/code>//g' -e 's/<[^>]*>/ /g' \
  | grep -oE "[[:alpha:]åäöÅÄÖ]{$N,}" | grep -v "$(printf '\302\255')" \
  | grep -viE 'meshcore|easyskymesh|https?' | sort | uniq -c | sort -rn | head -30
