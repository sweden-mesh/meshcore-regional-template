---
title: "A simple repeater in the window"
seoTitle: "Quick start: a MeshCore repeater in your window"
description: "A board on USB power in a high window: repeater firmware, your county's settings with the wizard, an advert and a check of its neighbors."
url: /en/guides/quickstart-repeater/
weight: 3
group: snabbstart
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

A repeater passes other people's messages on. One in a window high up already helps everyone around
you, and all it needs is a USB charger. You also need a companion to check the result
(see [From zero to a companion in your hand](../snabbstart-companion/)).

## 1. Radio and location {#1-radio-och-plats}

A board that sits indoors and gets power from a USB charger is enough, for example:

- **Heltec WiFi LoRa 32 V4**: 429 kr at Pileup in November 2026. It transmits strongly: with
  `set tx 10` it puts out about 22 dBm, with `set tx 22` about 28 dBm, and the wrong setting can
  damage the radio (step 3).
- **Seeed XIAO nRF52840 & Wio-SX1262 Kit**: small and low-power, antenna included.

Put it in the **highest window** you have, with a clear view toward where the mesh is, the
**antenna vertical** and some distance from metal and electronics. Screw on the antenna before the
radio gets power.

Read more: [Choose a repeater](../skaffa-hardvara/repeater/).

## 2. Flash repeater firmware {#2-flasha-repeater-firmware}

1. Open [MeshCore's web flasher]({{< param "firmware.flasher" >}}) in Chrome or Edge.
2. Choose the model and **Repeater**.
3. Connect over USB and follow the steps.

Read more: [Flash firmware](../flasha-firmware/).

## 3. Set it up with the wizard {#3-ställ-in-den-med-guiden}

[Quick repeater setup](/wizard/repeater-snabb/) sends all the settings to the radio over USB, from
the same browser: the radio values, your county's regions, name, position, a new admin password and
duty cycle. You choose the location and the name. Name the repeater following your county's
pattern:

{{< naming >}}

Last, the wizard sends an **advert**, so the mesh learns that the repeater exists. The wizard does
not set the transmit power. If you have a Heltec V4, send `set tx 10` in the [USB console](../usb-konsol/)
before you unplug the cable.

Read more: [Set up a repeater](../repeater/), with every command explained.

## 4. Let the mesh hear it {#4-låt-nätet-höra-den}

Put the radio in the window with the charger. The repeater sends a flood advert on its own only
many hours apart, so give it a hand from your phone:

1. Send a **flood advert** from your companion in the app, so the repeater and others hear you.
2. When the repeater shows up among the contacts in the app, select it and **log in** with the
   admin password you chose.
3. Type `advert` in the repeater's command line in the app. The repeater then sends a flood
   advert, which the repeaters around it pass on.

Read more: [Manage the repeater from the app](../fjarradministration/).

## 5. Does it have neighbors? {#5-har-den-grannar}

Still logged in to the repeater, type `neighbors`. The answer lists the repeaters it has heard
directly, one per line: the start of the key, how many seconds ago, and the signal-to-noise ratio
(SNR). If the list is still empty after half an hour, it reaches no one: try another window, higher
up.

If an observer has heard the repeater, it shows up on the map on the [home page](/) within a while,
with lines to its neighbors. Finally, test with `test` in your county's test channel
{{< testchannel >}} and see if your repeater is among those that heard you.

Read more: [The repeater doesn't show on the map](../../felsokning/repeater-syns-inte-pa-kartan/).

## Next steps {#nästa-steg}

- [The map and observers](../visa-pa-kartan/): make it an observer, so it reports what it hears
  to the map.
- [Solar nodes](../solnoder/): when it is going outdoors, without mains power.
