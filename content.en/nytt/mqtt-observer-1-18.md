---
title: "MQTT Observer 1.18"
description: "MQTT Observer v1.18.0: agessaman's observer firmware is now based on MeshCore 1.18, with six broker slots and updates over Wi-Fi."
url: /en/news/mqtt-observer-1-18/
group: observer
release: {product: observer, version: "1.18.0"}
date: 2026-11-09
lastmod: 2026-11-18
checkedOn: 2026-11-18
---

MQTT Observer is agessaman's firmware for a repeater that also reports what it hears, over Wi-Fi to an
MQTT server. That is how the map here and other maps get their packets. Version 1.18.0 is based on
MeshCore 1.18.0, and the stable build was last made on November 9, 2026 [^rel]. What is new in MeshCore
itself is in [MeshCore 1.18](../meshcore-1-18/).

## What this version has {#det-här-finns-i-versionen}

- **Up to six MQTT servers at once**, with ready-made presets for MeshMapper and several American
  meshes, among others [^rel]. The map in Sweden has no preset of its own there; how your observer gets
  onto the map is in [The map and observers](../../guider/visa-pa-kartan/).
- **Login** with a username and password, or with a signed key (JWT, Ed25519) [^rel].
- **A settings page on the node itself** that you open in a browser, and the USB console as before
  (115200 baud) [^rel].
- **Updates over Wi-Fi.** `ota branch prod` or `ota branch beta` picks the stable or the beta version,
  and `ota update` fetches it [^rel].
- **Neighbors are reported** to the server on the boards that support it [^rel].

The lou firmware is built on this one; see [lou firmware](../../guider/firmware-lou/).

## Sources {#källor}

[^rel]: agessaman/MeshCore, [MQTT Observer Firmwares](https://github.com/agessaman/MeshCore/releases/tag/observer-mqtt-latest) (tag `observer-mqtt-latest`), and the [setup guide](https://github.com/agessaman/MeshCore/blob/observer-firmware/MQTT_IMPLEMENTATION.md).
