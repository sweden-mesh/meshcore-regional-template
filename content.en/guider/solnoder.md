---
title: "Solar nodes"
seoTitle: "Solar-powered MeshCore node"
linkTitle: "Solar nodes"
description: "How a solar-powered MeshCore repeater works in Sweden: why winter is the hard part, and which panel, battery and charger it needs."
url: /en/guides/solar-nodes/
weight: 40
group: sol
date: 2026-11-14
lastmod: 2026-11-18
---

{{< solar-cta >}}

This page explains the why and the how, for those who want to read about it.

## Why solar? {#varför-sol}

A repeater does the most good high up with a clear view: on a hill, on a mast, at the edge of a
forest facing a valley. Those places rarely have a power outlet. A solar-powered repeater can stand
where it is needed instead of where there happens to be power, and it keeps working when the grid
is down.

The price is that it has to get by on its own all winter. A solar repeater gets through the summer
almost no matter how it is built; it is the winter that decides how big a battery it needs and how
the panel should be mounted. The figures on this page are for a typical build with
[Clas Ohlson's panel](https://www.clasohlson.com/se/Northlight-Flexible-Solar-System-solpanel-15-W/p/36-9423)
where you live, and they are calculated for **the worst winter in five years, plus a 50 percent
margin**, rounded up. The charger is set to **5.0 V**. They will not reliably get through a once-in-a-century winter.

## The short answer {#det-korta-svaret}

{{% solar "where" %}}

{{% solar "short" %}}

What changes the need the most is the tree line, the panel's angle and how much current the
firmware draws. How bad a single winter is matters less.

## The challenge: winter {#utmaningen-vintern}

Irradiation on a vertical south-facing panel, kWh/m² per day, monthly average 2005–2023 (PVGIS):

{{% solar "irradiation" %}}

The points below are for the reference case Jönköping (57.8° N). Farther north the winter is darker and the sun lower; farther south the opposite.

- December gets 19 percent of June's light. A typical December day gives 0.31 kWh/m², and every
  winter has a stretch of five or six days below 0.1.
- The midday sun is only about 10° above the horizon in early December, 9° at the winter solstice
  and about 15° at the end of January.
- Behind a 20° tree line, no direct sun at all arrives from late October to mid-February. Behind
  15°, that holds from about 10 November to early February. The panel then lives only on light
  from the sky.
- With a 20° tree line all around, the panel gives 79 Wh per day per kilowatt of rated power in
  December and 119 Wh in January. With a clear horizon it is 656 and 912 Wh. So the trees take
  away almost 90 percent of December and January.

The winter deficit is therefore built in: in the simulation it builds up every winter from about
mid-November to the end of January. How deep it gets varies a lot from winter to winter; the method description, which
you reach from [the calculator](/wizard/solcell/), works through an example.

## Does it help that the panels are cold? {#hjälper-det-att-panelerna-är-kalla}

It is true that a solar cell produces more in the cold, but for winter it makes almost no difference. The figures are for the reference case Jönköping.

| | Value |
|---|---|
| The cell at −5 / −10 °C compared with the datasheet's 25 °C | +11 % / +13 % |
| The gain that actually reaches the battery, December–February | +5–6 % |
| Irradiation in December compared with June | 19 % |
| Energy in December compared with June, everything included | 21 % |

- The gain is counted per unit of sunlight, and there is little sunlight. The low sun takes away
  about 2,500 Wh per kWp per day compared with June; the cold gives back about 40.
- A sunlit panel is 10–20 °C warmer than the air, and the sunny winter days are usually the milder
  ones. When the winter's energy actually arrives, the cells are therefore around +9 to +12 °C,
  not −5.
- Weak gray light is converted a few percent less efficiently, which eats up most of the cold gain.

What really drives the winter harvest is the tree line, which takes away about 90 percent of
December behind 20°, and fresh snow on the ground, which can give up to 15 percent more in January
on a vertical panel.

> [!WARNING]- Charging cold cells
> At such small currents the risk is limited but not zero. No published tests cover charging
> currents this low between 0 and −10 °C. Based on the data that exists, the limit lands at about
> 0.15–0.25 C at −10 °C (1 C means the full capacity is charged in one hour). Normal winter
> charging of a 7,000 mAh pack is at 0.02–0.03 C, far below. On the brightest days, about one in
> twenty, the best hour reaches 0.24–0.33 C. A larger pack or a charge current limited to 1 A
> lowers the peak, and behind a 20° tree line the currents in December and January are about ten
> times smaller. Half the energy in December–February arrives when the air is below 0 °C, so a
> charger that refuses to charge below 0 °C throws away half the winter.
>
> Experience from another cold network: [YYCMesh](https://yycmesh.com/blog/cold-weather-charging),
> a Meshtastic network in Calgary, Canada, has run unheated solar nodes in Alberta for about two
> winters, including on three mountain tops above 2,100 meters. The cells were charged at low
> current through winters down toward −40 °C, with no failures in the network. One cell measured
> afterwards had about 6 percent less capacity than new cells. This is experience from one
> network, not a controlled test, and the cell temperatures were not logged. It says something
> about the cold, not about battery size: Calgary is at 51° N, where the midday sun in December is
> still about 15° above the horizon.

## What it takes {#vad-som-krävs}

In short, for a node that has to get by on its own:

- **Panel:** Clas Ohlson's panel (stripped down, just the solar sheet), **vertical, facing south**
  if nobody brushes off the snow, and as clear a view to the south as the site allows.
- **Battery:** lithium-ion, **at least two cells** in parallel, with a protection board, in an insulated box. The size depends
  on the tree line and where in the country the node stands; see the tables below.
- **Charger:** an MPPT solar charger (CN3791), set to **5.0 V** with Clas Ohlson's panel. Avoid chargers that stop
  charging below 0 °C: half the winter's energy arrives when it is below freezing.
- **Firmware:** a low-power repeater. With EasySkyMesh it draws about 4.5 mA on average, with
  official MeshCore about 7.1 mA, and that changes the battery need by about a factor of two.
- **Radio:** Seeed XIAO nRF52840 with Wio-SX1262, and nothing else drawing power from the battery.

The details are under [What the figures assume](#vad-siffrorna-förutsätter).

{{< prebuilt-solar >}}

### Clas Ohlson's panel, and if you buy a different one {#clas-ohlsons-panel-och-om-du-köper-en-annan}

Clas Ohlson's panel is being phased out, but many people already have one. Its figures can guide
you when you choose a different panel:

| | Clas Ohlson's panel |
|---|---|
| Rated power according to the shop | 15 W |
| Actual power in full sun, measured | about 10 W |
| Open-circuit voltage in full sun, calculated from the field test | about 6.4–6.6 V |
| Indoors behind two panes of glass, 4 November at 13:04 | 5.90 V open circuit, 1.12 A short circuit, about 4.7 W |

If you choose a different panel:

- **Count on actual power, not rated power.** Clas Ohlson's panel gives about two thirds of its
  rated power in full sun. A panel that really gives about 10 W gives roughly the same winter
  harvest as in the tables; a smaller panel needs a bigger battery.
- **The voltage has to suit the charger.** The tables assume Clas Ohlson's panel (about 6.4–6.6 V
  open circuit in full sun) and a CN3791 set to 5.0 V. The CN3791 only charges when the panel's
  open-circuit voltage is above about 1.02 times the setting; set it too high and the charger only
  starts in strong light and misses the winter's weak light. If your panel has a different voltage,
  set the charger to match it.
- **Measure it yourself** before winter: the open-circuit voltage in sun, outdoors, with nothing
  connected.

## How big a battery {#hur-stort-batteri}

Want to work out a different panel or a different number of cells? Use
[the solar calculator](/wizard/solcell/): choose tree line, board and firmware, and drag the sliders.

Everything here applies to lithium-ion, 18650 cells or LiPo. LiFePO4 lasts more cycles and lead-acid
can be charged below freezing, but LiFePO4 sits below the voltage the nRF52 boards start at and needs
a different charger, and lead-acid needs about two and a half times as much battery and weighs many
times more. The reasons are in [the method description](/wizard/solcell/metod/#litiumjon).

### By battery capacity {#efter-batteriets-kapacitet}

Panel vertical, facing south. *Days in total darkness* is how long the battery alone keeps the
repeater running with no sun at all, with cold, discharge limit, aging and self-discharge included.
*Gets through* means the battery never drops below 3.4 V during the worst winter in five years,
with the margin. Snow on the panel is not included in the tables; see [Snow and frost](#snö-och-frost-på-panelen).
*No trees* means only the terrain around the site blocks the sun; in hilly areas farther
north, the terrain alone blocks a large part of the winter sun.

{{% solar "capacity" %}}

47 days (9,000 mAh) is more than the longest sunless period measured in the reference case Jönköping. The
long deficit periods behind trees are dim, not dark: the panel gives a little every day.

### By tree line and panel angle {#efter-trädlinje-och-panelvinkel}

Battery in mAh for the worst winter in five years, with EasySkyMesh unless stated otherwise. In
parentheses, how far off the calculation can be. Never build with fewer than **two cells** (6,000 mAh
with 3000 mAh cells), whatever the table says: the charger delivers up to 2 A, more than a single
cell usually tolerates.

{{% solar "trees" %}}

- **Measure the tree line:** stand where the panel will go, open an inclinometer (clinometer) app on
  your phone, sweep from southeast through south to southwest, and note the highest angle where
  trees, houses or hills cut off the sky.
- **Tilt and snow:** a tilted panel sees much more sky and therefore needs much less battery under
  a tree line, but only if someone brushes off the snow. A panel at 60° holds snow about as long as
  one at 40°; only a vertical panel usually clears itself (see [Snow and frost](#snö-och-frost-på-panelen)). Every day under
  snow costs about 154 mAh (EasySkyMesh) or 242 mAh (official firmware), so three weeks of snow
  needs about 3,200 mAh more, before the margin. For a site nobody visits in winter: use the
  vertical column.
- **Direction:** south is best. Southwest changed the need a little with a clear horizon in the
  first calculation and has not been recalculated. Facing west does not work; see the field test
  below.

## What a field test in Jönköping showed {#vad-ett-fälttest-i-jönköping-visade}

A field test from 17 October to 13 November 2026 measured a real charging setup in late autumn.
Round 2 used Clas Ohlson's panel, but with a different charger (a cheap linear HW-736 instead of a
CN3791) and indoors behind two panes of glass, so the test does not check the calculation's
figures. It shows how a small real solar setup behaves in late autumn.

**Setup:** the panel vertical in a south-facing window indoors, behind two old panes of glass. The
charger was an HW-736, a cheap linear charger that needs about 4.7 V from the panel before any
current flows. Two cheap 18650 cells in parallel. A 531 Ω resistor as the load, about 7.5 mA or
180 mAh per day, instead of a repeater with XIAO nRF52840 and Wio-SX1262 without aggressive power
saving. Light was measured by a weather station on the roof with a horizontal sensor that reads
about 25–35 percent too low, so those figures show the shape of the weather, not absolute values.

**Round 1, a small 1.5 W garden-lamp panel (8 × 15 cm):**

| Conditions | Result |
|---|---|
| Night, no sun | the battery loses about 180 mAh per day, very steadily |
| Clear day, 18 October | at least 760 mAh in, peak 208 mA, about 1 W |
| Sunny days, 28–29 October | about +280 to +300 mAh net per day (450–480 mAh from the panel, about 2.5 days of load) |
| Grayest week, 22–27 October | the panel gave about 90 mAh per day, half the load |
| Dark gray day, 1 November | the panel gave essentially nothing |
| Nine days, 23 October–1 November | broke even with about one sunny day in three or four |
| Same panel facing west, with a hill to the east | 3–6 mA versus up to 208 mA facing south, about 40 times less |

**Round 2, Clas Ohlson's panel** (from 4 November, same charger, cells and load). On 4 November at
13:04, indoors behind the glass and with about 145 W/m² on the roof sensor: open-circuit voltage
5.90 V, short-circuit current 1.12 A, about 4.7 W at that moment.

| Conditions | Result |
|---|---|
| The week of 5–11 November, on average about half the light the small panel needed to break even | the panel covered about 70–90 percent of the 180 mAh per day load |
| Dark days, peak light only 35–60 W/m² | about 50–100 mAh per day, where the small panel gave zero |
| Good light | the charger's 500 mA limit, not the panel, became the bottleneck |

What the test showed:

- **The harvest is very nonlinear.** Below a certain light level a linear charger gives nothing at
  all, because the panel cannot hold the voltage above the threshold. Clas Ohlson's panel turned
  dark days from zero into 50–100 mAh. The testers think a charger that works in lower light (an
  MPPT charger like the CN3791) also helps, but that was not tested.
- **A full battery looks like it is not charging:** the charger cuts the current near 4.2 V and
  the green LED lights up.
- **Cheap cells labeled "3000 mAh" gave about half that.**
- **Only compare voltages measured in the morning,** after the night and before the sun reaches
  the panel. Evening readings after charging are 30–50 mV too high.

The testers' rough estimate from the measurements so far: a winter deficit from November to
mid-February of about 14 Ah at 180 mAh per day for the small panel, and about 5–8 Ah for Clas
Ohlson's panel in the same window. Both may be off by a factor of two in either direction. They
expect Clas Ohlson's panel to give about 30–50 percent more outdoors without glass, but that has
not been measured.

## What the figures assume {#vad-siffrorna-förutsätter}

The tables above apply only to this build:

- **Panel:** Clas Ohlson's panel, stripped down so that only the solar sheet is used. The built-in
  battery, charging board and dusk sensor are removed. Actual power in full sun is about 10 W.
- **Radio:** Seeed XIAO nRF52840 with Wio-SX1262, powered from the battery only through the XIAO's
  BAT+ and BAT−.
- **Firmware:** EasySkyMesh, MeshCore's power-saving branch, the repeater build, with
  `powersaving on` and `set radio.rxps max`: about 4.5 mA on average. Official MeshCore with
  `powersaving on`: about 7.1 mA.
- **Charger:** an adjustable CN3791 solar charger board set to **5.0 V** (never 5.6 V with this panel), with the LED resistors
  removed, charge current at most 2 A.
- **Battery:** lithium-ion, 3.6–3.7 V, cells in parallel, with a protection board, in an insulated box.
- **Mounting:** vertical, facing south, the bottom edge above the height where snow drifts.
- **Nothing else on the battery:** no extra boards, no status LEDs.

### Before the first winter {#innan-första-vintern}

1. Measure the voltage between the panel's two output wires in sun, with nothing connected. Expect
   about 6.0–6.6 V in full sun (the field test measured 5.90 V indoors behind glass). If it shows
   anything else: stop and check that you have the right wires, and do not go on until you read
   about 6.0–6.6 V.
2. Set the charger with a bench power supply at **5.0 V** until the board's MPPT pin shows
   1.205 V. Check that the charge current is at most 2 A. The CN3791's reference is accurate to
   about ±2 percent, roughly ±0.1 V, so then measure the voltage at the panel connection while the
   board is charging and adjust toward 5.0 V. 4.8 V is a little better still behind trees, but only
   if the board's input voltage drop is below about 0.15 V and it has no series diode before the
   inductor; otherwise 5.0 V.
3. Remove the charger's LED resistors: the board's own current eats into the weak light's harvest.
   Connect charger → protection board → the XIAO's battery pads.
4. Check that a test charge ends between 4.16 and 4.25 V and starts again by itself below 4.0 V.
5. Cover the panel and check that the battery loses less than 0.1 mA at night.
6. Flash the firmware and turn on the power-saving settings.
7. Run the battery flat, put the panel in the sun and check that the node starts by itself.
8. Mount it, and make sure the battery is fully charged at the end of October.

A day's current log at the battery before you buy cells is worth more than any calculation.

> [!TIP]- Optional: measure the panel's voltage in weak light
> How much battery you need depends on how the panel's voltage falls in weak light, and nobody has
> measured that yet. It is the difference between the tables' low, expected and high values. Here
> is how to measure it:
>
> 1. Within about two minutes, with the panel at the same temperature, measure open-circuit voltage
>    and short-circuit current at 4–6 light levels.
> 2. Dim the whole panel evenly with layers of tulle or mosquito netting; never shade just part of it.
> 3. Cover short-circuit currents from about 1 A down to about 0.03 A.
> 4. Plot the voltage against the logarithm of the current. How much the voltage rises when the
>    current goes up tenfold shows which value applies: about 0.85–0.9 V the low one, about 1.0 V
>    the expected one, about 1.3 V the high one.

### Snow and frost on the panel {#snö-och-frost-på-panelen}

Even a vertical panel can be covered by snow that sticks to the glass through a thin layer of frost
or ice; in a trial in Piteå (65° N), even the vertical module was completely covered all of January.
Hoarfrost disappears after an hour or two of low sun and needs no margin of its own. Count on days
with no harvest and add them before the margin, about 154 mAh per day with EasySkyMesh and 242 mAh
with official firmware:

| | Sheltered site | Exposed hill or summit |
|---|---|---|
| South of 60° N | 2 days | 4 days |
| North of 60° N | 5 days | 8 days |

North of about 63° N, a vertical panel can be buried for 2–3 weeks in midwinter; that is not
included in the figures. [The solar calculator](/wizard/solcell/) adds the snow days for you.

## How the figures were produced {#så-togs-siffrorna-fram}

The full method, with assumptions, data and checks, is in
[the solar calculator's method](/wizard/solcell/metod/). In short:

An hour-by-hour simulation over the 18 winters 2005–2023, with PVGIS satellite data for
irradiation and temperature at the region's location ({{% solar "point" %}}). The tree line blocks the direct sun and
part of the sky. The model accounts for the panel's lower efficiency in weak light, the charger's
own losses and the repeater's consumption. Each winter gives the largest deficit the battery must
bridge. The tables use the worst winter in five years and add 50 percent, rounded up to the
nearest hundred mAh.

The charger is modeled hour by hour at 5.0 V: the panel's voltage in weak light decides when the
CN3791 starts. The first version of the calculation assumed the charger worked in light where it
cannot start at 5.6 V, and so gave figures that were too low; this page shows the corrected version.
The model matches the field test if the window in the test had a skyline of about 10°, which shows
that the tree line, or the horizon, is what matters most.

An independent rebuild of the current model, written only from the method description, gave
exactly the same values as the calculator's data. The full method and the checks are in the
method description, which you reach from [the calculator](/wizard/solcell/).

> [!NOTE]- The battery size formula
> battery (mAh) = (deficit / (0.92 × 0.85 × 0.90) / (1 − 0.03 × days/30) + snow days) × 1.50
>
> - 0.92: capacity left at −20 °C at such a small discharge
> - 0.85: usable window, 4.2 V down to a limit of 3.4 V
> - 0.90: aging, sized for the third winter
> - 3 %: self-discharge per month during the deficit period
> - snow days: days with no harvest × the daily need, where the daily need is the consumption × 24 h / (0.92 × 0.85 × 0.90): about 153 mAh with EasySkyMesh (4.5 mA) and 242 mAh with official firmware (7.1 mA), before the margin (only in the calculator)
> - 1.50: margin, and the answer is rounded up

Not included in the tables: snow or frost on the panel (see above), and extra light reflected from
fresh snow on the ground. The biggest uncertainties are the panel's voltage in weak light (see the
measurement above), the firmware's actual average consumption and the actual tree line. The
uncertainty is large, about ±25–50 percent, until the panel's weak-light behavior has been measured.

**Sources:** PVGIS v5.3 (the EU's Joint Research Centre), SARAH3 hourly irradiation with ERA5
temperature, 2005–2023; station data from the Swedish Meteorological and Hydrological Institute
(SMHI) for Jönköping-Axamo and Växjö; current measurements of MeshCore and EasySkyMesh builds on
XIAO nRF52840 with Wio-SX1262; the CN3791 datasheet; module temperatures from FMI's field
measurements in Sodankylä and laminate datasheets; cold behavior of cells from manufacturers'
datasheets and published tests, including Battery University's
[BU-410](https://batteryuniversity.com/article/bu-410-charging-at-high-and-low-temperatures) on charging in the
cold and a [typical LiFePO4 datasheet](https://robu.in/wp-content/uploads/2021/03/10-871884-Orange-50Ah-3.2V-Prismatic-LFP-Battery.pdf)
(charging at 0–45 °C); the field test in Jönköping in October and November 2026.

Has your solar node already gone quiet? See [The solar node dies in winter](/felsokning/sol-dor-pa-vintern/).

{{< solar-cta >}}
