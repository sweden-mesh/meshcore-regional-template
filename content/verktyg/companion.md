---
title: "Ställ in en companion"
description: "Värdena att fylla i i MeshCore-appen för en companion i regionen, steg för steg."
weight: 30
---

En companion ställs in i MeshCore-appen, inte via USB-konsolen. Här är värdena för
{{< region "name" >}}, i den ordning appen frågar efter dem. Har du inte flashat radion än, börja
med [Flasha firmware](../../guider/flasha-firmware/) och välj *companion*.

## 1. Anslut appen

Anslut appen till radion via Bluetooth, eller USB för en USB-companion. Har radion en skärm står
PIN-koden där; annars är den ofta `123456`.

## 2. Radioinställningar

Välj förinställningen, eller fyll i värdena för hand:

{{< settings >}}

## 3. Namn

Kort, igenkännbart och utan att avslöja mer än du vill. Under 22 byte får positionen plats i
samma advert.

{{< namecheck >}}

## 4. Position

Frivillig för en companion. Den följer med dig, så en delad position kan visa var du bor. Kartan
på den här sidan visar inte companions.

## 5. Kanaler

Lägg till regionens kanaler med exakt samma namn. För lokala samtal, sätt kanalens region till
`{{< region "scope" >}}`.

{{< channels >}}

## 6. Testa

Skicka en advert från appen och skriv `test` i testkanalen. Repeatrar med auto-svar svarar, och du
ser vilka som hörde dig.
