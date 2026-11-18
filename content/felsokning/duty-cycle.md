---
title: "Radion slutar sända en stund"
description: "Allt fungerar, sedan kommer inget ut på ett tag, sedan fungerar det igen."
category: radio
weight: 40
date: 2026-11-13
lastmod: 2026-11-18
---

## Troliga orsaker

1. **Sändtidsgränsen (duty cycle) är nådd.** I 868 MHz-bandet får en radio bara sända en viss
   andel av tiden: på 869,4–869,65 MHz högst 10 procent, om den inte använder LBT-teknik
   ([PTSFS 2025:1](https://pts.se/contentassets/b05c8a7d01a64783aafc6a19e1b78590/ptsfs-2025-1-foreskrifter-om-undantag-fran-tillstandsplikt-for-anvandning-av-vissa-radiosandare.pdf) § 146). MeshCore håller räkningen och väntar när gränsen nås.
2. Många meddelanden, adverts eller en repeater i ett tätt nät som för vidare mycket.

## Kontrollera

```sh {title="Konsol"}
get dutycycle
get af
```

`get dutycycle` visar gränsen i procent, till exempel `> 10.0%` på en repeater som ställts in
enligt [guiden](../../guider/repeater/) (`set dutycycle 10`). `get af` visar samma gräns som en
faktor (*airtime factor*): 9 betyder 10 procent, eftersom gränsen är 100 / (af + 1) procent.

## Åtgärda

Skicka färre och kortare meddelanden, och låt adverts gå med standardintervallet. Höj inte
gränsen: den finns för att alla ska få plats i bandet.

## Så vet du att det fungerar

Radion sänder igen efter en stund, utan att du gör något.

## Fungerade inte?

- **Radion sänder inte alls, inte ens efter en kvart:** då är det inte sändtidsgränsen. Se
  [Jag hör andra, men de hör inte mig](../hor-andra-men-inte-mig/).
- **Bara långt bort når den inte:** se [Räckvidden är mycket kortare än väntat](../kort-rackvidd/).
