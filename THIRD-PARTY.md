# Third-party material and services

| What | Where | Licence / terms | How we comply |
|---|---|---|---|
| MapLibre GL JS 6.16.0 | `static/lib/maplibre-gl/6.16.0/` | BSD-3-Clause | Licence file shipped next to the code and served with it |
| IBM Plex Sans (400–700) and IBM Plex Mono (400, 500), latin, Fontsource 5.2.5 | `static/fonts/` | SIL Open Font License 1.1 | Licence files shipped; fonts unmodified |
| OpenFreeMap basemap (styles, tiles) | loaded at view time from tiles.openfreemap.org | OpenFreeMap: free use, attribution; data © OpenMapTiles, © OpenStreetMap contributors (ODbL) | MapLibre's attribution control is always on the map |
| meshat.se guide texts | adapted into `content/guider/*.md` | CC BY 4.0 (reuse approved by meshat.se) | Each adapted page names its source, the licence and what changed (`source:` front matter → page footer) |
| Swedish county borders (simplified to ~1 km) | `assets/se-lan.geojson`, made by `scripts/se-lan.py` from Natural Earth 10m admin-1 v5.1.2 | Public domain (Natural Earth) | Nothing required; the source is named here |
| Beacon backend | called over its public REST API and WebSocket | Beacon is AGPL-3.0; **no Beacon code is in this repository** | Only network calls; the region runs its own instance |
| Plausible tracker script (optional) | proxied at view time from the region's Plausible server | Plausible CE (AGPL-3.0); not bundled here | Only loaded when a region turns analytics on |

This repository's own code is BSD 2-Clause (`LICENSE`); its own text is CC BY 4.0
(`LICENSE-CONTENT`).
