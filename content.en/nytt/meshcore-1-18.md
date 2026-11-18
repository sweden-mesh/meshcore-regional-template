---
title: "MeshCore 1.18"
description: "MeshCore 1.18 (October 15, 2026) for Sweden: the command line for companions, remote control of a companion, traffic without a region and more."
url: /en/news/meshcore-1-18/
date: 2026-10-15
lastmod: 2026-11-18
group: meshcore
release: {product: meshcore, version: "1.18.0"}
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

MeshCore 1.18 came out on October 15, 2026, for companion, repeater and room server [^rel]. Update
from the [web flasher]({{< param "firmware.flasher" >}}); see [Choose and flash
firmware](../../guider/flasha-firmware/).

## If you have a companion {#för-dig-med-en-companion}

- **A command line in the app.** A companion now accepts text commands, like a repeater. In the app from
  version 1.50.0 there is *Command Line* under the settings [^blog]. The commands are the same kind as in
  the [USB console](../../guider/usb-konsol/).
- **Remote control of a companion.** A contact can be given the right to send commands to your companion
  over the network, for example to change radio settings and the name, and to restart it [^blog]. Give that
  right only to someone you trust.

## If you have a repeater {#för-dig-med-en-repeater}

- **Traffic with transport code 0 counts as traffic without a region** [^blog]. This affects what
  `flood.max.unscoped` and `region allowf *` apply to; see [Regions](../../guider/regioner/).
- **Acknowledgements sent direct now wait according to `direct.txdelay`**; before, they did not wait at all
  [^blog]. See [Fine-tune](../../guider/repeater/#4-finjustera).
- **Loop protection** at its minimum level is now the default on repeaters [^blog].
- **A repeater with adverts turned off** also no longer shows when someone searches for nodes [^blog].
- **The low-battery lockout** when the board starts is turned off on most nRF52 boards
  [^blog]. This affects repeaters on [solar](../../guider/solnoder/).
- **The clock is kept** across a restart [^blog].

## Sources {#källor}

[^rel]: MeshCore, [the releases on GitHub](https://github.com/meshcore-dev/MeshCore/releases): repeater, companion and room server v1.18.0.
[^blog]: MeshCore, [Release v1.18.0](https://blog.meshcore.io/2026/10/15/release-1-18-0), October 15, 2026.
