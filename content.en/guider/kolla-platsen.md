---
title: "Check the site with MeshMapper"
seoTitle: "Check a MeshCore repeater site with MeshMapper"
description: "How to check a planned repeater site in MeshMapper before you climb: coverage from the terrain, line of sight to a repeater, the right region and wardriving after."
url: /en/guides/check-the-site/
weight: 47
group: repeater
date: 2026-11-18
lastmod: 2026-11-18
---
Before you carry a repeater up onto a roof or a mast, you can see roughly how far it would reach.
[MeshMapper](https://swe.meshmapper.net/) has tools that work out the terrain around a site and
show which repeaters it can reach. It takes a few minutes and can save you a climb.

A check is a help, not a requirement. A repeater that is up does more good than one waiting for the
best site, see [A repeater that is up beats a perfect one that is not](../for-radioamatorer/#en-repeater-som-är-uppe-slår-en-perfekt-som-inte-är-det).

## The tools {#verktygen}

Open the map's tools with the hammer-and-wrench button on the right side of the map. One tool is
open at a time.

{{< screenshot src="images/guider/meshmapper-verktygsmeny.webp" alt="MeshMapper's map with measured coverage in squares from green to red, and the tools menu open under the hammer-and-wrench button: Line of Sight, Antenna Coverage (highlighted), Coverage Timeline and Scope Finder." caption="The tools menu in MeshMapper." credit="Screenshot: MeshMapper" >}}

Line of Sight
: Clear view between two or more points, with a terrain profile and the Fresnel zone.

Antenna Coverage
: How far a radio at a given site can reach, calculated from the terrain.

Coverage Timeline
: How the region's measured coverage has grown, played back like a film.

Scope Finder
: Whether a region name (scope) is used in the traffic in the region.

## Coverage from a site {#täckning-från-en-plats}

Antenna Coverage shows where a radio at the site is likely to reach.

{{< screenshot src="images/guider/meshmapper-antenna-coverage.webp" alt="The Antenna Coverage panel in MeshMapper: a field for the location (PIN), buttons for power from 14 dBm (25 mW) to 30 dBm (1 W) with 22 dBm selected, TX height 6 m, RX height 2 m, the frequency 869.618 MHz, a collapsed Advanced section and the Show coverage button." caption="The Antenna Coverage panel. Never choose 30 dBm (1 W): it is over the limit." credit="Screenshot: MeshMapper" >}}

1. **Place the site (PIN).** Tap the map where the repeater will stand, or tap an existing
   repeater. You can also type in latitude and longitude, like `57.79, 13.42`.
2. **Choose the power (POWER).** Choose what the radio actually transmits: most boards give at most 22 dBm.
   The limit in Sweden is 500 mW ERP, which is 27 dBm counting the antenna's gain and the cable's loss.
   **Never choose 30 dBm (1 W).** That is twice what is allowed, and the map then shows a
   range that no legal repeater has. See [Transmit power and antenna](../radioinstallningar/#sändeffekt-och-antenn).
3. **Enter the antenna's height (TX HEIGHT)** above the ground, in meters. Measure to the antenna, not to
   the roof under it.
4. **Enter the receiver's height (RX HEIGHT).** 2 m corresponds to a handheld radio. If you want to see which
   repeaters the site reaches, set the height to that of a typical repeater in the area.
5. **The frequency** is filled in by MeshMapper, using the one most used in the region. In Sweden it is
   {{< param "radio.freq" >}} MHz.
6. **Leave Advanced alone.** It holds sensitivity, spreading factor, antenna gain, cable loss,
   margin and environment. The default values suit most cases.
7. **Tap Show coverage.**

### Reading the map {#läs-kartan}

{{< screenshot src="images/guider/meshmapper-tackning-ulricehamn-liggande.webp" alt="Coverage map from MeshMapper for a site near Ulricehamn: a blue dot for the site and colored areas stretching north toward Falköping along the valley, narrow streaks to the northwest, and existing repeaters as labels to the east." caption="Coverage from a site in Ulricehamn. The valley carries the signal north and south; to the east and west the hills cast shadows." credit="Screenshot: MeshMapper" >}}

The colors show how reliable the link is: red is strong, orange likely and yellow at the edge.
MeshMapper also shows how far each level reaches and roughly how large an area it covers.

- **Terrain shadows.** Coverage is rarely an even circle. Hills block, and valleys and lakes
  carry the signal far in some directions. Narrow streaks show directions where the terrain happens to be open.
- **Existing repeaters** appear as labels on the map. A new repeater does the most good where it reaches
  at least one existing one, and at the same time covers an area no other one reaches.
- **Compare two sites.** Run the tool on both, with the same power and height, and see which one reaches
  more repeaters and more new area.

The map calculates only on bare terrain. Buildings, trees, the antenna and the weather change the range in
reality, so treat it as an estimate, not a promise.

## Line of sight to a repeater {#sikt-mot-en-repeater}

Line of Sight shows whether two points can see each other.

{{< screenshot src="images/guider/meshmapper-line-of-sight.webp" alt="MeshMapper's map near Falköping and Lake Vättern with the tools menu open and Line of Sight highlighted, above Antenna Coverage, Coverage Timeline and Scope Finder." caption="Line of Sight is chosen in the same tools menu." credit="Screenshot: MeshMapper" >}}

1. Tap the map or a repeater for point A and point B, or type in coordinates. With
   Add Point you add more.
2. Enter the height above the ground for each point. A point on a repeater starts at 3 m.
3. Tap Calculate.

The answer is a terrain profile, with the earth's curvature and the first [Fresnel zone](../skaffa-hardvara/antenn/#fri-sikt-är-mer-än-en-linje).
Each stretch gets a verdict: clear view (CLEAR), slightly inside the Fresnel zone (Minor Fresnel Intrusion),
the Fresnel zone partly blocked, less than 60 percent clear (Partially Blocked), or blocked view
(OBSTRUCTED). On the map, a clear view is green and a blocked one red.

## The right region {#rätt-region}

Scope Finder shows whether a region name is already used in the traffic there. Type the name, like `{{< region "scope" >}}`,
and tap Find. The answer says whether the name is already tracked by MeshMapper, has been found, only resembles something,
or does not exist. Which region applies here is in [Regions](../regioner/).

## How the mesh has grown {#hur-nätet-har-vuxit}

Coverage Timeline plays back how the region's measured coverage has grown, from the first measurements
to today. There you can see where the mesh is already dense and where it is still thin.

## Afterward: measure {#efteråt-mät}

Once the repeater is up, measurements show how it turned out. Run MeshMapper's app with your companion and drive
or walk around the area (wardriving): every successful ping becomes a point on the map. Also check
on [the map](/#karta) which repeaters the new one hears, and read [The map and observers](../visa-pa-kartan/).
