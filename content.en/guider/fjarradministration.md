---
title: "Manage the repeater from the app"
seoTitle: "Manage a MeshCore repeater remotely"
description: "Log in as admin on your MeshCore repeater from the app, over the radio and through other repeaters: what you can change and what needs USB."
url: /en/guides/remote-admin/
weight: 61
group: repeater
date: 2026-11-18
lastmod: 2026-11-25
---

Once the repeater is up the mast, you can't reach it with a USB cable. Instead you can log in to it
as admin from the MeshCore app, over the radio. The login also goes through other repeaters:
if the app knows no path to the repeater it is sent as a flood, otherwise directly along the path [^login].

## Log in {#logga-in}

1. Make sure the repeater is among the contacts in the app. It ends up there once your radio has heard
   its advert.
2. Select the repeater and log in with the **admin password**.
3. Once logged in, you can read the repeater's status and send it commands.

The password is `password` from the factory [^cli]. Change it before the repeater is put up, in the
[USB console](../usb-konsol/):

```text {title="Console"}
password your-new-password
```

Anyone who knows the password becomes admin [^cli]. Choose your own long password.

## What you can change {#vad-du-kan-ändra}

Most commands in MeshCore's [CLI reference](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md)
can be sent from the app, for example name, TX power, regions and adverts. Some work only over
USB [^cli]:

- the frequency (`set freq`),
- erasing and factory reset (`erase`),
- reading out the node's private key (`get prv.key`),
- statistics and the log written to the console.

Don't change the radio settings remotely unless you are sure: if they end up wrong, the repeater no longer
hears the mesh, and then you can only reach it with a cable again.

> [!NOTE]- The app asks me to wait
> In the mobile app, the wait time for remote administration over the radio can be unlocked with an in-app
> purchase [^faq]. Remote administration itself works without it.

## Remote control over the internet {#fjärrstyrning-via-internet}

A repeater with [lou special firmware](../firmware-lou/) can also be controlled with signed
commands, over the internet or over the mesh, without you having to be within radio range. It is an add-on; the login above works with standard
MeshCore.

## Sources {#källor}

[^login]: MeshCore, `sendLogin` in [BaseChatMesh.cpp](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.cpp) (flood when the path is unknown, otherwise direct), and the route types in the [packet format](https://github.com/meshcore-dev/MeshCore/blob/main/docs/packet_format.md).
[^cli]: MeshCore, [the CLI reference](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md): `password`, the default value `password`, and which commands work only over the serial port.
[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md).
