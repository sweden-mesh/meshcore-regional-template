---
title: "The solar calculator: method and verification"
seoTitle: "The solar calculator's method"
description: "How the solar calculator works out the battery a solar-powered MeshCore repeater needs: model, assumptions, data, checks and known weaknesses."
url: "/en/wizard/solcell/method/"
lead: false
build:
  list: never
date: 2026-11-14
lastmod: 2026-11-17
---

This page describes the method behind [the solar calculator](/wizard/solcell/). It is written for
anyone who wants to review or recalculate the figures. The sections are numbered B.1–B.16; the
reference script refers to them.

Figures in the text are labelled with how they should be read:

| Label | Meaning |
|---|---|
| *current* | Taken from the calculator's data to explain something. The data file always takes precedence over the text. |
| *historical* | From a replaced version of the model. Only shows what has changed. |
| *sensitivity* | A hypothetical run. Never used for sizing. |
| *example* | A step in the worked example (B.8). |
| *test vector* | For anyone recalculating. Jönköping values apply to the rounded point 57.78° N, 14.16° E, which the data also uses. |
| *field measurement* | From the indoor field test, with a different charger. Never used for sizing. |
| *check result* | The outcome of a check. |

Formula constants and inputs in B.2–B.7 are not labelled: they define the method.

## B.1 What the figures answer, and what they don't {#b1}

**The question.** How much battery capacity does a solar-powered MeshCore repeater need so that it
does not run flat in a bad winter? A bad winter here is the worst winter in five years.

**The answer.** A battery need in mAh, before safety margin, per site, panel angle, tree line,
firmware and panel size. Each case has three values: a central one, a low (optimistic) one and a
high (pessimistic) one. The calculator then adds snow days and margin and converts the result to a
number of cells.

**It does not answer:** radio range, coverage or placement; summer behaviour, except as the time
when the battery charges fully; prices or which cell to buy; repeaters with other hardware, other
chargers or much higher consumption (the method carries over, the figures do not).

## B.2 The system being modelled {#b2}

| Part | Assumption |
|---|---|
| Radio board | Seeed XIAO nRF52840 with the Wio-SX1262 radio module, powered from a group of lithium-ion cells in parallel (1S) |
| Charger | CN3791 solar charger board. Holds the panel at a fixed voltage, the setting, here 5.0 V. At most 2 A into the battery. The board's LEDs removed. |
| Battery | 1S lithium-ion, 18650 cells in parallel. The calculator counts on 3000 mAh per cell, nominal. |
| Panel | Clas Ohlson's "Northlight Flexible Solar System" panel, sold as 15 W (art. 36-9423), with the electronics removed. A laminate of 10 or 11 cut cell strips in series, open-circuit voltage about 6.0–6.6 V in full sun. Modelled as about 10 W actual power in full sun. |
| Other panel sizes | The same panel type scaled by area: same voltage, same behaviour in weak light, more or less area |
| Placement | Facing due south. Vertical (default), 60° or 40°. |
| Trees | No trees (PVGIS's own terrain horizon), or an even tree line all around at 10°, 15°, 20°, 30° or 50° |

**The panel's voltage matters.** All panel sizes in the data are assumed to be 6 V panels of this
type, held at 5.0 V, about 77 % of the open-circuit voltage in full sun.

- An ordinary 12 V panel (36 cells, about 21 V open circuit) on a charger set to 5.0 V would
  lose most of its power. The figures do not apply to it.
- Set to the same share of its own open-circuit voltage (about 16 V), and with cells that behave
  like this panel's, such a panel gives the same result in the model's equations except for the
  charger's own consumption, which is about three times higher at 16 V than at 5.0 V. *Sensitivity:*
  in Jönköping, vertical, 20° trees, this raises the central need by about 35–65 % for panels of
  5–30 W and the high one by about 5–15 %. For such panels the figures are optimistic.

**The repeater's consumption.** Assumed constant around the clock.

| Firmware | Average current at the battery | Per day |
|---|---|---|
| EasySkyMesh (power-saving branch), `powersaving on` and `set radio.rxps max` | 4.5 mA | 108 mAh |
| Official MeshCore with `powersaving on` | 7.1 mA | 170.4 mAh |

**Where the consumption comes from.** Neither figure is measured on a finished node. Both are
estimates from September 2026, built on published measurements on the same XIAO nRF52840 +
Wio-SX1262.

- **EasySkyMesh, 4.5 mA** (likely; range 4.1–5.4 mA). Radio and processor give 4.3 mA, from a
  fit to 20 published current measurements of the branch's receive cycling (about 0.66 mA plus
  6.29 mA times the share of the time the radio listens), projected to the `max` mode in release
  PowerSaving 17.1.3: 0.66 + 6.29 × 0.58 ≈ 4.3 mA. Transmitting adds about 0.16 mA (2 minutes of
  transmit time per day at 118 mA). Leakage currents add about 0.05 mA, mostly the charger board's
  own consumption at night.
- **Official firmware, 7.1 mA** (likely; range 5.9–8.0 mA). Starts from a published measurement of
  6.92 mA on this board, with power saving, the radio always listening and no traffic, plus the
  same additions for transmitting and leakage.
- **Traffic.** Both assume a quiet network: 2 minutes of transmitting per day and no extra receive
  time. A busy repeater draws more; for busy sites the consumption is optimistic.
- A current log over one day on a real node would replace both (B.13).

**The boards (since 17 November 2026).** The calculator lets the visitor choose a board, not just
firmware. Each board has a measured or published average current at the battery per firmware, and
is rounded **up** to the nearest level in a grid of loads: 4.5, 5.2, 6, 7.1, 8.6, 9, 10.5, 13, 13.4
and 190 mA. The model is only calculated for those levels, so every figure in the calculator can be
recalculated with the reference script, and a board never gets a smaller battery than the source
supports. A board with no source is not included; a firmware with no figure for the board cannot be
chosen.

| Board | EasySkyMesh | Official MeshCore | Source | Confidence |
|---|---|---|---|---|
| Seeed XIAO nRF52840 + Wio-SX1262 | 4.5 mA (grid 4.5) | 7.1 mA (7.1) | [S1], the table above | high |
| RAK4631 | 6.0 mA (6) ¹ | 6.0 mA (6) | [S2], [S3] | medium; EasySkyMesh low |
| Heltec T096 | 5.2 mA (5.2) | 8.6 mA (8.6) | [S1] PPK2 | medium–high |
| Heltec V3 | 9 mA (9) ² | 10.49 mA (10.5) | [S3], [S4] | medium; EasySkyMesh low |
| Heltec V4, amplifier (FEM) on | 13.4 mA (13.4) ¹ | 13.29 mA (13.4) | [S2], [S4] | low |
| Heltec V4.3, FEM off | 13 mA (13) ² | – | [S3] | low |
| Seeed XIAO ESP32-S3 + Wio-SX1262 | 7 mA (7.1) ² | – | [S3], [S5] | low |
| Raspberry Pi Zero 2 W + SX1262-HAT | 190 mA (190), no firmware to choose | | [S6]–[S14], derived below | medium |

**Other board** (B-322) comes last in each family, for a board that is not in the list. It is
calculated with the family's highest sourced current, so that the battery is never too small, and it
is always marked as less certain:

- **Other nRF52 board:** 6 mA with EasySkyMesh (RAK4631) and 8.6 mA with official firmware (Heltec T096).
- **Other ESP32 board:** 13.4 mA with both (Heltec V4 with the amplifier on).
- **Other Raspberry Pi:** 190 mA, like the Pi Zero 2 W; larger models draw more.

¹ No PPK2 measurement exists; the figure is the upper part of the range a multimeter showed
(operator decision 2026-11-17), so it is cautiously high. ² The `powersaving on` mode without
receive cycling, the only published figure; cautious. A multimeter shows a range, not an average,
and only PPK2 averages should really feed the model; these boards are therefore marked as less
certain in the calculator. The Heltec V4 draws differently depending on board version and whether
the amplifier (FEM) is on: 13–16 mA for almost the same setting in different sources.

**Raspberry Pi Zero 2 W.** Nobody has published the current for a Pi Zero as a MeshCore repeater
(openHop Repeater, formerly pyMC_Repeater [S9], [S10]). The figure is derived: Pi Zero 2 W idle with
Wi-Fi 80–130 mA at 5 V, central 120 mA ([S6], [S7], [S8]), plus about 4 mA for the SX1262 module
([S12]), through a 5 V converter with 85–90 % efficiency ([S14]) from a cell at 3.7 V:
124 × 5 / (0.88 × 3.7) ≈ 190 mA, range 126–213 mA. The daemon's own processor load, GPS on the
module and writes to the memory card are not included and raise the figure. Raspberry Pi's own
documentation gives a higher current for active use ([S13]). The older **Pi Zero W** draws somewhat
less, about 160 mA at the cell (range 126–189 mA, [S7], [S11]), but openHop's installation guide does
not mention it, so it is not offered as a choice. 190 mA is about 42 times the XIAO board with
EasySkyMesh: in Jönköping, on an open south wall, the worst winter in five needs about 100 W of panel
and 76 cells. The model's charger (CN3791 at 5.0 V, at most 2 A) is not built for that much power;
the figures show how big the energy gap is, not a shopping list.

**A third firmware is mentioned but cannot be chosen.** dt267's low-power build of MeshCore ([S4])
gives lower idle values (Heltec V3 3.82 mA, RAK4631 2.21 mA, T096 3.64 mA, V4.3 4.52 mA with LNA off;
the measurement method is not stated). It lies outside the calculator's two firmwares.

**What changed on 17 November 2026.** The tables for 4.5 and 7.1 mA are unchanged: the build script
compared them with the published file for all 20 points and they are equal. New are the tables for
the eight other levels in the grid, the snow allowance per level, and that the data is in one file
per county (B.14).

**Where 10 W comes from.** A planning assumption from the first sizing in September 2026: a cheap
laminate of cut cells, sold as 15 W, was assumed to give about two thirds of its rating. It has not
been measured in full sun. *Sensitivity:* the only field measurement (B.4 step 4) extrapolates to
about 10–15 W, with a typical fill factor of 0.7 and 340–500 W/m² on the panel; 10 W is therefore on
the cautious side. The estimate was made when this document was written and has not been reviewed.
In the calculator the visitor chooses the panel's actual power, so the assumption only sets the
default value of 10 W.

## B.3 Weather data {#b3}

**Source.** PVGIS version 5.3, the free solar database of the EU's Joint Research Centre, the
"seriescalc" service with hourly values for the years 2005–2023: 166,536 hours per file.

**Datasets.**

- PVGIS-SARAH3, satellite-based sunlight data, for 19 of the 20 points.
- PVGIS-ERA5, a reanalysis from ECMWF, for Norrbotten, whose point lies north of SARAH3's coverage
  (which ends at about 65° N).
- Air temperature and wind speed are in the same file; for SARAH3 points PVGIS takes them from ERA5.

A *reanalysis* such as ERA5 is a weather model run backwards over past decades, fed with
observations, which gives consistent hourly values everywhere.

**The request, exactly as it was made.**

```text
https://re.jrc.ec.europa.eu/api/v5_3/seriescalc?lat={lat}&lon={lon}&raddatabase={db}&startyear=2005&endyear=2023&components=1&outputformat=csv&angle={tilt}&aspect=0
```

- `angle` is the tilt from the horizontal: 90, 60 or 40. `aspect=0` means south.
- `components=1` splits the light on the panel into direct (`Gb(i)`), diffuse (`Gd(i)`) and
  ground-reflected (`Gr(i)`), in W/m².
- For a tree line of h degrees, `&userhorizon=h,h,h,h,h,h,h,h` is added: eight equal values, an even
  horizon of h° all around.
- **Tree line 0 sends no `userhorizon`.** PVGIS then uses its own terrain horizon for the point,
  which is not flat. In hilly northern areas the terrain alone blocks some winter sun.
- For tree lines from 10° upwards, the even horizon replaces PVGIS's terrain horizon; it is not added to it.
- No other parameters are sent.
- One file per point, angle and tree line: 20 × 3 × 6 = 360 files, about 2.9 GB.

**The file.** The data rows follow the row that starts with `time,` and end at the first empty row.
The model uses `time` (e.g. `20050101:0011`; SARAH3 rows are at minute 11, ERA5 rows at minute 30;
the times are UTC), `Gb(i)`, `Gd(i)`, `Gr(i)` (W/m²), `T2m` (air temperature at 2 m, °C) and
`WS10m` (wind at 10 m, m/s). `H_sun` and `Int` are not used; *check result:* `Int`, which marks
reconstructed hours, was 0 in every hour of the nine files in B.14.

**Days.** A day is a UTC date, the first 8 characters of the timestamp. UTC midnight is 01:00
Swedish winter time, so it is dark, and no daylight hours are split.

**The 20 points.** Each county is represented by one point: the centroid of the county's observers.
Stockholm and Uppsala share a point. The three-letter codes are labels borrowed from an airport code
in the county; the points are not at the airports. The elevation is the value in the PVGIS file's
header. *Input.*

| Code | County | Latitude | Longitude | Elevation (m) | Dataset |
|---|---|---|---|---|---|
| JKG | Jönköping | 57.78 | 14.16 | 104 | SARAH3 |
| BLE | Dalarna | 60.972 | 14.37 | 290 | SARAH3 |
| GOT | Västra Götaland | 58.318 | 12.91 | 77 | SARAH3 |
| GVX | Gävleborg | 61.477 | 16.3 | 228 | SARAH3 |
| HAD | Halland | 56.976 | 12.827 | 149 | SARAH3 |
| KLR | Kalmar | 57.252 | 16.05 | 107 | SARAH3 |
| KSD | Värmland | 59.786 | 13.154 | 65 | SARAH3 |
| LLA | Norrbotten | 66.951 | 20.1 | 387 | **ERA5** |
| LPI | Östergötland | 58.368 | 15.662 | 89 | SARAH3 |
| MMX | Skåne | 55.964 | 13.603 | 145 | SARAH3 |
| NYO | Södermanland | 59.094 | 16.7 | 45 | SARAH3 |
| ORB | Örebro | 59.376 | 14.998 | 208 | SARAH3 |
| OSD | Jämtland | 63.267 | 14.329 | 294 | SARAH3 |
| RNB | Blekinge | 56.296 | 15.204 | 35 | SARAH3 |
| SDL | Västernorrland | 63.116 | 17.271 | 217 | SARAH3 |
| STO | Stockholm and Uppsala | 59.794 | 17.872 | 45 | SARAH3 |
| UME | Västerbotten | 64.87 | 17.837 | 325 | SARAH3 |
| VBY | Gotland | 57.482 | 18.514 | 34 | SARAH3 |
| VST | Västmanland | 59.82 | 16.341 | 71 | SARAH3 |
| VXO | Kronoberg | 56.803 | 14.585 | 151 | SARAH3 |

**The Jönköping point.** Jönköping's point is rounded to two decimals. The calculator's data (v4) is
calculated at exactly that point, so the table, the data and the reference script agree exactly.
Earlier versions used a private location nearby. *Historical:* the switch to the rounded point
changed 317 of 1,836 need values for Jönköping, by at most 8.3 mAh; no floor changed; one value near
the limit where no battery is enough became null (vertical, official firmware, 50° trees, 3 W, low
variant); no rounded table value and no result in the calculator changed.

## B.4 From sunlight to charge, hour by hour {#b4}

Each row in the PVGIS file is one hour. The model runs the steps below for every hour 2005–2023.

**Step 1. The trees block part of the diffuse sky.** The tree line hides the lower part of the sky.
The model treats the trees as black and even all around, and multiplies the diffuse light by a sky
factor R:

```text
G = Gb(i) + R × Gd(i) + Gr(i)        [W/m² on the panel]
```

- **R** is the share of the panel-weighted sky brightness that is visible above a tree line of h
  degrees. R = 1 without trees.
- **The sky's brightness** follows Muneer's law for an overcast sky: proportional to (1 + b·sin e) at
  elevation e, with b = 5.73, Muneer's index for shaded surfaces (from his published constant
  2b/[π(3+2b)] = 0.25227).
- **Why that sky.** PVGIS calculates `Gd(i)` with Muneer's model and uses the constant 0.25227 when
  the sun is behind the horizon. R uses the same sky shape, so it agrees with PVGIS's assumption in
  the hours when the sun is behind the trees. Behind 20° trees in Jönköping that applies to all
  daylight hours from late October to mid-February. When the sun is above the tree line, R is
  somewhat milder than PVGIS's own sky shape would give.
- **Calculation.** Numerically over the sky hemisphere, 0–90° elevation, on a 180 × 180 grid with
  cell centres: 0.5° in elevation and 2° in azimuth, symmetric about south. Each cell is weighted by
  the brightness, by the cosine of the angle between the cell and the panel's direction (zero behind
  the panel) and by cos(e) for the cell's solid angle. R is the sum of the weights for cells with
  their centre above h, divided by the sum over all cells.
- `Gb(i)` and `Gr(i)` are used as PVGIS gives them in the file for that tree line; PVGIS has already
  removed direct sun when the sun is behind the horizon.
- **Why R is still needed.** In the hours when the sun is behind the given horizon, `Gd(i)` and
  `Gr(i)` differ from the file with a clear horizon. *Check result:* on a vertical panel `Gd(i)` is
  about 0.71 times the clear-horizon value in overcast hours. That is PVGIS switching from its sunlit
  to its shaded Muneer formula, a change of assumed sky shape; the part of the sky hidden by the
  trees is not removed. That is why R is used anyway.

| Angle | 10° trees | 15° | 20° | 30° | 50° |
|---|---|---|---|---|---|
| Vertical | 0.9041 | 0.8351 | 0.7550 | 0.5742 | 0.2264 |
| 60° | 0.9495 | 0.9091 | 0.8587 | 0.7309 | 0.4136 |
| 40° | 0.9681 | 0.9400 | 0.9026 | 0.7992 | 0.4891 |

*Sensitivity, not used:* with a uniform sky (b = 0), R for vertical at 20° would be 0.5732 instead of
0.7550; with b = 2, the CIE's classic overcast sky, 0.6910.

**Step 2. The panel's power at its best operating point.**

```text
P_mpp = Wp × G/1000 × LL(G) × (1 + 0.004 × (25 − T2m))      [W]
```

- `Wp` is the panel's actual power in full sun (1000 W/m², 25 °C), not the rated power: 0.15–300 W in
  the data, 10 W for Clas Ohlson's panel.
- `(1 + 0.004 × (25 − T2m))` is crystalline silicon's usual gain in the cold, 0.4 % per degree, using
  air temperature, not panel temperature (B.12).
- `LL(G)` is the weak-light curve: the panel's efficiency relative to full sun, linearly interpolated
  in log10(G) between the points below. 0 at 3 W/m² or less, 1 above 400 W/m².

| G (W/m²) | 3 | 5 | 10 | 20 | 50 | 100 | 200 | 400 |
|---|---|---|---|---|---|---|---|---|
| Standard curve | 0 | 0.35 | 0.55 | 0.70 | 0.85 | 0.92 | 0.97 | 1.0 |
| Pessimistic curve | 0 | 0.20 | 0.40 | 0.58 | 0.78 | 0.88 | 0.95 | 1.0 |

The curves are an assessment of the shape for a cheap monocrystalline laminate with cut cells, in
the style of the curves in the IEC 61853-1 standard. They are not measured on the panel.
IEC 61853-1 stops at 100 W/m², so the curve below that has no support in the standard. Published
measurements on 41 cells from eight manufacturers (Reich et al. 2009) gave efficiencies at about
3 W/m² from roughly 0.1 to 0.8 of the full-sun value, with large differences even within the same
manufacturer. The curves are therefore a band, not a known value; that is why the high variant uses
the pessimistic curve.

**Step 3. The panel's temperature** (Faiman's model):

```text
Tc = T2m + G / (25.0 + 6.84 × WS10m)      [°C]
```

25.0 and 6.84 are Faiman's original coefficients and the default values in pvlib. PVGIS uses 26.9
and 6.2 for free-standing crystalline panels, which gives almost the same temperature at normal wind
speeds. Tc is only used for the panel's voltage in step 4.

**Step 4. Does the charger start, and what does it get?** The CN3791 only starts charging when the
panel's open-circuit voltage reaches about 1.02 times the setting, that is 5.10 V. The factor comes
from the datasheet: the MPPT pin starts at 1.23 V and regulates at 1.205 V, and 1.23/1.205 ≈ 1.02. In
weak light the panel's voltage drops, so on a dark day the charger may never start.

The panel's voltage is modelled as an ideal diode with no series or parallel resistance:

```text
I/Isc = 1 − (e^(V/a) − 1) / (e^(Voc/a) − 1)
a(Tc) = Ns × n × k × (Tc + 273.15) / q          Ns = 11, k = 1.380649e-23 J/K, q = 1.602176634e-19 C
Voc(G, Tc) = Voc_stc × (1 − 0.003 × (Tc − 25)) + a(Tc) × ln(G/1000)
```

- `Isc` is the short-circuit current, `Voc` the open-circuit voltage, `Vmp` the voltage at maximum
  power.
- `n` is the diode's ideality factor. It decides how fast the voltage falls in weak light, and it is
  the most important unmeasured panel parameter; the three variants in B.6 differ in it.
- Only the product Ns × n matters. Each variant gives a measurable voltage slope: the rise in Voc per
  tenfold increase in short-circuit current, 0.85 V (low), 0.98 V (central) and 1.30 V (high) at
  25 °C. With 10 cells instead of 11, n would be 10 % higher for the same slope; the cell count
  therefore does not affect the result.
- Hours with G = 0 have f = 0; the logarithm is never taken of zero.

**Calibration.** `Voc_stc` is set so that the model reproduces the only field measurement (*field
measurement*): Voc 5.897 V with a short-circuit current of 1.115 A, in early November 2026, indoors,
with the panel standing in a south-facing window behind two panes of glass. The model assumes
340 W/m² on the panel and 30 °C in the cell at the time of the measurement:

```text
Voc_stc = (5.897 − a(30 °C) × ln(340/1000)) / (1 − 0.003 × 5)
        = 6.3959 V (n = 1.3), 6.4589 V (n = 1.5), 6.6163 V (n = 2.0)
```

- **Calculate Voc_stc at full double precision from the formula.** The four-decimal values are
  rounded for display; plugging them in changes some needs by up to 0.6 mAh, and some test vectors in
  B.14 then do not match.
- How 340 W/m² and 30 °C were estimated was not written down. *Check result:* 340 W/m² corresponds to
  a full-sun short-circuit current of about 3.3 A, close to the field notes' expectation of about
  3 A.
- *Check result:* a later review judged 350–500 W/m² and 35–45 °C in the cell to be more likely. The
  two errors work in opposite directions and largely cancel out. *Sensitivity:* the calibration
  point alone is worth about ±25 % on the result at 5.0 V.

**The charger's share.** If the panel's Voc in that hour is at least 1.02 × 5.0 V, the charger runs,
and it gets the panel's power at 5.0 V instead of at the best point:

```text
f = P(5.0 V) / P(Vmp)    if Voc ≥ 5.10 V,   else f = 0
```

With y = Voc/a and x_m = Vmp/a, x_m solves the equation x + ln(1 + x) = y. Then
P(Vmp) ∝ x_m × (1 − (e^x_m − 1)/(e^y − 1)) and P(5.0 V) ∝ x_s × (1 − (e^x_s − 1)/(e^y − 1)) with
x_s = 5.0/a; the common factor a × Isc cancels out. The model's code solves x_m with 30 rounds of
the iteration x ← y − ln(1 + x) starting from x = y; any exact solver gives the same published
values. f is clamped to between 0 and 1.

**Two panel descriptions, no double counting.** The panel's power comes only from `Wp` and `LL(G)`
in step 2. The diode model is used only for the charger's start condition and the ratio f; its
absolute current and power are never used (*sensitivity:* they would correspond to a panel of about
16 W in full sun). The physics review (B.9) checked that LL and f do not count the same loss twice:
LL scales the efficiency at the best point, f is the extra loss from holding the panel at 5.0 V.
*Check result:* the diode model's own relative efficiency in weak light, 0.83, 0.75 and 0.69 at 50,
20 and 10 W/m² for n = 1.5, has a similar shape to the standard curve's 0.85, 0.70 and 0.55; with
n = 2 it lies close to the pessimistic curve.

*Example:* light needed for the charger to start, W/m², at different panel temperatures:

| Variant (n) | −10 °C | 0 °C | 10 °C | 25 °C |
|---|---|---|---|---|
| Low (1.3) | 2.3 | 5.1 | 10.7 | 29.4 |
| Central (1.5) | 4.3 | 8.7 | 16.6 | 40.5 |
| High (2.0) | 11.9 | 20.5 | 34.1 | 68.4 |

**Step 5. From panel power to charge in the battery.**

```text
P_batt  = 0.90 × max(0, P_mpp × f − 5.0 V × I_chip/1000)     [W, with I_chip in mA]
Ah_hour = min(P_batt × 0.92 / 3.9 V, 2.0)                      [Ah that hour; 0 if f = 0]
```

| Constant | Value | Stands for |
|---|---|---|
| 0.90 | 90 % | The efficiency of the CN3791's switching stage |
| I_chip | 3.5 mA (central, high), 1.0 mA (low) | The charging chip's own current while it runs, taken from the panel side at 5.0 V; subtracted only in the hours the charger runs. The datasheet gives 0.7–1.3 mA without switching; switching adds about 1.5–3.6 mA, so 3.5 mA is the central estimate with the LEDs removed. The low variant's 1.0 mA is the datasheet value without switching, so it is optimistic. |
| 0.92 | 92 % | A combined loss from the first model for wiring, dirt, rime and drift of the panel's best voltage. The voltage drift is now modelled in step 4 and snow in B.7, so it partly double counts and makes the result somewhat cautious. |
| 3.9 V | | Cell voltage during charging, for converting Wh to Ah. The review judged it 3–5 % cautious. |
| 2.0 A | | The CN3791's maximum charge current, per hour on the battery side, after 0.90, 0.92 and 3.9 V |

*Sensitivity:* a chip current of 6 mA instead of 3.5 mA raises the need by about 20 % (calculated at
4.8 V). If the board's charge LED is left in place (7–18 mA; 13.5 mA in total was assumed), the
central need rises by about 50 % in Jönköping, vertical, 20° trees, 10 W.

**Step 6. Daily harvest.** The hourly values `Ah_hour` are summed per UTC date.

## B.5 From daily harvest to battery size {#b5}

**Daily balance.** Each day the node consumes `current × 24 h` (0.108 Ah or 0.1704 Ah) and gets the
day's harvest. The model tracks the deficit, how far the battery is from full:

```text
deficit = max(0, deficit + daily_consumption − harvest)        from 0 (full) on 1 January 2005
```

The battery never gets fuller than full: any surplus is thrown away. The deficit is never reset
between seasons; a deficit that carries over into the next winter keeps growing.

**One number per winter.** A winter runs from 1 July to 30 June: 18 winters, 2005/06–2022/23. For
each winter, its largest deficit is noted, along with D, the length of the episode in days. An
episode is a run of days with a deficit above zero; D is counted from the episode's first day to the
day of the winter's largest deficit, both included. The episode may have started before 1 July, even
in an earlier year. If the same largest deficit occurs twice, the first one counts. A winter with no
deficit has a maximum of 0 and D = 0. January–June 2005 and July–December 2023 are simulated but not
counted.

**The worst winter in five.** The 18 winter maxima are sorted from worst to best; equal values keep
their time order. The five-year return level is taken with the Weibull plotting position
r = (N + 1)/T, with N = 18 and T = 5, so r = 3.8:

```text
level = w3 + 0.8 × (w4 − w3)
```

where w3 and w4 are the third and fourth worst winter maxima. D is taken from the winter whose
maximum lies closest to the level; with these numbers it is the fourth worst. If several are equally
close, the first in worst-to-best order is taken; in the published data this never changes D.

**Why one winter in five.** The project chose it as the sizing point. A rarer winter would rest on
only 18 winters of data; such winters are left to the margin (B.7, and the survival check in B.8).

**From deficit to battery size.**

```text
need [mAh] = level [Ah] / (0.92 × 0.85 × 0.90) / (1 − 0.03 × D/30) × 1000
```

| Factor | Value | Meaning | Basis | Direction |
|---|---|---|---|---|
| Cold | 0.92 | Capacity left with the cell at −20 °C at this very low current | At such low currents the loss is set by the cell's open-circuit voltage, not its resistance (Ji, Zhang and Wang 2013, cell at C/1000 and −20 °C). −20 °C is roughly the median coldest night of a winter at Jönköping airport. | Cautious in the south, optimistic in the northern inland (B.12) |
| Usable window | 0.85 | Share of the capacity between full (4.2 V) and 3.4 V | Assessment from the discharge curves for LG MJ1 and Samsung 35E, which give about 88–90 % above 3.4 V. 3.4 V is a planning limit just above 3.3 V, the example boot-lock limit in MeshCore's documentation on power management on nRF52. | Either |
| Aging | 0.90 | Capacity left in the battery's third winter | Assessment | Optimistic after the third winter |
| Self-discharge | 3 % per month | Loss during the episode of D days | Battery University: about 2 % per month at 0 °C and half charge, about 6 % at full charge. | Probably cautious at low temperature |

`0.92 × 0.85 × 0.90 = 0.7038`. The term (1 − 0.03 × D/30) is the same as (1 − 0.001 × D). The need
contains no margin and no snow days; they are added in B.7. The data stores the need rounded to
0.1 mAh, without rounding up.

**"No battery is enough" (null).** Sometimes the panel cannot recharge the battery even in summer,
and the deficit grows year after year. A case is null when either D for the worst winter in five is
longer than 365 days, or more than 3 of the 18 winters have D longer than 365 days. The rule is
applied within each case, before the running minimum below. The calculator shows null as "the panel
is not enough even in summer".

**Floor: the need with an unlimited panel.** For each site, angle and tree line, the need is also
calculated as if the panel were unlimited: every hour in which the charger can start
(Voc ≥ 5.10 V) gives the full 2 A, with no other losses, whatever the light level. That includes
hours below 3 W/m², where the weak-light curve gives no power for a finite panel, so the floor is
somewhat lower than the limit as the panel grows. *Sensitivity:* counting only hours above 3 W/m²
would raise some northern floors, e.g. by 13 % for Norrbotten, vertical, 20° trees, low variant. The
floor goes through the same rules and does not depend on the panel size. If the visitor's battery is
smaller than the floor, the calculator says that no panel size is enough.

**Running minimum.** A larger panel should never need a larger battery. For each site, angle,
firmware, tree line and variant, the panel sizes are gone through from small to large; a value above
the smallest so far is replaced by that smallest value. Null stays null and is skipped. The floors
are not adjusted. *Check result:* this changed 14 of 36,720 values, each by less than 1 %.

**The 17 panel sizes:** 0.15, 0.5, 1, 1.5, 3, 5, 10, 15, 20, 25, 30, 40, 50, 100, 150, 200 and
300 W.

## B.6 Three variants: low, central, high {#b6}

The panel's behaviour in weak light is the largest unmeasured input. The model therefore gives three
values for each case.

| Variant | Ideality n | Voc_stc | Weak-light curve | Charging chip current |
|---|---|---|---|---|
| Central (best estimate) | 1.5 | 6.4589 V | Standard | 3.5 mA |
| Low (optimistic) | 1.3 | 6.3959 V | Standard | 1.0 mA |
| High (pessimistic) | 2.0 | 6.6163 V | Pessimistic | 3.5 mA |

Everything else is shared.

**What the band is and is not.** The three variants only span the panel's weak-light parameters and
the chip's current. They are not a statistical confidence interval, and "high" is not an upper
bound. The horizon, the calibration, the setting's tolerance, the consumption, leakage in the panel
and the cells' actual capacity (B.12) act on top of every variant.

**The order does not always hold for the smallest panels.** Near the limit where no battery is
enough, the chosen episode D and the null rule can differ between the variants. *Check result:* in
30 of 12,240 triples, all for panels of 3 W or less, the high value is lower than the central one, by
at most 3.8 %. In one case the central value is null while low and high are finite (Halland,
vertical, official firmware, 10° trees, 0.5 W). In 2 triples the low value is slightly above the
central one, by at most 1.0 %.

**Which is used where.** The calculator and the guide size for the **larger of central and high**,
and show "no battery is enough" if either of them is null. The build guide for the Jönköping node
sizes for the **central** value and gives the high one alongside.

**What the evidence says.** The field test's dark days are reproduced by the central and the low
variant; the high one predicts less harvest than was measured (B.11). The physics review judged
n = 1.3–2.0 to be the right range and found two parameter errors that roughly cancel out (B.10).

## B.7 From the model's need to a recommendation {#b7}

**Snow and frost days.** A panel covered by snow or frost harvests nothing. The data contains an
allowance in days with no harvest:

| Site | South of 60° N | 60° N and north |
|---|---|---|
| Sheltered (default) | 2 days | 5 days |
| Exposed: high ground, summit | 4 days | 8 days |

Each day costs `current × 24 h / 0.7038`; the data stores it rounded to 0.1 mAh (*current*:
153.5 mAh for EasySkyMesh, 242.1 mAh for official firmware), before margin. It is added to the need
before the margin. The number of days is an assessment supported by the literature, mainly a study
by RISE in Piteå, 65° N, in the winter of 2018/19, where even a vertical panel was fully covered for
all of January. The exposed values, roughly double, follow icing maps of Sweden. Rime alone gets no
allowance. The allowance covers temporary coverage; north of about 63° N a vertical panel can be
buried for 2–3 weeks, which the calculator gives as a notice instead of sizing for it.

**Margin.** A plain multiplier, applied last. The calculator lets the visitor choose 0–100 %,
default 50 %. The margin is meant to cover winters rarer than one in five and the uncertainties in
B.12.

**Rounding.** Battery figures are always rounded **up**: by the calculator, to a whole number of
cells.

**The calculator's rule** (the page's code and data file are the authority):

```text
cells = ceil( (max(central, high) + snow_days × per_day_mAh) × (1 + margin) / cell_capacity ),   at least 2 cells
```

- The cell capacity is 3000 mAh, the seller's nominal value for the suggested cell (Biltema
  art. 84-1378); the visitor can change it. No independent capacity test of the cell was found.
  *Sensitivity:* with 2400 mAh per cell, the example in B.8 needs 10 cells instead of 8.
- At least 2 cells, because the charger can deliver up to 2 A and the cell is specified for 1.5 A
  charging.
- 60° and 40° are offered only for panels that someone brushes free of snow; vertical is the default.
- No values are interpolated or extrapolated between or beyond the panel sizes in the data.

## B.8 Worked example: Jönköping, vertical, 20° trees, 10 W, central, EasySkyMesh {#b8}

All numbers here are *example*; step 7 equals the *current* data.

1. R(vertical, 20°) = 0.7550.
2. The hourly harvest is summed per day. The average harvest over all December and January days is
   61.7 mAh per day, against a consumption of 108 mAh.
3. Largest deficit per winter, Ah, with episode length D in days:

| Winter | Max (Ah) | D | Winter | Max (Ah) | D |
|---|---|---|---|---|---|
| 2005/06 | 3.9755 | 60 | 2014/15 | 3.7832 | 78 |
| 2006/07 | 4.5731 | 72 | 2015/16 | 3.1230 | 67 |
| 2007/08 | 4.5170 | 71 | 2016/17 | 3.9146 | 74 |
| 2008/09 | 4.4715 | 85 | 2017/18 | 4.1050 | 60 |
| 2009/10 | 2.9293 | 70 | 2018/19 | 4.1223 | 76 |
| 2010/11 | 1.3868 | 50 | 2019/20 | **5.0329** | 78 |
| 2011/12 | 3.1577 | 66 | 2020/21 | 4.7799 | 79 |
| 2012/13 | 3.5918 | 69 | 2021/22 | 3.8185 | 80 |
| 2013/14 | 3.7742 | 66 | 2022/23 | 4.1436 | 77 |

4. Ranks 3 and 4 are 2006/07 (4.5731) and 2007/08 (4.5170). Level = 4.5731 + 0.8 × (4.5170 − 4.5731) =
   **4.5282 Ah**.
5. The winter closest to the level is 2007/08, so **D = 71 days**.
6. Need = 4.5282 / 0.7038 / (1 − 0.071) × 1000 = **6,925.7 mAh**, without margin.
7. The data gives the case as [central 6,925.7, low 4,248.8, high 14,667.4].
8. The calculator, 50 % margin, sheltered site: (14,667.4 + 2 × 153.5) × 1.5 = 22,461.6 mAh, that is
   7.49 cells, so **8 cells = 24,000 mAh**.

**How often would these batteries have run out?** *Sensitivity:* for each of the 18 winters, that
winter's own need plus 2 snow days was compared with the battery.

- The worst winter, 2019/20, central: 5.0329 / 0.7038 / (1 − 0.078) × 1000 = 7,756 mAh, 12 % above
  the need for the worst winter in five.
- If the panel behaves like the high variant, the worst winter needs about 15,601 mAh. The
  calculator's 24,000 mAh would have got through all 18 winters; a 12,000 mAh battery only 1 of them.
- If the panel behaves like the central variant, the worst winter needs about 8,063 mAh including
  snow days.

## B.9 How the model was checked {#b9}

**Who did the checks.** All checks except the field test were done by AI agents: separate sessions
between September and November 2026. "Independent" means that an agent rebuilt the model from a
written description without being given the model's code. The descriptions were written by the
session that built the model. **No independent human expert has reviewed the model.** The field test
(B.11) is the only evidence produced by people.

| # | Check | Scope | Result |
|---|---|---|---|
| 0 | Review of the first draft (Sept. 2026) | The first Jönköping simulation: one independent rebuild and two reviewers | The code matched the specification except for two errors in helper scripts. 11 problems were listed, mostly in the assumptions. Among the corrections: the sky factor switched from a uniform sky to Muneer's; the charging chip's own current was added; the cold gain was added; a pessimistic weak-light curve was added; the assumption "no harvest while there is snow" was removed for vertical panels. |
| 1 | Independent rebuild, county model | The first winter model (5.6 V) | Reproduced the Jönköping case exactly; also calculated Skåne, Jämtland and Norrbotten with the same result. |
| 2 | Review for the north | Do Jönköping's assumptions hold north of about 61° N? | The tables are optimistic in the north in four ways: cold, ERA5, rime and charging below 0 °C. These became warnings (B.12). |
| 3 | Fact check of the first guide text | Every number and claim against five sources, two reviewers | 8 number errors and 15 claim errors; 28 points confirmed. Most corrected. |
| 4 | Independent rebuild, panel sizes | The model scaled by panel size (5.6 V) | Matched to the decimal. |
| 5 | Cell review | Biltema's 3000 mAh cell | Only the seller's information exists; no independent test. Kept as nominal, marked unverified. |
| 6 | SMHI's snow cover statistics | 348 stations, snow depth per day, 2005/06–2022/23 | *Check result:* the longest snow cover in the worst winter in five ranges from 21 days (Skåne) to 113–151 days (Dalarna and further north). Snow on the ground, not on the panel. Led to "vertical if nobody brushes". |
| 7 | **Independent rebuild, current model (5.0 V)** | Hourly panel voltage and charger model | Reproduced all reported numbers. *Check result:* Jönköping vertical 20° 10 W came out as 6,925.7 / 4,248.7 / 14,667.4, identical except for the last decimal of the low value (published 4,248.8). |
| 8 | Physics review of the 5.0 V model | Calibration, n, temperature coefficients, leakage, start condition, double counting | "No calculation or implementation error" and no double counting. Two parameter errors roughly cancel out (B.10). *Check result:* total uncertainty about ±25–50 % until the panel's weak-light behaviour is measured. |
| 9 | Reconciliation with the field test | Does the field test contradict the model? | Not on dark days. The seasonal estimates only agree if the test window had about a 10° horizon (B.11). |
| 10 | Snow and frost | Do vertical panels need a snow allowance? | Yes. Led to the 2/4/5/8 day allowance. |
| 11 | The build guide | Every table cell and claim in the Jönköping guide | All 72 cells and 8 capacity rows recalculated correctly; 11 text errors corrected. |
| 12 | Small panels | 0.15, 0.5, 1.5 and 3 W | All 28,080 values shared with the previous version identical. |
| 13 | Specification check | A new implementation from this description, Jönköping and Norrbotten, selected cases | All 120 need triples and 24 floor triples matched to 0.1 mAh, null included. |
| 14 | **Reproduction from the document alone** | A new agent was given only an earlier draft of this description and the PVGIS files, and wrote the reference script (B.14) | *Check result:* all 36,720 needs and 2,160 floors in calculator data v3 reproduced exactly, 0.0 mAh difference, all 3,494 nulls in the same places. The published copy uses Jönköping's rounded point, which calculator data v4 also uses (check 16). |
| 15 | Data consistency | All 12,240 triples in v3, repeated for v4 | *Check result:* a higher tree line never lowers the need; no need is below its floor; official firmware never needs less than EasySkyMesh. The variant order has the exceptions in B.6, the same in both versions. |
| 16 | Jönköping recalculated for calculator data v4 | The production model, unchanged, run at the rounded point for all 36 Jönköping cases | *Check result:* all other points identical to v3. The reference script reproduces all 1,944 needs and floors for Jönköping in v4 exactly. No table value at 10 W and no result in the calculator changed, at any margin from 0 to 100 %. |

**Not done.**

- No comparison with an established tool, such as PVGIS's own off-grid tool or pvlib with the same
  inputs.
- No comparison with winter logs from real MeshCore or Meshtastic nodes in the Nordic countries.
- No independent human expert review.
- Checks 7, 13 and 14 used PVGIS files the model had already downloaded; the download itself was
  only tested by check 1 and by the reference script's rounded Jönköping point.

## B.10 What was corrected along the way {#b10}

The model has been through five data versions; only the last one applies.

| Version | What changed | Status |
|---|---|---|
| County tables | Charger at 5.6 V, 20 % margin, rounded to the nearest 100 mAh | *Historical.* Not used. |
| Calculator data v1 | Panel sizes 1–300 W, 50° trees, null rule, 2 A cap; still 5.6 V | *Historical.* Withdrawn. |
| Calculator data v2 | Setting 5.0 V, hourly panel voltage, snow allowance | *Historical.* v3 repeats all its values. |
| Calculator data v3 | 0.15, 0.5, 1.5 and 3 W added | *Historical.* v4 repeats all its values except Jönköping's. |
| **Calculator data v4** | Jönköping calculated at the rounded point | **Current** |

**The big correction: charger 5.6 V → 5.0 V.**

- *Trigger:* the website team asked whether the clear-horizon values were too optimistic.
- *Cause, historical:* the first guide set the charger to 5.6 V in the belief that the panel gives
  about 7 V. The field test measured 5.90 V, which puts the panel at about 6.4–6.6 V in full sun. At
  5.6 V the charger only starts above about 30–100 W/m²; behind trees, most midwinter light is weaker
  than that.
- *Effect, historical, Jönköping vertical 10 W, EasySkyMesh, without margin:* behind 20° trees the
  old published value was 5,651 mAh. With 5.6 V modelled correctly it became 20,621 mAh central;
  with 5.0 V it is 6,926 mAh central, 4,249–14,667 across the variants.
- *Sensitivity, not used:* 4.8 V would need 15–40 % less battery behind trees, but only on boards
  with a small voltage drop at the input and no series diode. 5.0 V is the safe choice.

**Other corrections.** The panel's voltage in weak light (n) was added to the variants. The null
rule was added when small panels gave meaningless (negative) needs, because the self-discharge term
breaks down for episodes longer than a year. An explicit snow allowance was introduced. The margin
was raised from 20 % to 50 %. The rounding changed from "nearest 100 mAh" to "always up". The sky
model switched from a uniform sky (R = 0.573 vertical behind 20°, *historical*) to Muneer's (0.755).
The text on the panel's voltage changed from "about 7 V" to "about 6.0–6.6 V", and the sun dates
behind trees were corrected: at 57.8° N a 20° tree line shuts out direct sun from late October to
mid-February.

**Known errors left in on purpose** (*sensitivity*, Jönköping vertical 20° 10 W central, 6,926 mAh
published):

- The panel voltage's temperature coefficient of −0.30 %/K is probably too small; −0.38 to
  −0.40 %/K is the physical value for 11 cells. The physical value gives about 5,364 mAh (−23 %): the
  model is cautious here.
- n = 1.5 is probably optimistic for cut cells; about 1.7 is more likely. n = 1.7 alone gives
  9,372 mAh (+35 %).
- Both together give about 7,115 mAh, close to the published value. That is why the central value
  was kept.
- The low variant's 1.0 mA chip current is probably not reached while the chip is switching, so the
  low variant is optimistic on that point.

## B.11 The field test {#b11}

A local builder tested panel, charger and battery indoors in Jönköping from mid-October to
mid-November 2026, with a resistor instead of a node. All numbers here are *field measurement* or
reconciliation values for an indoor setup with a different charger. They are never used for sizing.

**Setup.** The panel stood upright in a south-facing window behind two old panes of glass. Round 1
(late October): a small garden-lamp panel of about 1.5 W. Round 2 (from early November): Clas
Ohlson's panel. Charger: an HW-736 board, a linear charger of the CN3065 type with a Schottky diode
on the input, which needs about 4.7 V before any current flows; **not** the CN3791 the model
assumes. Battery: two 18650 cells sold as 3000 mAh, in parallel; one of them measured about 1.7 Ah.
Load: a 531 Ω resistor, about 7.5 mA or 180 mAh per day. Measurement: battery voltage with a
multimeter, mainly rested morning values. Light: a nearby weather station with a horizontal sensor
that reads about 25–35 % low, used for the shape of the weather and to pick comparable dark days.

**Results.** The calibration measurement: Voc 5.897 V and short-circuit current 1.115 A. On dark gray
days the panel in round 2 gave about 50–100 mAh per day. For the first five days it covered about
70 % of the 180 mAh per day load, for the first week about 90 %. The testers' own rough estimate of a
winter deficit in the window was 5–8 Ah, uncertain by a factor of two either way.

**What it confirms.** It gave the calibration point that exposed the 5.6 V error. The reconciliation
reran the model's physics for the window with Jönköping's weather, 112 analogous days chosen by the
measured light; the window's light factor k (0.35–0.65) and the horizon from the window (0°, 10° or
20°) were unknown and were varied. On dark days the model reproduces the measured 50–100 mAh per day
for the central and the low variant at k of about 0.35–0.5; the high one predicts less than was
measured. *Sensitivity:* under the same conditions a CN3791 at 5.6 V would have harvested nothing on
any dark day; at 5.0 V, 13–76 mAh per day.

**What did not match.** With a clear view from the window, the model gives a deficit from
mid-November to mid-February of only 0.4–1.5 Ah (median), 0.8–2.3 Ah in the worst winter in five,
against the testers' 5–8 Ah. They only agree if the window's view of the low winter sun was blocked
by a horizon of about 10°. The question stays open until logs from December or a measurement with an
inclinometer at the window settles it.

**What it cannot show.** A different charger, indoors, behind glass, with two free parameters: a
consistency check, not an independent validation. The harvest was derived from voltage, about
±70 mAh per reading. No data from December or January, outdoors, with a cold battery or with snow.
The panel's voltage curve in weak light was not measured directly.

## B.12 Assumptions and limitations {#b12}

"Cautious" means that the published need is probably too high; "optimistic" that it is probably too
low. Sizes are *sensitivity* for Jönköping, vertical, 20° trees, 10 W, EasySkyMesh, central, unless
stated otherwise.

| Assumption | Direction | Size |
|---|---|---|
| Even tree line all around | Either | More than tenfold: about 500 mAh with a clear horizon against about 6,900 at 20° trees (*current*) |
| The panel's weak-light behaviour (n, curve) | Either | Low to high: 4,249–14,667 mAh (*current*) |
| No leakage (shunt) in the panel model | Optimistic | +36 % at 300 Ω, +76 % at 150 Ω |
| Light and temperature at the calibration | Either | About ±25 % |
| Temperature coefficient −0.30 %/K | Cautious | −23 % with the physical value |
| Charger setting ±0.1 V | Either | About 5,900–8,800 mAh |
| Charging chip current 3.5 mA | Either | +20 % at 6 mA (at 4.8 V) |
| Consumption, quiet network | Optimistic for busy sites | 1.6 times the consumption gives 1.6–2.3 times the need |
| Nominal cell capacity | Optimistic | 25 % more cells if the actual capacity is 80 % of the rating |
| Cold factor 0.92 (−20 °C) | Cautious in the south, optimistic in the northern inland | ×1.08 to ×1.23 in the north |
| Aging 0.90 (third winter) | Optimistic after the third winter | Not quantified |
| Self-discharge 3 % per month | Cautious | Small |
| 3.9 V charging voltage | Cautious | 3–5 % |
| 0.92 combined loss | Cautious | Small |
| Snow on the ground reflects no extra light | Cautious | About −14 % (*historical*) |
| The trees are treated as black | Cautious | R 0.780 instead of 0.755 if the trees reflected 20 % |
| Cold gain from air temperature, not panel temperature | Optimistic | Small, not quantified |
| Start condition per hour | Cautious | Small |
| ERA5 for Norrbotten | Optimistic | 11–29 % vertical (*historical*) |
| Panel aging, partial shading by branches, recharge restart when full, panel not facing due south | Optimistic | Not quantified |
| The one-winter-in-five level from 18 winters | Either | About −2 % to +6 % (*historical*) |

**Taken together**, no single net direction can be claimed. The deductions and losses lean cautious;
the panel's unmeasured weak-light behaviour, the consumption, the cell capacity and the north lean
optimistic. The two largest items, the horizon and the panel, can go either way.

**In order of how much they can move the answer:**

1. **The site's actual horizon.** By far the largest factor. The model assumes an even tree line all
   around; a site with a clear sky to the southeast or southwest needs less, so the row for the
   highest trees in the southern half of the sky is the safe choice.
2. **The panel's weak-light behaviour** (n, leakage, curve). Leakage is not modelled; an ideal diode
   is the best case in weak light. *Sensitivity:* a shunt resistance of 300 Ω gives 9,424 mAh
   (+36 %), 150 Ω gives 12,208 mAh (+76 %).
3. **The calibration point.** Light and cell temperature at the only field measurement are
   estimated.
4. **The charger board.** The setting's accuracy is about ±0.1 V. A diode drop of 0.3–0.5 V in the
   board's input can hold the panel that much above the setting; a series diode after the switch
   (0.25–0.45 V) instead raises the input voltage needed for the full 4.2 V. The start condition is
   tested once an hour; an hour that drops below the start voltage counts as fully lost, which is
   cautious.
5. **The consumption.** 4.5 and 7.1 mA are estimates for a quiet network. Firmware alone changes the
   need by a factor of about 1.6–2.3 (*current*, Jönköping, vertical, 10 W).
6. **The cell capacity.** 3000 mAh is the seller's nominal value. *Field measurement:* one of the
   field test's "3000 mAh" cells measured about 1.7 Ah.
7. **Cold in the north.** The model assumes that the battery stays above −20 °C; reasonable up to the
   Gävleborg coast but optimistic in the inland of Jämtland, Västerbotten and Norrbotten, where −35
   to −40 °C occurs in a bad winter. *Sensitivity, not applied in the data:* a cold factor of 0.85
   instead of 0.92 raises all values by 8 %, 0.75 by 23 %. Cold also raises the cell's internal
   resistance, so transmit pulses can make a cold, nearly empty cell shut off early; this is not
   modelled.
8. **Charging below 0 °C** is assumed to work; the CN3791 has no temperature cut-off. The charge
   currents are usually very low, but months of cold charging carry some risk of lithium plating,
   which is not modelled. The suggested cell is only specified for charging from 0 °C.
9. **ERA5 for Norrbotten** overestimates cloudy winter light in the north; Norrbotten's figures
   should be read as optimistic. The comparison has not been repeated with the current model.
10. **Snow, frost and rime.** The snow allowance is an assessment; rime on exposed northern sites is
    not modelled. Extra light from snow-covered ground onto a vertical panel is not counted, which
    is cautious.
11. **SARAH3 near its edge.** Västerbotten's point lies near the coverage limit at 65° N.
12. **One point per county.** Coast and inland, forest and mountains can differ more within one
    county than between southern counties.
13. **"No trees" is PVGIS's terrain horizon, not flat.** In hilly northern areas the terrain alone
    blocks a lot of winter sun.
14. **The field test** is a consistency check, not a validation of figures outdoors (B.11).
15. **Optimistic effects that are not modelled:** panel aging; partial shading (a branch over part
    of a series string of cut cells lowers the whole string's current); the charger only tops up
    once the battery has dropped a little; a panel not facing due south; more traffic than assumed;
    a battery that is not full before the first winter.
16. **Minor items.** Self-discharge is probably high at low temperature (cautious). The cold gain is
    somewhat overestimated in sunny hours. The one-winter-in-five level rests on 18 winters.
    *Check result:* the number of days with snow cover in Götaland has fallen by about 40 % since
    1960 (SMHI faktablad 23, 2005), so 2005–2023 need not represent future winters.

### Why only lithium-ion {#litiumjon}

The calculator only works with lithium-ion (18650 cells, or LiPo with the same chemistry). It is the
only chemistry that works with the guide's charger (CN3791, 4.2 V), panel and firmware without
changes, and it has the most energy per kilo. Decided 2026-11-17 (B-295); no table changed because of
it.

| Property | Lithium-ion 18650 | LiFePO4 | Lead-acid, sealed (AGM, 12 V) |
|---|---|---|---|
| Nominal voltage | 3.6 V [MJ1], [S35E] | 3.2 V [PSL], [EVE] | 12 V [NP7] |
| Charge voltage | 4.2 V | 3.65 V, at most 3.7 V [PSL] | 14.5 V cyclic, 13.65 V float [NP7] |
| Capacity at −20 °C | 0.92 at C/1000 (B.5); discharge specified down to −10 °C [S35E] | at least 70 % at 0.2C [EVE] | about 63–67 % at C/20 [YUA-M], [DISC] |
| Self-discharge per month | 1–2 % plus the protection board [BU-802b] | at most 5–10 % according to the specification [PSL], [EVE] | 3 % at 20 °C, less in the cold [NP7], [YUA-M] |
| Charging below 0 °C | not allowed [MJ1] | not allowed [EVE] | allowed down to −15 °C [NP7] |
| Energy per kilo | about 250 Wh/kg [S35E], [MJ1] | 120–170 Wh/kg [PSL], [EVE] | about 40 Wh/kg [NP7], [CSB] |
| Charger | CN3791, the guide's board | 3.6 V charger, never CN3791 [PSL] | 12 V charger and a voltage converter to the node |

**What LiFePO4 has going for it.** It tolerates thousands of deep cycles [PSL], [EVE], is harder to
set on fire and keeps its capacity well in the cold according to the manufacturers' figures. But a
solar node does one deep cycle a year, so lifetime matters little, and like lithium-ion it cannot be
charged below 0 °C. What stops it here is the voltage: the nRF52 boards do not start below 3.3 V
(MeshCore's `PWRMGT_VOLTAGE_BOOTLOCK`), and LiFePO4 sits at 3.2–3.3 V for most of its capacity. It
also needs a different charger, so the model's step from panel to charge (B.4) does not apply.

**What lead-acid has going for it.** It is cheap, tolerates charging down to −15 °C [NP7] and
self-discharges little in the cold. But it needs about 2.5 times as much stored energy for the same
winter (poorer capacity in the cold, and only half the capacity is usable), weighs about 13 times
more, and the electrolyte freezes at −15 °C when the battery is discharged [BU-410], which a winter
node is in January. Common 12 V regulators also draw more themselves than the node does.

If you still want to build with one of them, the calculator's figures do not apply. The sources are
in B.15 under "Battery chemistry".

## B.13 Measurements that would sharpen the figures most {#b13}

In order of expected effect:

1. **The site's horizon.** Sweep with an inclinometer from southeast through south to southwest and
   note the highest angle. Can move the answer by an order of magnitude.
2. **The panel's voltage slope in weak light.** Within about 2 minutes, at the same panel
   temperature: measure open-circuit voltage and short-circuit current at 4–6 light levels, from
   about 1 A down to 0.03 A. Dim the whole panel evenly with tulle or mosquito net; never shade just
   part of it. Plot the voltage against the logarithm of the current. A rise of about 0.85–0.9 V per
   tenfold increase points to the low variant, about 1.0 V to the central one, about 1.3 V to the
   high one. Points that bend downwards show leakage.
3. **Short-circuit current and panel temperature in full sun**, outdoors, to anchor the calibration.
4. **One day of battery current** on the real node and firmware.
5. **The CN3791 logged on gray days** at the chosen setting: confirm the setting at the panel's
   connection while charging, measure the board's voltage drop at the input, look for a series
   diode, measure the chip's own current with the LEDs removed.
6. **Battery logs December–January** from a real node outdoors.
7. **Actual cell capacity:** discharge a bought cell at about 0.2 C to 3.4 V.
8. **For the north:** battery temperature in a real box over a winter, and icing maps for exposed
   high ground.
9. **For the data:** repeat the ERA5 versus SARAH3 comparison in Västerbotten with the current model.
10. **External comparison:** run the PVGIS off-grid tool for a few cases and compare.

## B.14 Recalculate the figures yourself {#b14}

**You need** Python 3 with numpy and access to PVGIS.

{{< solar-files >}}

**The reference script** is an independent reference implementation, written by an AI agent from
this description alone, without the model's code (B.9 check 14). It downloads the PVGIS files it
needs and saves them.

```sh {title="Example"}
python reference_solar_need.py JKG --tilt 90 --trees 20 --firmware esm
python reference_solar_need.py JKG --tilt 90 --trees 0 --firmware 13.4
python reference_solar_need.py --check
python build_load_grid.py --cache-dir pvgis_cache
python reference_solar_need.py --tables
python reference_solar_need.py --example
```

The first line prints the need triples for all 17 panel sizes, before and after the running
minimum, plus the floor. `--firmware` takes `esm`, `official` or a load in mA from the grid.
`build_load_grid.py` builds the whole data set, one file per point, and stops if the tables for 4.5
and 7.1 mA differ from the previously published file. `--check` runs the test vectors below,
`--tables` prints R, Voc_stc and the start-light table, `--example` prints the example in B.8. The
script uses Jönköping's rounded point, the same point as calculator data v4, and reproduces its
Jönköping values exactly.

**Recipe.**

```text
for each point, angle in (90, 60, 40), tree line h in (0, 10, 15, 20, 30, 50):
    download the PVGIS seriescalc CSV (B.3)
    R = 1 if h == 0 else sky_view(angle, h)                                   (B.4 step 1)
    each hour: G = Gb + R*Gd + Gr ;  Tc = T2m + G/(25 + 6.84*WS10m)
    for variant (n, curve LL, I_chip in mA) in central, low, high:            (B.6)
        Voc_stc from the calibration, full precision                        (B.4 step 4)
        f = P(5.0 V)/P(Vmp) if Voc(G, Tc) >= 5.10 V else 0
        for each of the 17 panel sizes Wp:
            Ah_hour = 0 if f == 0 else min(2.0, 0.90*max(0, Wp*G/1000*LL(G)*(1 + 0.004*(25 - T2m))*f - 5.0*I_chip/1000) * 0.92/3.9)
            harvest per UTC date = sum of Ah_hour
            for daily consumption in the grid (4.5 ... 190 mA × 24 h) in Ah:
                deficit per day -> 18 winter maxima and D -> one-winter-in-five level and D
                -> null rule -> need = level/0.7038/(1 - 0.001*D)*1000, rounded to 0.1 mAh   (B.5)
        floor: harvest per UTC date = 2.0 * (number of hours with f > 0) -> same steps
then, per variant: running minimum over the panel sizes; null stays null; floors are not adjusted.
The snow allowance is stored separately and added by the calculator (B.7).
```

**Pitfalls.**

- Calculate Voc_stc at full precision (B.4 step 4).
- Apply the null rule within each case, before the running minimum; otherwise negative needs from
  the smallest panels spread to all larger ones.
- Apply R to `Gd(i)` from the file for that tree line, not from the clear-horizon file.
- The cold gain uses the air temperature `T2m`; the panel voltage uses Faiman's panel temperature
  `Tc`.
- `I_chip` is in mA, so the chip's power is 5.0 × I_chip / 1000 W, and it is subtracted only when the
  charger runs.
- The 2 A cap applies on the battery side, after 0.90, 0.92 and 3.9 V.
- The floor counts every hour with Voc ≥ 5.10 V, whatever the light level.
- The deficit starts at 0 on 1 January 2005 and is never reset; an episode can start before the
  winter it belongs to.
- The model's code calculated the need with an old margin of ×1.2, divided it out and rounded to
  0.1 mAh. The reference script matched exactly, but a difference of ±0.1 mAh in the last digit is
  acceptable for other implementations.

**The data files.** One JSON file per point code, `<code>.json`. Each file has `place`, `lat`, `lon`,
`source` (PVGIS dataset), `panels` (the 17 sizes in W) and `loads` (the grid's levels in mA, as
text); `need[angle][load][trees]`, a list of 17 triples [central, low, high] in the same order as
`panels`, in mAh without margin or snow days, to 0.1 mAh, where null means that no battery is enough
(angle keys `vertical`, `tilt60`, `tilt40`; load `"4.5"` … `"190"`; trees `"0"`, `"10"`, `"15"`,
`"20"`, `"30"`, `"50"`); `floor[angle][load][trees]`, one triple; `snow_allowance` with `days`
(sheltered, exposed) and `per_day_mAh` per load; and `setpoint_V`: 5.0. The load 4.5 corresponds to
the earlier key `esm`, 7.1 to `official`.

**Test vectors** (*test vector*, need without margin in mAh, [central, low, high]). Jönköping rows
apply to the rounded point 57.78° N, 14.16° E and match calculator data v4 exactly.

| Point | Angle | Firmware | Trees | Panel | Need [central, low, high] |
|---|---|---|---|---|---|
| JKG | vertical | EasySkyMesh | 20° | 10 W | 6,925.7; 4,248.8; 14,667.4 |
| JKG | vertical | EasySkyMesh | 0° | 10 W | 501.7; 355.7; 847.8 |
| JKG | vertical | official | 20° | 10 W | 15,455.2; 10,861.0; 26,540.6 |
| JKG | 60° | EasySkyMesh | 20° | 10 W | 1,746.5; 568.9; 6,471.8 |
| JKG | 40° | EasySkyMesh | 20° | 10 W | 516.3; 324.5; 3,145.8 |
| JKG | vertical | EasySkyMesh | 20° | 1 W | 22,093.4; 20,403.9; 22,485.5 |
| JKG | vertical | EasySkyMesh | 20° | 0.15 W | null; null; null |
| JKG | vertical | EasySkyMesh | 50° | 3 W | 44,168.4; 30,583.4; null |
| MMX | vertical | EasySkyMesh | 10° | 5 W | 1,195.5; 884.0; 1,697.1 |
| LLA | vertical | EasySkyMesh | 20° | 10 W | 16,918.7; 15,061.7; 22,768.4 |
| OSD | 60° | official | 30° | 20 W | 17,420.9; 15,602.4; 23,330.5 |
| JKG | vertical | 13.4 mA | 20° | 10 W | 42,286.8; 35,332.8; 56,460.5 |
| JKG | vertical | 5.2 mA | 0° | 10 W | 643.3; 461.2; 991.9 |
| JKG | vertical | 190 mA | 0° | 10 W | null; 686,851.9; null |
| GVX | vertical | EasySkyMesh | 50° | 25 W | high value 40,700.2 after the running minimum; 40,983.3 before |

| Point | Angle | Firmware | Trees | Floor [central, low, high] |
|---|---|---|---|---|
| JKG | vertical | EasySkyMesh | 20° | 307.5; 184.3; 2,526.4 |
| LLA | vertical | EasySkyMesh | 20° | 8,108.8; 6,259.5; 13,262.6 |

**Intermediate test vectors**, to find where a failed recalculation goes wrong. JKG at the rounded
point, vertical, 20° trees, 10 W. *Test vector.*

| Day (UTC) | Harvest, central | Low | High |
|---|---|---|---|
| 2010-12-15 | 120.34 mAh | 140.28 mAh | 64.48 mAh |
| 2013-12-20 | 43.18 mAh | 70.75 mAh | 0 |
| 2022-01-10 | 4.09 mAh | 24.61 mAh | 0 |

| Hour (UTC) | Gb, Gd, Gr | T2m, WS10m | G, Tc | Central: Voc, f, mAh | Low: Voc, f, mAh | High: Voc, f, mAh |
|---|---|---|---|---|---|---|
| 2013-12-20 09:11 | 0; 13.17; 3.7 | 1.31; 3.86 | 13.643; 1.575 | 5.235; 0.5787; 7.611 | 5.392; 0.8205; 14.998 | 4.845; 0; 0 |
| 2013-12-20 11:11 | 0; 21.72; 6.1 | 1.66; 4.14 | 22.499; 2.082 | 5.418; 0.8054; 26.538 | 5.549; 0.9276; 33.782 | 5.091; 0; 0 |
| 2013-12-20 13:11 | 0; 8.54; 2.4 | 2.38; 4.00 | 8.848; 2.549 | 5.041; 0; 0 | 5.221; 0.5947; 5.208 | 4.591; 0; 0 |

The 11:11 hour shows the start condition: the high variant's Voc of 5.091 V is just below 5.10 V, so
it gets nothing.

**Input fingerprint.** If a recalculation differs, first check whether PVGIS has changed its data.
The files behind the test vectors, downloaded in November 2026. *Test vector.*

| File | Rows | Sum Gb(i) | Sum Gd(i) | Sum Gr(i) | Mean T2m | sha256 |
|---|---|---|---|---|---|---|
| 57.7800_14.1600_PVGIS-SARAH3_t90_h20.csv | 166,536 | 6,381,525.54 | 5,378,320.95 | 1,679,744.70 | 7.1367 | `dea57214bb93f352dbc8a818c13746c86630707e204428c3f6b14c1ccee03cfd` |
| 57.7800_14.1600_PVGIS-SARAH3_t90_h0.csv | 166,536 | 8,574,941.48 | 6,014,701.75 | 1,760,378.40 | 7.1367 | `c17c097cde22244829c2025ca5aaa12f36fd688fea78a1e5db12617338baf609` |
| 57.7800_14.1600_PVGIS-SARAH3_t60_h20.csv | 166,536 | 9,317,286.17 | 7,902,062.91 | 849,450.85 | 7.1367 | `dfd54b82803a9726463398915faaaf13702ed28644e9341a7b00fd2962204cf5` |
| 57.7800_14.1600_PVGIS-SARAH3_t40_h20.csv | 166,536 | 9,931,132.13 | 8,998,538.00 | 397,463.76 | 7.1367 | `ffb00c160bb93bee907d6e4727066555ec46f1c15a42c5773313af3a052382de` |
| 55.9640_13.6030_PVGIS-SARAH3_t90_h10.csv | 166,536 | 7,919,314.22 | 6,036,084.07 | 1,830,670.30 | 8.1924 | `9c97ffb797d759951fc18dc42a384f10eba1c82bea57bf437b8a6a0cb915537d` |
| 66.9510_20.1000_PVGIS-ERA5_t90_h20.csv | 166,536 | 6,631,646.38 | 4,226,017.45 | 1,339,620.34 | 0.4467 | `02816af991b2209756b00068963ade949664c30420861408995bec159a147504` |
| 63.2670_14.3290_PVGIS-SARAH3_t60_h30.csv | 166,536 | 5,819,471.49 | 6,656,339.14 | 653,251.20 | 3.2091 | `2ea1677df988d756a5dedda29f08457960b0c717219be4ba18ce3e4692ec9d18` |
| 61.4770_16.3000_PVGIS-SARAH3_t90_h50.csv | 166,536 | 363,217.60 | 3,221,812.90 | 918,814.40 | 5.7654 | `31d127421db182c90c29572838375af5c3afc1332b87c8054d3384f7cb1ce5a4` |
| 57.7800_14.1600_PVGIS-SARAH3_t90_h50.csv | 166,536 | 869,900.68 | 3,625,597.35 | 1,058,368.70 | 7.1367 | `f4c2ed2b5d2d41947d2ada44dc968bf243baf97c6f951cf35d3053f8a22e806a` |

PVGIS may update or replace its datasets; the sums above show whether a later download differs. The
full set of PVGIS files (about 2.9 GB) is not published; anyone can download it again with the
request in B.3.

## B.15 Sources {#b15}

Each source is labelled with how it was used: **[model]** sets an input, constant or formula;
**[check]** was used by reviewers and sets no constant; **[background]** was read for the first
sizing and sets no constant in the current model. All links were tested on 14 November 2026.
"Blocked" means that the server refused automated access; an ordinary browser will probably open it.

**Weather and irradiation data**

- [model] PVGIS 5.3, the EU's Joint Research Centre. Tool: <https://re.jrc.ec.europa.eu/pvg_tools/en/>. API documentation: <https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/using-pvgis-5/api-non-interactive-service_en>
- [model] PVGIS data sources and calculation methods, including Muneer's diffuse model and PVGIS's own Faiman coefficients: <https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/general-information/data-sources-calculation-methods_en>
- [model] PVGIS's description of ERA5, the reason Norrbotten uses ERA5: <https://joint-research-centre.ec.europa.eu/preliminary-description-new-reanalysis-based-data-pvgis_en>
- [check] Pfeifroth et al., "SARAH-3: satellite-based climate data records of surface solar radiation", Earth System Science Data 16, 5243–5265, 2024. <https://essd.copernicus.org/articles/16/5243/2024/>
- [check] Urraca et al., "Extensive validation of CM SAF surface radiation products over Europe", Remote Sensing of Environment 199, 171–186, 2017. DOI 10.1016/j.rse.2017.07.013
- [check] Urraca et al., "Evaluation of global horizontal irradiance estimates from ERA5 and COSMO-REA6 reanalyses using ground and satellite-based data", Solar Energy 164, 339–354, 2018. DOI 10.1016/j.solener.2018.02.059
- [check] Babar, Luppino, Boström, Anfinsen, "Random forest regression for improved mapping of solar irradiance at high latitudes", Solar Energy 198, 81–92, 2020. DOI 10.1016/j.solener.2020.01.034
- [check] ECMWF Forecast User Guide, section 9.2.2 "Regional temperature biases": <https://confluence.ecmwf.int/spaces/FUG/pages/673551684/Section+9.2.2+Regional+temperature+biases>
- [check] SMHI open data, snow depth (parameter 8), 348 stations: <https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/8.json>
- [check] SMHI on the cold January of 2026 and record low temperatures: <https://www.smhi.se/blogg/blogg/2026-02-03-extremt-kall-januari-i-norra-tornedalen> and <https://www.smhi.se/pd/klimat/pdf_stats/year/SMHI_vov_temperature_25.pdf>
- [background] SMHI's sunlight model STRÅNG: <https://strang.smhi.se/>

**The boards and their current (B.2, 17 November 2026)**

- [model] [S1] IoTThinks/MeshCore pull request 11, receive cycling, PPK2 at 4 V on the battery connector: <https://github.com/IoTThinks/MeshCore/pull/11> (2026-07-08)
- [model] [S2] EasySkyMesh PowerSaving17, test table (Uni-T 890C): <https://github.com/IoTThinks/EasySkyMesh/releases/tag/PowerSaving17> (2026-08-02)
- [model] [S3] EasySkyMesh PowerSaving16, measured at the battery cable: <https://github.com/IoTThinks/EasySkyMesh/releases/tag/PowerSaving16> (2026-06-08)
- [model] [S4] dt267, MeshCore Low Power Firmware for Heltec V3/V4, current profiles for the original firmware and the fork: <https://github.com/dt267/MeshCore-Low-Power-Firmware-For-Heltec-V3-V4> (2026-02-06)
- [check] [S5] EasySkyMesh PowerSaving13: <https://github.com/IoTThinks/EasySkyMesh/releases/tag/PowerSaving13> (2026-02-21)
- [model] [S6] CNX Software, Raspberry Pi Zero 2 W power consumption (Otii Arc): <https://www.cnx-software.com/2021/12/09/raspberry-pi-zero-2-w-power-consumption/>
- [model] [S7] Pi Dramble, power consumption: <https://www.pidramble.com/wiki/benchmarks/power-consumption>
- [model] [S8] Jeff Geerling, Pi Zero 2 W with fewer cores: <https://www.jeffgeerling.com/blog/2021/disabling-cores-reduce-pi-zero-2-ws-power-consumption-half/>
- [background] [S9] openHop Repeater (formerly pyMC_Repeater): <https://github.com/rightup/pyMC_Repeater>
- [background] [S10] openHop Repeater's installation guide: <https://areyoumeshingwith.us/docs/meshcore/installation/>
- [model] [S11] raspi.tv, Pi Zero W power consumption: <https://raspi.tv/2017/how-much-power-does-pi-zero-w-use>
- [model] [S12] Waveshare SX1262 LoRaWAN/GNSS HAT: <https://www.waveshare.com/sx1262-lorawan-hat.htm>
- [check] [S13] Raspberry Pi documentation, power supply: <https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#power-supply>
- [model] [S14] Adafruit PowerBoost 1000C: <https://learn.adafruit.com/adafruit-powerboost-1000c-load-share-usb-charge-boost>

**Battery chemistry (B.12, 17 November 2026)**

- [check] [MJ1] LG Chem INR18650 MJ1, product specification 2016-06-30: <https://cdn.shopify.com/s/files/1/0721/2761/1190/files/LG-MJ1.pdf>
- [check] [S35E] Samsung SDI INR18650-35E, technical report June 2015: <https://static.rapidonline.com/pdf/10-5181_v1.pdf>
- [check] [PSL] Power-Sonic PSL-FP-IFR18650EC, LiFePO4 datasheet Rev1 06/20: <https://cdn.power-sonic.com/documents/PSL-FP-IFR18650EC_Data_Sheet.pdf>
- [check] [EVE] EVE LF105 LiFePO4, product specification: <https://cdn.shopify.com/s/files/1/0603/8283/8841/files/EVE-105Ah-Lithium-Iron-PhosphateLiFePO4-LFP-Battery-Cell-Product-Specification.pdf>
- [check] [NP7] Yuasa NP7-12, datasheet V.3 March 2013: <https://www.plaisance-pratique.com/IMG/pdf/NP7-12_UK.pdf>
- [check] [YUA-M] Yuasa NP, manual for valve-regulated lead-acid batteries, figures 4 and 5: <https://www.thierry-lequeu.fr/data/Yuasa3.pdf>
- [check] [CSB] CSB GP1272, datasheet: <https://csb-battery.com/wp-content/uploads/2026/03/CSB-Datasheet-GP1272-01312026.pdf>
- [check] [DISC] Discover, AGM battery performance and temperature: <https://assets.discoverbattery.com/documents/07_sla/885_product_literature/standard-agm-battery-performance.pdf>
- [check] [BU-410] Battery University, charging at high and low temperatures: <https://batteryuniversity.com/article/bu-410-charging-at-high-and-low-temperatures/>
- [check] [BU-802b] Battery University, elevated self-discharge: <https://batteryuniversity.com/article/bu-802b-what-does-elevated-self-discharge-do/>

**Panel and sky models**

- [model] Muneer, T., "Solar radiation model for Europe", Building Services Engineering Research and Technology 11(4), 153–163, 1990. DOI 10.1177/014362449001100405 (blocked). The source of the overcast-sky law and b = 5.73.
- [model] Faiman's panel temperature model, documented in pvlib: <https://pvlib-python.readthedocs.io/en/stable/reference/generated/pvlib.temperature.faiman.html>
- [model] Clas Ohlson Northlight Flexible Solar System solpanel 15 W, art. 36-9423: <https://www.clasohlson.com/se/Northlight-Flexible-Solar-System-solpanel-15-W/p/36-9423> (out of stock on 14 November 2026)
- [check] Reich, van Sark, Alsema et al., "Crystalline silicon cell performance at low light intensities", Solar Energy Materials and Solar Cells 93(9), 1471–1481, 2009. DOI 10.1016/j.solmat.2009.03.018
- [check] Fell et al., Fraunhofer ISE, recombination at the edges of cut cells, 33rd EU PVSEC 2017: <https://www.ise.fraunhofer.de/content/dam/ise/de/documents/publications/conference-paper/33-eupvsec-2017/Fell_2CV236.pdf>. Supports n of about 1.7 in cut cells.
- [background] IEC 61853-1, testing the performance of photovoltaic modules at different irradiance and temperature.
- [background] Karhu et al., FMI's solar power dataset with snow detection, Geoscience Data Journal 2025; dataset DOI 10.57707/fmi-b2share.d7407bbaca2145afa109d757b00cf086.
- [background] Offgridtec ETFE V2, datasheet: <https://www.offgridtec.com/media/product_attachements/Datasheet_ETFE-V2-modules.pdf>
- [background] Kiwa PVEL, module reliability: <https://scorecard.pvel.com/>

**Charger and electronics**

- [model] CN3791, datasheet Rev 1.0, Consonance (third-party copy; no official link exists): <https://static.chipdip.ru/lib/174/DOC013174086.pdf>. The start condition (1.23 / 1.205 V), the reference's ±2 % and the chip's own current.
- [model] Wio-SX1262, datasheet: <https://files.seeedstudio.com/products/SenseCAP/Wio_SX1262/Wio-SX1262_Module_Datasheet.pdf>, and Semtech SX1262: <https://www.semtech.com/products/wireless-rf/lora-connect/sx1262>. The transmit current of 118 mA.
- [model] Seeed XIAO nRF52840, wiki and schematic: <https://wiki.seeedstudio.com/XIAO_BLE/> and <https://files.seeedstudio.com/wiki/XIAO-BLE/Seeed-Studio-XIAO-nRF52840-Sense-v1.1.pdf>; TI BQ25101, the XIAO's own charger: <https://www.ti.com/product/BQ25101>; DW01-P, protection IC, datasheet Rev 1.6 (third-party copy): <https://static.procontact74.ru/media/product/8e498b70ad97aed070e5a5e91773e30a.pdf>. The leakage currents in the consumption.
- [background] nRF52840, product brief (copy): <https://www.mouser.com/pdfdocs/Nordic_nRF52840_PB.pdf>

**Firmware and consumption**

- [model] EasySkyMesh releases from IoTThinks: PowerSaving 17.1 (<https://github.com/IoTThinks/EasySkyMesh/releases/tag/PowerSaving17.1>), PowerSaving 17 (<https://github.com/IoTThinks/EasySkyMesh/releases/tag/PowerSaving17>) and the wiki page <https://github.com/IoTThinks/EasySkyMesh/wiki/PowerSaving>. 4.5 mA applies to release 17.1.3 with `rxps max`; the newer PowerSaving 18 (22 October 2026) has not been assessed.
- [model] IoTThinks/MeshCore pull request 11, "Added RX duty-cycle power saving support": <https://github.com/IoTThinks/MeshCore/pull/11>. The source of the 6.92 mA measurement behind 7.1 mA.
- [model] MeshCore's documentation on power management on nRF52, the boot lock at 3.3 V behind the 3.4 V planning limit: <https://github.com/meshcore-dev/MeshCore/blob/main/docs/nrf52_power_management.md>
- [check] Meshtastic discussion 478, current measurements on the same hardware with Meshtastic: <https://github.com/orgs/meshtastic/discussions/478>. Only for comparing the order of magnitude; its figures are not used.
- [background] MeshCore: <https://github.com/meshcore-dev/MeshCore>, pull requests 1238, 1353, 1562 and 2286 on power saving on nRF52.

**Batteries and cold**

- [model] Ji, Zhang, Wang, "Li-Ion Cell Operation at Low Temperatures", Journal of The Electrochemical Society 160(4), A636–A649, 2013. DOI 10.1149/2.047304jes. The basis for the cold factor 0.92.
- [model] Battery University BU-802b, self-discharge: <https://batteryuniversity.com/article/bu-802b-what-does-elevated-self-discharge-do>. The basis for 3 % per month.
- [model] Cell datasheets for the usable window of 0.85 (third-party copies): LG INR18650 MJ1 (<https://cdn.shopify.com/s/files/1/0721/2761/1190/files/LG-MJ1.pdf>) and Samsung INR18650-35E (<https://cdn.shopify.com/s/files/1/0613/3327/4870/files/35eDatasheet.pdf>).
- [model] Biltema ICR18650 3000 mAh, art. 84-1378: <https://www.biltema.se/kontor---teknik/batterier/uppladdningsbara-batterier/laddningsbart-icr18650-batteri-3000-mah-2000064536>. The calculator's 3000 mAh per cell and minimum of two cells. The seller's information: 3000 mAh, unprotected flat top, at most 1.5 A charging, charging at 0–50 °C.
- [check] Kasper et al., "Low-temperature discharging performance comparison of sodium-ion and lithium-ion cylindrical batteries", Monatshefte für Chemie 157, 851–857, 2026. DOI 10.1007/s00706-026-03462-5 (blocked). One of the sources for the northern cold factors 0.85 and 0.75.
- [check] lygte-info.dk, index of battery tests (no Biltema entry): <https://lygte-info.dk/info/batteryIndex.html>
- [background] Battery University BU-502 (discharging in the cold) and BU-410 (charging in the cold): <https://batteryuniversity.com/article/bu-502-discharging-at-high-and-low-temperatures> and <https://batteryuniversity.com/article/bu-410-charging-at-high-and-low-temperatures>
- [background] Molicel INR-21700-P42A, datasheet (third-party copy).
- [background] Lithium plating at low temperature: Burns, Stevens, Dahn, JES 162(6), A959–A964, 2015, DOI 10.1149/2.0621506jes; Ouyang et al., J. Power Sources 286, 309–320, 2015, DOI 10.1016/j.jpowsour.2015.03.178; Zinth et al., J. Power Sources 271, 152–159, 2014, DOI 10.1016/j.jpowsour.2014.07.168

**Snow, frost and icing**

- [model] Granlund, Narvesjö, Petersson (RISE), "The Influence of Module Tilt on Snow Shadowing of Frameless Bifacial Modules", 36th EU PVSEC 2019, pp. 1650–1654. DOI 10.4229/EUPVSEC20192019-5CV.4.36. Full text: <https://www.diva-portal.org/smash/get/diva2:1384575/FULLTEXT01.pdf>. The main basis for the snow allowance.
- [model] Icing map of Sweden (Byrkjedal, Kjeller Vindteknikk): <https://www.slideshare.net/slideshow/kvt-mapping-oficing/16696876>. The exposed allowance, roughly double the sheltered one.
- [check] Granlund, "Snow impacts", EU PVSEC 2024, IEA-PVPS: <https://iea-pvps.org/wp-content/uploads/2024/08/02_AGranlund_Snow-Impacts_PVSEC2024.pdf>. The basis for "vertical if nobody brushes".
- [check] Øgaard et al., "Analyzing and modeling snow loss and snow loss accumulation in ground-mounted photovoltaic systems", EPJ Photovoltaics 17, 9, 2026. DOI 10.1051/epjpv/2026004 (blocked).
- [check] IEA-PVPS T13-40 2026, Arctic PV, executive summary: <https://iea-pvps.org/wp-content/uploads/2026/02/IEA-PVPS-T13-40-2026-EXEC-SUMM-Arctic-PV.pdf>
- [check] SMHI faktablad 23, snöklimat (2005), the 40 % fall in days with snow cover: <https://www.smhi.se/download/18.18f5a56618fc9f08e832d674/1717805952680/faktablad_snoklimat%5B1%5D.pdf>
- [check] SMHI on the snow climate: <https://www.smhi.se/kunskapsbanken/meteorologi/arstider/julvader> and <https://www.smhi.se/klimat/klimatet-da-och-nu/klimatindikatorer/sno>
- [check] pvlib snow model (Marion): <https://pvlib-python.readthedocs.io/en/stable/reference/generated/pvlib.snow.coverage_nrel.html>

**Experience from the field**

- [check] YYCMesh, "Cold Weather Charging of Lithium-Ion Batteries": <https://yycmesh.com/blog/cold-weather-charging>. A Meshtastic network in Calgary, not MeshCore; evidence only for tolerance of cold, not for sizing.
- [model] The field test in Jönköping (B.11). No public link.

**Constants that rest on judgement:** the weak-light curves (B.4 step 2); the chip current of
3.5 mA; the combined loss of 0.92 and the charging voltage of 3.9 V; the usable window of 0.85 and
the aging of 0.90; the temperature coefficient of −0.30 %/K; the number of snow days; the panel's
actual 10 W; 340 W/m² and 30 °C at the calibration.

## B.16 Glossary {#b16}

| Term | Meaning |
|---|---|
| PVGIS | The EU's free solar database and calculator (Photovoltaic Geographical Information System) |
| SARAH3 | Satellite-based sunlight data in PVGIS; covers Europe up to about 65° N |
| ERA5 | A global reanalysis from ECMWF; PVGIS uses it where satellite data is missing |
| SMHI | The Swedish Meteorological and Hydrological Institute |
| STRÅNG | SMHI's model for sunlight over Sweden |
| RISE | Research Institutes of Sweden |
| Cut cells | Solar cells cut into narrow strips so that a small panel gets a usable voltage; the edges lose a little in weak light |
| Reanalysis | A weather model run over past decades, fed with observations |
| Weibull plotting position | A standard way to estimate from a ranked list how often a value is exceeded: r = (N + 1)/T |
| Inclinometer | An angle meter (clinometer), for measuring how high trees or hills reach above the horizon |
| MPPT | Maximum power point tracking: a charger that tries to hold the panel at its best voltage; the CN3791 does this with a fixed setting |
| Setting | The panel voltage the CN3791 holds while charging; here 5.0 V |
| Wp | Here: the panel's actual power in full sun, not the rated power |
| Voc | Open-circuit voltage: the panel's voltage with nothing connected |
| Isc | Short-circuit current: roughly proportional to the light |
| Fill factor | The panel's maximum power divided by Voc × Isc; about 0.7 for typical cheap panels |
| Ideality factor n | A diode parameter; here it decides how fast the panel's voltage falls in weak light |
| Shunt resistance | Internal leakage in a panel; does most harm in weak light |
| Sky factor R | The share of the diffuse sky light that a panel still sees above the tree line |
| Tree line | The angle above the horizon below which trees or hills block the sky |
| Rime | Ice that builds up from supercooled fog, mainly on exposed high ground |
| Deficit | How far the battery is from full, in Ah |
| Episode, D | A run of days with a deficit; D is its length up to the winter's largest deficit |
| Return level | The deficit expected to be reached or exceeded once in a given number of winters; here five |
| Deduction | A factor below 1 for capacity that cannot be used: cold, usable window, aging |
| Need | Battery capacity in mAh, before margin, snow days and rounding |
| Floor | The need with an unlimited panel; no panel size can do better |
| Null | No battery is enough, because the panel cannot recharge it even in summer |
| C-rate | Current relative to capacity; 1 C empties a cell in one hour |
