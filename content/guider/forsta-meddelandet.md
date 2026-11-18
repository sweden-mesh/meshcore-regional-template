---
title: "Första meddelandet"
seoTitle: "Ditt första MeshCore-meddelande"
description: "Skicka ditt första meddelande i MeshCore: kontakter, direktmeddelanden och kanaler, kvittenser, var du testar och varför tystnad oftast är normalt."
weight: 22
group: start
date: 2026-11-16
lastmod: 2026-11-18
---

Radion är flashad, appen är ansluten och radioinställningarna stämmer (annars: [Kom igång med en
companion](../companion/)). Nu ska något ut i luften. Den här guiden säger vad som händer när du
skickar, och hur du läser det som kommer tillbaka.

## 1. Skicka en advert

En *advert* är ett kort paket där din radio säger att den finns, med namn och, om du vill,
position. Andra ser dig först när de har hört din advert, och du ser dem först när du har hört
deras. Skicka en från appen. Två sorter finns:

- **Nollhopp** (zero hop): hörs bara av dem som når din radio direkt.
- **Flood**: förs vidare av repeatrarna och når hela nätet. Bra första gången, men skicka den inte
  ofta: varje flood tar sändningstid för alla.

## 2. Kontakter

Noderna som din radio har hört hamnar i appens kontaktlista: repeatrar, room servers och andra
companions. Listan växer av sig själv när fler adverts kommer in. Hörs ingen alls efter en
stund: se [Jag hör inga repeatrar](../../felsokning/hor-inga-repeatrar/).

## 3. Testa i testkanalen

Har regionen repeatrar med [auto-svar]({{< param "firmware.picker" >}}#f=ar&install=update), testa i regionens egen
testkanal {{< testchannel >}}. Annars använder du den vanliga `#test`. Inte i chattkanalerna: där
läser andra, och varje test kostar dem sändningstid.

1. Lägg till kanalen i appen med namnet, inklusive `#`.
2. Skriv `test` i testkanalen och skicka.
3. Vänta. Repeatrar med [auto-svar](../firmware-lou/) svarar med vem som hörde dig och hur
   starkt. Svaren kommer utspridda under några minuter, för att de inte ska krocka med varandra.

Skriv inte `test` igen medan du väntar. En repeater svarar samma avsändare högst en gång på några
minuter, så ett nytt test direkt ger inga fler svar.

{{< channels >}}

## 4. Direktmeddelande eller kanal

Direktmeddelande
: Till en kontakt. Bara mottagaren kan läsa det. När mottagarens radio har tagit emot det skickar
  den en kvittens, och appen visar att meddelandet kom fram. Kommer ingen kvittens försöker appen
  igen, och kan till sist skicka det som flood.

Kanal
: Till alla som har kanalen. Ingen kvittens: du vet inte vem som läste. Appen kan visa att en
  repeater hörde ditt meddelande och sände det vidare, men inte hur långt det kom.

Det första svaret till en ny kontakt tar ofta längre tid. Radion vet inte vägen än, så
meddelandet skickas som flood. När ett svar har kommit fram lär sig radiorna vägen, och nästa
meddelande går direkt längs den.

## 5. När ingen svarar

Tystnad betyder sällan att något är fel. Oftast är det något av det här:

- **Ingen var vaken.** Människor svarar inte i kanalen dygnet runt.
- **Inget auto-svar inom räckhåll.** Bara repeatrar med auto-svar svarar på `test`, och alla
  repeatrar har det inte. Har regionen inga, testa i den vanliga `#test`.
- **Svaret kom inte tillbaka.** Du når kanske en repeater som inte når dig, eller tvärtom: se
  [Jag hör andra, men de hör inte mig](../../felsokning/hor-andra-men-inte-mig/).
- **Du skickade nyss.** Vänta några minuter innan du försöker igen.

Ett uteblivet svar bevisar inte att meddelandet inte kom fram. Det säger bara att inget svar har
kommit tillbaka till dig.

> [!TIP] Säg hej
> När testet fungerar: skriv något i regionens chattkanal och berätta var du finns. Det är så
> man hittar dem som bor nära, och de som vet var nätet behöver fler repeatrar.

## Nästa steg

- [Sändningstid är gemensam](../etikett/): vanor som gör att nätet fungerar för alla
- [Kanaler i MeshCore](../kanaler/): publika, hashtag- och privata kanaler
- [Meddelanden kommer inte fram](../../felsokning/meddelanden-kommer-inte-fram/): när det inte
  fungerar
