---
title: "Flashing was interrupted, and the radio seems dead"
seoTitle: "MeshCore flashing interrupted and the radio is dead"
description: "The cable came loose or the computer went to sleep halfway through. The screen is black and nothing happens."
url: /en/troubleshooting/flashing-interrupted/
category: flasha
weight: 15
date: 2026-11-13
lastmod: 2026-11-16
---

## Likely causes {#troliga-orsaker}

1. **The firmware was only half written.** The radio has no complete firmware to start.
2. The battery is empty, and the radio gets too little power from USB to start.

## Fix {#åtgärda}

You can almost always flash again; the boot code in the chip isn't overwritten.

1. Connect with a cable that carries data and leave it in place.
2. Put the radio in flashing mode:
   - **ESP32:** hold down **BOOT**, briefly press **RST** and release **BOOT**.
   - **nRF52:** double-click **RST**.
3. Flash the same file again, without erasing.
4. Keep the computer awake and the tab open until the flasher says it's done.

## How to tell it worked {#så-vet-du-att-det-fungerar}

The radio starts, and `ver` in the [USB console](../../guider/usb-konsol/) shows the version you
flashed.
