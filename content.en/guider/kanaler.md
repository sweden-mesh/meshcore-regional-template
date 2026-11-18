---
title: "Channels"
seoTitle: "Channels in MeshCore"
description: "Public, hashtag and private channels in MeshCore: who can read what, how long a message can be, and how to create a private channel."
url: /en/guides/channels/
weight: 80
group: regioner
date: 2026-11-12
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

A **channel** is a shared room: everyone who has the channel's key can read and write there. Besides
channels, you can send direct messages to a contact.

## Three kinds of channels {#tre-sorters-kanaler}

Public
: The channel every radio has from the start. It has a known key, so **anyone can read it**.

Hashtag channels
: Channels whose names start with `#`, for example {{< chat-example >}}. The key is derived from the
  name, so anyone who knows the name can join, and anyone who knows the name can also read. This is
  how local and topic channels work.

Private channels
: Channels with a random secret key that you share with the people you choose. Only those who have
  the key can read.

> [!NOTE]- Why anyone can read hashtag channels
> The key to a hashtag channel is the first 16 bytes of the SHA-256 of the name, for example
> `sha256("#test")`. The messages are encrypted on the air, but anyone who knows or guesses the name
> can work out the key. MeshCore's documentation says hashtag channels should not be considered
> private [^cp].

> [!IMPORTANT] Nothing is secret on Public or in hashtag channels
> Never write anything there that you would not want anyone at all to be able to read, even much
> later. Messages can also be recorded by observers.

## How long can a message be? {#hur-långt-kan-ett-meddelande-vara}

At most 160 bytes [^text]. Ordinary letters take one byte each, but å, ä and ö take two and an emoji
four [^utf8]:

| Text | Characters | Bytes |
| --- | --- | --- |
| `Hej på dig` | 10 | 11 |
| `Är du där?` | 10 | 12 |
| `Ses vid sjön 👍` | 14 | 18 |

Channel messages are always flooded, to every repeater in the region [^faq]. Keep it short, and
split up a long conversation rather than sending many messages in a row; see
[Good mesh etiquette](../etikett/).

## Create a private channel {#skapa-en-privat-kanal}

1. Open the channels in the app and choose to add a channel.
2. Choose to create a private channel and give it a name. The app generates a random 16-byte key
   [^cp].
3. Share the channel with the people who should be in it, for example as a QR code or key, and
   preferably not in an open channel.
4. Whoever receives the key adds the channel with it.

Menu names can differ between app versions. Anyone who has the key can always read the channel;
switch to a new channel if the key has spread too far.

## Channels in {{< region "name" >}} {#kanaler-i-regionen}

{{< channels >}}

Join a hashtag channel by adding it in the app with exactly the same name, with `#` first.

## Region on the channel {#region-på-kanalen}

A channel can have a [region](../regioner/), so that its messages are passed on only within that
area. Choose the smallest region that reaches the people the channel is for:

- local chat in the county: `{{< region "scope" >}}`,
- something that concerns all of Sweden: `se`,
- with no region, the message is passed on as far as it reaches.

## Test in the right place {#testa-på-rätt-ställe}

Test messages cost airtime for everyone in range. If your region has repeaters with
[auto-reply](../firmware-lou/), test in the region's test channel {{< testchannel >}}, otherwise
in the common `#test`. Try not to use the ordinary chat channels (Public and the region's chat
channel) for test messages, and do not send more tests than you need. Repeaters with auto-reply
answer `test` in the test channel, with a delay, so that the replies do not collide.

No reply? See [Messages don't arrive](../../felsokning/meddelanden-kommer-inte-fram/) and [Auto-reply doesn't answer in the county's test channel](../../felsokning/auto-svar-legacy/).

## Sources {#källor}

[^cp]: MeshCore, [companion protocol](https://github.com/meshcore-dev/MeshCore/blob/main/docs/companion_protocol.md), channel types.
[^text]: MeshCore, [BaseChatMesh.h](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.h), `MAX_TEXT_LEN`.
[^utf8]: [RFC 3629](https://www.rfc-editor.org/rfc/rfc3629), UTF-8.
[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md), 5.5.
