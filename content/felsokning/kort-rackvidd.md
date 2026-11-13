---
title: "Räckvidden är mycket kortare än väntat"
description: "Några hundra meter i stället för kilometer."
category: radio
weight: 20
---

## Troliga orsaker

1. **Placeringen.** Höjd betyder mest: en antenn på marken eller inomhus når en bråkdel av vad
   den gör på taket.
2. **Antennen**: fel band, dålig kontakt i kontakten, eller en liten medföljande antenn.
3. **Kroppen och omgivningen**: en radio i fickan eller bakom metall tappar mycket.
4. Sändeffekten är låg inställd.

## Kontrollera

```sh {title="Konsol"}
get tx
get radio
```

## Åtgärda

1. Flytta antennen högre och fritt från väggar och metall.
2. Byt till en antenn för 868 MHz med bra kontakt; skruva åt kontakten för hand.
3. Kontrollera sändeffekten med `get tx`. Höj den bara om radion är byggd för det, och aldrig
   över vad bandet tillåter (500 mW ERP på 869,4–869,65 MHz).

## Så vet du att det fungerar

Fler grannar i `neighbors`, och bättre SNR på dem du redan hörde.
