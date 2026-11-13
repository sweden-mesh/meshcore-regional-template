---
title: "Namnge din nod"
description: "Ett bra namn talar om var noden står. Så väljer du namn, och regionens namnförslag."
weight: 70
source:
  title: "Vad är MeshCore? (avsnittet Namnge din enhet)"
  url: "https://meshat.se/meshcore/meshcore-info/#namnge-din-enhet"
  license: "CC BY 4.0"
  changes: "Egen guide; regionens namnförslag från sidans parametrar; namnlängden räknas av ett eget verktyg."
---

Namnet syns för alla när din nod skickar en *advert*. För en repeater är namnet det andra ser i
sina listor och på kartan, så det ska tala om **var den står**.

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
- En companion behöver inget platsnamn; ett kort namn räcker, och det behöver inte avslöja vem
  du är.
