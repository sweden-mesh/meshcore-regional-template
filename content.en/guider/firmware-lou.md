---
title: "lou custom firmware with remote control and auto-reply"
seoTitle: "lou custom MeshCore firmware with auto-reply"
description: "What sweden-mesh's lou firmware is, which variants exist (auto-reply, Observer, remote control) and how to choose the right one."
url: /en/guides/firmware-lou/
weight: 45
group: repeater
date: 2026-11-12
lastmod: 2026-11-18
---

Besides the MeshCore project's own firmware there is lou, modified variants written by Louie:
repeater firmware built by [sweden-mesh](https://github.com/sweden-mesh/MeshCore-lou) for the
Swedish meshes. They are based on MeshCore and add features that help the mesh measure itself.
Everything else works as in ordinary MeshCore, and nodes with and without lou talk to each other as
usual.

The latest released version is `v1.18.0-lou-18`, built on MeshCore 1.18.0.

## The variants {#varianterna}

Auto-reply (`ar`)
: The repeater answers `test` in the county's test channel with a signal report: who heard it, how
  strongly, and the path there. The replies come with a delay so that they do not collide. This is
  how the mesh can measure which parts reach each other. The channel follows the node's region, for
  example `#test-{{< region "scope" >}}`.

Observer
: The repeater reports what it hears to the map over Wi-Fi (see
  [The map and observers](../visa-pa-kartan/)). Based on agessaman's Observer firmware, it can
  update itself over the network (OTA), with updates signed by sweden-mesh.

Remote control (`rc`)
: The owner can change settings on their repeater without going there, through the command server
  `{{< param "backend.host" >}}`. The commands are signed with the owner's own key, and the repeater
  checks the signature before it does anything. Some commands, such as keys and erasing, can never
  be sent remotely.

| Variant | Contents |
|---|---|
| Plain repeater + auto-reply | MeshCore 1.18.0 with auto-reply, for almost all repeater boards |
| Observer + auto-reply | auto-reply, reports to the map, OTA |
| Observer + remote control | remote control, reports to the map, OTA |
| Observer + both | auto-reply and remote control, reports to the map, OTA |

## Choose and install {#välj-och-installera}

Go to the [firmware picker]({{< param "firmware.picker" >}}) and choose the type of node, the
features and your board. You get a file and instructions for exactly that. If you choose no extra
features, it sends you to MeshCore's own flasher. The flashing itself is described in
[Flash firmware](../flasha-firmware/).

After flashing, the picker shows the commands you need, for example:

```text {title="Turn on auto-reply"}
set autoreply on
```

Auto-reply uses the node's region, so set that first (see [Regions](../regioner/)).

Remote control is turned on from the USB console, because the key can only be set there. The lines
below apply to lou-17 and later. The repeater guides under [Step by step](../../wizard/) can send
them for you.

{{< region-control >}}

## Upcoming versions {#nästa-versioner}

lou-20 is built but not released yet; it will be released once it has passed testing. It makes
remote control simpler and more private:

- **No region needed.** The repeater is reached by its own key, regardless of region and map.
- **Encrypted to the owner.** Each command is encrypted to that specific repeater, and the reply
  goes back encrypted. No one else on the server can read them.
- **The repeater checks in.** About every 15 minutes, and shortly after it has connected, it sends
  an encrypted sign of life to its owner. This is how the owner's tools find their repeaters. The
  interval is changed with `set alive.interval`.
- **Encrypted over the mesh too.** A command sent through another node's radio cannot be read by
  the node that passes it on.

lou-21 comes at the earliest one month after lou-20. It removes the older way of controlling
repeaters, so that only the new one remains. Update to lou-20 first.

## Good to know {#bra-att-veta}

- **It adds, it does not change.** lou does not change MeshCore's default settings; the features
  are off until you turn them on.
- **Mixed versions work.** The mesh copes with some nodes having lou and others not; a node without
  auto-reply simply does not answer `test`.
- **Source code and versions** are at
  [github.com/sweden-mesh/MeshCore-lou](https://github.com/sweden-mesh/MeshCore-lou/releases),
  with a list of every file and what it contains.
- **If something goes wrong:** [Auto-reply doesn't answer in the county's test channel](../../felsokning/auto-svar-legacy/) and [The firmware picker doesn't offer the latest version](../../felsokning/firmwarevaljaren-gammal-version/).
