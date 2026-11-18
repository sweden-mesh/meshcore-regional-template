---
title: "My radio stops transmitting for a while"
description: "Everything works, then nothing goes out for a while, then it works again."
url: /en/troubleshooting/duty-cycle/
category: radio
weight: 40
date: 2026-11-13
lastmod: 2026-11-18
---

## Likely causes {#troliga-orsaker}

1. **The airtime limit (duty cycle) has been reached.** In the 868 MHz band a radio may only transmit
   a certain share of the time: on 869.4–869.65 MHz at most 10 percent, unless it uses LBT
   ([PTSFS 2025:1](https://pts.se/contentassets/b05c8a7d01a64783aafc6a19e1b78590/ptsfs-2025-1-foreskrifter-om-undantag-fran-tillstandsplikt-for-anvandning-av-vissa-radiosandare.pdf) § 146). MeshCore keeps count and waits when the limit is reached.
2. Many messages or adverts, or a repeater in a dense mesh that passes on a lot.

## Check {#kontrollera}

```sh {title="Console"}
get dutycycle
get af
```

`get dutycycle` shows the limit in percent, for example `> 10.0%` on a repeater set up
according to the [guide](../../guider/repeater/) (`set dutycycle 10`). `get af` shows the same limit as a
factor (*airtime factor*): 9 means 10 percent, because the limit is 100 / (af + 1) percent.

## Fix {#åtgärda}

Send fewer and shorter messages, and let adverts run at the default interval. Don't raise the
limit: it is there so that everyone fits in the band.

## How to tell it worked {#så-vet-du-att-det-fungerar}

The radio transmits again after a while, without you doing anything.

## Didn't work? {#fungerade-inte}

- **The radio doesn't transmit at all, not even after 15 minutes:** then it's not the airtime limit. See
  [I can hear others, but they can't hear me](../hor-andra-men-inte-mig/).
- **It only fails to reach far away:** see [The range is much shorter than expected](../kort-rackvidd/).
