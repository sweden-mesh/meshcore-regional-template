---
title: "Choose a repeater"
seoTitle: "Which repeater for MeshCore?"
description: "Repeaters for MeshCore: boards to build yourself and ready-made solar repeaters, with processor, power, TX power, pros and cons, battery life and prices in SEK."
url: /en/guides/get-hardware/repeater/
weight: 16
group: start
cardSkip: true
date: 2026-11-18
lastmod: 2026-11-18
---

A repeater passes traffic on and makes the mesh bigger. It stays in one place, up high, around the
clock. What decides the choice is power: on mains power a cheap ESP32 board will do, on battery and
solar you need a low-power nRF52 board or a ready-made solar repeater. Check in the
[web flasher]({{< param "firmware.flasher" >}}) that your model is listed before you buy.

{{< hw "repeater" >}}

Step by step for those who build their own: [Build a repeater](../../bygg-en-repeater/). What the
ready-made solar repeaters can handle in winter: [Solar nodes](../../solnoder/#fardiga-solrepeatrar).

## How long the battery lasts {#hur-länge-batteriet-räcker}

Approximate run times, without a solar panel. How much you transmit, the screen, the GPS and Bluetooth
change the numbers a lot.

| Device | Run time | Basis |
| --- | --- | --- |
| Companion, T1000-E (700 mAh) | up to 2 days | manufacturer's figure, for Meshtastic firmware |
| Repeater, nRF52 (XIAO, RAK) on 3,000 mAh | about 17 days | 7.1 mA with official MeshCore and power saving ([Solar nodes](../../solnoder/)) |
| Repeater, ESP32 (Heltec) on 3,000 mAh, without power saving | about 2 days | 50 mA or more, according to the EasySkyMesh project's measurements |
| Repeater, ESP32 with power saving on 3,000 mAh | 5–12 days | 10–25 mA, same source; not available in all firmware |

So a repeater on an ESP32 board belongs on mains power. If it is to run on battery and solar: choose
nRF52.

## Power for a repeater {#ström-till-en-repeater}

A repeater is on around the clock. With mains power that is easy. With **solar and battery** the
battery has to last through the darkest weeks of December, when the panel delivers a fraction of
summer's energy. Plan for:

- an nRF52 board, which draws little;
- a battery that lasts several days without sun;
- a panel that is oversized for summer, so that it is enough in winter;
- a charge controller that tolerates cold, and a battery that can be charged below freezing (LiFePO4
  needs protection).

For solar: read [Solar nodes](../../solnoder/) before you buy a panel, charger and battery. Much of
what is sold as a solar kit is not enough for a Swedish winter.

## Enclosure and mounting {#låda-och-montering}

A repeater outdoors needs a sealed enclosure (IP65 or better), cable glands that seal and a
mount that withstands wind. Leave a small drain hole open at the bottom so condensation can run out.

{{< hw-credits >}}

## Next steps {#nästa-steg}

- [Choose an antenna](../antenn/) for the repeater.
- [Flash firmware](../../flasha-firmware/) and [Set up a repeater](../../repeater/).
