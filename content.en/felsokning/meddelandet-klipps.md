---
title: "My message gets cut off or won't send"
description: "A long MeshCore message arrives cut off or can't be sent: the limit is 160 bytes, and å, ä and ö take two bytes each."
url: /en/troubleshooting/message-cut-off/
category: companion
weight: 50
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

## Likely causes {#troliga-orsaker}

1. **The message is longer than 160 bytes.** That is the limit for a text message in MeshCore
   ([the source code](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.h),
   `MAX_TEXT_LEN`).
2. **Å, ä and ö** take two bytes each and an emoji four, so a Swedish message fits fewer than 160
   characters.

## Check {#kontrollera}

Count: a message with many å, ä and ö or emojis reaches the limit sooner. There are examples in
[Channels](../../guider/kanaler/#hur-långt-kan-ett-meddelande-vara).

## Fix {#åtgärda}

Write less, or split the text into two messages. Don't send them right after each other: everyone
shares the airtime.

## How to tell it worked {#så-vet-du-att-det-fungerar}

The recipient gets the whole text, and you get a receipt for direct messages.

## Didn't work? {#fungerade-inte}

See [Messages are sent but never arrive](../meddelanden-kommer-inte-fram/).
