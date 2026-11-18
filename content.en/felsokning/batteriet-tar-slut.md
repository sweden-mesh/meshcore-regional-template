---
title: "The battery runs out fast"
description: "Does your repeater's battery only last a few days? Usually power saving is off or Wi-Fi is on. Here's how to check the power draw and fix it."
url: /en/troubleshooting/battery-drains-fast/
category: strom
weight: 10
date: 2026-11-13
lastmod: 2026-11-16
---

## Likely causes {#troliga-orsaker}

1. **Power saving is off.** Without it, the radio is awake all the time.
2. **Wi-Fi is on.** Observer firmware with Wi-Fi draws many times more than a regular repeater, and
   is a poor fit for battery power.
3. **A screen or LEDs** left on.
4. Frequent adverts, or lots of traffic to pass on.

## Check {#kontrollera}

```sh {title="Console"}
powersaving
get flood.advert.interval
ver
```

## Fix {#åtgärda}

```sh {title="Console"}
powersaving on
set flood.advert.interval 47
```

Use repeater firmware without Observer on a battery-powered node. Choose *off-grid* in the wizard:
it turns on power saving and gives the node the region `offgrid`.

## How to tell it worked {#så-vet-du-att-det-fungerar}

In the repeater's status in the app, the battery voltage drops more slowly from day to day.
