---
title: "Skärmen, knapparna eller radion fungerar inte efter flashningen"
description: "Radion startar, men skärmen är svart, en knapp gör inget eller noden hör ingenting."
category: flasha
weight: 50
---

## Troliga orsaker

1. **Firmware för en annan modell eller hårdvaruversion.** Två kort kan se lika ut men ha
   skärmen, radiochipet eller knapparna kopplade till olika stift. Olika versioner av samma
   Heltec- eller LilyGO-kort är vanliga förväxlingar.

## Kontrollera

```sh {title="Konsol"}
ver
```

Jämför modellen i filnamnet med vad som står på kortet eller på kartongen.

## Åtgärda

Ta reda på exakt modell och version, välj den i
[firmwareväljaren]({{< param "firmware.picker" >}}) och flasha igen med *Uppdatera*.

## Så vet du att det fungerar

Skärmen tänds, knapparna svarar och noden hör grannarna inom några minuter.
