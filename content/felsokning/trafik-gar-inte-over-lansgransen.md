---
title: "Trafiken går inte över länsgränsen"
description: "Meddelanden i länets kanal når inte grannlänet, eller tvärtom."
category: regioner
weight: 30
---

## Troliga orsaker

1. **Det är så det ska vara.** En kanal med länets region förs bara vidare av repeatrar som bär
   länets region. Det håller länets trafik i länet.
2. **Ingen kantrepeater.** För att trafik i grannlänets region ska nå hit behövs en repeater nära
   gränsen som bär båda länens namn.
3. Trafik utan region stoppas: `region allowf` saknas, eller hoppgränsen är låg.

## Kontrollera

```sh {title="Konsol"}
region
get flood.max.unscoped
```

## Åtgärda

- **Nå hela Sverige:** skicka i en kanal med regionen `se`, eller utan region.
- **Bygg en kantrepeater:** välj grannlänet i [regionverktyget](../../guider/regioner/) eller i
  guiden. Repeatern får båda länens namn och för vidare trafik utan region.
- **Trafik utan region:** `region allowf *` och `set flood.max.unscoped 16`, sedan `region save`.

## Så vet du att det fungerar

Ett `test` i grannlänets testkanal får svar från repeatrar på andra sidan gränsen.
