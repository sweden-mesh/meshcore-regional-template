---
title: "Messages are sent but never arrive"
seoTitle: "MeshCore messages not arriving"
description: "Do your messages never arrive, or only sometimes? Usually no repeater hears you, the channel has the wrong region or the path is stale. Here's the fix."
url: /en/troubleshooting/messages-not-arriving/
category: companion
weight: 20
date: 2026-11-13
lastmod: 2026-11-17
---

## Likely causes {#troliga-orsaker}

1. **No repeater hears you.** Your radio may not get through, even if you hear the repeater; it
   often transmits more strongly and sits higher than you.
2. **The channel has a region.** A channel with a region (scope) is only passed on by repeaters that
   carry that region. If you are outside it, or the repeater doesn't have the region, the message stops.
3. **A stale path to the recipient.** Direct messages first take the path that worked last time.
   If the mesh has changed, that path may be broken.
4. Wrong channel key: for hashtag channels the name is enough, but it must match exactly.

## Fix {#åtgärda}

1. Send `test` in the region's test channel. Repeaters with auto-reply answer and show that you get out.
   If the region has no such repeaters, try the regular `#test`.
2. Reset the path to the contact in the app (*Reset path*) and send again.
3. Check the channel name character by character, and that your app uses the region's scope.
4. Move the radio higher up or closer to a window.

## How to tell it worked {#så-vet-du-att-det-fungerar}

An answer in the test channel, or a check mark next to the direct message.
