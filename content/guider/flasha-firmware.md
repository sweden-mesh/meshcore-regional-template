---
title: "Välj och flasha firmware"
description: "Välj och flasha MeshCore från webbläsaren: standardfirmware från den officiella webbflashern för companion och repeater, Observer för kartan, och vad du gör om något krånglar."
weight: 18
group: start
source:
  title: "Sätt upp en egen MeshCore Companion"
  url: "https://meshat.se/meshcore/satt-upp-egen-companion/"
  license: "CC BY 4.0"
  changes: "Flashningsdelen omskriven som egen guide; val av firmware via firmwareväljaren; filer och adresser för ESP32; felsökning tillagd."
date: 2026-11-12
lastmod: 2026-11-18
---

Att *flasha* är att installera programvaran (firmware) i radion. Samma radio kan bli companion,
repeater eller room server beroende på vilken firmware du väljer, och du kan alltid flasha om den.
Vilken radio du ska välja står i [Skaffa hårdvara](../skaffa-hardvara/).

## Det här behöver du

- Radion och en **USB-kabel som klarar data**. Många kablar laddar bara; byt kabel om datorn
  inte hittar radion.
- En dator med **Chrome eller Edge**. Flashningen sker via Web Serial, som de webbläsarna har.
  Firefox och Safari har det inte, och stödet i mobiler varierar.

## 1. Välj firmware

Börja med MeshCore-projektets egen firmware. Den finns i den officiella
[webbflashern]({{< param "firmware.flasher" >}}) för companion, repeater och room server, och den
räcker för de flesta.

### Companion

Din egen radio, den du parar med appen:

1. Öppna [webbflashern]({{< param "firmware.flasher" >}}) och välj din radio, exakt modell och
   version.
2. Välj companion-firmware: **Bluetooth** om du ska använda telefonen, **USB** om radion ska sitta
   i datorn.
3. Fortsätt med [Anslut radion](#2-anslut-radion) nedan.

### Repeater

1. I [webbflashern]({{< param "firmware.flasher" >}}): välj din radio och **Repeater**.
2. Ska repeatern också visa på kartan vad den hör, välj en **Observer**-firmware i stället. Den
   kommer från [MeshCore Observer-projektet](https://github.com/agessaman/MeshCore) och behöver ett
   kort med wifi; se [Din repeater på kartan](../visa-pa-kartan/).

### Specialfirmware, om du vill ha mer

[Specialfirmware lou](../firmware-lou/) är repeaterfirmware som byggs för de svenska näten. Den lägger
till auto-svar på test och fjärrstyrning, och fungerar ihop med vanlig MeshCore. Du behöver den inte
för att komma igång. Den finns i en egen väljare, [lou-firmwareväljaren]({{< param "firmware.picker" >}}),
som bara har lou-firmware: välj typ av nod, funktioner, ny installation eller uppdatering, och din
radio. För ESP32-radior har den en knapp, **Flasha via USB**, som flashar direkt från webbläsaren.
Välj *Uppdatera* för att behålla inställningar och identitet; *Ny installation* raderar dem.

> [!WARNING] Rätt modell
> Firmware för fel modell kan göra att skärm, radio eller knappar inte fungerar. Kontrollera
> modellen och versionen innan du flashar.

## 2. Anslut radion

1. Anslut radion till datorn med USB-kabeln.
2. Klicka på *Flash* eller *Connect* i flashern och välj radions port i listan.
3. Hittar webbläsaren ingen port: byt kabel eller USB-port, och följ flasherns instruktioner för
   att starta radion i *bootloader-läge* (DFU). Hur det görs skiljer sig mellan modeller; ofta
   håller man inne en knapp medan kabeln ansluts.

## 3. Flasha

Starta flashningen och vänta tills flashern säger att den är klar. Under tiden:

- låt kabeln sitta kvar,
- stäng inte fliken,
- låt datorn inte somna.

Många radior startar om av sig själva. Står den kvar i bootloader-läge: tryck på reset eller
koppla ur och in strömmen.

### Med en annan flasher (ESP32)

Varje version finns som två filer. De ska skrivas till olika adresser:

| Fil | Adress | Innehåller |
| --- | --- | --- |
| `…-merged.bin` | `0x0` | hela flashen: startkod, partitionstabell och firmware |
| `….bin` (utan *merged*) | `0x10000` | bara firmwaren |

Är du osäker: ta `-merged.bin` och skriv den till `0x0`, utan att radera. Inställningarna ligger
längre in i flashen och skrivs inte över.

> [!CAUTION] Radera inte i onödan
> *Erase flash* och *ny installation* raderar radions inställningar och identitet, så att den blir
> en ny nod för alla andra. Använd det bara när du vill börja om från början.

## 4. Efter flashningen

- **Companion:** öppna MeshCore-appen och anslut till radion via Bluetooth eller USB; se
  [Kom igång med en companion](../companion/#2-anslut-appen).
- **Repeater:** ställ in namn, position och [region](../regioner/) innan den sätts upp. Radions
  inställningar för {{< region "name" >}} ([vad de betyder](../radioinstallningar/)):

{{< settings >}}

## Om något krånglar

> [!NOTE]- Webbläsaren hittar ingen port
> Byt till en kabel som klarar data, prova en annan USB-port och kontrollera att du använder
> Chrome eller Edge. Starta radion i bootloader-läge och försök igen.

> [!NOTE]- Flashningen avbröts halvvägs
> Det går nästan alltid att flasha igen. Starta radion i bootloader-läge och gör om flashningen.

> [!NOTE]- Radion startar om hela tiden efter flashningen
> Syns `load:0x3c120020` och sedan *Guru Meditation Error* i USB-konsolen har filen utan
> *merged* skrivits till `0x0`, där startkoden ska ligga. Flasha `-merged.bin` till `0x0`, utan
> att radera. Inställningarna finns kvar.

> [!NOTE]- `ver` visar fortfarande den gamla versionen
> Har radion uppdaterats trådlöst (OTA) tidigare startar den från den andra firmwareplatsen i
> flashen. En fil utan *merged*, skriven till `0x10000`, hamnar då på platsen som inte används.
> Flasha `-merged.bin` till `0x0`: den pekar om starten till den nya firmwaren. Kontrollera också
> att firmwareväljaren visar den senaste versionen; den uppdateras inom någon timme efter en ny
> version.

> [!NOTE]- Radion startar men syns inte i nätet
> Kontrollera att radioinställningarna ovan stämmer och att regionen är rätt. En repeater syns på
> kartan först när den skickat en *advert* och en observatör har hört den.

Fler svar i Felsökning: [Flashningen avbröts, och radion verkar död](../../felsokning/flashningen-avbrots/), [Radion startar om hela tiden](../../felsokning/startar-om-efter-flashning/) och [Inställningarna är borta efter flashningen](../../felsokning/installningar-borta/).
