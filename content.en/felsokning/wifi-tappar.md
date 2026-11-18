---
title: "The observer keeps losing Wi-Fi"
description: "It connects, drops off and comes back; there are gaps in what it reports."
url: /en/troubleshooting/wifi-keeps-dropping/
category: mqtt
weight: 30
date: 2026-11-13
lastmod: 2026-11-13
---

## Likely causes {#troliga-orsaker}

1. **Weak signal.** Repeaters often sit in the attic or an outbuilding, far from the router.
2. **Wi-Fi power saving** that drops the connection too often.
3. The router hands out addresses for too short a time, or disconnects devices that are quiet.
4. The ESP32 only handles 2.4 GHz. A network that only has 5 GHz doesn't show up.

## Check {#kontrollera}

```sh {title="Console"}
get wifi.status
get wifi.powersave
```

`get wifi.status` shows the signal strength (RSSI). Worse than roughly −80 dBm is too weak.

## Fix {#åtgärda}

1. Move the repeater or the router, or put a Wi-Fi extender closer.
2. Turn off Wi-Fi power saving if it is on.
3. Check that the network has 2.4 GHz turned on.

## How to tell it worked {#så-vet-du-att-det-fungerar}

`get mqtt.status` shows the slot connected all day, and the map shows the observer without gaps.
