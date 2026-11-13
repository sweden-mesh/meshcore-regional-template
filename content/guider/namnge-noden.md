---
title: "Namnge din repeater"
description: "Regionens namnförslag för repeatrar, hur långt ett namn får vara, och hur du namnger en companion."
weight: 70
source:
  title: "Vad är MeshCore? (avsnittet Namnge din enhet)"
  url: "https://meshat.se/meshcore/meshcore-info/#namnge-din-enhet"
  license: "CC BY 4.0"
  changes: "Egen guide; regionens namnförslag från sidans parametrar; namnlängden räknas av ett eget verktyg."
---

En repeaters namn syns för alla i listor och på kartan, så det ska tala om **var den står**.

{{< naming >}}

## Längd

Namnet räknas i byte, inte tecken: `å`, `ä` och `ö` tar två byte var. Håll namnet inom
**22 byte**, så får positionen plats i samma advert. Upp till 31 byte går, men då skickas namnet
utan position.

{{< namecheck >}}

## Tips

- Använd platsen, inte ditt namn: andra ska förstå var repeatern står, inte vem som äger den.
- Hoppa över `å`, `ä` och `ö` om namnet blir för långt (`Braneryd` i stället för `Bråneryd`).
- Fyra tecken av nodens nyckel på slutet (som `FD70`) gör namnet unikt även om två noder står
  på samma plats. De syns som nodens kortnamn på kartan.

## Namnge din companion

En companion namnger du som du vill; namnförslaget ovan gäller bara repeatrar. Namnet syns för
andra när radion skickar en advert, och det behöver inte avslöja vem du är. Samma gräns gäller:
22 byte om positionen ska följa med. En emoji tar fyra byte.

{{< namecheck kind="companion" >}}
