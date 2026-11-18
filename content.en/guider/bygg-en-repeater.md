---
title: "Build a repeater"
seoTitle: "Build a MeshCore repeater: Wio, Heltec V4"
description: "Two MeshCore repeater builds: a low-power Seeed XIAO with Wio-SX1262 for battery and solar, and a Heltec V4 with Wi-Fi. Parts, flashing and enclosure."
url: /en/guides/build-a-repeater/
weight: 48
group: repeater
date: 2026-11-16
lastmod: 2026-11-18
wideTables: true
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

This guide builds the hardware. How you then configure the repeater, choose a site and check
that it can be heard is in [Set up a repeater](../repeater/). Two builds, depending on how the
repeater will get power:

| Feature | Seeed XIAO nRF52840 + Wio-SX1262 | Heltec V4 |
| --- | --- | --- |
| Suits | battery and solar | mains power |
| Wi-Fi (can become an [observer](../visa-pa-kartan/)) | no | yes |
| Screen | no | yes |
| Soldering | two battery wires | none with USB power |
| Flashed | `.uf2` file copied to the board | in the browser |

Neither requires radio knowledge. If you would rather buy a finished repeater: see [Get
hardware](../skaffa-hardvara/repeater/).

> [!CAUTION] Antenna first
> Screw on the antenna before the radio gets power. A LoRa radio that transmits without an antenna can be damaged.

## Build 1: Seeed XIAO with Wio-SX1262 {#bygge-1-seeed-xiao-med-wio-sx1262}

A small nRF52840 board with a radio module on top. It draws so little that it can run on battery and
solar all year, if the panel and battery are chosen correctly.

### Parts {#delar}

- **The XIAO nRF52840 & Wio-SX1262 kit** from Seeed Studio. It cost 13.49 USD at Seeed in
  November 2026, with a small antenna but without an enclosure or battery.
- **An antenna for 868 MHz.** The kit's small antenna is fine for trying it out on the desk. Outdoors you need a
  better one; see [Antennas](../skaffa-hardvara/antenn/).
- **A lithium-ion battery** (3.7 V) with a protection circuit, for example 18650 cells.
- **A sealed enclosure** (IP65 or better) with cable glands.
- For solar: a panel and charger as described in [Solar nodes](../solnoder/), not just a simple charging module.

### Build {#bygg}

1. **Assemble the kit.** The radio module sits on top of the XIAO board. Connect the antenna to the
   radio module.
2. **Try it on USB first.** Flash and configure the board on USB power on the desk, before anything is
   soldered.
3. **Solder the battery** to the battery pads on the underside of the XIAO board, plus and minus as
   marked. The board charges the battery from USB-C. Wrong polarity can destroy the board; measure before
   you solder.
4. **Solar:** follow [Solar nodes](../solnoder/). It says which panel, charger and
   battery size a node needs to get through a Swedish winter. That differs from the
   advice on many foreign sites, which assume more winter sun.

### Flash {#flasha}

The repeater gets the MeshCore project's standard repeater firmware from the official web flasher.

1. Open the [web flasher]({{< param "firmware.flasher" >}}), choose the radio **Seeed Studio Xiao nRF52
   WIO** and **Repeater**, and download the `.uf2` file.
2. Double-click the board's reset button. The board shows up as a USB drive on the computer.
3. Copy the `.uf2` file there. The board restarts by itself once the file is in place.

If the computer finds no drive: see [The nRF52 board does not show up as a drive](../../felsokning/nrf52-ingen-enhet/).

### Enclosure {#låda}

There are many printable enclosures for this exact kit, several with room for a solar panel and
battery: search for *XIAO Wio-SX1262* on Printables or MakerWorld. Print in PETG or ASA,
which handle sun and heat better than PLA. Leave a small drainage hole open in the bottom.

### With Wi-Fi instead {#med-wifi-i-stället}

The same radio module comes in a kit with the **XIAO ESP32-S3**. It has Wi-Fi and can become an observer, but
draws more power. Seeed has its [own guide](https://wiki.seeedstudio.com/get_started_with_esp32s3_meshcore/)
for that kit, with a printable enclosure. In the web flasher it is called **Seeed Studio Xiao S3 WIO** and
is flashed like the Heltec V4 below.

## Build 2: Heltec V4 {#bygge-2-heltec-v4}

An ESP32-S3 board with screen, Wi-Fi and radio on the same board. Nothing to solder if it gets power over
USB. It draws too much to run long on battery: put it where there is power.

### Parts {#delar-1}

- **Heltec WiFi LoRa 32 V4**, in the 868 MHz version. It cost 429 kr at Pileup in November
  2026 (the listing does not say which band; check before you buy).
- **An antenna for 868 MHz**, with the right connector for the board. See [Antennas](../skaffa-hardvara/antenn/#kontakter).
- **A USB power adapter** and a cable long enough to reach.
- **A sealed enclosure** if it will stand outdoors.

### Transmit power {#sändeffekten}

The Heltec V4 has a power amplifier after the radio chip and transmits stronger than `set tx` says. Measured,
`set tx 22` gave about 28 dBm, which with an ordinary antenna is over the 500 mW ERP limit. With a
3 dBi antenna, `set tx 16` (about 25 dBm) is within the limit. If you have an antenna with higher gain
you need to go lower. The calculation is in [MeshCore settings in Sweden](../radioinstallningar/#sändeffekt-och-antenn).

```text {title="Transmit power for Heltec V4 with a 3 dBi antenna"}
set tx 16
```

### Flash {#flasha-1}

1. Open the [web flasher]({{< param "firmware.flasher" >}}) and choose the radio **Heltec v4** or
   **Heltec v4 R8**, according to what is printed on your board, and then **Repeater**.
2. If the repeater should also show on the map what it hears, flash **Observer** firmware instead, from
   [the MeshCore Observer project's flasher](https://observer.gessaman.com/); see [The map and
   observers](../visa-pa-kartan/).
3. Connect the board with a USB cable that carries data, start the flashing and choose the board's port.

More on each step, and what to do if something goes wrong, is in [Choose and flash firmware](../flasha-firmware/).
If you want auto-reply to tests and remote control, the [special firmware lou](../firmware-lou/) is an
option; standard MeshCore is enough for a repeater.

## Save power {#spara-ström}

The repeater firmware has a setting that lets the radio sleep between transmissions [^cli]. It is
off by default. Turn it on for a repeater that runs on battery or solar:

```text {title="Console"}
powersaving on
```

A repeater on mains power does not need it.

## When it is built {#när-den-är-byggd}

1. Set the radio, name, position and region: follow [Set up a repeater](../repeater/) or
   the repeater wizard. Change the administrator password; a factory default password anyone
   can guess.
2. Try it where you can easily reach it, and check that it can be heard.
3. Mount it high, with the antenna vertical and clear of metal.

If you need a high place for it: see [Host a node](../../bli-nodvard/).

## Sources {#källor}

[^cli]: MeshCore, [the CLI reference](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md), `powersaving` (default `off`).
