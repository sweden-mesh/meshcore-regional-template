---
title: "My radio keeps restarting after flashing"
seoTitle: "MeshCore radio keeps restarting after flashing"
description: "ESP32: the wrong file at the wrong address. It can be rescued, and your settings are kept."
url: /en/troubleshooting/boot-loop-after-flashing/
category: flasha
weight: 10
date: 2026-11-13
lastmod: 2026-11-16
---

In the [USB console](../../guider/usb-konsol/) the same lines appear over and over, roughly like this:

```text {title="Console"}
rst:0x10 (RTCWDT_RTC_RST),boot:0x29 (SPI_FAST_FLASH_BOOT)
load:0x3c120020,len:0x6fe64
Guru Meditation Error: Core 0 panic'ed (StoreProhibited)
```

## Likely causes {#troliga-orsaker}

1. **The file without *merged* was written to address `0x0`.** That is where the radio's boot code
   belongs. Now the chip tries to start the firmware as if it were the boot code, and crashes. The line
   `load:0x3c120020` is the giveaway.
2. Firmware for a different model or chip.

## Fix {#åtgärda}

Flash again with **`-merged.bin`** to address **`0x0`**, without erasing. It contains the boot code,
partition table and firmware. Settings and identity live further into the flash and are
kept.

If the radio doesn't answer when you connect: hold down **BOOT**, briefly press **RST** and release **BOOT**.
Then it waits for new firmware.

The easiest way is the firmware picker's **Flash via USB** button with *Update*: it picks the file and
address itself. See [Flash firmware](../../guider/flasha-firmware/).

## How to tell it worked {#så-vet-du-att-det-fungerar}

The radio starts once and stays up. `ver` in the console shows the new version.
