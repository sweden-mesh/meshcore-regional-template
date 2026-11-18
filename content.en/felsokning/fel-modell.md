---
title: "The screen, buttons or radio don't work after flashing"
seoTitle: "Screen or radio dead after flashing MeshCore"
description: "The radio starts, but the screen is black, a button does nothing or the node hears nothing."
url: /en/troubleshooting/wrong-model/
category: flasha
weight: 50
date: 2026-11-13
lastmod: 2026-11-16
---

## Likely causes {#troliga-orsaker}

1. **Firmware for a different model or hardware version.** Two boards can look alike but have the
   screen, radio chip or buttons wired to different pins. Different versions of the same
   Heltec or LilyGO board are common mix-ups.

## Check {#kontrollera}

```sh {title="Console"}
ver
board
```

`ver` answers with the version and build date, and `board` with the name of the board the firmware
was built for. Compare that, and the model in the file name, with what is printed on the board or the box.
If the radio doesn't answer in the console at all, go straight to *Didn't work?* below.

## Fix {#åtgärda}

Find out the exact model and version, pick it in the
[firmware picker]({{< param "firmware.picker" >}}) and flash again with *Update*.

## How to tell it worked {#så-vet-du-att-det-fungerar}

The screen lights up, the buttons respond and the node hears its neighbors within a few minutes.

## Didn't work? {#fungerade-inte}

- **The radio keeps restarting:** see [My radio keeps restarting after flashing](../startar-om-efter-flashning/).
- **Nothing happens at all, the screen is black:** see [Flashing was interrupted, and the radio seems dead](../flashningen-avbrots/).
- **The node works but hears nobody:** see [My radio doesn't hear any repeaters](../hor-inga-repeatrar/).
