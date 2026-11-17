#!/usr/bin/env python3
"""Build the solar calculator's data for every point and every load on the grid.

    python3 assets/solar/build_load_grid.py --cache-dir pvgis_cache [--out assets/data/solar] [CODES...]

Writes one file per point, <out>/<CODE>.json, with the same shape as one county's entry in the
old assets/data/solar-calc.json, except that the firmware keys under need/floor are load keys
("4.5", "7.1", "190", ...) from LOAD_GRID_MA, and snow_allowance.per_day_mAh has one value per
load. Every number comes from reference_solar_need.compute_case, so the reference script
reproduces each one; --verify compares the 4.5 and 7.1 tables with the old solar-calc.json.
A PVGIS file is downloaded once per point, tilt and tree line (about 8 MB, 360 in all) and can
be deleted afterwards with --drop-cache.
"""
import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import reference_solar_need as ref  # noqa: E402

TILT_KEYS = {90: "vertical", 60: "tilt60", 40: "tilt40"}


def key(ma):
    return f"{ma:g}"


def build_point(code, cache_dir, drop):
    need, floor = {}, {}
    for tilt, tkey in TILT_KEYS.items():
        need[tkey] = {key(m): {} for m in ref.LOAD_GRID_MA}
        floor[tkey] = {key(m): {} for m in ref.LOAD_GRID_MA}
        for trees in ref.TREE_LINES:
            wx = ref.load_pvgis(code, tilt, trees, cache_dir)
            harvests = ref.daily_harvests(wx, tilt, trees)
            for ma in ref.LOAD_GRID_MA:
                r = ref.compute_case(code, tilt, trees, key(ma), cache_dir, _harvests=harvests)
                need[tkey][key(ma)][str(trees)] = [[None if v is None else round(v, 1) for v in t] for t in r["need"]]
                floor[tkey][key(ma)][str(trees)] = [None if v is None else round(v, 1) for v in r["floor"]]
            if drop:
                os.remove(os.path.join(cache_dir, ref.cache_name(code, tilt, trees)))
            print(f"{code} t{tilt} h{trees}", file=sys.stderr, flush=True)
    return need, floor


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("codes", nargs="*")
    ap.add_argument("--cache-dir", default="pvgis_cache")
    ap.add_argument("--out", default="assets/data/solar")
    ap.add_argument("--old", default="assets/data/solar-calc.json", help="the published file: place, snow days, notes")
    ap.add_argument("--drop-cache", action="store_true")
    ap.add_argument("--verify", action="store_true", help="compare 4.5/7.1 with --old and stop")
    a = ap.parse_args()
    old = json.load(open(a.old))
    os.makedirs(a.out, exist_ok=True)
    for code in a.codes or sorted(ref.POINTS):
        path = os.path.join(a.out, f"{code}.json")
        if os.path.exists(path) and not a.verify:
            print(f"{code}: already built", file=sys.stderr)
            continue
        need, floor = build_point(code, a.cache_dir, a.drop_cache)
        o = old[code]
        for tkey in TILT_KEYS.values():
            for fw, ma in (("esm", "4.5"), ("official", "7.1")):
                if need[tkey][ma] != o["need"][tkey][fw] or floor[tkey][ma] != o["floor"][tkey][fw]:
                    sys.exit(f"{code} {tkey} {fw}: differs from the published table")
        if a.verify:
            print(f"{code}: 4.5 and 7.1 equal the published tables")
            continue
        days = o["snow_allowance"]["days"]
        entry = {k: o[k] for k in o if k not in ("need", "floor", "snow_allowance")}
        entry.update({
            "loads": [key(m) for m in ref.LOAD_GRID_MA],
            "need": need, "floor": floor,
            "snow_allowance": {"days": days, "per_day_mAh": {key(m): round(m * 24 / ref.DERATE, 1) for m in ref.LOAD_GRID_MA}},
        })
        with open(path + ".part", "w") as f:
            json.dump(entry, f, separators=(",", ":"), ensure_ascii=False)
        os.replace(path + ".part", path)
        print(f"{code}: written", file=sys.stderr)


if __name__ == "__main__":
    main()
