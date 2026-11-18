---
title: "For radio amateurs"
seoTitle: "MeshCore for radio amateurs: 868 MHz"
description: "You know antennas and propagation. Here is what is different about MeshCore: license-free 868 MHz, ERP with antenna gain, duty cycle, LoRa parameters and flooding."
url: /en/guides/for-radio-amateurs/
weight: 105
group: radio
date: 2026-11-16
lastmod: 2026-11-18
---

If you hold an amateur radio license, you already know most of what decides how far a LoRa node
reaches: height, clear line of sight, antenna gain, cable losses. This page covers what is
different. The other guides assume no radio experience; look up terms in the [glossary](../ordlista/).

## This is not amateur radio {#det-här-är-inte-amatörradio}

MeshCore in Europe transmits in the 868 MHz band for short-range devices (SRD), which is exempt from
licensing. That means:

- **No license is needed**, and your license gives you no extra rights here. The power limit is
  the same for you as for everyone else.
- **No call sign.** A node is identified by its public key and a name the owner chooses.
  You can use your call sign in the name, but you don't have to.
- **Encryption is normal.** Direct messages and private channels are encrypted, which amateur
  radio rules generally don't allow. See [Encryption in MeshCore](../../fragor/#kryptering).
- **Everyone shares the same channel.** The whole mesh sits on one frequency, and there is no
  band plan to choose from.

## The band and the limits {#bandet-och-gränserna}

The mesh here uses {{< param "radio.freq" >}} MHz, in the sub-band **869.4–869.65 MHz**. The following
applies there across the EU, and in Sweden through [PTSFS 2025:1](https://pts.se/contentassets/b05c8a7d01a64783aafc6a19e1b78590/ptsfs-2025-1-foreskrifter-om-undantag-fran-tillstandsplikt-for-anvandning-av-vissa-radiosandare.pdf) § 146, the Swedish Post and Telecom Authority's (PTS) license-exemption regulations:

Power
: At most **500 mW ERP** (27 dBm ERP).

Duty cycle
: At most **10 percent** of the time, that is 360 seconds of transmitting per hour, unless the radio
  uses LBT (listen before talk). MeshCore assumes 10 percent. It applies to every
  transmitter, including a repeater. MeshCore keeps count; see [Duty cycle in the
  repeater guide](../repeater/#duty-cycle).

### Antenna gain counts {#antennvinsten-räknas-in}

The limit applies to ERP, not to the board's output power, and boards with a power amplifier put out
more than `set tx` says. The formula, a worked example and the Heltec V4's measured power are in
[Transmit power and antenna](../radioinstallningar/#sändeffekt-och-antenn).

## The LoRa parameters {#lora-parametrarna}

LoRa is a chirp modulation (CSS) that can be received below the noise floor. Frequency, bandwidth and
spreading factor must be the same on every node in the mesh, or they won't hear each other:

{{< settings >}}

Spreading factor (SF)
: How many chirps each symbol is spread over. Each step up doubles the time on air and tolerates
  about 2.5 dB worse signal-to-noise ratio. At SF8, signals are received down to about 10 dB
  below the noise.

Bandwidth (BW)
: Halving the bandwidth doubles the time on air and lowers the noise floor by about 3 dB. 62.5 kHz is
  narrow for LoRa; it gives range without raising the SF.

Coding rate (CR)
: The error correction. 4/8 sends twice as many bits as the data and handles interference best, but
  takes the longest.

The choice is a trade-off. Longer time on air gives range, but every packet occupies the channel
longer for everyone. At SF8 and 62.5 kHz a short text message takes about half a second on air.

## How traffic is passed on {#så-förs-trafiken-vidare}

It is similar to APRS digipeaters, but with differences:

- **Flooding with memory.** A repeater retransmits a packet once, and recognizes it if it comes
  back. The packet carries the list of repeaters it has passed through (the path).
- **Direct when the path is known.** A reply can go back along the path that worked, instead of
  being flooded again. Only the repeaters on the path transmit.
- **Regions limit the spread.** A flood with a region is only passed on by repeaters that carry
  that region, so local traffic stays local. See [Regions](../regioner/).
- **Companions don't pass traffic on.** Only repeaters do. A handheld in your pocket adds nothing
  to the mesh's coverage.

Since everyone shares one frequency, airtime is the mesh's scarcest resource. A repeater that
transmits collides with neighbors that also want to transmit, and several repeaters within earshot
of each other cost more than they give. See [Airtime is shared](../etikett/).

## What you can contribute {#vad-du-kan-bidra-med}

What you know about antennas, masts and siting is exactly what a mesh most often lacks. A repeater
high up with a clear line of sight does more for the mesh than ten companions. See [Antennas](../skaffa-hardvara/antenn/), [Set
up a repeater](../repeater/) and [Host a node](../../bli-nodvard/).

## A repeater that is up beats a perfect one that isn't {#en-repeater-som-är-uppe-slår-en-perfekt-som-inte-är-det}

As a radio amateur you are used to getting the most out of a station. In a mesh, coverage comes from
many nodes together: each repeater passes on what it hears, so the next node along the path takes
over where yours reaches. A repeater that is up today therefore does more good than one waiting for
the best site or the best antenna.

The best site is often only a little better than the second best. Put up a node that is good enough,
see on the [map](/#karta) which nodes it hears and which hear it, and move or rebuild it once you
know more. Your feel for antennas and siting makes the biggest difference right there, when you
fine-tune. How to set it up: [Set up a repeater](../repeater/).
