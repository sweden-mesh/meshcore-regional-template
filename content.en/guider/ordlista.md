---
title: "Glossary"
seoTitle: "MeshCore glossary"
description: "MeshCore glossary in plain English: advert, flood, region, duty cycle, ERP, SF, BW, CR, IATA, observer and more terms the guides use, briefly explained."
url: /en/guides/glossary/
weight: 110
group: start
date: 2026-11-13
lastmod: 2026-11-18
# The words a guide links to this list on first use (layouts/_partials/glossary.html): the anchor,
# the word forms as a regular expression (case-insensitive; (?-i:...) for acronyms), and where a
# common word only means the term in one phrase, the words that must come before or after it.
# Order matters: a longer term goes before a shorter one inside it (private channel before channel).
# English word forms; the ids are the Swedish page's anchors and must stay the same.
terms:
  - { id: advert, match: 'advert(s)?' }
  - { id: auto-svar, match: 'auto-repl(y|ies)' }
  - { id: bootloader, match: 'bootloader(s)?|(?-i:DFU)' }
  - { id: bw, match: '(?-i:BW)|bandwidth' }
  - { id: companion, match: 'companion(s)?' }
  - { id: cr, match: '(?-i:CR)|coding\s+rate' }
  - { id: dbi, match: '(?-i:dBi|dBd)' }
  - { id: direkt, match: 'direct', after: '\s+along' }
  - { id: duty-cycle, match: 'duty\s+cycle(s)?' }
  - { id: erp, match: '(?-i:ERP)' }
  - { id: firmware, match: 'firmware' }
  - { id: flood, match: 'flood(s|ed|ing)?' }
  - { id: forinstallning, match: 'preset(s)?' }
  - { id: fresnelzon, match: 'fresnel\s+zone(s)?' }
  - { id: hashtag-kanal, match: 'hashtag\s+channel(s)?' }
  - { id: hemregion, match: 'home\s+region(s)?' }
  - { id: hopp, match: 'hop(s)?' }
  - { id: iata, match: '(?-i:IATA)(\s+code(s)?)?' }
  - { id: privat-kanal, match: 'private\s+channel(s)?' }
  - { id: testkanal, match: 'test\s+channel(s)?' }
  - { id: kanal, match: 'channel(s)?' }
  - { id: lbt, match: '(?-i:LBT)' }
  - { id: lora, match: '(?-i:LoRa)' }
  - { id: mqtt, match: '(?-i:MQTT)' }
  - { id: nod, match: 'node(s)?' }
  - { id: observator, match: 'observer(s)?' }
  - { id: path-hash, match: 'path\s+hash(es)?' }
  - { id: public, match: '(?-i:Public)' }
  - { id: region-default, match: 'default\s+region(s)?' }
  - { id: region, match: 'region(s)?' }
  - { id: repeater, match: 'repeater(s)?' }
  - { id: room-server, match: 'room\s+server(s)?' }
  - { id: sensor, match: 'sensor(s)?' }
  - { id: sf, match: '(?-i:SF)' }
  - { id: sandeffekt, match: 'transmit\s+power|(?-i:TX)\s+power' }
  - { id: vag, match: 'path', before: 'along\s+(the\s+|a\s+)?' }
  - { id: webbflasher, match: 'web\s+flasher(s)?' }
---
Common questions are under [FAQ](../../fragor/). Terms that have their own guide link to it.

## Advert {#advert}

A short packet in which a node announces that it exists, with its name, type and sometimes its position. A *zero-hop advert* is heard only by those who reach the node directly; a *flood advert* is passed on by the repeaters. See [First message](../forsta-meddelandet/).

## Auto-reply (auto-svar) {#auto-svar}

Repeaters running the [special lou firmware](../firmware-lou/) answer `test` in the county's test channel, so you can see which ones heard you.

## Bootloader and DFU {#bootloader}

The small program that starts the radio and receives new firmware. *DFU mode* (bootloader mode) is when the radio is waiting for new firmware. See [Choose and flash firmware](../flasha-firmware/).

## BW (bandwidth) {#bw}

How wide a frequency band a transmission takes up, in kHz. Everyone on the network must use the same. See [MeshCore settings in Sweden](../radioinstallningar/).

## Companion {#companion}

Your personal radio, which you use with the app. It does not pass on other people's traffic. See [Get started with a companion](../companion/).

## CR (coding rate) {#cr}

How much error correction each transmission carries, written as 5 to 8. The firmware default is 5; the network uses {{< param "radio.cr" >}}. See [MeshCore settings in Sweden](../radioinstallningar/#fällor-i-standardvärdena).

## dBi and dBd {#dbi}

An antenna's gain, compared with an imaginary antenna that radiates equally in all directions (dBi) or with a half-wave dipole (dBd). dBd = dBi − 2.15. See [Antennas](../skaffa-hardvara/antenn/).

## Direct {#direkt}

A packet that travels along a known path instead of being flooded. See [What is MeshCore?](../vad-ar-meshcore/#så-tar-sig-ett-meddelande-fram).

## Duty cycle {#duty-cycle}

How much of the time a transmitter may transmit: at most 10 percent on 869.4–869.65 MHz for a radio without LBT. See [MeshCore settings in Sweden](../radioinstallningar/#duty-cycle).

## ERP {#erp}

Effective radiated power: the radio's power minus the cable loss plus the antenna's gain, measured against a dipole. The limit is 500 mW ERP. See [Transmit power and antenna](../radioinstallningar/#sändeffekt-och-antenn).

## Firmware {#firmware}

The software in the radio. To *flash* it means to install it.

## Flood {#flood}

A packet that every repeater sends on once, until it has gone as far as it can. Channel messages are always flooded.

## Preset {#forinstallning}

A named set of radio values in the app. The network here uses *{{< param "radio.preset" >}}*.

## Fresnel zone {#fresnelzon}

The area around the line of sight between two antennas that also needs to be free of obstacles. See [A clear view is more than a line](../skaffa-hardvara/antenn/#fri-sikt-är-mer-än-en-linje).

## Hashtag channel {#hashtag-kanal}

A channel whose name starts with `#`. The key is derived from the name, so anyone who knows the name can read it. See [Channels](../kanaler/).

## Home region {#hemregion}

The region a repeater counts as its own (`region home`). It does not control forwarding. See [Regions](../regioner/).

## Hop {#hopp}

One transmission from one node to the next. A packet can travel up to 64 hops.

## IATA code {#iata}

A three-letter code an observer puts on what it reports, so the map knows which area it is about. Not the same thing as the region. See [The IATA code for your county](../visa-pa-kartan/#iata-koden-för-ditt-län).

## Channel {#kanal}

A shared room: everyone who has the channel's key can read and write there. See [Channels](../kanaler/).

## LBT {#lbt}

*Listen before talk*: the radio listens before it transmits. With LBT the rules allow more than 10 percent of the time; MeshCore assumes 10 percent.

## LoRa {#lora}

The radio technology: long range, low data rate, low power consumption.

## MQTT {#mqtt}

A way of sending messages to a server over the internet. Observers use it to report to the map. See [The map and observers](../visa-pa-kartan/).

## Node {#nod}

A radio on the network: companion, repeater, room server or sensor.

## Observer {#observator}

A node, or a computer attached to a radio, that reports what it hears to a server, so it shows up on the map. See [The map and observers](../visa-pa-kartan/).

## Path hash {#path-hash}

The 1, 2 or 3 bytes of a repeater's key that are written into a packet's path. Longer ids are mixed up less often, but the path allows fewer hops: 64, 32 or 21. See [Fine-tune](../repeater/#4-finjustera).

## Private channel {#privat-kanal}

A channel with a random secret key. Only those who have the key can read it. See [Create a private channel](../kanaler/#skapa-en-privat-kanal).

## Public {#public}

The channel every radio has from the start. The key is known, so anyone can read it.

## Region (scope) {#region}

A label on a packet that decides which repeaters pass it on. Here `{{< region "scope" >}}`. See [Regions](../regioner/).

## Repeater {#repeater}

A node that receives traffic and sends it on, usually placed high up. See [Set up a repeater](../repeater/).

## Room server {#room-server}

A node that stores messages in shared rooms, so that someone who was away can catch up. See
[Room server](../room-server/).

## Sensor {#sensor}

A node in the sensor role, a role of its own in MeshCore alongside companion, repeater and room server.

## SF (spreading factor) {#sf}

How long each bit is transmitted. A higher SF reaches farther but takes more airtime. The network here uses SF {{< param "radio.sf" >}}.

## Default region {#region-default}

The region a repeater puts on its own adverts (`region default`). See [Regions](../regioner/).

## Transmit power {#sandeffekt}

How strongly the radio transmits, in dBm, set with `set tx`. The limit applies to ERP, not just the radio.

## Test channel {#testkanal}

The county's channel for test messages, {{< testchannel >}}, where repeaters with auto-reply answer.

## Path {#vag}

The repeaters a packet has passed through on its way to the recipient.

## Web flasher {#webbflasher}

A web page that installs firmware on the radio over USB, like MeshCore's [official flasher]({{< param "firmware.flasher" >}}).
