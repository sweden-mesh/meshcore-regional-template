---
title: "Auto-svaret svarar i #test-<iata> i stället för länets testkanal"
description: "get autoreply visar legacy #test-… och inte länets kanal."
category: regioner
weight: 40
---

Gäller repeatrar med auto-svar (firmwaren *lou*). Auto-svaret tar länet från `region home` och
svarar i `#test-<län>`. Saknas länet svarar det i den gamla kanalen `#test-<iata>`.

## Troliga orsaker

1. **Firmwaren är äldre än lou-16.** Äldre versioner tittar bara på `region default`, och med
   `se` där blir det den gamla kanalen.
2. **`region home` är inte satt**, eller sparades inte (`region save`).

## Kontrollera

```sh {title="Konsol"}
ver
region home
get autoreply
```

## Åtgärda

1. Äldre än lou-16: [flasha](../../guider/flasha-firmware/) den senaste versionen med
   *Uppdatera*. Inställningarna finns kvar.
2. `home is *`: `region home {{< region "scope" >}}` och `region save`.

## Så vet du att det fungerar

`get autoreply` visar `#test-{{< region "scope" >}} (region home)`.
