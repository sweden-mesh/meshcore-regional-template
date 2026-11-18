---
title: "Antenner"
seoTitle: "Antenner för MeshCore på 868 MHz"
description: "Antenner för MeshCore på 868 MHz: vad som spelar roll, modeller med vinst och kontakt, typer, vad dBi betyder, kontakter, kabelförluster och var antennen ska sitta."
url: /guider/skaffa-hardvara/antenn/
weight: 17
group: start
cardSkip: true
aliases: ["/guider/antenner/"]
date: 2026-11-18
lastmod: 2026-11-18
---

Antennen och var den sitter betyder mer för en repeater än kortet. Den lilla antennen som följer
med kortet duger på bordet, inte på en mast. Hur antenner fungerar, vad vinsten betyder och hur du
räknar på kabel står längre ned.

## Det här spelar roll, i den ordningen

1. **Höjd och fri sikt.** En antenn högt upp med fri sikt mot dem den ska nå gör mer än en med
   högre vinst lägre ned. Mellan två antenner behöver inte bara linjen vara fri, utan ett område
   runt den (Fresnelzonen) [^fresnel]. Se [Placering](#placering).
2. **Rätt band.** Antennen ska vara gjord för 868 MHz, eller ett band som täcker 863–870 MHz.
3. **Kontakt och kabel.** Kontakten ska passa radion (oftast SMA), och kabeln ska vara kort:
   tunn kabel som RG58 förlorar många gånger mer än grov lågförlustkabel som LMR-400
   [^rg58] [^lmr400]. Se [Kabel](#kabel).
4. **Tålighet.** En antenn utomhus ska vara gjord för det, och kontakten ska tätas mot väta.

{{< hw "antenna" >}}

> [!CAUTION] Antennen först
> Skruva fast antennen innan radion får ström. En LoRa-radio som sänder utan antenn kan gå sönder.

## Gjord för 868 MHz

En antenn fungerar bara bra på det band den är byggd för. Köp en som säger **868 MHz** (eller
ett band som täcker 863–870 MHz). En antenn för 915 MHz eller 433 MHz kan se likadan ut, men
skickar ut mindre av effekten och tar emot sämre.

## Typer

Pinnantenn (whip)
: Den lilla antennen som följer med kortet. Duger på bordet och i fickan, inte för en repeater.

Dipol och kvartsvåg med jordplan
: Enkla och förutsägbara, runt 2 dBi. Bra på en companion vid fönstret, och lätta att bygga
  själv om du vill.

Kollinjär (rundstrålande med vinst)
: Flera element staplade i en lång antenn, ofta 3–6 dBi. Den vanliga repeaterantennen utomhus.

Riktantenn (Yagi, panel)
: Hög vinst åt ett håll. För en länk mellan två repeatrar som inte hör varandra annars, inte för
  att täcka ett område.

## Vad vinsten betyder

En antenn skapar ingen effekt. Vinsten i dBi säger hur mycket den samlar strålningen åt vissa håll
i stället för åt alla. En rundstrålande antenn med hög vinst har en platt strålningslob: den når
längre mot horisonten, men sämre rakt ned och rakt upp.

- **På en hög mast eller ett berg** kan en antenn med hög vinst skjuta över dem som bor i
  dalen nedanför. 3–5 dBi är ofta ett bättre val där än 8–10 dBi.
- **På platt mark** med lång sikt mot horisonten gör högre vinst mest nytta.
- **Effektgränsen räknas med vinsten.** Högst 500 mW ERP gäller sändaren plus antennen. Med en
  antenn på 6 dBi och en radio på 22 dBm är du inom gränsen; med ett kort som ger mer än 22 dBm
  behöver du räkna, se [MeshCore-inställningar i Sverige](../../radioinstallningar/#sändeffekt-och-antenn).

Vinsten hjälper lika mycket åt båda hållen: den som hör dig bättre hörs också bättre av dig.

## Kontakter

SMA
: Den vanligaste kontakten på LoRa-kort och antenner för 868 MHz.

RP-SMA
: Ser nästan likadan ut som SMA, men med stiftet åt andra hållet. Vanlig på wifi-utrustning.
  En RP-SMA-antenn på en SMA-kontakt får ingen kontakt i mitten och fungerar knappt alls,
  fast den sitter fast. Kontrollera båda innan du köper.

U.FL (IPEX)
: En liten snäppkontakt direkt på kretskortet. Tål bara ett fåtal i- och urkopplingar. Använd
  en kort övergångskabel till en SMA-kontakt i lådans vägg och låt den sitta.

N-kontakt
: Stor och vädertålig, för grov kabel och antenner utomhus.

## Kabel

All koaxialkabel äter signal, och mer ju tunnare den är. Ungefärliga förluster vid 868 MHz,
enligt typiska datablad:

| Kabel | Förlust per meter |
| --- | --- |
| RG174 (tunn, ofta på övergångskablar) | cirka 1 dB |
| RG58 | cirka 0,5 dB |
| LMR-400 och liknande grov lågförlustkabel | cirka 0,13 dB |

Tre decibel är halva effekten. Fem meter RG58 tar alltså nästan lika mycket som en antenn på
3 dBi ger. Håll kabeln kort, eller sätt radion uppe vid antennen och dra ström i stället för
antennkabel. Tätningen i kontakter utomhus är lika viktig: vatten i kabeln ökar förlusten med
tiden.

## Placering

- **Höjd före allt.** Över hustak och trädtoppar, med fri sikt åt de håll nätet finns.
- **Lodrätt.** Alla i nätet använder lodrät polarisation; en vågrät antenn tappar mycket mot dem.
- **Fri från metall.** En halvmeter från stolpar, plåttak och andra antenner, om du kan.
- **Åska.** En antenn högst upp på en mast ska jordas som annan utomhusantenn.

Inomhus: vid ett fönster åt rätt håll, så högt som möjligt. Moderna energifönster med metallskikt
dämpar mycket; prova ett annat fönster eller en antenn utanför.

{{< hw-credits >}}

## Nästa steg

- [Bygg en repeater](../../bygg-en-repeater/): två byggen, med antenn, låda och ström.
- [Sätt upp en repeater](../../repeater/).
- [Räckvidden är mycket kortare än väntat](../../../felsokning/kort-rackvidd/): felsök räckvidden.

## Källor

[^fresnel]: Omni Calculator, [Fresnel zone calculator](https://www.omnicalculator.com/physics/fresnel-zone).
[^rg58]: Pro-Tecs, [datablad för RG58](https://shop.pro-tecs.de/pub/media/datasheets/79037803-6FB1-4875-974D-2A8F0989469A.pdf): 51–55 dB per 100 m.
[^lmr400]: Fairview Microwave, [datablad för LMR-400](https://www.fairviewmicrowave.com/images/productPDF/LMR-400.pdf): 3,9 dB per 100 fot.
