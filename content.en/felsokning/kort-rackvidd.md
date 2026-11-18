---
title: "The range is much shorter than expected"
description: "Does your radio only reach a few hundred meters? Usually it's the placement, the antenna or your body. Here's how to check and improve the range."
url: /en/troubleshooting/short-range/
category: radio
weight: 20
date: 2026-11-13
lastmod: 2026-11-16
---

## Likely causes {#troliga-orsaker}

1. **Placement.** Height matters most: an antenna on the ground or indoors reaches a fraction of what
   it does on the roof.
2. **The antenna**: wrong band, a poor connection in the connector, or a small antenna that came in the box.
3. **Your body and surroundings**: a radio in a pocket or behind metal loses a lot.
4. Transmit power is set low.

## Check {#kontrollera}

```sh {title="Console"}
get tx
get radio
```

## Fix {#åtgärda}

1. Move the antenna higher and clear of walls and metal.
2. Switch to an 868 MHz antenna with a good connector; tighten the connector by hand.
3. Check the transmit power with `get tx`. Only raise it if the radio is built for it, and never
   above what the band allows (500 mW ERP on 869.4–869.65 MHz).

## How to tell it worked {#så-vet-du-att-det-fungerar}

More neighbors in `neighbors`, and better SNR on the ones you already heard.
