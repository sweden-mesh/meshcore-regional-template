---
title: "Från noll till companion i handen"
seoTitle: "Snabbstart: din första MeshCore-radio"
description: "Den kortaste vägen till en egen MeshCore-radio: en färdig enhet med låda, firmware från webbläsaren, appen och länets värden."
weight: 1
group: snabbstart
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

Kortaste vägen till en egen MeshCore-radio i fickan. Du behöver ingen lödkolv och ingen licens,
bara en dator med Chrome eller Edge, en USB-kabel som klarar data och en telefon.

## 1. Köp en färdig radio

Välj en enhet som redan har låda, batteri och antenn och som säljs för 868 MHz. Två som finns hos
svenska butiker:

- **Seeed Wio Tracker L1 Pro**: skärm, GPS och 2000 mAh batteri. 725 kr hos Limmared i november
  2026.
- **RAK WisMesh Tag**: tunn spårare utan skärm, med GPS. 667 kr hos Pileup i november 2026.

Ett Heltec-kort med låda går också, men batteriet ingår inte, och Heltec V3 tappar lätt
Bluetooth-kontakten med telefonen eftersom antennen på kortet är liten.

Läs mer: [Välj en companion](../skaffa-hardvara/companion/), med fler enheter, batteritider och
källorna till priserna.

## 2. Flasha companion-firmware

De flesta enheter levereras med Meshtastic och behöver ny firmware först. Det görs i
webbläsaren:

1. Öppna [MeshCores webbflasher]({{< param "firmware.flasher" >}}) i Chrome eller Edge.
2. Välj din modell och **Bluetooth Companion**.
3. Anslut radion med USB-kabeln och följ stegen i flashern.

Hittar flashern ingen radio: prova en annan kabel eller port. Läs mer: [Flasha
firmware](../flasha-firmware/#companion) och [Webbläsaren hittar ingen
port](../../felsokning/ingen-port/).

## 3. Installera appen och para radion

1. Installera **MeshCore** från Google Play eller App Store.
2. Starta radion och slå på Bluetooth i telefonen.
3. Öppna appen och välj radion i listan.
4. Ange PIN-koden om appen frågar. Har radion skärm står koden där; annars är den ofta `123456`.

Appen är gratis för att skicka och ta emot.

## 4. Ställ in radion för {{< region "name" >}}

Alla som ska höra varandra behöver samma värden. Välj förinställningen i appens
radioinställningar och spara:

{{< settings >}}

Ge radion ett namn du vill att andra ska se. Position är frivillig: en companion följer med dig
hem, så dela den bara om du vill.

Läs mer: [Ställ in en companion](/wizard/companion/), steg för steg med länets värden.

## Klart

Radion är redo. Nästa snabbstart: [Skriv ditt första meddelande](../snabbstart-forsta-meddelandet/).
Den långa guiden med allt om companions: [Kom igång med en companion](../companion/).
