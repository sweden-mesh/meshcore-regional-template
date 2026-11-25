---
title: "lou custom firmware with remote control and auto-reply"
seoTitle: "lou custom MeshCore firmware with auto-reply"
description: "What sweden-mesh's lou firmware is, which variants exist (auto-reply, Observer, remote control) and how to choose the right one."
url: /en/guides/firmware-lou/
weight: 45
group: repeater
date: 2026-11-12
lastmod: 2026-11-25
---

Besides the MeshCore project's own firmware there is lou: repeater firmware built by [sweden-mesh](https://github.com/sweden-mesh/MeshCore-lou) for the
Swedish meshes. It is based on MeshCore and adds features that help the mesh measure itself.
Everything else works as in ordinary MeshCore, and nodes with and without lou talk to each other as
usual.

The latest released version is `v1.18.0-lou-20`, built on MeshCore 1.18.0.

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
  `{{< param "backend.host" >}}`, or over the mesh for boards without Wi-Fi. The commands are signed with the owner's own key, and the repeater
  checks the signature before it does anything. Some commands, such as keys and erasing, can never
  be sent remotely.

| Variant | Contents |
|---|---|
| Plain repeater + auto-reply | MeshCore 1.18.0 with auto-reply, for almost all repeater boards |
| Plain repeater + remote control | remote control over the mesh, for boards without Wi-Fi |
| Plain repeater + both | auto-reply and remote control over the mesh |
| Observer + auto-reply | auto-reply, reports to the map, OTA |
| Observer + remote control | remote control, reports to the map, OTA |
| Observer + both | auto-reply and remote control, reports to the map, OTA |

Want to see what remote control looks like before you flash anything? [Try mccontrol with invented
nodes](https://mccontrol.meshcoresverige.se/?demo=1). You need no key, and nothing is sent.

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

Set the first key from the USB console, or as a logged-in admin from the app. Replace it with
`rekey`, signed by the current key. Clearing it needs USB.

The lines below apply to lou-20. On lou-18 and older they are called `set mqtt.cmd.pubkey` and
`set mqtt.cmd on`. The repeater guides under [Step by step](../../wizard/) can send them for you.

{{< region-control >}}

## Remote control without Wi-Fi {#fjärrstyrning-utan-wifi}

From lou-20 the `rc` and `arrc` files for ordinary repeater boards (nRF52, RP2040, STM32, and ESP32
without Observer) take signed commands over the mesh.

Something has to pass the commands on over radio. It can be one of your own Observer repeaters with
remote control and the same command key, within radio reach in the same mesh. It passes your
commands on and is called the relay. It can also be your own companion radio.

```text {title="Turn on remote control over the mesh"}
set cmd.pubkey <your public key>
set cmd on
```

`get cmd` then answers `mesh only`.

In [mccontrol](https://mccontrol.meshcoresverige.se) such a node does not appear by itself. Add it
with its public key.

The relay passes on one command at a time, and the node answers on an airtime budget of its own. So
a command may get no answer. Wait a few minutes and send it again.

Boards without Wi-Fi are updated by USB or Bluetooth, not over the mesh.

## New in lou-20 {#nytt-i-lou-20}

lou-20 makes remote control simpler and more private:

- **No region needed.** The repeater is reached by its own key, regardless of region and map.
- **Encrypted to the owner.** Each command is encrypted to that specific repeater, and the reply
  goes back encrypted. No one else on the server can read them.
- **The repeater checks in.** About every 15 minutes, and shortly after it has connected, it sends
  an encrypted sign of life to its owner. This is how the owner's tools find their repeaters. The
  interval is changed with `set alive.interval`.
- **Encrypted over the mesh too.** A command sent through another node's radio cannot be read by
  the node that passes it on.
- **Remote control on boards without Wi-Fi.** Ordinary repeater boards take signed commands over
  the mesh, see [Remote control without Wi-Fi](#fjärrstyrning-utan-wifi).
- **The relay.** An Observer repeater with remote control passes its owner's commands on over radio
  to the owner's other repeaters and returns their answers unread.
- **Auto-reply in `#test-se` too.** The repeater answers `test` in the test channel for the whole
  country. Replies there cost the whole country airtime: send one `test`, wait two minutes, do not
  repeat it.
- **New command names.** `set cmd on` instead of `set mqtt.cmd on`, and `set cmd.pubkey` instead of
  `set mqtt.cmd.pubkey`. The old names are gone. Your settings carry over.

lou-21 comes at the earliest one month after lou-20. It removes the older way of controlling
repeaters, so that only the new one remains. Update to lou-20 first.

## Good to know {#bra-att-veta}

Short answers to what people usually ask are in [Questions about the lou firmware](../../fragor/lou/).

- **It adds, it does not change.** lou does not change MeshCore's default settings; the features
  are off until you turn them on.
- **Mixed versions work.** The mesh copes with some nodes having lou and others not; a node without
  auto-reply simply does not answer `test`.
- **Source code and versions** are at
  [github.com/sweden-mesh/MeshCore-lou](https://github.com/sweden-mesh/MeshCore-lou/releases),
  with a list of every file and what it contains.
- **If something goes wrong:** [Auto-reply doesn't answer in the county's test channel](../../felsokning/auto-svar-legacy/) and [The firmware picker doesn't offer the latest version](../../felsokning/firmwarevaljaren-gammal-version/).
