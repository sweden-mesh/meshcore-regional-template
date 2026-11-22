---
title: "MeshCore settings in Sweden"
seoTitle: "MeshCore in Sweden: frequency and rules"
description: "Frequency and radio settings for MeshCore in Sweden, what the PTS rules say about power and duty cycle on 868 MHz, and the traps in the defaults."
url: /en/guides/radio-settings/
weight: 104
group: radio
date: 2026-11-18
lastmod: 2026-11-22
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

MeshCore in Sweden uses the **{{< param "radio.preset" >}}** preset on {{< param "radio.freq" >}} MHz.
No license is needed: the band is free to use within the limits below. Every radio in the mesh must
have the same values, or they cannot hear each other.

## The values {#värdena}

{{< settings >}}

In the app, choose the **{{< param "radio.preset" >}}** preset. On a repeater, in the
[USB console](../usb-konsol/):

```text {title="Console"}
set radio {{< param "radio.freq" >}},{{< param "radio.bw" >}},{{< param "radio.sf" >}},{{< param "radio.cr" >}}
```

MeshCore has no preset of its own for Sweden; the mesh here uses the one for the EU and the
UK [^presets]. The region (scope) depends on your county, see [Regions](../regioner/).

## The rules {#reglerna}

The rules are set out in the regulations of the Swedish Post and Telecom Authority (PTS),
[PTSFS 2025:1](https://pts.se/contentassets/b05c8a7d01a64783aafc6a19e1b78590/ptsfs-2025-1-foreskrifter-om-undantag-fran-tillstandsplikt-for-anvandning-av-vissa-radiosandare.pdf) [^ptsfs]. MeshCore transmits in the sub-band
that allows the most:

| Sub-band | Power | Condition | MeshCore? |
| --- | --- | --- | --- |
| 869.40–869.65 MHz (§ 146) | 500 mW ERP | LBT or at most 10 % of the time | yes, {{< param "radio.freq" >}} MHz |
| 868.0–868.6 MHz (§ 141) | 25 mW ERP | at most 1 % | no |
| 868.7–869.2 MHz (§ 143) | 25 mW ERP | at most 0.1 % | no |
| 433.05–434.79 MHz (§ 124) | 15 mW ERP | | no, not in the meshes here |

So another frequency is not a free choice: the neighboring bands allow one twentieth of the power and
one tenth of the time, or less.

## Transmit power and antenna {#sändeffekt-och-antenn}

The limit applies to ERP: the radio's output power minus cable loss plus antenna gain, measured
against a half-wave dipole: dBd = dBi − 2.15 [^ptsfs]. Most boards give at most 22 dBm, and then you
stay within 500 mW with an ordinary antenna. Boards with a power amplifier, such as the Heltec V4,
put out more than `set tx` says.

| Output power | Cable | Antenna | ERP | Within the limit? |
| --- | --- | --- | --- | --- |
| 22 dBm | 1 dB | 3 dBi | about 150 mW | yes |
| 22 dBm | 1 dB | 6 dBi | about 310 mW | yes |
| 28.4 dBm (Heltec V4, `set tx 22`) | 0 dB | 3 dBi | about 850 mW | **no** |
| 25.3 dBm (Heltec V4, `set tx 16`) | 0 dB | 3 dBi | about 420 mW | yes |

```text {title="ERP"}
ERP (dBm) = output power (dBm) − cable loss (dB) + antenna gain (dBi) − 2.15
```

The Heltec V4 gave 28.4 dBm at `set tx 22`, measured with a calibrated meter on three boards [^v4].
With a board like that, work out the ERP before you set `set tx`, and lower it until the total is
within the limit.

## Duty cycle {#duty-cycle}

At most 10 percent of the time means at most 360 seconds of transmitting per hour, for every
transmitter, a repeater included. MeshCore keeps count and waits when the limit is reached; see
[Duty cycle reached](../../felsokning/duty-cycle/).

> [!NOTE]- LBT or 10 percent
> § 146 allows a radio to transmit more than 10 percent of the time if it uses a technique that
> listens before it transmits (LBT) [^ptsfs]. MeshCore works to the 10 percent limit.

## Traps in the defaults {#fällor-i-standardvärdena}

The firmware's own defaults are not the mesh's [^cli]:

- **Coding rate (CR)** is 5 in the firmware, but the mesh uses {{< param "radio.cr" >}}. A radio
  with CR 5 hears the others less well. Set the whole line with `set radio` above.
- **Duty cycle** is 50 percent in the firmware. On a repeater, set `set dutycycle 10`, see
  [Set up a repeater](../repeater/#duty-cycle).
- **The path hash** is 1 byte in the firmware and in the app. That is not enough: many repeaters
  then share the same id. Set 3 bytes; 2 is the minimum. On a repeater: `set path.hash.mode 2`, see
  [Set up a repeater](../repeater/#väg-id). On a companion: **Experimental Settings** in the app,
  see [Get started with a companion](../companion/#väg-id-3-byte).

## Old settings {#gamla-inställningar}

The older preset for the EU and the UK, 869.525 MHz with SF11, BW 250 and CR 5, is marked as
deprecated [^presets]. If you have it in old notes, switch to the values above.

## Sources {#källor}

[^ptsfs]: PTS, [PTSFS 2025:1](https://pts.se/contentassets/b05c8a7d01a64783aafc6a19e1b78590/ptsfs-2025-1-foreskrifter-om-undantag-fran-tillstandsplikt-for-anvandning-av-vissa-radiosandare.pdf), regulations on exemptions from the license requirement for certain radio transmitters, § 2, § 124, § 141, § 143 and § 146.
[^presets]: MeshCore, [radio presets](https://github.com/meshcore-dev/MeshCore/blob/main/docs/radio_presets.md).
[^cli]: MeshCore, [CLI reference](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md).
[^v4]: [MeshCore issue 1708](https://github.com/meshcore-dev/MeshCore/issues/1708).
