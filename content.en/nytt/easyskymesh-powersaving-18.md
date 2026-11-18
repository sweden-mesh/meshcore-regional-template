---
title: "EasySkyMesh PowerSaving 18"
description: "EasySkyMesh PowerSaving 18 (October 22, 2026): the low-power MeshCore firmware moves to 1.18 and gets more commands, companions included."
url: /en/news/easyskymesh-powersaving-18/
group: easyskymesh
release: {product: easyskymesh, version: "18"}
date: 2026-10-22
lastmod: 2026-11-18
checkedOn: 2026-11-18
---

EasySkyMesh is IoTThinks' low-power version of MeshCore. It draws far less current, which makes it a
common choice for [solar nodes](../../guider/solnoder/). PowerSaving 18 came out on October 22, 2026 and
is based on MeshCore 1.18 [^rel]. You flash it from [easyskymesh.com](https://easyskymesh.com/) or as
"Custom Firmware" in MeshCore's web flasher; see [Choose and flash firmware](../../guider/flasha-firmware/).

## What is new {#det-här-är-nytt}

- **Power saving is on from the start** in a new install, for repeater, room server, companion and
  sensor. You can change it from the command line, and the choice survives a restart [^rel].
- **The same commands on companions** as on repeaters: `powersaving on` and `powersaving off`,
  `set radio.rxps balanced` (or `off`, `overdrive`) and `get radio.rxps` [^rel].
- **`set radio.fem.rxgain off`** for Heltec V4.3, V4.3 R8, Tracker v2 and T096 [^rel].
- **Power-saving GPS:** a repeater or room server turns its GPS on once a day for at most ten minutes;
  a companion every 30 minutes and when someone asks for telemetry [^rel].
- **Battery voltage and power-saving status** on the repeater's screen, and companions show uptime [^rel].

## Before you update {#innan-du-uppdaterar}

- **Station G3 as a BLE companion:** the partition is larger now. Export the settings, do a clean
  install with `merged.bin` and import them again [^rel].
- **T-Echo:** there are reports of weaker reception. For now: `set radio.rxps off` [^rel].

## Sources {#källor}

[^rel]: IoTThinks/EasySkyMesh, [PowerSaving 18: For Power Users with More CLI Controls](https://github.com/IoTThinks/EasySkyMesh/releases/tag/PowerSaving18), October 22, 2026, with notes added October 29 and 30.
