---
title: "Which boards is lou available for?"
url: /en/faq/lou/which-boards/
category: lougrunder
weight: 50
date: 2026-11-21
lastmod: 2026-11-25
---

In lou-20:

| Base | Boards | Variants |
|---|---|---|
| Observer (boards with Wi-Fi, ESP32) | 33 | auto-reply, remote control or both |
| Ordinary MeshCore | 93 | auto-reply, remote control over the mesh or both |

lou is built for repeaters only, not for companions or room servers.
[The firmware picker]({{< param "firmware.picker" >}}) shows what exists for your board.

From lou-20 remote control also exists for the boards without Wi-Fi. Wio-E5 mini has no file with
both, because it does not fit the board's flash. Auto-reply and remote control exist separately.
