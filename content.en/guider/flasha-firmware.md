---
title: "Choose and flash firmware"
description: "Flash MeshCore from your browser: stock firmware from the official web flasher for companion and repeater, Observer for the map, and what to do if it fails."
url: /en/guides/flash-firmware/
weight: 18
group: start
source:
  title: "Sätt upp en egen MeshCore Companion"
  url: "https://meshat.se/meshcore/satt-upp-egen-companion/"
  license: "CC BY 4.0"
  changes: "Flashing section rewritten as a guide of its own; firmware choice via the firmware picker; files and addresses for ESP32; troubleshooting added."
date: 2026-11-12
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

To *flash* is to install the software (firmware) on the radio. The same radio can become a companion,
a repeater or a room server depending on the firmware you choose, and you can always flash it again.
Which radio to pick is covered in [Get hardware](../skaffa-hardvara/).

## What you need {#det-här-behöver-du}

- The radio and a **USB cable that carries data**. Many cables only charge; try another cable if
  the computer can't find the radio.
- A computer with **Chrome or Edge**. Flashing uses Web Serial, which those browsers support.
  Firefox and Safari don't, and support on phones varies.

## 1. Choose firmware {#1-välj-firmware}

Start with the MeshCore project's own firmware. It is in the official
[web flasher]({{< param "firmware.flasher" >}}) for companion, repeater and room server, and it is
enough for most people.

### Companion {#companion}

Your own radio, the one you pair with the app:

1. Open the [web flasher]({{< param "firmware.flasher" >}}) and choose your radio, with the exact
   model and version.
2. Choose companion firmware: **Bluetooth** if you will use your phone, **USB** if the radio will
   be plugged into a computer.
3. Continue with [Connect the radio](#2-anslut-radion) below.

### Repeater {#repeater}

1. In the [web flasher]({{< param "firmware.flasher" >}}): choose your radio and **Repeater**.
2. If the repeater should also show on the map what it hears, flash **Observer** firmware instead,
   from the [MeshCore Observer project's flasher](https://observer.gessaman.com/). It needs a board
   with Wi-Fi; see [The map and observers](../visa-pa-kartan/).
3. The web flasher has no separate low-power firmware. If the repeater will run on battery or solar,
   turn on power saving after flashing; see [Build a repeater](../bygg-en-repeater/#spara-ström).

### Special firmware, if you want more {#specialfirmware-om-du-vill-ha-mer}

[Special firmware lou](../firmware-lou/) is repeater firmware built for the Swedish meshes. It adds
auto-reply to tests and remote control, and it works alongside regular MeshCore. You don't need it
to get started. It has its own picker, the [lou firmware picker]({{< param "firmware.picker" >}}),
which only has lou firmware: choose the node type, features, new install or update, and your
radio. For ESP32 radios it has a button, **Flash via USB**, that flashes straight from the browser.
Choose *Update* to keep settings and identity; *New install* erases them.

> [!WARNING] The right model
> Firmware for the wrong model can leave the screen, radio or buttons not working. Check the
> model and version before you flash.

## 2. Connect the radio {#2-anslut-radion}

1. Connect the radio to the computer with the USB cable.
2. Click *Flash* or *Connect* in the flasher and choose the radio's port from the list.
3. If the browser finds no port: try another cable or USB port, and follow the flasher's
   instructions to start the radio in *bootloader mode* (DFU). How you do that differs between
   models; often you hold down a button while plugging in the cable.

## 3. Flash {#3-flasha}

Start flashing and wait until the flasher says it is done. While it runs:

- leave the cable plugged in,
- don't close the tab,
- don't let the computer go to sleep.

Many radios restart on their own. If it stays in bootloader mode: press reset or unplug and
reconnect the power.

### With another flasher (ESP32) {#med-en-annan-flasher-esp32}

Each version comes as two files. They are written to different addresses:

| File | Address | Contains |
| --- | --- | --- |
| `…-merged.bin` | `0x0` | the whole flash: boot code, partition table and firmware |
| `….bin` (without *merged*) | `0x10000` | the firmware only |

If you are unsure: take `-merged.bin` and write it to `0x0`, without erasing. The settings sit
further into the flash and are not overwritten.

> [!CAUTION] Don't erase unless you need to
> *Erase flash* and *new install* erase the radio's settings and identity, so it becomes a new
> node to everyone else. Only use them when you want to start over from scratch.

## 4. After flashing {#4-efter-flashningen}

- **Companion:** open the MeshCore app and connect to the radio over Bluetooth or USB; see
  [Get started with a companion](../companion/#2-anslut-appen).
- **Repeater:** set its name, position and [region](../regioner/) before it goes up. The radio
  settings for {{< region "name" >}} ([what they mean](../radioinstallningar/)):

{{< settings >}}

## If something goes wrong {#om-något-krånglar}

> [!NOTE]- The browser finds no port
> Switch to a cable that carries data, try another USB port and check that you are using
> Chrome or Edge. Start the radio in bootloader mode and try again.

> [!NOTE]- Flashing stopped halfway
> You can almost always flash again. Start the radio in bootloader mode and flash once more.

> [!NOTE]- The radio keeps restarting after flashing
> If you see `load:0x3c120020` followed by *Guru Meditation Error* in the USB console, the file
> without *merged* has been written to `0x0`, where the boot code belongs. Flash `-merged.bin` to
> `0x0`, without erasing. Your settings are kept.

> [!NOTE]- `ver` still shows the old version
> If the radio has been updated over the air (OTA) before, it boots from the other firmware slot in
> the flash. A file without *merged*, written to `0x10000`, then lands in the slot that isn't in use.
> Flash `-merged.bin` to `0x0`: it points the boot back to the new firmware. Also check that the
> firmware picker shows the latest version; it updates within an hour or so of a new release.

> [!NOTE]- The radio starts but doesn't show up on the mesh
> Check that the radio settings above are correct and that the region is right. A repeater shows
> on the map only after it has sent an *advert* and an observer has heard it.

More answers in Troubleshooting: [Flashing stopped and the radio seems dead](../../felsokning/flashningen-avbrots/), [The radio keeps restarting](../../felsokning/startar-om-efter-flashning/) and [The settings are gone after flashing](../../felsokning/installningar-borta/).
