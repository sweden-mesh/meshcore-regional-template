---
title: "The map and observers"
seoTitle: "The MeshCore map and observers (MQTT)"
description: "What the MeshCore map shows and where its data comes from, what an observer sends, three ways to become an observer, and the IATA code for your county."
url: /en/guides/map-and-observers/
weight: 100
group: repeater
source:
  title: "MeshCore till MQTT"
  url: "https://meshat.se/mqtt/meshcore-till-mqtt/"
  license: "CC BY 4.0"
  changes: "Rewritten; three ways with their own steps; the region's IATA and preset from the page parameters; the IATA table from the county files."
date: 2026-11-12
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

An **observer** is a repeater, or a computer next to a radio, that sends what it hears to a
server, and the map shows it. The mesh works just the same without observers. **Your repeater
doesn't need to be an observer to show up on the map:** it is enough that an observer hears its
advert.

{{< diagram "observer" >}}

## What the map shows {#vad-kartan-visar}

The map on the [home page](/) shows repeaters and traffic that observers have heard. The positions
are the ones the owners have set on their nodes themselves (`set lat`, `set lon`), and the lines
between repeaters show that one has heard the other. Anything no observer hears doesn't show up,
even if it works. Companions are not shown, to protect where people live.

The more observers, the more of the mesh is visible, and the easier it is to see where more
repeaters are needed.

## What an observer sends {#vad-en-observatör-skickar}

- Every packet it hears, with signal strength and time.
- Text in Public and hashtag channels, which anyone who knows the channel's name can already read [^cp].
- Not the content of direct messages and private channels: they stay encrypted.

## Choose a way {#välj-sätt}

| Way | Radio | Needs | Best when |
| --- | --- | --- | --- |
| [Observer firmware](#1-observer-firmware) | repeater with ESP32 | Wi-Fi at the repeater | the repeater is near Wi-Fi |
| [Computer with repeater](#2-en-dator-med-repeatern-på-usb) | any repeater | a computer or Raspberry Pi, custom firmware | the repeater has no Wi-Fi, for example nRF52 on solar |
| [Computer with companion](#3-en-dator-med-en-companion) | a companion | a computer or Raspberry Pi | you want to report without a repeater |

### 1. Observer firmware {#1-observer-firmware}

1. Flash Observer firmware from the [MeshCore Observer project's flasher](https://observer.gessaman.com/);
   see [Choose and flash firmware](../flasha-firmware/#repeater). It needs a board with Wi-Fi.
2. Set up the repeater as usual, see [Set up a repeater](../repeater/).
3. Type the commands below in a serial console, one at a time.

```text {title="Wi-Fi"}
set wifi.ssid your-network
set wifi.pwd your-wifi-password
```

```text {title="The region's code for the map"}
set mqtt.iata {{< iata >}}
```

```text {title="The server the map reads from"}
set mqtt1.preset {{< param "observer.preset" >}}
```

`{{< iata >}}` is the code the map in {{< region "name" >}} filters on; see [The IATA code for your
county](#iata-koden-för-ditt-län).


### 2. A computer with the repeater on USB {#2-en-dator-med-repeatern-på-usb}

[meshcoretomqtt](https://github.com/Cisien/meshcoretomqtt) reads the packets from a repeater plugged
into a Raspberry Pi or other computer over USB, and passes them on [^m2mqtt].

1. Build and flash the repeater with packet logging turned on (the build flag `MESH_PACKET_LOGGING=1`);
   the regular firmware from the web flasher doesn't have it [^m2mqtt].
2. Connect the repeater to the computer over USB.
3. Install meshcoretomqtt with the project's install script and enter the server when it asks.

### 3. A computer with a companion {#3-en-dator-med-en-companion}

[meshcore-packet-capture](https://github.com/agessaman/meshcore-packet-capture) does the same with a
companion, over Bluetooth, USB or TCP, and needs no custom firmware [^pktcap].

1. Set up the companion radio with the mesh's values, see [Get started with a companion](../companion/).
2. Install meshcore-packet-capture on the computer with the project's install script.
3. Choose how it should connect to the radio, and enter the server.

{{< region-mqtt >}}

## Check {#kontrollera}

After a few minutes the repeater should have a blue ring (observer) on the map on the [home page](/),
and the observer count should go up. Without a ring it is already visible, if another observer hears it.

{{< meshmapper >}}

Not showing up? See [The repeater doesn't show up on the map](../../felsokning/repeater-syns-inte-pa-kartan/), [The observer doesn't report to the map](../../felsokning/observer-syns-inte/) and [The observer keeps dropping Wi-Fi](../../felsokning/wifi-tappar/).

## The IATA code for your county {#iata-koden-för-ditt-län}

The map sorts the observers' reports by a three-letter code, borrowed from the airports'
IATA codes. The code is not the same thing as the region: the region controls which repeaters pass
traffic on, the IATA code only where the report ends up.

{{< iata-table >}}

## Other maps {#andra-kartor}

- [map.meshcore.io](https://map.meshcore.io): the MeshCore project's official map [^faq].
- [MeshMapper](https://swe.meshmapper.net/): where the mesh actually reaches, measured by people who
  drive, cycle or walk with a radio; see [Tools for node owners](../for-nodagare/).
- [meshat.se](https://meshat.se/): maps and a guide to more ways to report,
  [MeshCore to MQTT](https://meshat.se/mqtt/meshcore-till-mqtt/).

If you want your own server for the reports: [Your own broker for the region](../egen-broker/).

## Sources {#källor}

[^cp]: MeshCore, [the companion protocol](https://github.com/meshcore-dev/MeshCore/blob/main/docs/companion_protocol.md), channel types.
[^m2mqtt]: [meshcoretomqtt](https://github.com/Cisien/meshcoretomqtt), README.
[^pktcap]: [meshcore-packet-capture](https://github.com/agessaman/meshcore-packet-capture), README.
[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md), 1.2.
