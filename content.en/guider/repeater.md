---
title: "Set up a repeater"
seoTitle: "Set up a MeshCore repeater: a guide"
description: "Set up a MeshCore repeater: site, flashing, radio, name, region, duty cycle and password, delays, testing before mounting, and a checklist."
url: /en/guides/repeater/
weight: 50
group: repeater
source:
  title: "Sätt upp en egen MeshCore-repeater"
  url: "https://meshat.se/meshcore/satt-upp-egen-repeater/"
  license: "CC BY 4.0"
  changes: "Rewritten and shortened; radio and region from the site's settings; the base values and the table of transmit delays reproduced with source; test and checklist rewritten."
date: 2026-11-12
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

A **repeater** receives traffic and sends it on. Every well-placed repeater lets more people
reach each other, and that is how the network in {{< region "name" >}} grows. How repeaters,
companions and observers fit together is explained in [What is MeshCore?](../vad-ar-meshcore/),
and the terms in [the MeshCore glossary](../ordlista/).

Prefer a form? Use [the quick guide](../../wizard/repeater-snabb/) or [the guided
wizard](../../wizard/repeater-guidad/), which send the commands for you.

> [!CAUTION] Antenna first
> Screw on the antenna before the radio gets power. A LoRa radio that transmits without an antenna can be damaged.

## 1. Choose a site {#1-välj-plats}

The site matters more than the transmit power. A good repeater site has:

- **height and a clear view**, ideally above rooftops and treetops,
- **stable power**: mains power, or a solar panel and a battery sized for winter,
- **a solid mount**, weatherproof if it is outdoors.

A clear view is more than a line: radio waves need an area around the line that is free of
obstacles, and it is wide over long distances. See [Antennas](../skaffa-hardvara/antenn/#fri-sikt-är-mer-än-en-linje).

To see roughly how far a site reaches before you climb, see [Check the site with MeshMapper](../kolla-platsen/).

{{< region-photo "mount" >}}

A repeater should stay put. The network's paths rely on repeaters not moving, so a repeater in a
car does more harm than good.

> [!TIP] Try it before you climb
> Set up and test the repeater where you can easily reach it. Mount it on the mast only once you
> have seen messages get through.

## 2. Flash repeater firmware {#2-flasha-repeater-firmware}

Follow [Choose and flash firmware](../flasha-firmware/#repeater) and choose **Repeater** in the
official web flasher. If you also want the repeater to show up on the map and report traffic,
choose an *Observer* firmware; it needs Wi-Fi. Building your own: [Build a repeater](../bygg-en-repeater/).

## 3. Configure with commands {#3-ställ-in-med-kommandon}

Type the commands one at a time in a serial console, for example *Console* in
[MeshCore Flasher]({{< param "firmware.flasher" >}}), with the radio connected over USB. Wait for
a reply after each command.

> [!WARNING] The defaults are not enough
> A freshly flashed repeater transmits up to 50 percent of the time and has coding rate CR 5, while
> the network uses {{< param "radio.cr" >}} [^cli]. Set everything below, even if the radio seems to work.

### Radio {#radio}

The same settings as everyone else in {{< region "name" >}} (why they are exactly these: [MeshCore settings
in Sweden](../radioinstallningar/)):

{{< settings >}}

```text {title="Radio settings"}
set radio {{< param "radio.freq" >}},{{< param "radio.bw" >}},{{< param "radio.sf" >}},{{< param "radio.cr" >}}
```

```text {title="Transmit power (example; check what your radio and antenna can handle)"}
set tx 22
```

### Name and position {#namn-och-position}

Everyone sees the name when the repeater sends adverts. Use the place name or the site, so that
others understand where it stands, and keep it within 23 bytes so that the position fits in the
same advert.

```text {title="Name"}
set name SE-EXEMPEL-Plats
```

```text {title="Position (decimal degrees)"}
set lat 57.7826
set lon 14.1618
```

A repeater's position is good to share: it stays put, and it shows where the network reaches.

### Region {#region}

The repeater needs the regions for Europe, all of Sweden and the county, with the county as the home
region and `se` as the default region (repeater firmware 1.16 or later). How and why is explained in
[Regions](../regioner/):

```text {title="Regions"}
set flood.max.unscoped 16
region allowf *
region def eu|* europe|eu se {{< region "scope" >}}
region home {{< region "scope" >}}
region default se
region save
```

### Duty cycle {#duty-cycle}

Duty cycle limits how much of the time the radio may transmit. In the 869.4–869.65 MHz band, where
869.618 MHz sits, the requirement is at most 10 percent of the time, unless the radio uses LBT
(listen before talk). This applies across the EU, and in Sweden through the Swedish Post and Telecom
Authority's (PTS) regulation [PTSFS 2025:1](https://pts.se/contentassets/b05c8a7d01a64783aafc6a19e1b78590/ptsfs-2025-1-foreskrifter-om-undantag-fran-tillstandsplikt-for-anvandning-av-vissa-radiosandare.pdf) § 146.
MeshCore assumes 10 percent.
It applies to every transmitter, including a repeater.

The limit also protects the network. While a repeater transmits, the neighbors that hear it cannot
transmit themselves, and if two transmit at once the packets collide. A repeater that transmits too
much drowns out the repeaters around it, and their traffic does not get through. 10 is the ceiling,
not a target: never set it higher.

```text {title="Duty cycle"}
set dutycycle 10
```

### Password {#lösenord}

The admin password is `password` out of the box [^cli]. Change it, or anyone near the radio can
change its settings.

```text {title="New admin password"}
password your-long-password
```

Reboot once everything is set, or after the fine-tuning in the next step:

```text {title="Reboot"}
reboot
```

## 4. Fine-tune {#4-finjustera}

This is optional, but it helps where there are many repeaters.

> [!NOTE]- Transmit delay: txdelay and direct.txdelay
> When several repeaters hear the same packet, each one waits a random moment before sending it on,
> so that they do not collide. `txdelay` (flood traffic, default 0.5) and `direct.txdelay` (direct
> traffic, default 0.3) control how long that moment can be; higher values give fewer collisions but
> slower traffic [^cli]. Count the neighbors with `neighbors` and start here [^meshat]:
>
> | Repeater neighbors | `txdelay` | `direct.txdelay` |
> | --- | --- | --- |
> | 0–1 | 0.3 | 0.1 |
> | 2–4 | 0.5 | 0.3 |
> | 5–9 | 1.0 | 0.5 |
> | 10–14 | 1.5 | 1.0 |
> | 15 or more | 2.0 | 2.0 |
>
> ```text {title="Example: 5–9 neighbors"}
> set txdelay 1.0
> set direct.txdelay 0.5
> ```

> [!NOTE]- Path hash: path.hash.mode
> Sets how many bytes of the repeater's key are used in the path for its own adverts: 0 gives
> 1 byte, 1 gives 2 bytes and 2 gives 3 bytes [^cli]. Longer ids are mixed up less often, but the
> path allows fewer hops: 64, 32 and 21 respectively [^faq]. Repeaters with firmware 1.14 or later
> pass on all sizes.
>
> ```text {title="3 bytes"}
> set path.hash.mode 2
> ```

> [!NOTE]- Base values: agc.reset.interval, multi.acks and rxdelay
> meshat.se suggests these three as a baseline [^meshat]:
>
> - `set agc.reset.interval 500`: resets the receiver's gain at regular intervals, in
>   seconds (default 0, off) [^cli].
> - `set multi.acks 1`: turns on support for multiple acknowledgments (default 0) [^cli].
> - `set rxdelay 0`: turns off the experimental delay for weakly received flood packets
>   (default 0) [^cli].

> [!NOTE]- How often the repeater announces itself
> A repeater sends a flood advert every 47 hours by default, according to the CLI reference;
> MeshCore's FAQ says every 12 hours [^cli] [^faq]. Change the value with
> `set flood.advert.interval <hours>` (3–168).

## 5. Check that it is heard {#5-kontrollera-att-den-hörs}

1. Wait a few minutes after the reboot. The repeater then sends an advert.
2. List the repeaters it has heard:

   ```text {title="Neighbors"}
   neighbors
   ```

3. Look at the map on [the home page](/). If an observer has heard the repeater, it shows up there
   within a while, with links to its neighbors.

## 6. Test before you mount it {#6-testa-innan-du-monterar}

Do this with the repeater on the table, or wherever you can easily reach it.

1. Set up two companions with the same values as the repeater, and place them so far apart that
   they do not hear each other directly.
2. Put the repeater in between.
3. Send an advert from both companions.
4. Check that they see each other in the contact list, with the repeater on the path.
5. Send a direct message and wait for the delivery receipt.
6. Type `test` in the county's test channel {{< testchannel >}}, and check that your repeater is
   among those that heard it.

## 7. Checklist {#7-checklista}

- The right firmware for the radio, and up to date
- Antenna attached, before power
- Radio settings with `set radio`
- Name and position
- `set dutycycle 10`
- New admin password
- The regions, saved with `region save`
- Power and enclosure suit the site and the winter
- Tested, and visible on the map

## If something goes wrong {#om-något-krånglar}

[The radio hears no repeaters](../../felsokning/hor-inga-repeatrar/), [The repeater does not show up on the map](../../felsokning/repeater-syns-inte-pa-kartan/) and [The region def command gives an error](../../felsokning/region-def-fungerar-inte/). More problems and solutions are in [Troubleshooting](../../felsokning/).

## Next steps {#nästa-steg}

- [Manage the repeater from the app](../fjarradministration/): change settings once it is mounted,
  without a USB cable
- [Regions](../regioner/): what the regions do with the traffic
- The map on [the home page](/): see your repeater and which nodes it reaches

## Sources {#källor}

[^cli]: MeshCore, [CLI reference](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md): `set radio`, `set dutycycle`, `password`, `txdelay`, `direct.txdelay`, `path.hash.mode`, `agc.reset.interval`, `multi.acks`, `rxdelay`, `flood.advert.interval`.
[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md): path hash and hops, flood adverts.
[^meshat]: meshat.se, [Sätt upp en egen MeshCore-repeater](https://meshat.se/meshcore/satt-upp-egen-repeater/) (in Swedish), step 5 (CC BY 4.0).
