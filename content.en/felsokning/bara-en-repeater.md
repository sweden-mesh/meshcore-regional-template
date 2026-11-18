---
title: "I only hear one repeater"
description: "Does your radio hear only one repeater? That is usually normal: one is enough to reach the mesh. When the signal is too weak, and how to get more margin."
url: /en/troubleshooting/only-one-repeater/
category: radio
weight: 30
date: 2026-11-13
lastmod: 2026-11-16
---

**Usually not.** Many companion radios hear exactly one repeater, and that is enough: that repeater
passes your messages on to the rest of the mesh. Most meshes look like this.

## When it's worth a closer look {#när-det-är-värt-att-titta-närmare}

- The repeater you hear has a weak signal (SNR below roughly −10 dB) and messages only get through
  some of the time.
- You used to hear more and haven't moved the radio.

## Check {#kontrollera}

```sh {title="Console"}
neighbors
```

Each line shows the repeater's id, how long ago it was heard and the signal's SNR.

## Fix {#åtgärda}

If you want some margin: place the radio higher up or closer to a window, or use a better
antenna. Two repeaters within range give you a backup if one goes down.
