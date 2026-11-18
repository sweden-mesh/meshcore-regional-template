---
title: "My nRF52 radio doesn't show up as a USB drive"
description: "RAK4631, T1000-E and other nRF52 boards: no drive to drag the firmware file onto."
url: /en/troubleshooting/nrf52-no-usb-drive/
category: flasha
weight: 35
date: 2026-11-13
lastmod: 2026-11-13
---

nRF52 boards are often updated by dragging a `.uf2` file onto a drive that the radio shows when it
is in bootloader mode.

## Likely causes {#troliga-orsaker}

1. **The radio isn't in bootloader mode.**
2. **The cable only charges.**
3. The board has no UF2 bootloader. Then you flash it with the web flasher over USB instead.

## Fix {#åtgärda}

1. Quickly double-click **RST** (reset). A drive appears on the computer, often with the board's
   name.
2. If that doesn't help: switch to a cable that carries data and try again.
3. If the drive shows up but won't take the file: check that the file ends in `.uf2` and is for
   your model.
4. No drive at all: flash with the [web flasher](../../guider/flasha-firmware/), which uses the
   serial port instead.

## How to tell it worked {#så-vet-du-att-det-fungerar}

The drive disappears by itself once the file is copied, the radio restarts and `ver` shows the
new version.
