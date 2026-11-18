---
title: "The browser can't find a port"
description: "The device list is empty when you go to flash MeshCore, or the radio isn't in it: the cable, the browser, flashing mode or the driver."
url: /en/troubleshooting/no-port/
category: flasha
weight: 30
date: 2026-11-13
lastmod: 2026-11-13
---

## Likely causes {#troliga-orsaker}

1. **The cable only charges.** Many USB cables have no data wires.
2. **The browser lacks Web Serial.** Only Chrome and Edge on a computer have it; Firefox and Safari
   don't.
3. **The radio isn't in flashing mode**, or another tab or program has the port open.
4. On Windows: **a driver is missing** for the board's USB chip (CP210x or CH340 on older boards).

## Fix {#åtgärda}

1. Switch to a cable you know carries data, and try another USB port directly on the computer.
2. Use Chrome or Edge.
3. Close other tabs with a flasher or console, and programs that may have the port open.
4. ESP32: hold down **BOOT**, briefly press **RST** and release **BOOT**. nRF52: double-click
   **RST** so the radio shows up as a USB drive.
5. If Device Manager shows an unknown device: install the CP210x or CH340 driver from the
   manufacturer.

## How to tell it worked {#så-vet-du-att-det-fungerar}

The radio appears in the list when you click *Connect*, and disappears when you unplug the cable.
