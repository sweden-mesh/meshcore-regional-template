#!/bin/sh
# Build the example site with warnings as errors, then check its links and HTML.
# Used by CI and locally: needs hugo and htmltest on PATH.
set -eu
cd "$(dirname "$0")/.."
node --test tests/*.test.mjs
cd exampleSite
rm -rf public
hugo --gc --minify --panicOnWarning
cd ..
htmltest --conf .htmltest.yml
