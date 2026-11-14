---
title: "Kommandot region def ger fel"
description: "Repeatern svarar med ett fel eller känner inte igen kommandot."
category: regioner
weight: 10
---

## Troliga orsaker

1. **Firmwaren är äldre än 1.16.** `region def` finns från MeshCore 1.16.
2. **Stavfel i kedjan**: regionerna ska skrivas i ordning från störst till minst, med mellanslag
   emellan, till exempel `region def eu|* europe|eu se {{< region "scope" >}}`.
3. Raden är för lång för appens fält; skriv den i USB-konsolen i stället.

## Kontrollera

```sh {title="Konsol"}
ver
region
```

## Åtgärda

1. Äldre än 1.16: [flasha](../../guider/flasha-firmware/) en ny version med *Uppdatera*.
2. Kopiera kommandot från guiden eller wizarden på den här sidan i stället för att skriva av.

## Så vet du att det fungerar

`region` listar `se` och `{{< region "scope" >}}` under den, och `^` vid länet.
