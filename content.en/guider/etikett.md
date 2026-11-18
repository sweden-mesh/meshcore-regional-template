---
title: "Airtime is shared"
description: "Everyone shares the same radio frequency. Simple habits that keep the mesh working for all: where to test, adverts in moderation and the region for local chat."
url: /en/guides/etiquette/
weight: 90
group: regioner
date: 2026-11-12
lastmod: 2026-11-18
---

The LoRa mesh is a shared resource. Only one radio at a time can transmit on the frequency within earshot,
and every flooded message is retransmitted by every repeater that hears it. A single message
can therefore take several seconds of airtime across the whole mesh.

## Habits that help {#vanor-som-hjälper}

**Test in the test channel.** A `test` in a chat channel disturbs everyone who reads it. If the region has repeaters
with [auto-reply]({{< param "firmware.picker" >}}#f=ar&install=update), test in the region's test channel {{< testchannel >}}. Otherwise
use the regular `#test`.

**Test sparingly.** One test is usually enough. Wait for the replies (they come with a delay, sometimes
several minutes) before you send the next one.

**Use the region.** Send local chat with the region `{{< region "scope" >}}`, so the
traffic stays in {{< region "name" >}} instead of being flooded across the neighboring counties. See
[Regions](../regioner/).

**Send adverts in moderation.** A repeater sends a flood advert on its own every 47 hours; that is
the firmware default (`flood.advert.interval 47`) and the recommended value. Sending extra ones
is only needed when something has changed, such as the name or position.

**No automated messages.** Bots, monitors and scripts that send often eat airtime
around the clock. Talk to the community before you set up anything like that.

**Keep repeaters stationary.** A repeater that moves around confuses the mesh's paths. Mobile nodes should
be companions.

## What you write is public {#det-du-skriver-är-offentligt}

Anyone can read the public and hashtag channels, and observers can record them. Don't write anything there
you don't want known, and don't share other people's details. See [Channels](../kanaler/).

Does the radio stop transmitting for a while? Then it has hit the airtime limit: see [The radio stops transmitting for a while](../../felsokning/duty-cycle/).
