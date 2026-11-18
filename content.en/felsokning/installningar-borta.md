---
title: "My settings are gone after flashing"
seoTitle: "MeshCore settings gone after flashing"
description: "Name, password and regions are back to defaults, and the node shows up as a new node."
url: /en/troubleshooting/settings-lost/
category: flasha
weight: 40
date: 2026-11-13
lastmod: 2026-11-16
---

## Likely causes {#troliga-orsaker}

1. **The flash was erased.** *Erase flash*, *Full erase* or *New install* wipes the whole flash,
   including the node's identity (its key). To everyone else it is now a new node.
2. A different kind of firmware was written (for example companion on a repeater). It doesn't read
   the previous firmware's settings.

## Fix {#åtgärda}

Set the node up again: name, password, radio settings and regions. The guides and wizards on
this site give you the commands.

If you saved the node's private key earlier, you can give it back its identity. Type in the
[USB console](../../guider/usb-konsol/), on one line:

```sh {title="Console"}
set prv.key <the-key>
```

The command only works over USB, not remotely.

## How to avoid it next time {#så-slipper-du-det-nästa-gång}

- Choose *Update*, not *New install*, and leave *Erase* off.
- Save the key before you erase anything: `get prv.key` in the USB console. Keep it like a
  password; whoever has it can pose as your node.

## How to tell it worked {#så-vet-du-att-det-fungerar}

With the key restored, the node has the same public key as before, and neighbors and the map
recognize it.
