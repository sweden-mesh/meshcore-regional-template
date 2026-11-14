---
title: "Vad är MeshCore?"
description: "En kort introduktion: vad MeshCore är, vilka roller noderna har och vad du behöver för att börja."
weight: 10
source:
  title: "Vad är MeshCore?"
  url: "https://meshat.se/meshcore/meshcore-info/"
  license: "CC BY 4.0"
  changes: "Omskriven och förkortad för regionala sidor; observatörsrollen, flooding och vägar tillagda; kartlänkarna ersatta av kartan på startsidan."
---

MeshCore skickar textmeddelanden mellan små LoRa-radior. Meddelandena går från radio till
radio, utan mobilnät, wifi eller internet. När många radior hjälps åt att föra trafiken vidare
bildar de ett **meshnät**, och varje radio i nätet kallas en **nod**.

> [!NOTE] Officiell information
> MeshCore-projektets egen webbplats är [meshcore.io](https://meshcore.io), med
> [dokumentation](https://docs.meshcore.io/) och nya versioner. `meshcore.co.uk` är inte
> projektets officiella sida.

## Det här behöver du

- En LoRa-radio som MeshCore stöder, och en antenn för 868 MHz-bandet.
- MeshCore-firmware på radion. Att installera den kallas att *flasha*.
- MeshCore-appen i telefonen eller datorn.

Det räcker för att skicka och ta emot. Allt annat i nätet, som repeatrar på höga platser, har
andra satt upp, och det är så nätet växer.

## Nodernas roller

Samma sorts radio kan få olika roller beroende på vilken firmware den har.

Companion
: Din personliga radio. Den kopplas till appen via Bluetooth eller USB och skickar och tar emot
  dina meddelanden. En companion för **inte** vidare andras trafik.

Repeater
: Tar emot trafik och sänder den vidare, så att meddelanden når längre och tar sig förbi hinder.
  En repeater gör mest nytta högt upp med fri sikt och en bra antenn, och står på samma plats
  dygnet runt.

Observatör
: En repeater som också rapporterar vad den hör till en server via internet. Det påverkar inte
  meshnätet, men det är så kartan på [startsidan](/) vet vilka noder som finns och vilka vägar
  paketen tar.

Room server
: En nod som sparar meddelanden i ett gemensamt rum, ungefär som en anslagstavla. Du loggar in
  från appen, ofta med ett lösenord, och servern skickar det som skrivits medan du var borta. Det
  låter användbart, men **room servers är svåra att få att fungera pålitligt**. Det är kända fel
  i MeshCore (hösten 2026), inte ditt nät: inloggningen hinner ofta passera sin tidsgräns över
  flera hopp, så appen säger att det misslyckades fast meddelandena kommer fram; servern sparar
  bara de 32 senaste inläggen; och en ESP32-baserad server utan klockbatteri kan efter en
  omstart tro att det är 2024 och sluta skicka nya inlägg. Räkna med att den fungerar bäst för
  noder som når servern direkt eller med få hopp.

## Så tar sig ett meddelande fram

Ett meddelande skickas som ett **paket**. Första gången skickas det ofta som *flood*: varje
repeater som hör paketet sänder det vidare en gång, tills det har nått så långt det kan. Varje
repeater som för det vidare lägger till sig själv i paketets **väg** (path).

När mottagaren svarar kan svaret skickas *direkt* längs den väg som fungerade, i stället för att
floodas över hela nätet igen. Det sparar sändningstid, och sändningstid är det som är dyrt i ett
LoRa-nät: bara en nod i taget kan sända på samma frekvens.

Nätet i {{< region "name" >}} använder regionen (scope) `{{< region "scope" >}}`, som håller
lokal trafik lokal. Mer om det i [Regioner](../regioner/).

## Vanliga ord

LoRa
: Radioteknik med lång räckvidd, låg datahastighet och låg strömförbrukning.

Advert
: Ett kort paket där en nod talar om att den finns, med namn, typ och ibland position.

Flooda
: Skicka ett paket och låta varje repeater som hör det sända det vidare.

Väg (path)
: Listan över repeatrar som ett paket passerat.

Firmware
: Programvaran i radion. *Flasha* betyder att installera eller uppdatera den.

## Räckvidd

Räckvidden avgörs mer av höjd, antenn och terräng än av sändeffekt. Från en mast eller ett
högt hus når en repeater långt; från en källare knappt grannen. Därför är några få välplacerade
repeatrar värda mer än många lågt placerade.

## Nästa steg

- [Regioner](../regioner/): vilken region du ska använda här
- Kartan på [startsidan](/): se vilka repeatrar som finns nära dig
