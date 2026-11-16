---
title: "Skärmen, knapparna eller radion fungerar inte efter flashningen"
seoTitle: "Skärm eller radio död efter flashning"
description: "Radion startar, men skärmen är svart, en knapp gör inget eller noden hör ingenting."
category: flasha
weight: 50
date: 2026-11-13
lastmod: 2026-11-16
---

## Troliga orsaker

1. **Firmware för en annan modell eller hårdvaruversion.** Två kort kan se lika ut men ha
   skärmen, radiochipet eller knapparna kopplade till olika stift. Olika versioner av samma
   Heltec- eller LilyGO-kort är vanliga förväxlingar.

## Kontrollera

```sh {title="Konsol"}
ver
board
```

`ver` svarar med versionen och byggdatumet, och `board` med namnet på kortet som firmwaren är
byggd för. Jämför det, och modellen i filnamnet, med vad som står på kortet eller på kartongen.
Svarar radion inte alls i konsolen, gå direkt till *Fungerade inte?* nedan.

## Åtgärda

Ta reda på exakt modell och version, välj den i
[firmwareväljaren]({{< param "firmware.picker" >}}) och flasha igen med *Uppdatera*.

## Så vet du att det fungerar

Skärmen tänds, knapparna svarar och noden hör grannarna inom några minuter.

## Fungerade inte?

- **Radion startar om hela tiden:** se [Radion startar om hela tiden efter flashningen](../startar-om-efter-flashning/).
- **Inget händer alls, skärmen är svart:** se [Flashningen avbröts, och radion verkar död](../flashningen-avbrots/).
- **Noden fungerar men hör ingen:** se [Radion hör inga repeatrar](../hor-inga-repeatrar/).
