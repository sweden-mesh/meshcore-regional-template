---
title: "Specialfirmware lou med fjärrstyrning och autosvar"
seoTitle: "Specialfirmware lou med autosvar"
description: "Vad sweden-mesh:s lou-firmware är, vilka varianter som finns (auto-svar, Observer, fjärrstyrning) och hur du väljer rätt."
weight: 45
group: repeater
date: 2026-11-12
lastmod: 2026-11-25
---

Utöver MeshCore-projektets egen firmware finns lou: repeaterfirmware som byggs av
[sweden-mesh](https://github.com/sweden-mesh/MeshCore-lou) för de svenska näten. Den bygger på
MeshCore och lägger till funktioner som hjälper nätet att mäta sig självt. Allt annat fungerar som
i vanlig MeshCore, och noder med och utan lou pratar med varandra som vanligt.

Den senaste släppta versionen är `v1.18.0-lou-20`, byggd på MeshCore 1.18.0.

## Varianterna

Auto-svar (`ar`)
: Repeatern svarar på `test` i länets testkanal med en signalrapport: vem som hörde, hur starkt
  och vägen dit. Svaren kommer med fördröjning, så att de inte krockar. Det är så nätet kan mäta
  vilka delar som når varandra. Kanalen följer nodens region, till exempel `#test-{{< region "scope" >}}`.

Observer
: Repeatern rapporterar vad den hör till kartan via wifi (se
  [Kartan och observatörer](../visa-pa-kartan/)). Bygger på agessamans Observer-firmware och
  kan uppdatera sig själv över nätet (OTA), med uppdateringar signerade av sweden-mesh.

Fjärrstyrning (`rc`)
: Ägaren kan ändra inställningar på sin repeater utan att åka dit, genom kommandoservern
  `{{< param "backend.host" >}}`, eller över meshen för kort utan wifi. Kommandona är signerade med ägarens egen nyckel, och repeatern
  kontrollerar signaturen innan den gör något. Vissa kommandon, till exempel nycklar och radering,
  går aldrig att skicka på distans.

| Variant | Innehåll |
|---|---|
| Vanlig repeater + auto-svar | MeshCore 1.18.0 med auto-svar, för nästan alla repeaterkort |
| Vanlig repeater + fjärrstyrning | fjärrstyrning över meshen, för kort utan wifi |
| Vanlig repeater + båda | auto-svar och fjärrstyrning över meshen |
| Observer + auto-svar | auto-svar, rapporter till kartan, OTA |
| Observer + fjärrstyrning | fjärrstyrning, rapporter till kartan, OTA |
| Observer + båda | auto-svar och fjärrstyrning, rapporter till kartan, OTA |

Vill du se hur fjärrstyrningen ser ut innan du flashar något? [Prova mccontrol med påhittade
noder](https://mccontrol.meshcoresverige.se/?demo=1). Du behöver ingen nyckel, och inget skickas.

## Välj och installera

Gå till [firmwareväljaren]({{< param "firmware.picker" >}}) och välj typ av nod, funktioner och
ditt kort. Du får en fil och instruktioner för just den. Väljer du inga extra funktioner leder den
dig till MeshCores egen flasher. Själva flashningen beskrivs i
[Flasha firmware](../flasha-firmware/).

Efter flashningen visar väljaren de kommandon som behövs, till exempel:

```text {title="Slå på auto-svar"}
set autoreply on
```

Auto-svaret använder nodens region, så ställ in den först (se [Regioner](../regioner/)).

Den första nyckeln sätter du från USB-konsolen, eller som inloggad administratör från appen. Nyckeln
byts med `rekey`, signerat med den nuvarande nyckeln. Att ta bort den kräver USB.

Raderna nedan gäller lou-20. I lou-18 och äldre heter de `set mqtt.cmd.pubkey` och `set mqtt.cmd on`.
Repeaterguiderna under [Steg för steg](../../wizard/) kan skicka dem åt dig.

{{< region-control >}}

## Fjärrstyrning utan wifi

Från lou-20 tar filerna `rc` och `arrc` för vanliga repeaterkort (nRF52, RP2040, STM32 och ESP32
utan Observer) emot signerade kommandon över meshen.

Något måste föra kommandona vidare över radio. Det kan vara en av dina egna Observer-repeatrar med
fjärrstyrning och samma kommandonyckel, inom radioräckhåll i samma mesh. Den för dina kommandon
vidare och kallas relä. Det kan också vara din egen companion.

```text {title="Slå på fjärrstyrning över meshen"}
set cmd.pubkey <din publika nyckel>
set cmd on
```

`get cmd` svarar sedan `mesh only`.

I [mccontrol](https://mccontrol.meshcoresverige.se) dyker en sådan nod inte upp av sig själv. Lägg
till den med dess publika nyckel.

Reläet för vidare ett kommando i taget, och noden svarar inom en egen sändningsbudget. Ett kommando
kan därför bli utan svar. Vänta några minuter och skicka det igen.

Kort utan wifi uppdateras med USB eller Bluetooth, inte över meshen.

## Nytt i lou-20

lou-20 gör fjärrstyrningen enklare och mer privat:

- **Ingen region behövs.** Repeatern nås på sin egen nyckel, oavsett region och karta.
- **Krypterat till ägaren.** Varje kommando är krypterat till just den repeatern, och svaret går
  krypterat tillbaka. Ingen annan på servern kan läsa dem.
- **Repeatern hör av sig.** Ungefär var 15:e minut, och strax efter att den anslutit, skickar den
  ett krypterat livstecken till ägaren. Det är så ägarens verktyg hittar sina repeatrar. Intervallet
  ändras med `set alive.interval`.
- **Över meshen också krypterat.** Ett kommando som skickas via en annan nods radio kan inte läsas
  av den som för det vidare.
- **Fjärrstyrning på kort utan wifi.** Vanliga repeaterkort tar signerade kommandon över meshen, se
  [Fjärrstyrning utan wifi](#fjärrstyrning-utan-wifi).
- **Reläet.** En Observer-repeater med fjärrstyrning för ägarens kommandon vidare över radio till
  ägarens andra repeatrar och skickar tillbaka svaren utan att läsa dem.
- **Auto-svar också i `#test-se`.** Repeatern svarar på `test` i hela landets testkanal. Svaren
  kostar sändningstid i hela landet: skicka ett `test`, vänta två minuter och upprepa det inte.
- **Nya kommandonamn.** `set cmd on` i stället för `set mqtt.cmd on`, och `set cmd.pubkey` i stället
  för `set mqtt.cmd.pubkey`. De gamla namnen finns inte kvar. Dina inställningar följer med.

lou-21 kommer tidigast en månad efter lou-20. Den tar bort det äldre sättet att styra repeatrar, så
att bara det nya finns kvar. Uppdatera till lou-20 först.

## Bra att veta

Korta svar på det folk brukar undra finns i [Frågor om lou-firmwaren](../../fragor/lou/).

- **Det är tillägg, inte ändringar.** lou ändrar inte MeshCores standardinställningar; funktionerna
  är avstängda tills du slår på dem.
- **Blandade versioner fungerar.** Nätet klarar att vissa noder har lou och andra inte; en nod
  utan auto-svar svarar bara inte på `test`.
- **Källkod och versioner** finns på
  [github.com/sweden-mesh/MeshCore-lou](https://github.com/sweden-mesh/MeshCore-lou/releases),
  med en lista över varje fil och vad den innehåller.
- **Om något krånglar:** [Auto-svaret svarar inte i länets testkanal](../../felsokning/auto-svar-legacy/) och [Firmwareväljaren erbjuder inte den senaste versionen](../../felsokning/firmwarevaljaren-gammal-version/).
