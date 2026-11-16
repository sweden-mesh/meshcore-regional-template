---
title: "Etikett: sändningstid är gemensam"
description: "Alla delar på samma radiofrekvens. Enkla vanor som gör att nätet fungerar för alla: var du testar, adverts med måtta och regionen för lokala samtal."
weight: 90
group: regioner
date: 2026-11-12
lastmod: 2026-11-16
---

LoRa-nätet är en gemensam resurs. Bara en radio i taget kan sända på frekvensen inom hörhåll,
och varje meddelande som floodas sänds om av varje repeater som hör det. Ett enda meddelande
kan därför ta flera sekunders sändningstid över hela nätet.

## Vanor som hjälper

**Testa i testkanalen.** Ett `test` i en chattkanal stör alla som läser den. Testa i regionens
testkanal {{< testchannel >}}, där repeatrar med auto-svar svarar, eller i den allmänna `#test`.

**Testa sparsamt.** Ett test räcker oftast. Vänta på svaren (de kommer med fördröjning, ibland
flera minuter) innan du skickar nästa.

**Använd regionen.** Skicka lokala samtal med regionen `{{< region "scope" >}}`, så stannar
trafiken i {{< region "name" >}} i stället för att floodas över grannlänen. Se
[Regioner](../regioner/).

**Skicka adverts med måtta.** Noden skickar själv adverts med jämna mellanrum. Att skicka extra
behövs bara när något ändrats, som namn eller position.

**Inga automatiska utskick.** Botar, bevakningar och scripts som skickar ofta äter sändningstid
dygnet runt. Prata med gemenskapen innan du sätter upp något sådant.

**Håll repeatrar stilla.** En repeater som flyttar runt förvirrar nätets vägar. Mobila noder ska
vara companions.

## Det du skriver är offentligt

Public och hashtag-kanalerna kan alla läsa, och observatörer kan spela in dem. Skriv inget där
som du inte vill ska vara känt, och dela inte andras uppgifter. Se [Kanaler](../kanaler/).

Slutar radion sända en stund? Då har den nått sändtidsgränsen: se [Radion slutar sända en stund](../../felsokning/duty-cycle/).
