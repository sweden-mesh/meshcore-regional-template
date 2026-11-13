---
title: "Hemregionen är borta efter en omstart"
description: "region home var satt, men efter en omstart svarar repeatern home is *."
category: regioner
weight: 20
---

## Troliga orsaker

**`region save` kördes inte.** `region home` ändras bara i minnet. `region default` sparar sig
själv, men hemregionen, regionkedjan och `region allowf` sparas först med `region save`.

## Åtgärda

```sh {title="Konsol"}
region home {{< region "scope" >}}
region save
```

## Så vet du att det fungerar

Efter en omstart (`reboot`) svarar `region home` med `home is {{< region "scope" >}}`.
