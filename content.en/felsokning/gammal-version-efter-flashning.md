---
title: "My radio still shows the old version after flashing"
seoTitle: "Old MeshCore version still there after flashing"
description: "Flashing went fine, but ver shows the same MeshCore version as before: the radio boots from the other firmware slot, or the file was old."
url: /en/troubleshooting/old-version-after-flashing/
category: flasha
weight: 20
date: 2026-11-13
lastmod: 2026-11-18
---

## Likely causes {#troliga-orsaker}

1. **The radio boots from the other firmware slot.** An ESP32 has two slots for firmware. If it has
   been updated over the air (OTA), it boots from the second one. A file without *merged*, written to
   `0x10000`, ends up in the first slot, which isn't used.
2. **You downloaded the old version.** The firmware picker shows a new version only a while after it
   is released, and a file downloaded earlier may still be in your Downloads folder.
3. The flasher wrote to a different radio, if several are connected.

## Check {#kontrollera}

```sh {title="Console"}
ver
```

Compare with the version number in the file name you flashed.

## Fix {#åtgärda}

1. Check that the file name has the version you want. Download it again if you're unsure.
2. Flash **`-merged.bin`** to address **`0x0`**, without erasing. It contains an empty
   boot record that points back to the first slot.
3. Or use the firmware picker's **Flash via USB** with *Update*.

## How to tell it worked {#så-vet-du-att-det-fungerar}

`ver` shows the new version after a restart.
