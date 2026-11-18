---
title: "Skriv ditt första meddelande"
seoTitle: "Snabbstart: ditt första MeshCore-meddelande"
description: "Se om det finns nät där du är, skicka en advert och skriv test i länets testkanal. Och vad du gör när ingen svarar."
weight: 2
group: snabbstart
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

Radion är flashad och ansluten till appen (annars: [Från noll till companion i
handen](../snabbstart-companion/)). Så här får du ut något i luften och ser att det kom fram.

## 1. Finns det nät där du är?

Titta på kartan på [startsidan](/). Ser du repeatrar några kilometer bort, och helst med fri sikt
dit, har du goda chanser. Står ingen i närheten hör du kanske inget inomhus: gå ut, eller upp en
våning.

Var nätet faktiskt når mäts av folk som rör sig med appen MeshMapper. Mätningarna finns på
[MeshMapper](https://swe.meshmapper.net/).

Läs mer: [Kolla platsen med MeshMapper](../kolla-platsen/).

## 2. Skicka en flood-advert

En *advert* säger att din radio finns. Skicka en **flood-advert** från appen, så att repeatrarna
för den vidare och andra ser dig. Gör det första gången, och när du byter namn; inte ofta, för
varje flood tar sändningstid för alla.

Efter en stund fylls kontaktlistan med de repeatrar och radior du hör.

## 3. Skriv test i testkanalen

1. Lägg till länets testkanal {{< testchannel >}} i appen, med `#` först i namnet.
2. Skriv `test` och skicka.
3. Vänta några minuter. Repeatrar med auto-svar svarar med vem som hörde dig och hur starkt.
   Svaren sprids ut i tid för att inte krocka.

Skriv inte `test` igen medan du väntar: en repeater svarar samma avsändare högst en gång på några
minuter. Har länet inga repeatrar med auto-svar, testa i den vanliga `#test`.

Testa aldrig i Public eller länets chattkanal. Där läser andra, och ett test avbryter samtalet.

## 4. Läs svaret

Ett svar från en repeater betyder att den hörde dig, direkt eller via andra repeatrar. Svarar flera,
når du långt. Skriv sedan ett riktigt meddelande: i en kanal, eller direkt till en kontakt. Ett
direktmeddelande får en kvittens när det kommit fram; en kanal får ingen.

Läs mer: [Första meddelandet](../forsta-meddelandet/), om kontakter, kvittenser och vägar.

## Om ingen svarar

Det betyder sällan att något är fel. Gå igenom i tur och ordning:

1. Samma radioinställningar som i {{< region "name" >}}, och antennen sitter i.
2. Du har skickat en flood-advert.
3. Det finns en repeater inom räckhåll; prova utomhus eller högre upp.

Läs mer: [Jag hör inga repeatrar](../../felsokning/hor-inga-repeatrar/) och [Meddelanden kommer
inte fram](../../felsokning/meddelanden-kommer-inte-fram/).

## Nästa steg

Vill du göra nätet större där du bor: [En enkel repeater i fönstret](../snabbstart-repeater/).
