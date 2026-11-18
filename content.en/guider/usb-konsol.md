---
title: "Send commands over USB"
description: "Repeaters and room servers are configured with text commands. How to open the console in your browser and send them."
url: /en/guides/usb-console/
weight: 60
group: repeater
source:
  title: "Vad är MeshCore? (avsnittet Skriv kommandon i Console)"
  url: "https://meshat.se/meshcore/meshcore-info/#skriv-kommandon-i-console"
  license: "CC BY 4.0"
  changes: "Expanded into a guide of its own with common commands and troubleshooting."
date: 2026-11-12
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

Repeaters and room servers have no app for all their settings. You configure them with short
text commands, such as `set name` or `region`, in a **serial console**: a window where you type
to the radio over the USB cable.

## Open the console {#öppna-konsolen}

1. Connect the radio to your computer with a USB cable that carries data.
2. Open [MeshCore Flasher]({{< param "firmware.flasher" >}}) in Chrome or Edge.
3. Click **Console** in the top right corner.
4. Pick the radio's port when the browser asks.
5. Type a command and press Enter. **Wait for the reply** before you send the next one.

> [!TIP] One at a time
> The radio takes one command at a time. If you send several at once, some can get lost.
> `reboot` restarts the radio, and the console loses the connection; connect again afterwards.

> [!TIP] Prefer buttons to commands?
> MeshCore has a web page for configuring repeaters and room servers over USB:
> [config.meshcore.io](https://config.meshcore.io). There you set the name, frequency and more in
> a form ([MeshCore FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md)).

## Good to know {#bra-att-kunna}

```text {title="Show settings"}
get name
get radio
region
```

```text {title="Neighbors the repeater has heard"}
neighbors
```

```text {title="Send an advert now"}
advert
```

```text {title="Restart"}
reboot
```

[Set up a repeater](../repeater/) walks through the settings for a repeater. Every command is in
the MeshCore project's [command list](https://docs.meshcore.io/cli_commands/).

## Remote administration {#fjärradministration}

If the repeater is up a mast, you can send the same commands over the radio: add it as a contact in
the app, log in with the admin password and open its command line. This works as long as you
can reach the repeater over the mesh, but be careful: one wrong radio command can leave you unable
to reach it again without climbing up. Step by step: [Manage the repeater from the
app](../fjarradministration/).

## If something goes wrong {#om-något-krånglar}

> [!NOTE]- No port to choose
> Switch to a cable that carries data, try another USB port and close other programs that may be
> using the port (for example another console window).

> [!NOTE]- No reply to commands
> Check that the radio has repeater or room server firmware; a companion does not answer
> console commands the same way. Wait a few seconds after connecting before the first command.

More answers in Troubleshooting: [The nRF52 radio does not show up as a USB device](../../felsokning/nrf52-ingen-enhet/), [The browser finds no port](../../felsokning/ingen-port/) and [I forgot the repeater's admin password](../../felsokning/glomt-adminlosenord/).
