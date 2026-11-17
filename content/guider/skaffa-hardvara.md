---
title: "Skaffa hårdvara"
seoTitle: "Vilken MeshCore-radio ska jag köpa?"
description: "Vilken MeshCore-radio ska du köpa? Färdiga companions, enheter med skärm och GPS, en egen repeater, priser i kronor, butiker och batteritid."
weight: 35
group: start
date: 2026-11-12
lastmod: 2026-11-17
---

MeshCore körs på billiga LoRa-kort. Samma kort kan oftast bli companion eller repeater beroende på
vilken firmware du flashar. Vad en companion och en repeater är förklarar [Vad är
MeshCore?](../vad-ar-meshcore/), och [ordlistan](../ordlista/) de andra orden.

Nedan står tre sätt att börja, från det enklaste. Priserna är vad svenska butiker tog i november
2026, och de ändras. Står inget pris i kronor har vi inte sett modellen i en svensk butik; då står
priset som en europeisk eller utländsk källa angav det. Vi tar inga provisioner och länkar inte
till enskilda annonser.

> [!WARNING] 868 MHz
> Köp alltid utförandet för **868 MHz** (EU). Samma modell säljs för 433 och 915 MHz, och de
> fungerar inte i nätet här. 915 MHz är dessutom inte tillåtet i EU.

## Bara skicka meddelanden

En färdig companion med låda, batteri och antenn. Du flashar MeshCore från webbläsaren och parar
den med appen i telefonen; ingen lödning. Många levereras med Meshtastic och behöver flashas om
först: se [Flasha firmware](../flasha-firmware/#companion).

| Enhet | Det här är den | Pris, november 2026 |
| --- | --- | --- |
| Seeed SenseCAP T1000-E | Kortstor, tät (IP65), med GPS. Den som flest källor rekommenderar som första radio. | 35–50 euro (europeisk prislista) |
| RAK WisMesh Tag | Liten, med GPS. | 667 kr (Pileup) |
| Seeed Wio Tracker L1 Pro | Med skärm, utskriven låda, batteri och antenn. | 725 kr (Limmared) |

Billigast är ett **Heltec V3 eller V4** utan låda, för några hundra kronor: 429 kr för V4 hos
Pileup (annonsen säger inte vilket band). Men då behöver du ordna låda och batteri själv.

## Mer i handen

Enheter med skärm, GPS eller tangentbord. Några kan skicka meddelanden utan telefon.

| Enhet | Det här är den | Pris, november 2026 |
| --- | --- | --- |
| LilyGO T-Deck och T-Deck Plus | Tangentbord och skärm, fungerar utan telefon. Plus har GPS och större batteri. | 65–90 euro, Plus 85–120 euro (europeisk prislista) |
| LilyGO T-Beam | GPS och plats för ett 18650-batteri. | 45–70 euro (europeisk prislista) |
| Heltec Wireless Tracker | Liten, med GPS och skärm. | 451 kr (Pileup; annonsen säger inte vilket band) |
| RAK WisMesh TAP V2 | Pekskärm, fungerar utan telefon. | 1 572 kr (Pileup, 868 MHz) |

En enhet utan telefon behöver en firmware med eget gränssnitt, som inte är samma som en vanlig
companion-firmware. Kontrollera i [webbflashern]({{< param "firmware.flasher" >}}) vad som finns
för just din modell.

## En egen repeater

En repeater för trafiken vidare och gör nätet större. Den står still, högt upp, dygnet runt.

Bygga själv
: Ett **Seeed XIAO nRF52840 med Wio-SX1262** för batteri och sol (kitet kostade 13,49 USD hos
  Seeed), eller ett **Heltec V4** för nätström. Båda finns i
  [firmwareväljaren]({{< param "firmware.picker" >}}). Steg för steg: [Bygg en
  repeater](../bygg-en-repeater/).

Färdig
: Sex färdiga solrepeatrar med panel och batteri i samma låda: {{< prebuilt-solar list >}}.
  Priser den 16 november 2026: **SenseCAP Solar Node P1-Pro** 1 495 kr för Meshtastic-versionen
  (Limmared), som flashas om till MeshCore; MeshCore-versionen cirka 135 euro i EU. **RAK WisMesh
  Repeater Mini** 1 685 kr (Pileup). **Heltec MeshTower V2** 109–129 USD direkt från Heltec, plus
  frakt och moms. **ThinkNode M6** cirka 80 USD hos Elecrow. **RAK WisMesh Repeater med solkit**
  5 077 kr (Pileup). Kontrollera i firmwareväljaren att din modell finns innan du köper, och läs
  [vad de klarar på vintern](../solnoder/#fardiga-solrepeatrar).

Antenn
: En bättre antenn för 868 MHz kostar 130–270 kr hos Pileup. Se [Antenner](../antenner/).

För sol: läs [Solnoder](../solnoder/) innan du köper panel, laddare och batteri. Mycket av det
som säljs som solkit räcker inte för en svensk vinter.

## Var du köper

Pileup och Limmared
: Svenska butiker med LoRa-utrustning: [pileupdx.com](https://www.pileupdx.com/) och
  [butik.limmared.nu](https://butik.limmared.nu/). Svensk moms och svensk reklamationsrätt.

amazon.se
: Har många av korten. Kontrollera bandet i annonsen; står det inte, fråga eller välj en annan.
  Säljaren är ofta en annan än Amazon.

AliExpress
: Ofta billigast, med längre leveranstid. Välj 868 MHz i varianten, och se att bilden och
  beskrivningen säger samma sak. Moms tas ut vid köpet eller vid leveransen, och en retur är
  krångligare än från en svensk butik.

Tillverkarnas egna butiker
: Seeed Studio, RAK, Heltec och LilyGO säljer direkt, ofta med frakt från Asien.

## Hur länge batteriet räcker

Ungefärliga drifttider, utan solpanel. Hur mycket du skickar, skärmen, GPS:en och Bluetooth ändrar
siffrorna mycket.

| Enhet | Drifttid | Underlag |
| --- | --- | --- |
| Companion, T1000-E (700 mAh) | upp till 2 dygn | tillverkarens uppgift, för Meshtastic-firmware |
| Repeater, nRF52 (XIAO, RAK) på 3 000 mAh | cirka 17 dygn | 7,1 mA med officiell MeshCore och strömsparläge ([Solnoder](../solnoder/)) |
| Repeater, ESP32 (Heltec) på 3 000 mAh, utan strömsparläge | cirka 2 dygn | 50 mA eller mer, enligt EasySkyMesh-projektets mätningar |
| Repeater, ESP32 med strömsparläge på 3 000 mAh | 5–12 dygn | 10–25 mA, samma källa; finns inte i alla firmware |

En repeater på ett ESP32-kort hör därför hemma på nätström. Ska den gå på batteri och sol: välj
nRF52.

## Radion

Alla kort har en LoRa-radio. Det som skiljer dem är processorn:

ESP32-kort
: Till exempel Heltec V3/V4 och LilyGO T-Beam. Billiga, ofta med skärm, och med wifi, vilket behövs
  för en **observatör**. Drar mer ström.

nRF52-kort
: Till exempel RAK WisBlock (RAK4631), Seeed XIAO nRF52840 med Wio-SX1262 och färdiga enheter som
  Seeed T1000-E. Mycket strömsnåla, bra för batteri och sol. Inget wifi.

Färdiga enheter
: Med låda och batteri, bra som companion i fickan. Se tabellerna ovan.

> [!TIP] Companion eller repeater?
> För en **companion** räcker nästan vilket kort som helst. För en **repeater** på batteri eller
> sol, välj nRF52; för en repeater som också ska rapportera till kartan, välj ESP32 med wifi.

## Antennen

Antennen och dess placering betyder mer än något annat.

- Köp en antenn **gjord för 868 MHz**. Den lilla antennen som följer med kortet duger för bordet,
  inte för en repeater.
- Placera repeaterns antenn **högt och fritt**, lodrätt och borta från metall.
- Kort kabel mellan radio och antenn; varje meter koaxialkabel äter signal.
- Sätt alltid på antennen innan radion får ström.

Typer, vinst, kontakter och kabel: [Antenner](../antenner/).

## Ström till en repeater

En repeater står på dygnet runt. Med nätström är det enkelt. Med **sol och batteri** måste
batteriet räcka genom de mörkaste veckorna i december, när panelen ger en bråkdel av sommarens
energi. Räkna med:

- ett nRF52-kort, som drar lite;
- ett batteri som klarar flera dygn utan sol;
- en panel som är överdimensionerad för sommaren, så att den räcker på vintern;
- en laddregulator som tål kyla, och ett batteri som får laddas i minusgrader (LiFePO4 behöver
  skydd).

## Låda och montering

En repeater utomhus behöver en tät låda (IP65 eller bättre), kabelgenomföringar som tätar och
fäste som tål vind. Låt ett litet dräneringshål vara öppet i botten så att kondens kan rinna ut.

## Nästa steg

- [Flasha firmware](../flasha-firmware/) på kortet.
- [Kom igång med en companion](../companion/), sedan [Första meddelandet](../forsta-meddelandet/).
- [Bygg en repeater](../bygg-en-repeater/) och [Sätt upp en repeater](../repeater/).

När radion är igång: [Räckvidden är mycket kortare än väntat](../../felsokning/kort-rackvidd/) och [Batteriet tar slut fort](../../felsokning/batteriet-tar-slut/).
