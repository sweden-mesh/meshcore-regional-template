---
title: "Your first message"
seoTitle: "Your first MeshCore message"
description: "Send your first MeshCore message: contacts, direct messages and channels, acknowledgments, where to test, and why silence is usually normal."
url: /en/guides/first-message/
weight: 22
group: start
date: 2026-11-16
lastmod: 2026-11-18
---

Your radio is flashed, the app is connected and the radio settings are right (if not: [Get started
with a companion](../companion/)). Now it is time to put something on the air. This guide explains
what happens when you send, and how to read what comes back.

## 1. Send an advert {#1-skicka-en-advert}

An *advert* is a short packet in which your radio says it exists, with its name and, if you want,
its position. Others see you only once they have heard your advert, and you see them only once you
have heard theirs. Send one from the app. There are two kinds:

- **Zero hop**: heard only by those who reach your radio directly.
- **Flood**: passed on by the repeaters and reaches the whole mesh. Do not send it often: every
  flood takes airtime from everyone.

Send a **flood advert the first time the radio starts, and every time you change its name**.
Other people's contact lists and the map learn about your radio, and its new name, only from an
advert, and a zero-hop advert reaches only those who hear you directly.

## 2. Contacts {#2-kontakter}

The nodes your radio has heard end up in the app's contact list: repeaters, room servers and other
companions. The list grows by itself as more adverts come in. If you hear no one at all after a
while, see [I can't hear any repeaters](../../felsokning/hor-inga-repeatrar/).

## 3. Test in the test channel {#3-testa-i-testkanalen}

If your region has repeaters with [auto-reply](../firmware-lou/), test in the region's own test
channel {{< testchannel >}}. Otherwise use the common `#test`. Not in the chat channels: other
people read those, and a test interrupts the conversation going on there.

1. Add the channel in the app by its name, including the `#`.
2. Type `test` in the test channel and send it.
3. Wait. Repeaters with [auto-reply](../firmware-lou/) answer with who heard you and how
   strongly. The replies are spread out over a few minutes so that they do not collide with
   each other.

Do not type `test` again while you wait. A repeater answers the same sender at most once every few
minutes, so a new test right away brings no more replies.

{{< channels >}}

## 4. Direct message or channel {#4-direktmeddelande-eller-kanal}

Direct message
: Only the recipient can read it. When the recipient's radio has received it, it sends an
  acknowledgment, and the app shows that the message arrived. If no acknowledgment comes, the app
  tries again, and may finally send it as a flood.

Channel
: No acknowledgment: you do not know who read it. The app can show that a repeater heard your
  message and passed it on, but not how far it got.

The first reply to a new contact often takes longer. The radio does not know the path yet, so the
message is sent as a flood. Once a reply has come through, the radios learn the path, and the next
message goes straight along it.

## 5. When no one answers {#5-när-ingen-svarar}

Silence rarely means something is wrong. Usually it is one of these:

- **No one was awake.** People do not answer in the channel around the clock.
- **No auto-reply in range.** Only repeaters with auto-reply answer `test`, and not every repeater
  has it. If your region has none, test in the common `#test`.
- **The reply did not make it back.** You may reach a repeater that does not reach you, or the
  other way around: see [I hear others, but they don't hear me](../../felsokning/hor-andra-men-inte-mig/).
- **You just sent one.** Wait a few minutes before you try again.

A missing reply does not prove that the message did not arrive. It only tells you that no reply
has come back to you.

> [!TIP] Say hello
> Once the test works, write something in the region's chat channel and say roughly where you are,
> a town or an area, never an address. Then others can see that the mesh reaches there, and you
> find the people who live nearby and the ones who know where the mesh needs more repeaters.

## Next steps {#nästa-steg}

- [Airtime is shared](../etikett/): habits that make the mesh work for everyone
- [Channels in MeshCore](../kanaler/): public, hashtag and private channels
- [Messages don't arrive](../../felsokning/meddelanden-kommer-inte-fram/): when it does not
  work
