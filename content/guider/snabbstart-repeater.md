---
title: "En enkel repeater i fönstret"
seoTitle: "Snabbstart: en MeshCore-repeater i fönstret"
description: "Ett kort på USB-ström i ett högt fönster: repeater-firmware, länets inställningar med guiden, en advert och en koll av grannarna."
weight: 3
group: snabbstart
date: 2026-11-18
lastmod: 2026-11-22
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

En repeater för andras meddelanden vidare. En i ett fönster högt upp hjälper redan alla omkring
dig, och den behöver bara en USB-laddare. Du behöver också en companion för att kolla resultatet
(se [Från noll till companion i handen](../snabbstart-companion/)).

## 1. Radio och plats

Ett kort som står inne och får ström från en USB-laddare räcker, till exempel:

- **Heltec WiFi LoRa 32 V4**: 429 kr hos Pileup i november 2026. Den sänder starkt: med
  `set tx 10` blir det cirka 22 dBm ut, med `set tx 22` cirka 28 dBm, och fel inställning kan
  skada radion (steg 3).
- **Seeed XIAO nRF52840 & Wio-SX1262 Kit**: litet och strömsnålt, antenn ingår.

Ställ den i det **högsta fönstret** du har, med fri sikt åt det håll nätet finns, **antennen
lodrätt** och en bit från metall och elektronik. Skruva i antennen innan radion får ström.

Läs mer: [Välj en repeater](../skaffa-hardvara/repeater/).

## 2. Flasha repeater-firmware

1. Öppna [MeshCores webbflasher]({{< param "firmware.flasher" >}}) i Chrome eller Edge.
2. Välj modellen och **Repeater**.
3. Anslut med USB och följ stegen.

Läs mer: [Flasha firmware](../flasha-firmware/).

## 3. Ställ in den med guiden

[Snabbkonfiguration av repeater](/wizard/repeater-snabb/) skickar alla inställningar till radion
via USB, från samma webbläsare: radiovärdena, väg-id på 3 byte, länets regioner, namn, position, nytt
administratörslösenord och duty cycle. Du väljer plats och namn. Ge repeatern ett namn efter
länets mönster:

{{< naming >}}

Sist skickar guiden en **advert**, så att nätet får veta att repeatern finns. Sändeffekten ställer
guiden inte in. Har du en Heltec V4, skicka `set tx 10` i [USB-konsolen](../usb-konsol/) innan du
kopplar ur kabeln.

Läs mer: [Sätt upp en repeater](../repeater/), med varje kommando förklarat.

## 4. Låt nätet höra den

Sätt radion i fönstret med laddaren. Repeatern skickar själv en flood-advert bara med många
timmars mellanrum, så hjälp den på traven från telefonen:

1. Skicka en **flood-advert** från din companion i appen, så att repeatern och andra hör dig.
2. När repeatern syns bland kontakterna i appen: välj den och **logga in** med
   administratörslösenordet du valde.
3. Skriv `advert` i repeaterns kommandorad i appen. Repeatern skickar då en flood-advert, som förs vidare av
   repeatrarna omkring.

Läs mer: [Administrera repeatern från appen](../fjarradministration/).

## 5. Har den grannar?

Fortfarande inloggad på repeatern: skriv `neighbors`. Svaret listar de repeatrar den har hört
direkt, en per rad: början av nyckeln, hur många sekunder sedan och signal-brusförhållandet
(SNR). Står listan tom efter en halvtimme når den ingen: prova ett annat fönster, högre upp.

Har en observatör hört repeatern syns den på kartan på [startsidan](/) inom en stund, med linjer
till grannarna. Testa till sist med `test` i länets testkanal {{< testchannel >}} och se om din
repeater är bland dem som hörde dig.

Läs mer: [Repeatern syns inte på kartan](../../felsokning/repeater-syns-inte-pa-kartan/).

## Nästa steg

- [Kartan och observatörer](../visa-pa-kartan/): gör den till observatör, så rapporterar den vad
  den hör till kartan.
- [Solnoder](../solnoder/): när den ska ut, utan nätström.
