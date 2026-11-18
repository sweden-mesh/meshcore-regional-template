---
title: "Namnge din repeater"
description: "Regionens namnförslag för repeatrar, hur långt ett namn får vara, och hur du namnger en companion."
weight: 49
group: repeater
source:
  title: "Vad är MeshCore? (avsnittet Namnge din enhet)"
  url: "https://meshat.se/meshcore/meshcore-info/#namnge-din-enhet"
  license: "CC BY 4.0"
  changes: "Egen guide; regionens namnförslag från sidans parametrar; namnlängden räknas av ett eget verktyg."
date: 2026-11-12
lastmod: 2026-11-18
---

En repeaters namn syns för alla i listor och på kartan, så det ska tala om **var den står**.

{{< naming >}}

## Längd

Namnet räknas i byte, inte tecken: `å`, `ä` och `ö` tar två byte var. Håll namnet inom
**23 byte**, så får positionen plats i samma advert. Upp till 31 byte går, men då skickas namnet
utan position.

{{< namecheck >}}

> [!NOTE]- Varför 23 och 31 byte
> En advert har 32 byte för typ, position och namn. Typen tar 1 och positionen 8, så namnet får
> 23 byte med position och 31 utan [^cli]. Å, ä och ö är två byte var i UTF-8 [^utf8].

## Andra format du kan se

Alla i Sverige använder inte samma format. Två vanliga, med en kommun som exempel:

| Format | Exempel | Byte |
| --- | --- | --- |
| Land, förkortning, plats | `SE-STHLM-Kvarnberget` | 20 |
| Land och kommunkod, plats | `SE0180-KvarnbergetREP` | 21 |

Följ det som redan används i ditt nät. Fler exempel och förslag finns i [Meshcore naming convention
in Sweden](https://github.com/MrBengt666/Meshcore-naming-convention-in-Sweden).

## Tips

- Använd en välkänd plats som de flesta i trakten känner igen, inte ditt namn: andra ska förstå
  var repeatern står, inte vem som äger den.
- Hoppa över `å`, `ä` och `ö` om namnet blir för långt{{< naming-ascii >}}.
- Står flera repeatrar på samma plats? Lägg då till de fyra första tecknen av nodens publika
  nyckel (som `-FD70`), så krockar inte namnen. Står den ensam behövs de inte.

## Namnge din companion

En companion namnger du som du vill; namnförslaget ovan gäller bara repeatrar. Namnet syns för
andra när radion skickar en advert, och det behöver inte avslöja vem du är. Samma gräns gäller:
23 byte om positionen ska följa med. En emoji tar fyra byte.

{{< namecheck kind="companion" >}}

## Källor

[^cli]: MeshCore, [CLI-referensen](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md), `set name`, och [AdvertDataHelpers.cpp](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/AdvertDataHelpers.cpp).
[^utf8]: [RFC 3629](https://www.rfc-editor.org/rfc/rfc3629), UTF-8.
