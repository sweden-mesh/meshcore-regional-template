---
title: "My radio doesn't hear any repeaters"
description: "No neighbors, no adverts, nothing in the app even though there are repeaters nearby."
url: /en/troubleshooting/no-repeaters-heard/
category: radio
weight: 10
date: 2026-11-13
lastmod: 2026-11-13
---

## Likely causes {#troliga-orsaker}

1. **Wrong radio settings.** Everyone in a mesh must have the same frequency, bandwidth, spreading
   factor and coding rate. A single difference and the radio hears nothing.
2. **The antenna is missing, loose or for the wrong band.** A 433 MHz antenna on an 868 radio
   gives almost no range.
3. **Too far to the nearest repeater**, or the radio is indoors in a basement or behind concrete.
4. The radio is new and hasn't waited long enough: repeaters send adverts hours apart.

## Check {#kontrollera}

```sh {title="Console"}
get radio
get freq
neighbors
```

`get radio` should give the same values as the region's settings:

{{< settings >}}

## Fix {#åtgärda}

1. Set up the radio as in the box above (in the app: *Settings → Radio*, the preset
   for the region).
2. Screw the antenna on firmly and check that it is for 868 MHz.
3. Move the radio to a window or higher up, and send an advert of your own. Neighbors that hear
   it don't answer directly, but your messages start getting through.

## How to tell it worked {#så-vet-du-att-det-fungerar}

`neighbors` lists at least one repeater, or the app shows contacts that came in through adverts.
