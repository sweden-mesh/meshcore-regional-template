---
title: "Flasha firmware"
description: "Välj rätt firmware för din radio och roll, installera den från webbläsaren och vet vad du ska göra om något krånglar."
weight: 40
source:
  title: "Sätt upp en egen MeshCore Companion"
  url: "https://meshat.se/meshcore/satt-upp-egen-companion/"
  license: "CC BY 4.0"
  changes: "Flashningsdelen omskriven som egen guide; val av firmware via firmwareväljaren; filer och adresser för ESP32; felsökning tillagd."
---

Att *flasha* är att installera programvaran (firmware) i radion. Samma radio kan bli companion,
repeater eller room server beroende på vilken firmware du väljer, och du kan alltid flasha om den.

## Det här behöver du

- Radion och en **USB-kabel som klarar data**. Många kablar laddar bara; byt kabel om datorn
  inte hittar radion.
- En dator med **Chrome eller Edge**. Flashningen sker via Web Serial, som de webbläsarna har.
  Firefox och Safari har det inte, och stödet i mobiler varierar.

## 1. Välj firmware

Börja i [firmwareväljaren]({{< param "firmware.picker" >}}). Den frågar efter:

1. **Typ av nod**: companion (din egen radio), repeater (för vidare trafik) eller room server.
2. **Funktioner**: till exempel *Observer*, som rapporterar vad noden hör till kartan.
3. **Ny installation eller uppdatering**: en uppdatering behåller nodens inställningar och
   identitet.
4. **Din radio**: välj exakt modell och hårdvaruversion.

Svaret är en fil och instruktioner för just den. För ESP32-radior har sidan en egen knapp,
**Flasha via USB**, som flashar direkt från webbläsaren. Den kontrollerar att filen passar
radions chip och skriver den på rätt ställe. Välj *Uppdatera* för att behålla inställningar och
identitet; *Ny installation* raderar dem.

Du kan också flasha med MeshCore-projektets egen [webbflasher]({{< param "firmware.flasher" >}}),
som har stöd för fler modeller.

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

- **Companion:** öppna MeshCore-appen och anslut till radion via Bluetooth eller USB.
- **Repeater:** ställ in namn, position och [region](../regioner/) innan den sätts upp. Radions
  inställningar för {{< region "name" >}}:

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
