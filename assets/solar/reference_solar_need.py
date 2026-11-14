#!/usr/bin/env python3
"""
reference_solar_need.py -- battery need for a solar-powered MeshCore repeater.

INDEPENDENT REFERENCE IMPLEMENTATION, FOR VERIFICATION ONLY.

This script was written from the text of the methodology document
("How the solar-repeater battery numbers were made") alone, without access
to the model's own code. Its purpose
is to show that the published numbers can be rebuilt from the description.
It is not the code that produced the calculator data; where the two disagree,
the calculator data is the published result.

What it computes, for one point, tilt, tree line and firmware:
  * the battery need in mAh (no margin, no snow days) for 17 panel sizes,
    as [central, low, high] triplets, with the null rule and the running
    minimum across panel sizes applied (dossier B.5, B.6);
  * the floor triplet: the need with an unlimited panel (dossier B.5).

Requirements: Python 3 and numpy. PVGIS hourly files are read from a cache
directory and downloaded from the PVGIS 5.3 API (dossier B.3) if missing.

Usage examples:
  python reference_solar_need.py JKG --tilt 90 --trees 20 --firmware esm
  python reference_solar_need.py LLA --tilt 60 --trees 0 --firmware official
  python reference_solar_need.py --check            # dossier B.14 test vectors
  python reference_solar_need.py --tables           # R, Voc_stc, start light
  python reference_solar_need.py --example          # dossier B.8 worked example
"""

import argparse
import io
import json
import math
import os
import sys
import urllib.request

import numpy as np

# ---------------------------------------------------------------------------
# Inputs from the dossier
# ---------------------------------------------------------------------------

# B.3: the 20 points. Coordinates are kept as the strings in the dossier's
# table, because they are sent to PVGIS exactly as written.
POINTS = {
    # Jönköping: the public point, rounded to two decimals. Since calculator
    # data v4 the published Jönköping values are computed at this point too,
    # and this script reproduces them exactly.
    "JKG": ("57.78", "14.16", "PVGIS-SARAH3"),      # Jönköping (rounded)
    "BLE": ("60.972", "14.37", "PVGIS-SARAH3"),     # Dalarna
    "GOT": ("58.318", "12.91", "PVGIS-SARAH3"),     # Västra Götaland
    "GVX": ("61.477", "16.3", "PVGIS-SARAH3"),      # Gävleborg
    "HAD": ("56.976", "12.827", "PVGIS-SARAH3"),    # Halland
    "KLR": ("57.252", "16.05", "PVGIS-SARAH3"),     # Kalmar
    "KSD": ("59.786", "13.154", "PVGIS-SARAH3"),    # Värmland
    "LLA": ("66.951", "20.1", "PVGIS-ERA5"),        # Norrbotten (ERA5)
    "LPI": ("58.368", "15.662", "PVGIS-SARAH3"),    # Östergötland
    "MMX": ("55.964", "13.603", "PVGIS-SARAH3"),    # Skåne
    "NYO": ("59.094", "16.7", "PVGIS-SARAH3"),      # Södermanland
    "ORB": ("59.376", "14.998", "PVGIS-SARAH3"),    # Örebro
    "OSD": ("63.267", "14.329", "PVGIS-SARAH3"),    # Jämtland
    "RNB": ("56.296", "15.204", "PVGIS-SARAH3"),    # Blekinge
    "SDL": ("63.116", "17.271", "PVGIS-SARAH3"),    # Västernorrland
    "STO": ("59.794", "17.872", "PVGIS-SARAH3"),    # Stockholm and Uppsala
    "UME": ("64.87", "17.837", "PVGIS-SARAH3"),     # Västerbotten
    "VBY": ("57.482", "18.514", "PVGIS-SARAH3"),    # Gotland
    "VST": ("59.82", "16.341", "PVGIS-SARAH3"),     # Västmanland
    "VXO": ("56.803", "14.585", "PVGIS-SARAH3"),    # Kronoberg
}

PANELS_W = [0.15, 0.5, 1, 1.5, 3, 5, 10, 15, 20, 25, 30, 40, 50, 100, 150, 200, 300]
TILTS = (90, 60, 40)
TREE_LINES = (0, 10, 15, 20, 30, 50)
FIRMWARE_MA = {"esm": 4.5, "official": 7.1}   # B.2: average draw at the battery

PVGIS_URL = ("https://re.jrc.ec.europa.eu/api/v5_3/seriescalc?lat={lat}&lon={lon}"
             "&raddatabase={db}&startyear=2005&endyear=2023&components=1"
             "&outputformat=csv&angle={tilt}&aspect=0")

# B.4 step 1: Muneer's overcast-sky index for shaded surfaces
MUNEER_B = 5.73

# B.4 step 2: weak-light curves, linear in log10(G) between these points,
# 0 below 3 W/m2 and 1 above 400 W/m2.
LL_G = np.array([3, 5, 10, 20, 50, 100, 200, 400], dtype=float)
LL_STANDARD = np.array([0, 0.35, 0.55, 0.70, 0.85, 0.92, 0.97, 1.0])
LL_PESSIMISTIC = np.array([0, 0.20, 0.40, 0.58, 0.78, 0.88, 0.95, 1.0])
TEMP_GAIN = 0.004            # power gain per degree below 25 C (air temperature)

# B.4 step 3: Faiman panel temperature
FAIMAN_U0, FAIMAN_U1 = 25.0, 6.84

# B.4 step 4: ideal single diode, CN3791 at a fixed set-point
NS = 11
K_BOLTZMANN = 1.380649e-23
Q_ELECTRON = 1.602176634e-19
VOC_TEMPCO = 0.003           # Voc falls 0.3 % per K
V_SET = 5.0                  # charger set-point, V
V_START = 5.10               # charger starts when Voc >= 1.02 x 5.0 V
CAL_VOC, CAL_G, CAL_TC = 5.897, 340.0, 30.0   # the one field reading
FIXED_POINT_ROUNDS = 30

# B.4 step 5: from panel power to battery charge
BUCK_EFF = 0.90
LUMPED_LOSS = 0.92
V_CHARGE = 3.9
I_MAX = 2.0                  # A, applied per hour -> Ah per hour

# B.5: derates and drawdown
DERATE = 0.92 * 0.85 * 0.90  # cold x usable window x ageing = 0.7038
SELF_DISCHARGE_PER_DAY = 0.03 / 30
FIRST_WINTER, N_WINTERS = 2005, 18  # 2005/06 ... 2022/23
NULL_EPISODE_DAYS = 365
NULL_MAX_LONG_WINTERS = 3

# B.6: the three variants, in output order [central, low, high]
VARIANTS = [
    {"name": "central", "n": 1.5, "ll": LL_STANDARD, "i_chip": 0.0035},
    {"name": "low", "n": 1.3, "ll": LL_STANDARD, "i_chip": 0.0010},
    {"name": "high", "n": 2.0, "ll": LL_PESSIMISTIC, "i_chip": 0.0035},
]


# ---------------------------------------------------------------------------
# B.4 step 1: sky-view factor R
# ---------------------------------------------------------------------------

def sky_view_factor(tilt_deg, tree_deg, b=MUNEER_B, n_el=180, n_az=180):
    """Share of the panel-weighted sky brightness above a uniform tree line.

    Sky brightness at elevation e is proportional to (1 + b sin e). Each sky
    cell (midpoint grid, 0.5 deg in elevation x 2 deg in azimuth) is weighted
    by that brightness, by the cosine of its angle to the panel normal (zero
    behind the panel) and by cos(e) for its solid angle.
    """
    if tree_deg == 0:
        return 1.0
    el = np.radians((np.arange(n_el) + 0.5) * 90.0 / n_el)
    az = np.radians((np.arange(n_az) + 0.5) * 360.0 / n_az)  # from panel azimuth
    E, A = np.meshgrid(el, az, indexing="ij")
    beta = math.radians(tilt_deg)
    cos_inc = math.sin(beta) * np.cos(E) * np.cos(A) + math.cos(beta) * np.sin(E)
    weight = (1.0 + b * np.sin(E)) * np.clip(cos_inc, 0.0, None) * np.cos(E)
    visible = np.degrees(E) > tree_deg
    return float(weight[visible].sum() / weight.sum())


# ---------------------------------------------------------------------------
# B.4 step 4: diode model helpers
# ---------------------------------------------------------------------------

def thermal_voltage(tc, n):
    """a(Tc) = Ns n k (Tc + 273.15) / q, in volts."""
    return NS * n * K_BOLTZMANN * (np.asarray(tc, dtype=float) + 273.15) / Q_ELECTRON


def voc_stc_from_calibration(n):
    """Voc at 1000 W/m2 and 25 C that reproduces the field reading.

    Kept in full double precision. The dossier prints it to 4 decimals
    (6.3959 / 6.4589 / 6.6163 V); using those rounded values instead shifts
    some needs by 0.1 to 0.6 mAh and fails several B.14 test vectors.
    """
    a30 = thermal_voltage(CAL_TC, n)
    return float((CAL_VOC - a30 * math.log(CAL_G / 1000.0))
                 / (1.0 - VOC_TEMPCO * (CAL_TC - 25.0)))


def start_irradiance(n, tc):
    """Light on the panel (W/m2) at which Voc reaches the start voltage,
    with the panel temperature held fixed at tc."""
    a = float(thermal_voltage(tc, n))
    voc_stc = voc_stc_from_calibration(n)
    return 1000.0 * math.exp((V_START - voc_stc * (1 - VOC_TEMPCO * (tc - 25))) / a)


def charger_fraction(G, Tc, n):
    """f = P(5.0 V)/P(Vmp) when Voc >= 5.10 V, else 0 (clipped to 0..1)."""
    f = np.zeros_like(G)
    lit = G > 0
    a = thermal_voltage(Tc[lit], n)
    voc = voc_stc_from_calibration(n) * (1 - VOC_TEMPCO * (Tc[lit] - 25.0)) \
        + a * np.log(G[lit] / 1000.0)
    y = voc / a
    # Maximum power point: x_m solves x + ln(1 + x) = y (fixed-point iteration)
    xm = y.copy()
    for _ in range(FIXED_POINT_ROUNDS):
        xm = y - np.log1p(xm)
    xs = V_SET / a
    denom = np.expm1(y)
    p_mpp = xm * (1 - np.expm1(xm) / denom)
    p_set = xs * (1 - np.expm1(xs) / denom)
    frac = np.clip(p_set / p_mpp, 0.0, 1.0)
    frac[voc < V_START] = 0.0
    f[lit] = frac
    return f


def weak_light(G, curve):
    """LL(G): linear in log10(G) between the curve points."""
    out = np.zeros_like(G)
    mid = (G >= LL_G[0]) & (G <= LL_G[-1])
    out[mid] = np.interp(np.log10(G[mid]), np.log10(LL_G), curve)
    out[G > LL_G[-1]] = 1.0
    return out


# ---------------------------------------------------------------------------
# PVGIS data (B.3)
# ---------------------------------------------------------------------------

def cache_name(code, tilt, trees):
    lat, lon, db = POINTS[code]
    return f"{float(lat):.4f}_{float(lon):.4f}_{db}_t{tilt}_h{trees}.csv"


def pvgis_url(code, tilt, trees):
    lat, lon, db = POINTS[code]
    url = PVGIS_URL.format(lat=lat, lon=lon, db=db, tilt=tilt)
    if trees > 0:  # tree line 0 sends no userhorizon (PVGIS terrain horizon)
        url += "&userhorizon=" + ",".join([str(trees)] * 8)
    return url


def load_pvgis(code, tilt, trees, cache_dir):
    """Return (day_index, n_days, first_date, Gb, Gd, Gr, T2m, WS10m)."""
    path = os.path.join(cache_dir, cache_name(code, tilt, trees))
    if not os.path.exists(path):
        os.makedirs(cache_dir, exist_ok=True)
        url = pvgis_url(code, tilt, trees)
        print(f"downloading {url}", file=sys.stderr)
        with urllib.request.urlopen(url, timeout=900) as resp:
            data = resp.read()
        if b"\ntime," not in data:  # PVGIS returns an error text instead of a CSV
            raise RuntimeError(f"PVGIS did not return a seriescalc CSV for {url}:\n"
                               + data[:500].decode("utf-8", "replace"))
        tmp = path + ".part"
        with open(tmp, "wb") as fh:
            fh.write(data)
        os.replace(tmp, path)

    with open(path, encoding="utf-8", errors="replace") as fh:
        lines = fh.read().splitlines()
    head = next(i for i, ln in enumerate(lines) if ln.startswith("time,"))
    cols = lines[head].split(",")
    rows = []
    for ln in lines[head + 1:]:
        if not ln or not ln[0].isdigit():
            break  # data ends at the first blank line before the legend
        rows.append(ln)
    stamps = [r[:8] for r in rows]                 # YYYYMMDD, a UTC date
    num = np.loadtxt(io.StringIO("\n".join(r.split(",", 1)[1] for r in rows)),
                     delimiter=",")
    col = {name: i - 1 for i, name in enumerate(cols)}
    dates, day_index = np.unique(np.array(stamps), return_inverse=True)
    return {
        "dates": dates,
        "day_index": day_index,
        "Gb": num[:, col["Gb(i)"]],
        "Gd": num[:, col["Gd(i)"]],
        "Gr": num[:, col["Gr(i)"]],
        "T2m": num[:, col["T2m"]],
        "WS10m": num[:, col["WS10m"]],
    }


# ---------------------------------------------------------------------------
# B.4 steps 1-6: hourly harvest summed per UTC date
# ---------------------------------------------------------------------------

def daily_harvests(wx, tilt, trees):
    """Daily harvest (Ah) per variant and panel, plus the floor harvests.

    Returns harvest[variant][panel] (arrays over days) and floor[variant].
    """
    R = sky_view_factor(tilt, trees)
    G = wx["Gb"] + R * wx["Gd"] + wx["Gr"]
    T2m = wx["T2m"]
    Tc = T2m + G / (FAIMAN_U0 + FAIMAN_U1 * wx["WS10m"])
    n_days = len(wx["dates"])
    idx = wx["day_index"]
    cold_gain = 1 + TEMP_GAIN * (25.0 - T2m)

    harvest, floor = [], []
    for var in VARIANTS:
        f = charger_fraction(G, Tc, var["n"])
        runs = f > 0
        rel_power = G / 1000.0 * weak_light(G, var["ll"]) * cold_gain * f  # W per Wp
        per_panel = []
        for wp in PANELS_W:
            p_batt = BUCK_EFF * np.maximum(0.0, wp * rel_power - V_SET * var["i_chip"])
            ah = np.minimum(p_batt * LUMPED_LOSS / V_CHARGE, I_MAX)
            ah[~runs] = 0.0
            per_panel.append(np.bincount(idx, weights=ah, minlength=n_days))
        harvest.append(per_panel)
        # Floor: every hour in which the charger can start (f > 0, i.e.
        # Voc >= 5.10 V) delivers 2 A. This includes hours below 3 W/m2,
        # where LL(G) = 0 and the finite panels above harvest nothing.
        floor.append(np.bincount(idx, weights=I_MAX * runs, minlength=n_days))
    return harvest, floor, R


# ---------------------------------------------------------------------------
# B.5: drawdown, worst winter in five, derates, null rule
# ---------------------------------------------------------------------------

def drawdown(daily_need_ah, harvest_cols):
    """Deficit per day for several harvest series at once.

    Returns (deficit, episode_start) with shape (n_days, n_cols); episode_start
    is the index of the first day of the current run of positive deficit.
    """
    H = np.column_stack(harvest_cols)
    n_days, n_cols = H.shape
    deficit = np.zeros((n_days, n_cols))
    start = np.zeros((n_days, n_cols), dtype=int)
    d = np.zeros(n_cols)
    s = np.zeros(n_cols, dtype=int)
    for t in range(n_days):
        new = np.maximum(0.0, d + daily_need_ah - H[t])
        s = np.where((new > 0) & (d == 0), t, s)  # a new episode starts today
        d = new
        deficit[t] = d
        start[t] = s
    return deficit, start


def winter_bounds(dates):
    """(first, last) day index of each winter 1 July .. 30 June."""
    pos = {d: i for i, d in enumerate(dates)}
    out = []
    for y in range(FIRST_WINTER, FIRST_WINTER + N_WINTERS):
        out.append((pos[f"{y}0701"], pos[f"{y + 1}0630"]))
    return out


def winter_maxima(deficit_col, start_col, bounds):
    """Per winter: (largest deficit in Ah, episode length D in days).

    The episode is the run of consecutive days with deficit > 0 that contains
    the day of the largest deficit. It may have started before 1 July of that
    winter, even years earlier; that is how D can exceed 365 days. A winter
    with no deficit at all gets D = 0.
    """
    res = []
    for a, b in bounds:
        seg = deficit_col[a:b + 1]
        k = int(np.argmax(seg))           # first occurrence of the largest value
        vmax = float(seg[k])
        if vmax > 0:
            D = (a + k) - int(start_col[a + k]) + 1   # inclusive count
        else:
            D = 0
        res.append((vmax, D))
    return res


def need_from_winters(winters):
    """Worst-in-five level, chosen D, and need in mAh (None = null)."""
    # Sort worst to best; Python's sort is stable, so ties keep chronology.
    order = sorted(range(len(winters)), key=lambda i: -winters[i][0])
    v3, v4 = winters[order[2]][0], winters[order[3]][0]
    level = v3 + 0.8 * (v4 - v3)
    # D from the winter whose maximum is nearest the level (first in sorted
    # order on a tie, i.e. the 3rd worst if the 3rd and 4th tie).
    pick = min(order, key=lambda i: abs(winters[i][0] - level))
    D = winters[pick][1]
    long_winters = sum(1 for _, d in winters if d > NULL_EPISODE_DAYS)
    if D > NULL_EPISODE_DAYS or long_winters > NULL_MAX_LONG_WINTERS:
        return {"level": level, "D": D, "winter": pick, "need": None}
    need = level / DERATE / (1 - SELF_DISCHARGE_PER_DAY * D) * 1000.0
    return {"level": level, "D": D, "winter": pick, "need": round(need, 1)}


def running_minimum(values):
    """Bigger panel never needs a bigger battery; nulls stay null."""
    out, best = [], None
    for v in values:
        if v is None:
            out.append(None)
            continue
        if best is not None and v > best:
            v = best
        best = v if best is None else min(best, v)
        out.append(v)
    return out


# ---------------------------------------------------------------------------
# One full case
# ---------------------------------------------------------------------------

def compute_case(code, tilt, trees, firmware, cache_dir, detail=False):
    wx = load_pvgis(code, tilt, trees, cache_dir)
    harvest, floor_h, R = daily_harvests(wx, tilt, trees)
    daily_need = FIRMWARE_MA[firmware] * 24 / 1000.0          # Ah per day
    bounds = winter_bounds(wx["dates"])

    cols = [h for per_var in harvest for h in per_var] + floor_h
    deficit, start = drawdown(daily_need, cols)

    n_p = len(PANELS_W)
    raw = [[None] * 3 for _ in range(n_p)]
    details = {}
    for vi, var in enumerate(VARIANTS):
        for pi in range(n_p):
            c = vi * n_p + pi
            w = winter_maxima(deficit[:, c], start[:, c], bounds)
            r = need_from_winters(w)
            raw[pi][vi] = r["need"]
            if detail:
                details[(var["name"], PANELS_W[pi])] = (w, r)
    floor = []
    for vi, var in enumerate(VARIANTS):
        c = 3 * n_p + vi
        w = winter_maxima(deficit[:, c], start[:, c], bounds)
        r = need_from_winters(w)
        floor.append(r["need"])
        if detail:
            details[(var["name"], "floor")] = (w, r)

    # Running minimum per variant across panel sizes (floors not adjusted).
    # It runs AFTER the null rule: without the null rule the smallest panels
    # can give negative needs (D >= 1000 days), which would otherwise spread
    # to every larger panel.
    adjusted = [list(t) for t in raw]
    for vi in range(3):
        col = running_minimum([raw[pi][vi] for pi in range(n_p)])
        for pi in range(n_p):
            adjusted[pi][vi] = col[pi]

    result = {
        "point": code, "tilt": tilt, "trees": trees, "firmware": firmware,
        "R": round(R, 4),
        "panels_W": PANELS_W,
        "need": adjusted,           # [central, low, high] per panel, mAh
        "need_before_running_min": raw,
        "floor": floor,
    }
    if detail:
        result["_details"] = details
        result["_harvest"] = harvest
        result["_dates"] = wx["dates"]
    return result


# ---------------------------------------------------------------------------
# --check: dossier B.14 test vectors
# ---------------------------------------------------------------------------

N = None  # null: "panelen räcker inte ens på sommaren"
TEST_VECTORS = [
    # (point, tilt, firmware, trees, panel W, expected [central, low, high])
    # Jönköping rows are for the rounded public point (see POINTS).
    ("JKG", 90, "esm", 20, 10, [6925.7, 4248.8, 14667.4]),
    ("JKG", 90, "esm", 0, 10, [501.7, 355.7, 847.8]),
    ("JKG", 90, "official", 20, 10, [15455.2, 10861.0, 26540.6]),
    ("JKG", 60, "esm", 20, 10, [1746.5, 568.9, 6471.8]),
    ("JKG", 40, "esm", 20, 10, [516.3, 324.5, 3145.8]),
    ("JKG", 90, "esm", 20, 1, [22093.4, 20403.9, 22485.5]),
    ("JKG", 90, "esm", 20, 0.15, [N, N, N]),
    ("JKG", 90, "esm", 50, 3, [44168.4, 30583.4, N]),
    ("MMX", 90, "esm", 10, 5, [1195.5, 884.0, 1697.1]),
    ("LLA", 90, "esm", 20, 10, [16918.7, 15061.7, 22768.4]),
    ("OSD", 60, "official", 30, 20, [17420.9, 15602.4, 23330.5]),
]
GVX_VECTOR = ("GVX", 90, "esm", 50, 25, 40700.2, 40983.3)  # high after / before
FLOOR_VECTORS = [
    ("JKG", 90, "esm", 20, [307.5, 184.3, 2526.4]),
    ("LLA", 90, "esm", 20, [8108.8, 6259.5, 13262.6]),
]


def _same(a, b, tol=0.05001):
    if a is None or b is None:
        return a is None and b is None
    return abs(a - b) <= tol


def run_check(cache_dir):
    cache = {}

    def case(code, tilt, trees, fw):
        key = (code, tilt, trees, fw)
        if key not in cache:
            cache[key] = compute_case(code, tilt, trees, fw, cache_dir)
        return cache[key]

    rows, all_ok = [], True
    for code, tilt, fw, trees, wp, exp in TEST_VECTORS:
        got = case(code, tilt, trees, fw)["need"][PANELS_W.index(wp)]
        ok = all(_same(g, e) for g, e in zip(got, exp))
        all_ok &= ok
        rows.append({"case": f"{code} t{tilt} {fw} h{trees} {wp} W",
                     "expected": exp, "got": got, "pass": ok})
    code, tilt, fw, trees, wp, after, before = GVX_VECTOR
    r = case(code, tilt, trees, fw)
    i = PANELS_W.index(wp)
    got = [r["need"][i][2], r["need_before_running_min"][i][2]]
    ok = _same(got[0], after) and _same(got[1], before)
    all_ok &= ok
    rows.append({"case": f"{code} t{tilt} {fw} h{trees} {wp} W high (after, before running min)",
                 "expected": [after, before], "got": got, "pass": ok})
    for code, tilt, fw, trees, exp in FLOOR_VECTORS:
        got = case(code, tilt, trees, fw)["floor"]
        ok = all(_same(g, e) for g, e in zip(got, exp))
        all_ok &= ok
        rows.append({"case": f"{code} t{tilt} {fw} h{trees} floor",
                     "expected": exp, "got": got, "pass": ok})
    for row in rows:
        print(("PASS " if row["pass"] else "FAIL ") + row["case"]
              + f"  expected {row['expected']}  got {row['got']}")
    print("ALL PASS" if all_ok else "SOME FAILED")
    return all_ok


# ---------------------------------------------------------------------------
# --tables and --example: intermediate values quoted in the dossier
# ---------------------------------------------------------------------------

def print_tables():
    print("R (Muneer b = 5.73):")
    for tilt in TILTS:
        vals = [f"{sky_view_factor(tilt, h):.4f}" for h in TREE_LINES[1:]]
        print(f"  tilt {tilt}: " + "  ".join(f"{h}deg={v}" for h, v in zip(TREE_LINES[1:], vals)))
    print(f"  sensitivity vertical 20deg: b=0 {sky_view_factor(90, 20, b=0):.4f}, "
          f"b=2 {sky_view_factor(90, 20, b=2):.4f}")
    print("Voc_stc:")
    for var in VARIANTS:
        print(f"  n={var['n']}: {voc_stc_from_calibration(var['n']):.4f} V")
    print("Light needed for the charger to start (W/m2):")
    for var in VARIANTS:
        vals = [f"{start_irradiance(var['n'], tc):.1f}" for tc in (-10, 0, 10, 25)]
        print(f"  n={var['n']}: -10C {vals[0]}, 0C {vals[1]}, 10C {vals[2]}, 25C {vals[3]}")


def print_example(cache_dir):
    r = compute_case("JKG", 90, 20, "esm", cache_dir, detail=True)
    winters, res = r["_details"][("central", 10)]
    print("JKG vertical 20deg trees, 10 W, central, EasySkyMesh")
    print(f"  R = {r['R']}")
    h = r["_harvest"][0][PANELS_W.index(10)]
    months = np.array([d[4:6] for d in r["_dates"]])
    dj = np.isin(months, ["12", "01"])
    print(f"  mean Dec-Jan harvest = {h[dj].mean() * 1000:.1f} mAh/day "
          f"(all Dec/Jan days 2005-2023)")
    for k, (v, D) in enumerate(winters):
        print(f"  {FIRST_WINTER + k}/{(FIRST_WINTER + k + 1) % 100:02d}: {v:.4f} Ah, D = {D}")
    print(f"  level = {res['level']:.4f} Ah, D chosen = {res['D']} "
          f"(winter {FIRST_WINTER + res['winter']}/{(FIRST_WINTER + res['winter'] + 1) % 100:02d}),"
          f" need = {res['need']} mAh")
    print(f"  triplet [central, low, high] = {r['need'][PANELS_W.index(10)]}")


# ---------------------------------------------------------------------------
# Command line
# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("point", nargs="?", choices=sorted(POINTS), help="point code")
    ap.add_argument("--tilt", type=int, choices=TILTS, default=90)
    ap.add_argument("--trees", type=int, choices=TREE_LINES, default=20)
    ap.add_argument("--firmware", choices=sorted(FIRMWARE_MA), default="esm")
    ap.add_argument("--cache-dir", default="pvgis_cache")
    ap.add_argument("--check", action="store_true", help="run the B.14 test vectors")
    ap.add_argument("--tables", action="store_true", help="print R, Voc_stc, start light")
    ap.add_argument("--example", action="store_true", help="print the B.8 worked example")
    args = ap.parse_args()

    if args.tables:
        print_tables()
    if args.example:
        print_example(args.cache_dir)
    if args.check:
        sys.exit(0 if run_check(args.cache_dir) else 1)
    if args.point:
        r = compute_case(args.point, args.tilt, args.trees, args.firmware, args.cache_dir)
        print(json.dumps(r, ensure_ascii=False))
    elif not (args.tables or args.example):
        ap.print_help()


if __name__ == "__main__":
    main()
