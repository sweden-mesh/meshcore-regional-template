#!/usr/bin/env python3
"""SCB's statistical urban areas (tätorter) 2023 as a small offline file: one row per tätort with its
name, county (SCB code), municipality, population, the centroid of its area and the radius of a circle
of the same area (km), so that a point within it reads as "in" the town. Feeds the nearest town
on the new-repeaters page (B-362) (the county pages' largest towns, CONTENT-SV-27, removed 2026-11-19).

Source: SCB open geodata, WFS layer stat:Tatorter_2023, requested in WGS 84. Run again when SCB
publishes a new edition (change LAYER). Usage: scripts/tatorter.py [saved WFS answer] > assets/data/tatorter.json
"""
import json, math, os, sys, urllib.request

LAYER = "stat:Tatorter_2023"
URL = ("https://geodata.scb.se/geoserver/stat/wfs?service=WFS&REQUEST=GetFeature&version=1.1.0"
       f"&TYPENAMES={LAYER}&outputFormat=application/json&srsName=EPSG:4326")


def centroid(geom):
    """Area-weighted centroid of the outer rings (lng, lat); the areas are small enough to be flat."""
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    a = cx = cy = 0.0
    for poly in polys:
        ring = poly[0]
        for (x0, y0), (x1, y1) in zip(ring, ring[1:]):
            c = x0 * y1 - x1 * y0
            a += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c
    return cx / (3 * a), cy / (3 * a)


def main():
    if len(sys.argv) > 1 and os.path.isfile(sys.argv[1]):   # a saved copy of the WFS answer
        features = json.load(open(sys.argv[1]))["features"]
    else:
        req = urllib.request.Request(URL, headers={"User-Agent": "meshcore-regional-template"})
        features = json.load(urllib.request.urlopen(req, timeout=300))["features"]
    rows = []
    for f in features:
        p = f["properties"]
        lng, lat = centroid(f["geometry"])
        r = (p["area_ha"] / 100 / math.pi) ** 0.5
        rows.append([p["tatort"], p["lan"], p["kommunnamn"], p["bef"], round(lat, 4), round(lng, 4), round(r, 2)])
    rows.sort(key=lambda r: (-r[3], r[0]))
    out = {"source": f"SCB, Tätorter {LAYER.rsplit('_', 1)[1]} (öppna geodata)",
           "fields": ["name", "lan", "kommun", "bef", "lat", "lng", "r"], "rows": rows}
    json.dump(out, sys.stdout, ensure_ascii=False, separators=(",", ":"))
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
