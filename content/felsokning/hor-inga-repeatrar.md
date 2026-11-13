---
title: "Radion hör inga repeatrar"
description: "Inga grannar, inga adverts, tomt i appen trots att det finns repeatrar i närheten."
category: radio
weight: 10
---

## Troliga orsaker

1. **Fel radioinställningar.** Alla i ett nät måste ha samma frekvens, bandbredd, spreading
   factor och coding rate. En enda avvikelse och radion hör ingenting.
2. **Antennen saknas, sitter löst eller är för fel band.** En 433 MHz-antenn på en 868-radio
   ger nästan ingen räckvidd.
3. **För långt till närmaste repeater**, eller radion står inomhus i källare eller bakom betong.
4. Radion är ny och har inte väntat länge nog: repeatrar skickar adverts med timmars mellanrum.

## Kontrollera

```sh {title="Konsol"}
get radio
get freq
neighbors
```

`get radio` ska ge samma värden som regionens inställningar:

{{< settings >}}

## Åtgärda

1. Ställ in radion enligt rutan ovan (i appen: *Inställningar → Radio*, förinställningen
   för regionen).
2. Skruva fast antennen och kontrollera att den är för 868 MHz.
3. Flytta radion till ett fönster eller högre upp, och skicka en egen advert. Grannar som hör
   den svarar inte direkt, men dina meddelanden börjar komma fram.

## Så vet du att det fungerar

`neighbors` listar minst en repeater, eller appen visar kontakter som kommit in via adverts.
