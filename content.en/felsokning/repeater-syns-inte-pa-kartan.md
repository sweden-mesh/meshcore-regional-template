---
title: "My repeater doesn't show up on the map"
description: "Is your repeater running but not on the map? Usually no observer has heard its advert, or the position is missing. Here's the fix."
url: /en/troubleshooting/repeater-not-on-map/
category: repeater
weight: 10
date: 2026-11-13
lastmod: 2026-11-16
---

## Likely causes {#troliga-orsaker}

1. **No observer has heard its advert.** The map shows what observers report.
   A repeater appears only once it has sent an advert that an observer received.
2. **The position is missing.** Without latitude and longitude there is nothing to draw.
3. The repeater sends adverts rarely (every 47 hours as a flood is normal), and it is new.
4. It was heard by an observer in another region, and is therefore listed under that one.

## Check {#kontrollera}

```sh {title="Console"}
get lat
get lon
neighbors
```

## Fix {#åtgärda}

1. Set the position: `set lat 57.78` and `set lon 14.16` (your own values, with a decimal point).
2. Send an advert right away: `advert`.
3. Wait a few minutes and reload the map.

See also [The map and observers](../../guider/visa-pa-kartan/).

## How to tell it worked {#så-vet-du-att-det-fungerar}

The repeater shows up on the map in the right place within a few minutes after `advert`.
