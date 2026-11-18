---
title: "My repeater transmits too much"
description: "A new repeater seems to use a lot of airtime, and the neighbors hear worse since it came online."
url: /en/troubleshooting/repeater-transmits-too-much/
category: repeater
weight: 55
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

## Likely causes {#troliga-orsaker}

1. **The duty cycle is still at the default 50 percent.** The firmware allows 50 percent out of
   the box ([CLI reference](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md), `set dutycycle`), but the limit on 869.4–869.65 MHz is 10 percent
   for a radio without LBT ([PTSFS 2025:1](https://pts.se/contentassets/b05c8a7d01a64783aafc6a19e1b78590/ptsfs-2025-1-foreskrifter-om-undantag-fran-tillstandsplikt-for-anvandning-av-vissa-radiosandare.pdf) § 146).
2. A short advert interval.

## Check {#kontrollera}

```sh {title="Console"}
get dutycycle
get flood.advert.interval
```

## Fix {#åtgärda}

```sh {title="Console"}
set dutycycle 10
```

Leave `flood.advert.interval` at the default, 47 hours.

## How to tell it worked {#så-vet-du-att-det-fungerar}

`get dutycycle` answers `10.0%`.

## Didn't work? {#fungerade-inte}

See [My radio stops transmitting for a while](../duty-cycle/) and [Set up a repeater](../../guider/repeater/#duty-cycle).
