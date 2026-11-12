---
title: "Skaffa hårdvara"
description: "Vilken radio, antenn och strömförsörjning du behöver för en companion eller en repeater, och vad du ska tänka på."
weight: 35
---

MeshCore körs på billiga LoRa-kort. Samma kort kan oftast bli companion eller repeater beroende på
vilken firmware du flashar. Den här sidan säger vad som spelar roll; vilka exakta modeller som
stöds står i [firmwareväljaren]({{< param "firmware.picker" >}}).

## Radion

Alla kort har en LoRa-radio för **868 MHz-bandet** (EU). Köp en variant för 868 MHz, inte 433 eller
915 MHz.

ESP32-kort
: Till exempel Heltec V3/V4 och LilyGO T-Beam. Billiga, ofta med skärm, och med wifi, vilket behövs
  för en **observatör**. Drar mer ström.

nRF52-kort
: Till exempel RAK WisBlock (RAK4631), Seeed XIAO nRF52840 med Wio-SX1262 och färdiga enheter som
  Seeed T1000-E. Mycket strömsnåla, bra för batteri och sol. Inget wifi.

Färdiga enheter
: Med låda och batteri, bra som companion i fickan. Kolla att firmwareväljaren har dem.

> [!TIP] Companion eller repeater?
> För en **companion** räcker nästan vilket kort som helst. För en **repeater** på batteri eller
> sol, välj nRF52; för en repeater som också ska rapportera till kartan, välj ESP32 med wifi.

## Antennen

Antennen och dess placering betyder mer än något annat.

- Köp en antenn **avstämd för 868 MHz**. Den lilla antennen som följer med kortet duger för bordet,
  inte för en repeater.
- Placera repeaterns antenn **högt och fritt**, lodrätt och borta från metall.
- Kort kabel mellan radio och antenn; varje meter koaxialkabel äter signal.
- Sätt alltid på antennen innan radion får ström.

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
- [Kom igång med en companion](../companion/) eller [Sätt upp en repeater](../repeater/).
