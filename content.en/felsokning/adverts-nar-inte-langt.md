---
title: "My repeater's adverts don't reach the rest of the region"
seoTitle: "MeshCore repeater adverts don't reach far"
description: "The neighbors know about the repeater, but further away nobody knows it exists."
url: /en/troubleshooting/adverts-dont-reach-far/
category: repeater
weight: 20
date: 2026-11-13
lastmod: 2026-11-16
---

## Likely causes {#troliga-orsaker}

1. **Only zero-hop adverts are being sent.** The automatic advert to neighbors only travels one hop.
   The advert that spreads across the whole mesh (flood) goes out less often.
2. **The default region is wrong.** The repeater's own adverts are tagged with the default region.
   Repeaters that don't carry that region won't pass them on.
3. The hop limit (`flood.max`) is low.

## Check {#kontrollera}

```sh {title="Console"}
get flood.advert.interval
region default
get flood.max
```

## Fix {#åtgärda}

```sh {title="Console"}
set flood.advert.interval 47
region default se
region save
```

Don't want to wait? `advert` sends one right away.

## How to tell it worked {#så-vet-du-att-det-fungerar}

The repeater shows up for contacts further away and on the map within an hour after `advert`.
