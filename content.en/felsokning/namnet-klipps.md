---
title: "The name gets cut off"
description: "Only half of the repeater's or radio's name shows in the app or on the map."
url: /en/troubleshooting/name-cut-off/
category: repeater
weight: 50
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

## Likely causes {#troliga-orsaker}

1. **The name is too long for an advert.** With a position the name can be at most 23 bytes, without
   a position 31 bytes. A longer name is cut off when the node sends its advert
   ([CLI reference](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md), `set name`).
2. **Å, ä and ö** take two bytes each, and an emoji four. A 20-character name can be over 23 bytes.

## Check {#kontrollera}

Count the bytes in the [name checker](../../guider/namnge-noden/#längd), or in the console:

```sh {title="Console"}
get name
```

## Fix {#åtgärda}

Shorten the name, or swap å, ä and ö for a and o, and send a new advert:

```sh {title="Console"}
set name SE-EXEMPEL-Plats
advert
```

## How to tell it worked {#så-vet-du-att-det-fungerar}

Others see the whole name after the next advert. The map may show the old one for a while.

## Didn't work? {#fungerade-inte}

See [Name your repeater](../../guider/namnge-noden/).
