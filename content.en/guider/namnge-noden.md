---
title: "Name your repeater"
description: "The region's naming suggestion for repeaters, how long a name may be, and how to name a companion."
url: /en/guides/name-your-node/
weight: 49
group: repeater
source:
  title: "Vad är MeshCore? (avsnittet Namnge din enhet)"
  url: "https://meshat.se/meshcore/meshcore-info/#namnge-din-enhet"
  license: "CC BY 4.0"
  changes: "A guide of its own; the region's naming suggestion from the site's parameters; name length counted by a tool of its own."
date: 2026-11-12
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

A repeater's name is visible to everyone in lists and on the map, so it should tell people **where it is**.

{{< naming >}}

## Length {#längd}

The name is counted in bytes, not characters: `å`, `ä` and `ö` take two bytes each. Keep the name within
**23 bytes**, and the position fits in the same advert. Up to 31 bytes works, but then the name is sent
without a position.

{{< namecheck >}}

> [!NOTE]- Why 23 and 31 bytes
> An advert has 32 bytes for type, position and name. The type takes 1 and the position 8, so the name gets
> 23 bytes with a position and 31 without [^cli]. Å, ä and ö are two bytes each in UTF-8 [^utf8].

## Other formats you may see {#andra-format-du-kan-se}

Not everyone in Sweden uses the same format. Two common ones, with a municipality as the example:

| Format | Example | Bytes |
| --- | --- | --- |
| Country, abbreviation, place | `SE-STHLM-Kvarnberget` | 20 |
| Country and municipality code, place | `SE0180-KvarnbergetREP` | 21 |

Follow what is already used in your mesh. More examples and suggestions are in [Meshcore naming convention
in Sweden](https://github.com/MrBengt666/Meshcore-naming-convention-in-Sweden).

## Tips {#tips}

- Use a well-known place that most people in the area recognize, not your name: others should understand
  where the repeater is, not who owns it.
- Skip `å`, `ä` and `ö` if the name gets too long{{< naming-ascii >}}.
- Several repeaters at the same place? Then add the first four characters of the node's public
  key (like `-FD70`), so the names don't clash. If it stands alone, they are not needed.

## Name your companion {#namnge-din-companion}

You can name a companion however you like; the naming suggestion above applies only to repeaters. The name is visible to
others when the radio sends an advert, and it doesn't need to reveal who you are. The same limit applies:
23 bytes if the position is to be included. An emoji takes four bytes.

{{< namecheck kind="companion" >}}

## Sources {#källor}

[^cli]: MeshCore, [the CLI reference](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md), `set name`, and [AdvertDataHelpers.cpp](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/AdvertDataHelpers.cpp).
[^utf8]: [RFC 3629](https://www.rfc-editor.org/rfc/rfc3629), UTF-8.
