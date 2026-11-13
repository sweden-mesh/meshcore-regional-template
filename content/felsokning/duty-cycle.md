---
title: "Radion slutar sända en stund"
description: "Allt fungerar, sedan kommer inget ut på ett tag, sedan fungerar det igen."
category: radio
weight: 40
---

## Troliga orsaker

1. **Sändtidsgränsen (duty cycle) är nådd.** I 868 MHz-bandet får en radio bara sända en viss
   andel av tiden. MeshCore håller räkningen och väntar när gränsen nås.
2. Många meddelanden, adverts eller en repeater i ett tätt nät som för vidare mycket.

## Kontrollera

```sh {title="Konsol"}
get dutycycle
get af
```

## Åtgärda

Skicka färre och kortare meddelanden, och låt adverts gå med standardintervallet. Höj inte
gränsen: den finns för att alla ska få plats i bandet.

## Så vet du att det fungerar

Radion sänder igen efter en stund, utan att du gör något.
