---
title: "My repeater is hard to hear even though the settings look right"
seoTitle: "MeshCore repeater hard to hear: wrong coding rate"
description: "Frequency, bandwidth and spreading factor are correct, but the repeater only hears the closest nodes, or only some of the time."
url: /en/troubleshooting/wrong-coding-rate/
category: radio
weight: 50
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

## Likely causes {#troliga-orsaker}

1. **Wrong coding rate (CR).** The firmware default is `869.618,62.5,8,5`, that is CR 5, but the
   mesh uses CR {{< param "radio.cr" >}} ([CLI reference](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md), `set radio`). A repeater where
   only the frequency was changed is still on CR 5.
2. The antenna or the location; see [The range is much shorter than expected](../kort-rackvidd/).

## Check {#kontrollera}

```sh {title="Console"}
get radio
```

The answer should end in `,{{< param "radio.cr" >}}`.

## Fix {#åtgärda}

Set the whole line at once and restart:

```sh {title="Console"}
set radio {{< param "radio.freq" >}},{{< param "radio.bw" >}},{{< param "radio.sf" >}},{{< param "radio.cr" >}}
reboot
```

## How to tell it worked {#så-vet-du-att-det-fungerar}

`get radio` shows all four values as above, and after a while `neighbors` lists more repeaters.

## Didn't work? {#fungerade-inte}

Go through [My radio doesn't hear any repeaters](../hor-inga-repeatrar/). The values and why they
are what they are: [MeshCore settings in Sweden](../../guider/radioinstallningar/).
