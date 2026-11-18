---
title: "Vad är MeshCore?"
seoTitle: "Vad är MeshCore? En guide på svenska"
description: "Vad MeshCore är, vad du kan använda det till och inte, fakta i korthet, nodernas roller och hur ett meddelande tar sig fram."
weight: 10
group: start
source:
  title: "Vad är MeshCore?"
  url: "https://meshat.se/meshcore/meshcore-info/"
  license: "CC BY 4.0"
  changes: "Omskriven och förkortad för regionala sidor; observatörsrollen, flooding och vägar tillagda; kartlänkarna ersatta av kartan på startsidan."
date: 2026-11-12
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

MeshCore skickar textmeddelanden mellan små LoRa-radior. Meddelandena går från radio till
radio, utan mobilnät, wifi eller internet. När många radior hjälps åt att föra trafiken vidare
bildar de ett **meshnät**, och varje radio i nätet kallas en **nod**.

## Vad kan du använda det till?

- Skicka meddelanden där mobilen saknar täckning, i skogen, på sjön eller på landet.
- Prata med andra i närheten i en gemensam kanal för ditt län.
- Ha en reserv när el och mobilnät går ner; se [MeshCore när el och mobilnät går
  ner](../nar-natet-gar-ner/).
- Bygga nätet tillsammans med andra, med repeatrar på höga platser.

## Fakta i korthet

| Vad | Kort svar |
| --- | --- |
| Band | 868 MHz, [inställningarna för Sverige](../radioinstallningar/) |
| Licens | behövs inte, se [frågorna](../../fragor/#licens) |
| Hopp | upp till 64 repeatrar på vägen [^faq] |
| Meddelande | högst 160 byte, se [Kanaler](../kanaler/#hur-långt-kan-ett-meddelande-vara) [^text] |
| Kryptering | direktmeddelanden och privata kanaler, se [frågorna](../../fragor/#kryptering) |
| Appar | Android, iOS, Windows, Mac och webben, se [Companion](../companion/) [^faq] |
| Kostnad | radion; appen är gratis för meddelanden, se [Skaffa hårdvara](../skaffa-hardvara/) |

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

{{< flow >}}

När mottagaren svarar kan svaret skickas *direkt* längs den väg som fungerade, i stället för att
floodas över hela nätet igen. Det sparar sändningstid, och sändningstid är det som är dyrt i ett
LoRa-nät: bara en nod i taget kan sända på samma frekvens.

> [!NOTE]- Exakt hur
> - Ett direktmeddelande floodas första gången. Mottagarens kvitto kommer tillbaka med listan över
>   repeatrarna på vägen, och nästa meddelande går direkt längs den [^faq].
> - Kanalmeddelanden floodas alltid, eftersom de inte har en enda mottagare [^faq].
> - Paket kan gå upp till 64 hopp. Varje repeater skrivs in i vägen med 1, 2 eller 3 byte av sin
>   nyckel; med 2 byte blir gränsen 32 hopp och med 3 byte 21 hopp, men risken minskar att två
>   repeatrar förväxlas [^faq].

Nätet i {{< region "name" >}} använder regionen (scope) `{{< region "scope" >}}`, som håller
lokal trafik lokal. Mer om det i [Regioner](../regioner/).

## Vad det inte gör

- Det skickar bara text, högst 160 byte per meddelande [^text]. Å, ä och ö tar två byte var.
- Det klarar inte röst eller bilder.
- Det lovar inte att ett meddelande kommer fram. Nätet byggs av frivilliga, och en väg kan vara
  borta.
- Alla delar på samma sändningstid. Ett långt samtal i en kanal tar tid från alla i regionen; se
  [God sed i nätet](../etikett/).

## MeshCore i Sverige

Bandet
: MeshCore använder 868 MHz-bandet. Nätet här kör förinställningen
  *{{< param "radio.preset" >}}* i appen: {{< param "radio.freq" >}} MHz, bandbredd
  {{< param "radio.bw" >}} kHz och spreading factor {{< param "radio.sf" >}}. Alla radior i nätet
  måste ha samma värden för att höra varandra.

Regler
: Du behöver ingen licens. Bandet är fritt att använda, med gränser för sändeffekten (högst
  500 mW ERP på 869,4–869,65 MHz) och för hur stor del av tiden en radio får sända (duty cycle).
  Med regionens standardinställningar håller du dig inom dem.

Kostnad
: En radio kostar från ett par hundra kronor för ett enkelt kort med antenn, upp till ungefär
  tusen kronor för en färdig enhet med skärm, tangentbord eller GPS. Firmwaren är gratis, och appen
  är gratis att ladda ned och använda för meddelanden; i mobilappen kan väntetiden för att
  administrera en repeater låsas upp med ett köp [^faq]. Nätet har inga abonnemang eller avgifter. En repeater för utomhusbruk kostar mer:
  låda, bättre antenn och kanske sol och batteri. Se [Skaffa hårdvara](../skaffa-hardvara/).

Vid strömavbrott
: Radior och repeatrar på batteri eller sol fungerar utan el och mobilnät. Se [MeshCore när el och
  mobilnät går ner](../nar-natet-gar-ner/).

I nyheterna
: TV4 har berättat om nätet i Västerbotten, i [Bygger eget radionät](https://www.tv4.se/artikel/5Frw4pRToGwrcn8m6vdOaU/bygger-eget-radionaet-naesta-steg-i-den-digitala-preppingen).

Meshtastic
: Ett annat system på samma radior, som inte pratar med MeshCore. Se
  [MeshCore eller Meshtastic?](../meshcore-eller-meshtastic/).

## Vanliga ord

Orden som används här, som *advert*, *flooda* och *väg*, förklaras i [ordlistan](../ordlista/).

## Räckvidd

Räckvidden avgörs mer av höjd, antenn och terräng än av sändeffekt. Från en mast eller ett
högt hus når en repeater långt; från en källare knappt grannen. Därför är några få välplacerade
repeatrar värda mer än många lågt placerade. Hör din radio bara en repeater är det oftast
normalt: se [Jag hör bara en repeater](../../felsokning/bara-en-repeater/).

## Nästa steg

- [Regioner](../regioner/): vilken region du ska använda här
- [MeshCore eller Meshtastic?](../meshcore-eller-meshtastic/): skillnaden, och hur du väljer
- Kartan på [startsidan](/): se vilka repeatrar som finns nära dig

## Källor

[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md): hopp och väg-id, flood och direkt, kanaler, appar och köp i appen.
[^text]: MeshCore, [BaseChatMesh.h](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.h), `MAX_TEXT_LEN`; UTF-8 enligt [RFC 3629](https://www.rfc-editor.org/rfc/rfc3629).
