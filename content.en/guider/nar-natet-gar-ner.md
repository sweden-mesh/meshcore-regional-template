---
title: "MeshCore when power and the mobile network go down"
seoTitle: "MeshCore in a power outage or emergency"
description: "What works in MeshCore when power and the mobile network go down, what doesn't, and what you can do now. MeshCore does not replace 112."
url: /en/guides/when-the-grid-goes-down/
weight: 30
group: start
date: 2026-11-18
lastmod: 2026-11-19
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

A companion on battery and repeaters on solar or battery keep passing messages without power and
without a mobile network. Repeaters on mains power without a backup battery stop. MeshCore is a
network built by volunteers, with no guarantee: **it does not replace 112**, and information from the authorities comes over the radio [^kris].

## What works, and what doesn't {#vad-fungerar-och-vad-inte}

| Part | Without power | Without mobile network and internet |
| --- | --- | --- |
| Your companion on battery | yes, as long as the battery lasts | yes |
| The app on your phone | yes, as long as the phone has power | yes, it talks to the radio over Bluetooth |
| Repeater on solar or battery | yes | yes |
| Repeater on mains power without a backup battery | no | yes, as long as it has power |
| The map on this site and the observers | no | no, they need the internet |

So messages get through as long as there are powered repeaters between you and the recipient. You
can see where they are on the [map](/#karta) while the internet works.

## Do this now {#gör-det-här-nu}

1. **Charge the radio and a power bank.** Krisinformation.se advises everyone to keep an extra
   power bank for their mobile phone [^hem]; it charges a companion too.
2. **Set up the radio with your county's values**, see [Get started with a companion](../companion/).
3. **Add your county's channel** and the test channel {{< testchannel >}}, see [Channels](../kanaler/).
4. **Test now, not when it happens.** Type `test` in the test channel and see who answers, see
   [Your first message](../forsta-meddelandet/).
5. **Save your contacts** in the app while the mesh is calm, so you can write to them directly.
6. **Print [your county's card](/kort/)**, with the preset, region, channels and first steps,
   and keep it with the radio.

## When it happens {#när-det-händer}

- **Call 112** in an emergency, if your phone has coverage [^komm]. MeshCore reaches no emergency
  call center.
- **Listen to P4.** Swedish Radio (Sveriges Radio) must always be able to broadcast information
  that is important to the public, and your local P4 station tells you what the situation is
  [^komm] [^hem]. A radio on batteries, solar or a hand crank works without power [^hem].
- **Keep it short.** A message holds at most 160 bytes, and everyone shares the same airtime
  [^text]. Do not send the same message several times.

## The limits {#gränserna}

- No guarantee: a message can disappear without you finding out.
- Text only, no calls and no pictures.
- Range depends on the repeaters around you and their power. Where there are no repeaters, you
  reach only those you hear directly.
- The mesh is run by volunteers and is not part of Sweden's civil emergency preparedness. The
  Swedish Civil Defence Agency (Myndigheten för civilt försvar, MCF) and the government publish the
  brochure *If Crisis or War Comes* (*Om krisen eller kriget kommer*) on what households should do
  [^mcf] [^reg].

## Emergency messages with MECP {#nödmeddelanden-med-mecp}

[MECP](https://mecp.radio/) (Mesh Emergency Communication Protocol) writes an emergency message as
short codes, so the receiver can read it in their own language [^mecp]. An example:

```
MECP/0/M01 M02 T01 P05 3pax 57.78,14.16 @1430
```

It means: life-threatening (0), injury (M01), unconscious person (M02), road blocked (T01), at GPS
coordinates (P05), 3 people, the position, and the time 14:30 in the sender's local time.

There are 109 codes in 12 categories, from medical and weather to supplies, and language packs in 21
languages, Swedish included [^mecp]. The message is plain text, so it can be sent on any MeshCore
channel today. The MeshCore app shows it as written. The codes are translated by
[MECP's web tool](https://mecp-org.github.io/mecp-app/), by Wadamesh, a MeshCore app that runs on the
radio itself, and by Colorado Mesh's mesh-client (for the computer) and meshcore-tak-bridge (to ATAK
on Android) [^mecp].

MECP is new. It started in February 2026, and version 1.4.0 in November changed what some fields
mean, for example that the time is now the sender's local time instead of UTC [^mecplog]. The texts
changed in 1.4.0 await review by a native speaker, in all 21 language packs [^mecplog]. If you know
the Swedish terms for medical care and rescue, you can help by reviewing
[the Swedish pack](https://github.com/mecp-org/MECP/blob/main/languages/sv.json). Practise a few codes
while things are calm, rather than using them for the first time when something has happened.

## Make the mesh more resilient {#gör-nätet-tåligare}

Every repeater on solar or battery makes the mesh stronger when the power goes. Read
[Solar nodes](../solnoder/) before you build one, [Host a node](/bli-nodvard/) if you have a good
spot, and [How long does the battery last?](../../fragor/#batteritid) for a companion.

Building your own radio network is seen as a way to prepare, as TV4 has reported [^tv4].

## Sources {#källor}

[^kris]: Krisinformation.se, [Hemberedskap](https://www.krisinformation.se/din-beredskap/hemberedskap/) (home preparedness).
[^hem]: Krisinformation.se, [Hemberedskap](https://www.krisinformation.se/din-beredskap/hemberedskap/) (home preparedness), the section on communication.
[^komm]: Krisinformation.se, [Kommunikation vid kris](https://www.krisinformation.se/din-beredskap/kommunikation/) (communication in a crisis).
[^text]: MeshCore, [`MAX_TEXT_LEN` in BaseChatMesh.h](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.h).
[^mcf]: MCF, [press release about the brochure](https://mcf.mynewsdesk.com/pressreleases/snart-landar-broschyren-om-krisen-eller-kriget-kommer-hos-drygt-fem-miljoner-hushaall-i-sverige-3354652).
[^reg]: Government Offices of Sweden (Regeringen), [En broschyr för allvarstid](https://regeringen.se/pressmeddelanden/2024/10/en-broschyr-for-allvarstid--ny-upplaga-av-om-krisen-eller-kriget-kommer/) (a brochure for serious times).
[^tv4]: TV4, [report on building your own radio network](https://www.tv4.se/artikel/5Frw4pRToGwrcn8m6vdOaU/bygger-eget-radionaet-naesta-steg-i-den-digitala-preppingen).
[^mecp]: MECP, [the protocol, the codes and the language packs](https://github.com/mecp-org/MECP) (README and languages/).
[^mecplog]: MECP, [CHANGELOG](https://github.com/mecp-org/MECP/blob/main/CHANGELOG.md), versions 1.0.0 (2026-02-25) and 1.4.0 (2026-11-17).
