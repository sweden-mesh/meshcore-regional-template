---
title: "I can hear others, but they can't hear me"
description: "Can you hear others but nobody answers you? Usually the repeater reaches you but you don't reach it: height, antenna or transmit power. Here's the fix."
url: /en/troubleshooting/others-cant-hear-me/
category: radio
weight: 15
date: 2026-11-13
lastmod: 2026-11-17
---

## Likely causes {#troliga-orsaker}

1. **The repeater transmits more strongly than you.** It often sits high up with a good antenna; your
   handheld radio doesn't reach as far back.
2. **Transmit power is low** or the antenna is poorly attached.
3. You are sending in a channel with a region that the repeaters around you don't carry.

## Check {#kontrollera}

```sh {title="Console"}
get tx
```

Send `test` in the region's test channel, or in the regular `#test` if the region has no repeaters with
auto-reply: if you get answers, you are getting out.

## Fix {#åtgärda}

1. Go higher up or to a window and try again.
2. Check the antenna and the transmit power.
3. Try sending without a region, or in the region's own channel.

## How to tell it worked {#så-vet-du-att-det-fungerar}

Answers in the test channel.
