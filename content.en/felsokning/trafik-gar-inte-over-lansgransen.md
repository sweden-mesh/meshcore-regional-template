---
title: "Traffic doesn't cross the county border"
description: "Do messages in your county's channel not reach the next county? That is usually on purpose: the region keeps traffic in the county. Here's how to reach across."
url: /en/troubleshooting/traffic-stops-at-county-border/
category: regioner
weight: 30
date: 2026-11-13
lastmod: 2026-11-17
---

## Likely causes {#troliga-orsaker}

1. **That is how it should be.** A channel with the county's region is only passed on by repeaters that
   carry the county's region. That keeps the county's traffic in the county.
2. **No border repeater.** For traffic in the neighboring county's region to reach you, you need a
   repeater near the border that carries the names of both counties.
3. Traffic without a region is stopped: `region allowf` is missing, or the hop limit is low.

## Check {#kontrollera}

```sh {title="Console"}
region
get flood.max.unscoped
```

## Fix {#åtgärda}

- **Reach all of Sweden:** send in a channel with the region `se`, or without a region.
- **Build a border repeater:** choose the neighboring county in the [region tool](../../guider/regioner/) or in
  the wizard. The repeater gets the names of both counties and passes on traffic without a region.
- **Traffic without a region:** `region allowf *` and `set flood.max.unscoped 16`, then `region save`.

## How to tell it worked {#så-vet-du-att-det-fungerar}

A `test` in the neighboring county's test channel gets answers from repeaters with auto-reply on the other side of the border.
