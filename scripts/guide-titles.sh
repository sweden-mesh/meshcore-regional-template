#!/bin/sh
# No colon in a guide's title (B-320, operator 2026-11-17: "Etikett: sändningstid är gemensam" read as
# a label, not a title). Checks the template's guides, or every content/guider/ given:
#   scripts/guide-titles.sh [site-dir ...]     e.g. ../meshcore-jkp.se ../meshcore-swe.se
cd "$(dirname "$0")/.."
fail=0
for d in content exampleSite/content "$@"; do
  [ -d "$d/guider" ] || d="$d/content"
  [ -d "$d/guider" ] || continue
  bad=$(grep -l '^title: *"[^"]*:' "$d"/guider/*.md 2>/dev/null || true)
  if [ -n "$bad" ]; then echo "FAIL guide title with a colon: $bad"; fail=1; else echo "ok   no colon in the guide titles in $d/guider"; fi
done
exit $fail
