---
title: "Repeaterns adverts når inte ut i regionen"
description: "Grannarna känner till repeatern, men längre bort vet ingen att den finns."
category: repeater
weight: 20
---

## Troliga orsaker

1. **Bara adverts utan hopp skickas.** Den automatiska adverten till grannar går bara ett hopp.
   Adverten som sprids i hela nätet (flood) går mer sällan.
2. **Standardregionen är fel.** Repeaterns egna adverts märks med standardregionen. Repeatrar
   som inte bär den regionen för inte vidare.
3. Gränsen för antal hopp (`flood.max`) är låg.

## Kontrollera

```sh {title="Konsol"}
get flood.advert.interval
region default
get flood.max
```

## Åtgärda

```sh {title="Konsol"}
set flood.advert.interval 47
region default se
region save
```

Vill du inte vänta: `advert` skickar en direkt.

## Så vet du att det fungerar

Repeatern dyker upp hos kontakter längre bort och på kartan inom en timme efter `advert`.
