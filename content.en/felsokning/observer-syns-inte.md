---
title: "The observer doesn't report to the map"
seoTitle: "MeshCore observer not showing on the map"
description: "The repeater with Observer firmware is running, but nothing it hears shows up on the map or in the analysis tools."
url: /en/troubleshooting/observer-not-on-map/
category: mqtt
weight: 10
date: 2026-11-13
lastmod: 2026-11-16
---

## Likely causes {#troliga-orsaker}

1. **No Wi-Fi connection.** Wrong network name or password, or too weak a signal where the
   repeater stands.
2. **Wrong IATA code.** The map reads observers with the region's code, {{< iata >}}.
3. **The broker slot is set up wrong**, or the broker is down.
4. The firmware has no Observer: regular repeater firmware doesn't report.

## Check {#kontrollera}

```sh {title="Console"}
ver
get wifi.status
get mqtt.status
get mqtt.iata
```

`ver` should include `observer`. `get mqtt.status` shows each slot and whether it is connected.

## Fix {#åtgärda}

1. Wi-Fi: `set wifi.ssid <name>` and `set wifi.pwd <password>`, then `reboot`.
2. IATA: `set mqtt.iata {{< iata >}}`.
3. The broker: run the MQTT step in the wizard again, or see [Your repeater on the
   map](../../guider/visa-pa-kartan/).
4. If `observer` is missing from `ver`: [flash](../../guider/flasha-firmware/) Observer firmware with
   *Update*.

## How to tell it worked {#så-vet-du-att-det-fungerar}

`get mqtt.status` shows the slot as connected, and the repeater shows up as an observer (◉) on the map
within a few minutes.
