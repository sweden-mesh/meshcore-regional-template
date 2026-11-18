---
title: "MeshCore or Meshtastic?"
seoTitle: "MeshCore vs Meshtastic: the difference"
description: "MeshCore or Meshtastic? Same radios, different ways of passing traffic on: hops, airtime, battery and encryption compared, and where Reticulum fits in."
url: /en/guides/meshcore-or-meshtastic/
weight: 95
group: start
date: 2026-11-16
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

MeshCore and Meshtastic are two free systems for text messaging over LoRa. **They run on the same
radios**, but they don't talk to each other: a MeshCore radio doesn't hear a Meshtastic radio. So
you are choosing a network, not hardware. Reticulum is a third, different option. If you are new,
start with [What is MeshCore?](../vad-ar-meshcore/).

## The big difference: who passes traffic on {#den-stora-skillnaden-vem-för-trafiken-vidare}

**In Meshtastic, every radio can help out.** A node that hears a message listens for a short while
and retransmits it only if no one else has already done so; a node in the ROUTER role always
retransmits [^mtalgo] [^mtrole]. A message may travel a limited number of hops, 3 by default and at
most 7 [^mtlora].

**In MeshCore, the repeaters do that job.** Your personal radio, a *companion*, only transmits your
own messages and doesn't pass on anyone else's. Fixed repeaters in high places carry the mesh, up to
64 hops [^mcfaq]. A direct message is flooded the first time, and the next one can then go *direct*
along the path that worked. Read more under [How a message finds its
way](../vad-ar-meshcore/#så-tar-sig-ett-meddelande-fram).

This has two consequences:

- **Airtime.** Only one radio at a time can transmit on the frequency within earshot. When fewer
  radios retransmit, and replies go direct, the airtime stretches to more users and more hops.
- **Battery.** A companion that doesn't retransmit other people's traffic can sleep more. The
  repeaters, on the other hand, need to run around the clock, often on mains power or [solar](../solnoder/).

## Comparison {#jämförelse}

| How traffic flows | MeshCore | Meshtastic |
| --- | --- | --- |
| Who passes it on | repeaters, not companions | nodes no one else beat to it, ROUTER always |
| Number of hops | up to 64 | 3 by default, at most 7 |
| Replies and direct messages | direct along a known path | flooded, in newer versions sometimes direct |
| Limiting traffic to an area | regions (scope) | the hop limit |

| Using it | MeshCore | Meshtastic |
| --- | --- | --- |
| Radios | the same LoRa boards | the same LoRa boards |
| Apps | Android, iPhone, Windows, Mac, the web | its own apps |
| Maps in Sweden | the map on the [home page](/) | see [meshat.se](https://meshat.se/) |
| Talks to the other system | no | no |

> [!NOTE]- Can they talk to each other?
> No. They use the same radio chips but different packets, and don't hear each other's traffic.

> [!NOTE]- Is it encrypted?
> In MeshCore, direct messages and private channels are encrypted with AES-128, with a two-byte
> checksum (HMAC), and every node has an identity with an Ed25519 key [^mccrypto]
> [^mcpayloads]. Comparison pages disagree on what should be called end-to-end, so we only describe
> what the code does. See also the [FAQ](../../fragor/#kryptering).

## When MeshCore is a good fit {#när-meshcore-passar}

- You want to reach far, through many hops, on a mesh with fixed repeaters.
- You want your own radio to last a long time on battery.
- There is a MeshCore mesh where you live. See the map on the [home page](/).

## When Meshtastic is a good fit {#när-meshtastic-passar}

- You are a group moving together, without fixed repeaters, and every radio should help out.
- You want the network your friends or your club already use.

## And Reticulum? {#och-reticulum}

Reticulum is not an app but a networking system. It can run over any mix of links,
LoRa, Wi-Fi, the internet or a serial cable, and doesn't need IP [^rns]. It talks to neither
MeshCore nor Meshtastic.

| Property | Reticulum |
| --- | --- |
| Links | any mix, without IP [^rns] |
| Encryption | X25519 and Ed25519, with forward secrecy [^rns] |
| Radio | RNode is the reference radio [^rns] |

meshat.se has guides to Reticulum: [What is Reticulum?](https://meshat.se/).

## What is used in Sweden? {#vad-används-i-sverige}

Both. You can see where the MeshCore mesh is on the map on the [home page](/); for Meshtastic, see
[meshat.se](https://meshat.se/). No one has measured how big the networks are, so we give no figures.

## Can I switch later? {#kan-jag-byta-senare}

Yes. The same radio can be flashed with the other system whenever you like; it is only firmware. See
[Choose and flash firmware](../flasha-firmware/). The settings don't carry over, and the radio becomes
a new node to everyone else.

## Next steps {#nästa-steg}

- [Get hardware](../skaffa-hardvara/): what matters when you choose a radio
- [Get started with a companion](../companion/): your first MeshCore radio
- [Frequently asked questions](../../fragor/)

## Sources {#källor}

[^mtalgo]: Meshtastic, [Mesh broadcast algorithm](https://meshtastic.org/docs/overview/mesh-algo/).
[^mtrole]: Meshtastic, [Device configuration](https://meshtastic.org/docs/configuration/radio/device/), roles.
[^mtlora]: Meshtastic, [LoRa configuration](https://meshtastic.org/docs/configuration/radio/lora/), hop limit.
[^mcfaq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md), 2.5.
[^mccrypto]: MeshCore, [MeshCore.h](https://github.com/meshcore-dev/MeshCore/blob/main/src/MeshCore.h) and [Utils.cpp](https://github.com/meshcore-dev/MeshCore/blob/main/src/Utils.cpp).
[^mcpayloads]: MeshCore, [payloads](https://github.com/meshcore-dev/MeshCore/blob/main/docs/payloads.md).
[^rns]: Reticulum, [What is Reticulum?](https://reticulum.network/manual/whatis.html)
