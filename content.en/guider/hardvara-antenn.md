---
title: "Antennas"
seoTitle: "Antennas for MeshCore on 868 MHz"
description: "Antennas for MeshCore on 868 MHz: what matters, models with gain and connector, what dBi means, cable losses and where to mount the antenna."
url: /en/guides/get-hardware/antenna/
weight: 17
group: start
cardSkip: true
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

For a repeater, the antenna and where it is mounted matter more than the board. The small antenna
that comes with the board is fine on the desk, not on a mast. How antennas work, what gain means
and how to work out cable losses is covered further down.

## What matters, in this order {#det-här-spelar-roll-i-den-ordningen}

1. **Height and a clear view.** An antenna high up with a clear view toward those it needs to reach
   does more than one with higher gain lower down. Between two antennas, not only the line needs to
   be clear, but also an area around it (the Fresnel zone) [^fresnel]. See [A clear view is more than a line](#fri-sikt-är-mer-än-en-linje).
2. **The right band.** The antenna should be made for 868 MHz, or a band that covers 863–870 MHz.
3. **Connector and cable.** The connector must fit the radio (usually SMA), and the cable should be short:
   thin cable such as RG58 loses many times more than thick low-loss cable such as LMR-400
   [^rg58] [^lmr400]. See [Cable](#kabel).
4. **Durability.** An outdoor antenna should be made for it, and the connector should be sealed against moisture.

{{< hw "antenna" >}}

> [!CAUTION] Antenna first
> Screw on the antenna before the radio gets power. A LoRa radio that transmits without an antenna can be damaged.

## Made for 868 MHz {#gjord-för-868-mhz}

An antenna only works well on the band it is built for. Buy one that says **868 MHz** (or a band
that covers 863–870 MHz). An antenna for 915 MHz or 433 MHz can look identical, but radiates less
of the power and receives worse.

## Types {#typer}

Whip
: The small antenna that comes with the board. Fine on the desk and in a pocket, not for a repeater.

Dipole and quarter-wave with ground plane
: Simple and predictable, around 2 dBi. Good for a companion by the window, and easy to build
  yourself if you want to.

Collinear (omnidirectional with gain)
: Several elements stacked in one long antenna, often 3–6 dBi. The usual outdoor repeater antenna.

Directional antenna (Yagi, panel)
: High gain in one direction. For a link between two repeaters that cannot otherwise hear each
  other, not for covering an area.

## What gain means {#vad-vinsten-betyder}

An antenna creates no power. The gain in dBi says how much it concentrates the radiation in some
directions instead of all of them. An omnidirectional antenna with high gain has a flat radiation
lobe: it reaches farther toward the horizon, but worse straight down and straight up.

- **On a tall mast or a hill**, a high-gain antenna can shoot over the people living in the
  valley below. 3–5 dBi is often a better choice there than 8–10 dBi.
- **On flat ground** with a long view to the horizon, higher gain does the most good.
- **The power limit includes the gain.** The limit of 500 mW ERP applies to the transmitter plus the
  antenna. With a 6 dBi antenna and a radio at 22 dBm you are within the limit; with a board that
  gives more than 22 dBm you need to do the math, see [MeshCore settings in Sweden](../../radioinstallningar/#sändeffekt-och-antenn).

Gain helps equally in both directions: whoever hears you better is also heard better by you.

## Connectors {#kontakter}

SMA
: The most common connector on LoRa boards and antennas for 868 MHz.

RP-SMA
: Looks almost the same as SMA, but with the pin the other way around. Common on Wi-Fi equipment.
  An RP-SMA antenna on an SMA connector gets no contact in the center and barely works at all,
  even though it is screwed on. Check both before you buy.

U.FL (IPEX)
: A small snap-on connector directly on the circuit board. It only survives a few connections and
  disconnections. Use a short adapter cable to an SMA connector in the enclosure wall and leave it in place.

N connector
: Large and weatherproof, for thick cable and outdoor antennas.

## Cable {#kabel}

All coaxial cable eats signal, and more the thinner it is. Approximate losses at 868 MHz,
according to typical datasheets:

| Cable | Loss per meter |
| --- | --- |
| RG174 (thin, common on adapter cables) | about 1 dB |
| RG58 | about 0.5 dB [^rg58] |
| LMR-195 | about 0.36 dB [^lmr195] |
| LMR-400 and similar thick low-loss cable | about 0.13 dB [^lmr400] |

Three decibels is half the power. So five meters of RG58 takes almost as much as a 3 dBi antenna
gives. Keep the cable short, or put the radio up by the antenna and run power instead of
antenna cable. Sealing outdoor connectors matters just as much: water in the cable increases the
loss over time.

## Placement {#placering}

- **Height above all.** Above rooftops and treetops, with a clear view toward where the mesh is.
- **Vertical.** Everyone in the mesh uses vertical polarization; a horizontal antenna loses a lot toward them.
- **Clear of metal.** Half a meter from poles, metal roofs and other antennas, if you can.
- **Lightning.** See [Lightning and grounding](#åska-och-jordning).

Indoors: by a window facing the right way, as high as possible. Modern energy-efficient windows
with a metal coating attenuate a lot; try another window or an antenna outside.

## A clear view is more than a line {#fri-sikt-är-mer-än-en-linje}

Radio waves between two antennas need more than a clear line. Around the line is an area, the
Fresnel zone, which is widest in the middle and which also needs to be free of hills, trees and
buildings. If an obstacle reaches into the zone, the signal gets weaker, even though you can see
the other antenna [^fresnel].

{{< diagram "fresnel" >}}

| Distance | Radius at the midpoint |
| --- | --- |
| 1 km | about 9 m |
| 5 km | about 21 m |
| 20 km | about 42 m |

That is why a repeater on a mast reaches farther than one on a low roof: at 5 km the line needs to
pass a little over 20 meters above the treetops at the midpoint.

> [!NOTE]- How the radius is calculated
> The radius midway between the antennas is r = 8.66 · √(D ÷ f) meters, with the distance D in
> kilometers and the frequency f in gigahertz [^fresnel]. For 869 MHz, f = 0.868. The table above is
> calculated with that formula.

## Lightning and grounding {#åska-och-jordning}

An antenna at the top is what lightning reaches first.

- **Ground the mast**, especially if the building has no lightning protection [^dehn].
- **Fit a surge protector** on the antenna cable where it enters the building [^dehn].
- **Do not work on the mast** during a thunderstorm.
- **Let an electrician** do the grounding.

We have not found any guidance from a Swedish authority on grounding antenna masts for radio
amateurs and hobby radio. The advice above comes from a manufacturer of lightning protection.

{{< hw-credits >}}

## Next steps {#nästa-steg}

- [Build a repeater](../../bygg-en-repeater/): two builds, with antenna, enclosure and power.
- [Set up a repeater](../../repeater/).
- [The range is much shorter than expected](../../../felsokning/kort-rackvidd/): troubleshoot the range.

## Sources {#källor}

[^fresnel]: Omni Calculator, [Fresnel zone calculator](https://www.omnicalculator.com/physics/fresnel-zone).
[^rg58]: Pro-Tecs, [datasheet for RG58](https://shop.pro-tecs.de/pub/media/datasheets/79037803-6FB1-4875-974D-2A8F0989469A.pdf): 51–55 dB per 100 m.
[^lmr195]: [Datasheet for LMR-195](https://dtsheet.com/model/2274863): 11.1 dB per 100 feet.
[^dehn]: DEHN, [Lightning and surge protection for cable networks](https://www.dehn-international.com/sites/default/files/media/files/wp005-cable-networks.pdf).
[^lmr400]: Fairview Microwave, [datasheet for LMR-400](https://www.fairviewmicrowave.com/images/productPDF/LMR-400.pdf): 3.9 dB per 100 feet.
