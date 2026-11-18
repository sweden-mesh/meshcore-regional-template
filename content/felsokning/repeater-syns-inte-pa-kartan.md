---
title: "Repeatern syns inte på kartan"
description: "Är repeatern igång men syns inte på kartan? Oftast har ingen observatör hört dess advert, eller så saknas positionen. Så rättar du det."
category: repeater
weight: 10
date: 2026-11-13
lastmod: 2026-11-16
---

## Troliga orsaker

1. **Ingen observatör har hört dess advert.** Kartan visar det som observatörer rapporterar.
   En repeater syns först när den skickat en advert som en observatör tagit emot.
2. **Positionen saknas.** Utan latitud och longitud finns inget att rita.
3. Repeatern skickar adverts sällan (var 47:e timme som flood är normalt), och den är ny.
4. Den har hörts av en observatör i en annan region, och står därför under den.

## Kontrollera

```sh {title="Konsol"}
get lat
get lon
neighbors
```

## Åtgärda

1. Sätt positionen: `set lat 57.78` och `set lon 14.16` (dina egna värden, med punkt).
2. Skicka en advert direkt: `advert`.
3. Vänta några minuter och ladda om kartan.

Se också [Kartan och observatörer](../../guider/visa-pa-kartan/).

## Så vet du att det fungerar

Repeatern syns på kartan på rätt plats inom några minuter efter `advert`.
