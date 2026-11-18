---
title: "Write your first message"
seoTitle: "Quick start: your first MeshCore message"
description: "Check if there is mesh coverage where you are, send an advert and type test in your county's test channel. And what to do when no one answers."
url: /en/guides/quickstart-first-message/
weight: 2
group: snabbstart
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

Your radio is flashed and connected to the app (if not: [From zero to a companion in your
hand](../snabbstart-companion/)). Here is how to get something on the air and see that it arrived.

## 1. Is there a mesh where you are? {#1-finns-det-nät-där-du-är}

Look at the map on the [home page](/). If you see repeaters a few kilometers away, ideally with a
clear line of sight to them, your chances are good. If there are none nearby, you may hear nothing
indoors: go outside, or up a floor.

Where the mesh actually reaches is measured by people moving around with the MeshMapper app. The
measurements are on [MeshMapper](https://swe.meshmapper.net/).

Read more: [Check your location with MeshMapper](../kolla-platsen/).

## 2. Send a flood advert {#2-skicka-en-flood-advert}

An *advert* says that your radio exists. Send a **flood advert** from the app, so that the
repeaters pass it on and others see you. Do it the first time, and when you change your name; not
often, because every flood takes airtime from everyone.

After a while the contact list fills with the repeaters and radios you hear.

## 3. Type test in the test channel {#3-skriv-test-i-testkanalen}

1. Add your county's test channel {{< testchannel >}} in the app, with `#` first in the name.
2. Type `test` and send it.
3. Wait a few minutes. Repeaters with auto-reply answer with who heard you and how strongly.
   The replies are spread out in time so they do not collide.

Do not type `test` again while you wait: a repeater answers the same sender at most once every few
minutes. If your county has no repeaters with auto-reply, test in the common `#test`.

Never test in Public or your county's chat channel. Other people read those, and a test interrupts
the conversation.

## 4. Read the reply {#4-läs-svaret}

A reply from a repeater means it heard you, directly or through other repeaters. If several
answer, you reach far. Then write a real message: in a channel, or directly to a contact. A direct
message gets an acknowledgment when it has arrived; a channel message gets none.

Read more: [Your first message](../forsta-meddelandet/), about contacts, acknowledgments and paths.

## If no one answers {#om-ingen-svarar}

It rarely means something is wrong. Go through these in order:

1. The same radio settings as in {{< region "name" >}}, and the antenna is attached.
2. You have sent a flood advert.
3. There is a repeater within range; try outdoors or higher up.

Read more: [I can't hear any repeaters](../../felsokning/hor-inga-repeatrar/) and [Messages don't
arrive](../../felsokning/meddelanden-kommer-inte-fram/).

## Next steps {#nästa-steg}

If you want to make the mesh bigger where you live: [A simple repeater in the window](../snabbstart-repeater/).
