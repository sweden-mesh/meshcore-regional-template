---
title: "What is MeshCore?"
seoTitle: "What is MeshCore? A guide for Sweden"
description: "What MeshCore is, what you can and cannot use it for, key facts, the roles of the nodes and how a message finds its way through the mesh."
url: /en/guides/what-is-meshcore/
weight: 10
group: start
source:
  title: "Vad är MeshCore?"
  url: "https://meshat.se/meshcore/meshcore-info/"
  license: "CC BY 4.0"
  changes: "Rewritten and shortened for the regional sites; the observer role, flooding and paths added; the map links replaced by the map on the home page."
date: 2026-11-12
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

MeshCore sends text messages between small LoRa radios. The messages go from radio to radio,
with no cell network, Wi-Fi or internet. When many radios work together to pass the traffic on,
they form a **mesh network**, and each radio in the mesh is called a **node**.

## What can you use it for? {#vad-kan-du-använda-det-till}

- Send messages where your phone has no coverage: in the forest, on the lake or in the countryside.
- Talk to others nearby in a shared channel for your county.
- Have a backup when the power and the cell network go down; see [MeshCore when the power and
  cell network go down](../nar-natet-gar-ner/).
- Build the mesh together with others, with repeaters in high places.

## Key facts {#fakta-i-korthet}

| What | Short answer |
| --- | --- |
| Band | 868 MHz, [the settings for Sweden](../radioinstallningar/) |
| License | not needed, see [the FAQ](../../fragor/#licens) |
| Hops | up to 64 repeaters along the way [^faq] |
| Message | at most 160 bytes, see [Channels](../kanaler/#hur-långt-kan-ett-meddelande-vara) [^text] |
| Encryption | direct messages and private channels, see [the FAQ](../../fragor/#kryptering) |
| Apps | Android, iOS, Windows, Mac and the web, see [Companion](../companion/) [^faq] |
| Cost | the radio; the app is free for messaging, see [Get hardware](../skaffa-hardvara/) |

> [!NOTE] Official information
> The MeshCore project's own website is [meshcore.io](https://meshcore.io), with
> [documentation](https://docs.meshcore.io/) and new releases. `meshcore.co.uk` is not the
> project's official site.

## What you need {#det-här-behöver-du}

- A LoRa radio that MeshCore supports, and an antenna for the 868 MHz band.
- MeshCore firmware on the radio. Installing it is called *flashing*.
- The MeshCore app on your phone or computer.

That is enough to send and receive. Everything else in the mesh, such as repeaters in high
places, has been set up by others, and that is how the mesh grows.

## The roles of the nodes {#nodernas-roller}

The same kind of radio can take different roles depending on the firmware it runs.

Companion
: Your personal radio. It connects to the app over Bluetooth or USB and sends and receives your
  messages. A companion does **not** pass on other people's traffic.

Repeater
: Receives traffic and sends it on, so that messages reach farther and get past obstacles.
  A repeater does the most good high up with a clear view and a good antenna, and stays in the
  same place around the clock.

Observer
: A repeater that also reports what it hears to a server over the internet. This does not affect
  the mesh, but it is how the map on the [home page](/) knows which nodes exist and which paths
  the packets take.

Room server
: A node that stores messages in a shared room, a bit like a bulletin board. You log in from the
  app, often with a password, and the server sends you what was written while you were away. It is
  the best way MeshCore has today to catch up, but it has known limits: over many hops the login
  can look as if it failed even though it worked, and the server keeps only the 32 most recent
  posts. It works best for those who reach it directly or in few hops. See
  [Room server](../room-server/).

## How a message finds its way {#så-tar-sig-ett-meddelande-fram}

A message is sent as a **packet**. The first time, it is often sent as a *flood*: every
repeater that hears the packet sends it on once, until it has reached as far as it can. Each
repeater that passes it on adds itself to the packet's **path**.

{{< flow >}}

When the recipient replies, the reply can be sent *direct* along the path that worked, instead of
being flooded across the whole mesh again. That saves airtime, and airtime is what is expensive in a
LoRa mesh: only one node at a time can transmit on the same frequency.

> [!NOTE]- Exactly how
> - A direct message is flooded the first time. The recipient's acknowledgment comes back with the
>   list of repeaters along the path, and the next message goes direct along it [^faq].
> - Channel messages are always flooded, since they have no single recipient [^faq].
> - Packets can go up to 64 hops. Each repeater is written into the path with 1, 2 or 3 bytes of its
>   key; with 2 bytes the limit is 32 hops and with 3 bytes 21 hops, but there is less risk of two
>   repeaters being mixed up [^faq].

The mesh in {{< region "name" >}} uses the region (scope) `{{< region "scope" >}}`, which keeps
local traffic local. More on that in [Regions](../regioner/).

## What it does not do {#vad-det-inte-gör}

- It sends only text, at most 160 bytes per message [^text]. Å, ä and ö take two bytes each.
- It cannot carry voice or pictures.
- It does not promise that a message gets through. The mesh is built by volunteers, and a path
  can be gone.
- Everyone shares the same airtime. A long conversation in a channel takes time from everyone in
  the region; see [Good manners on the mesh](../etikett/).

## MeshCore in Sweden {#meshcore-i-sverige}

The band
: MeshCore uses the 868 MHz band. The mesh here runs the preset
  *{{< param "radio.preset" >}}* in the app: {{< param "radio.freq" >}} MHz, bandwidth
  {{< param "radio.bw" >}} kHz and spreading factor {{< param "radio.sf" >}}. All radios in the mesh
  must have the same values to hear each other.

Rules
: You do not need a license. The band is free to use, with limits on transmit power (at most
  500 mW ERP on 869.4–869.65 MHz) and on how much of the time a radio may transmit (duty cycle).
  With the region's default settings you stay within them.

Cost
: A radio costs from a couple of hundred kronor for a simple board with an antenna, up to about a
  thousand kronor for a finished device with a screen, keyboard or GPS. The firmware is free, and the
  app is free to download and use for messaging; in the mobile app, the waiting time for
  administering a repeater can be unlocked with a purchase [^faq]. The mesh has no subscriptions or fees. An outdoor repeater costs more:
  an enclosure, a better antenna and perhaps solar and a battery. See [Get hardware](../skaffa-hardvara/).

During a power outage
: Radios and repeaters on battery or solar work without power and the cell network. See [MeshCore
  when the power and cell network go down](../nar-natet-gar-ner/).

In the news
: TV4 has reported on the mesh in Västerbotten, in [Bygger eget radionät](https://www.tv4.se/artikel/5Frw4pRToGwrcn8m6vdOaU/bygger-eget-radionaet-naesta-steg-i-den-digitala-preppingen) ("Building their own radio network", in Swedish).

Meshtastic
: Another system on the same radios, which does not talk to MeshCore. See
  [MeshCore or Meshtastic?](../meshcore-eller-meshtastic/).

## Common terms {#vanliga-ord}

The terms used here, such as *advert*, *flood* and *path*, are explained in [the glossary](../ordlista/).

## Range {#räckvidd}

Range depends more on height, antenna and terrain than on transmit power. From a mast or a tall
building a repeater reaches far; from a basement it barely reaches the neighbor. That is why a few
well-placed repeaters are worth more than many placed low. If your radio hears only one repeater,
that is usually normal: see [I only hear one repeater](../../felsokning/bara-en-repeater/).

## Next steps {#nästa-steg}

- [Regions](../regioner/): which region to use here
- [MeshCore or Meshtastic?](../meshcore-eller-meshtastic/): the difference, and how to choose
- The map on the [home page](/): see which repeaters are near you

## Sources {#källor}

[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md): hops and path ids, flood and direct, channels, apps and in-app purchases.
[^text]: MeshCore, [BaseChatMesh.h](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.h), `MAX_TEXT_LEN`; UTF-8 per [RFC 3629](https://www.rfc-editor.org/rfc/rfc3629).
