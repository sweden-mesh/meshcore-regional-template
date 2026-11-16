---
title: "Hemregionen är borta efter en omstart"
description: "Är region home borta efter en omstart? Hemregionen sparas bara med region save. Så sätter du den igen och ser till att den finns kvar."
category: regioner
weight: 20
date: 2026-11-13
lastmod: 2026-11-16
---

## Troliga orsaker

**`region save` kördes inte.** `region home` ändras bara i minnet. `region default` sparar sig
själv, men hemregionen, regionkedjan och `region allowf` sparas först med `region save`.

## Kontrollera

```sh {title="Konsol"}
region home
```

Svarar repeatern `home is *` finns ingen hemregion.

## Åtgärda

```sh {title="Konsol"}
region home {{< region "scope" >}}
region save
```

Repeatern svarar `home is now {{< region "scope" >}}` på det första kommandot och `OK` på det andra.

## Så vet du att det fungerar

Efter en omstart (`reboot`) svarar `region home` med `home is {{< region "scope" >}}`.

## Fungerade inte?

- **`Err - unknown region`:** regionen finns inte i repeaterns regionkedja. Lägg in den med
  `region def` först, se [Regioner](../../guider/regioner/) och
  [Kommandot region def ger fel](../region-def-fungerar-inte/).
- **`Err - save failed`:** sparningen misslyckades. Starta om repeatern, kör kommandona igen och
  kontrollera med `region home` efter omstarten.
