---
title: "Ordlista"
seoTitle: "Ordlista för MeshCore"
description: "Ordlista för MeshCore på svenska: advert, flood, region, duty cycle, ERP, SF, BW, CR, IATA, observatör och fler ord som guiderna använder, kort förklarade."
weight: 110
group: start
date: 2026-11-13
lastmod: 2026-11-18
---
Vanliga frågor finns under [Frågor](../../fragor/). Ord som har en egen guide länkar dit.

## Advert {#advert}

Ett kort paket där en nod talar om att den finns, med namn, typ och ibland position. En *zero-hop advert* hörs bara av dem som når noden direkt; en *flood advert* förs vidare av repeatrarna. Se [Första meddelandet](../forsta-meddelandet/).

## Auto-svar {#auto-svar}

Repeatrar med [specialfirmware lou](../firmware-lou/) svarar på `test` i länets testkanal, så att du ser vilka som hörde dig.

## Bootloader och DFU {#bootloader}

Det lilla programmet som startar radion och tar emot ny firmware. *DFU-läge* (bootloader-läge) är när radion väntar på en ny firmware. Se [Välj och flasha firmware](../flasha-firmware/).

## BW (bandbredd) {#bw}

Hur brett frekvensband en sändning tar, i kHz. Alla i nätet måste ha samma. Se [MeshCore-inställningar i Sverige](../radioinstallningar/).

## Companion {#companion}

Din personliga radio, som du använder med appen. För inte vidare andras trafik. Se [Kom igång med en companion](../companion/).

## CR (kodningshastighet) {#cr}

Hur mycket felrättning varje sändning har med sig, skrivet som 5 till 8. Firmwarens standard är 5, nätets är {{< param "radio.cr" >}}. Se [MeshCore-inställningar i Sverige](../radioinstallningar/#fällor-i-standardvärdena).

## dBi och dBd {#dbi}

Antennens vinst, jämfört med en tänkt antenn som strålar lika åt alla håll (dBi) eller med en halvvågsdipol (dBd). dBd = dBi − 2,15. Se [Antenner](../skaffa-hardvara/antenn/).

## Direkt (direct) {#direkt}

Ett paket som går längs en känd väg, i stället för att floodas. Se [Vad är MeshCore?](../vad-ar-meshcore/#så-tar-sig-ett-meddelande-fram).

## Duty cycle {#duty-cycle}

Hur stor del av tiden en sändare får sända: högst 10 procent på 869,4–869,65 MHz för en radio utan LBT. Se [MeshCore-inställningar i Sverige](../radioinstallningar/#duty-cycle).

## ERP {#erp}

Effektiv utstrålad effekt: radions effekt minus kabelförlusten plus antennens vinst, räknat mot en dipol. Gränsen är 500 mW ERP. Se [Sändeffekt och antenn](../radioinstallningar/#sändeffekt-och-antenn).

## Firmware {#firmware}

Programvaran i radion. *Flasha* betyder att installera den.

## Flood {#flood}

Ett paket som varje repeater sänder vidare en gång, tills det nått så långt det kan. Kanalmeddelanden floodas alltid.

## Förinställning (preset) {#forinstallning}

En namngiven uppsättning radiovärden i appen. Nätet här använder *{{< param "radio.preset" >}}*.

## Fresnelzon {#fresnelzon}

Området runt siktlinjen mellan två antenner som också ska vara fritt från hinder. Se [Fri sikt är mer än en linje](../skaffa-hardvara/antenn/#fri-sikt-är-mer-än-en-linje).

## Hashtag-kanal {#hashtag-kanal}

En kanal vars namn börjar med `#`. Nyckeln räknas fram ur namnet, så alla som vet namnet kan läsa. Se [Kanaler](../kanaler/).

## Hemregion {#hemregion}

Den region en repeater räknar som sin egen (`region home`). Den styr inte vidarebefordran. Se [Regioner](../regioner/).

## Hopp {#hopp}

En sändning från en nod till nästa. Ett paket kan gå upp till 64 hopp.

## IATA-kod {#iata}

En kod med tre bokstäver som en observatör sätter på det den rapporterar, så att kartan vet vilket område det gäller. Inte samma sak som regionen. Se [IATA-koden för ditt län](../visa-pa-kartan/#iata-koden-för-ditt-län).

## Kanal {#kanal}

Ett gemensamt rum: alla som har kanalens nyckel kan läsa och skriva där. Se [Kanaler](../kanaler/).

## LBT {#lbt}

*Listen before talk*: radion lyssnar innan den sänder. Med LBT tillåter reglerna mer än 10 procent av tiden; MeshCore räknar med 10 procent.

## LoRa {#lora}

Radiotekniken: lång räckvidd, låg datahastighet, låg strömförbrukning.

## MQTT {#mqtt}

Ett sätt att skicka meddelanden till en server över internet. Observatörer använder det för att rapportera till kartan. Se [Kartan och observatörer](../visa-pa-kartan/).

## Nod {#nod}

En radio i nätet: companion, repeater, room server eller sensor.

## Observatör {#observator}

En nod, eller en dator vid en radio, som rapporterar vad den hör till en server, så att det syns på kartan. Se [Kartan och observatörer](../visa-pa-kartan/).

## Path hash (väg-id) {#path-hash}

De 1, 2 eller 3 byte av en repeaters nyckel som skrivs in i ett pakets väg. Längre id förväxlas mer sällan, men vägen får färre hopp: 64, 32 eller 21. Se [Finjustera](../repeater/#4-finjustera).

## Privat kanal {#privat-kanal}

En kanal med en slumpad hemlig nyckel. Bara de som har nyckeln kan läsa. Se [Skapa en privat kanal](../kanaler/#skapa-en-privat-kanal).

## Public {#public}

Kanalen alla radior har från början. Nyckeln är känd, så alla kan läsa.

## Region (scope) {#region}

En etikett på ett paket som avgör vilka repeatrar som för det vidare. Här `{{< region "scope" >}}`. Se [Regioner](../regioner/).

## Repeater {#repeater}

En nod som tar emot och sänder vidare trafik, oftast högt placerad. Se [Sätt upp en repeater](../repeater/).

## Room server {#room-server}

En nod som lagrar meddelanden i gemensamma rum.

## Sensor {#sensor}

En nod i rollen sensor, en egen roll i MeshCore vid sidan av companion, repeater och room server.

## SF (spreading factor) {#sf}

Hur länge varje bit sänds. Högre SF når längre men tar mer sändningstid. Nätet här använder SF {{< param "radio.sf" >}}.

## Standardregion {#region-default}

Den region en repeater sätter på sina egna adverts (`region default`). Se [Regioner](../regioner/).

## Sändeffekt {#sandeffekt}

Hur starkt radion sänder, i dBm, ställt med `set tx`. Gränsen gäller ERP, inte bara radion.

## Testkanal {#testkanal}

Länets kanal för testmeddelanden, {{< testchannel >}}, där repeatrar med auto-svar svarar.

## Väg (path) {#vag}

Repeatrarna ett paket passerat på väg till mottagaren.

## Webbflasher {#webbflasher}

En webbsida som installerar firmware i radion via USB, som MeshCores [officiella flasher]({{< param "firmware.flasher" >}}).

