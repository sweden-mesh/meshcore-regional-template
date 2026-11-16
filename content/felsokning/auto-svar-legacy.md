---
title: "Auto-svaret svarar inte i länets testkanal"
seoTitle: "Auto-svaret svarar inte i testkanalen"
description: "Svarar auto-svaret i en äldre testkanal i stället för länets? Oftast är firmwaren äldre än lou-16 eller region home inte sparad. Så rättar du det."
category: regioner
weight: 40
date: 2026-11-13
lastmod: 2026-11-16
---

Gäller repeatrar med auto-svar (firmwaren *lou*). Auto-svaret tar länet från `region home` och
svarar i `#test-<län>`. Saknas länet svarar det {{< legacy-test >}}.

## Troliga orsaker

1. **Firmwaren är äldre än lou-16.** Äldre versioner tittar bara på `region default`, och med
   `se` där blir det den äldre kanalen.
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
