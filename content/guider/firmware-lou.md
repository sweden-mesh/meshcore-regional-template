---
title: "Specialfirmware lou med fjärrstyrning och autosvar"
seoTitle: "Specialfirmware lou med autosvar"
description: "Vad sweden-mesh:s lou-firmware är, vilka varianter som finns (auto-svar, Observer, fjärrstyrning) och hur du väljer rätt."
weight: 45
group: repeater
date: 2026-11-12
lastmod: 2026-11-18
---

Utöver MeshCore-projektets egen firmware finns lou, modifierade varianter som Louie skrivit: repeaterfirmware som byggs av
[sweden-mesh](https://github.com/sweden-mesh/MeshCore-lou) för de svenska näten. De bygger på
MeshCore och lägger till funktioner som hjälper nätet att mäta sig självt. Allt annat fungerar som
i vanlig MeshCore, och noder med och utan lou pratar med varandra som vanligt.

Den senaste släppta versionen är `v1.18.0-lou-18`, byggd på MeshCore 1.18.0.

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
  `{{< param "backend.host" >}}`. Kommandona är signerade med ägarens egen nyckel, och repeatern
  kontrollerar signaturen innan den gör något. Vissa kommandon, till exempel nycklar och radering,
  går aldrig att skicka på distans.

| Variant | Innehåll |
|---|---|
| Vanlig repeater + auto-svar | MeshCore 1.18.0 med auto-svar, för nästan alla repeaterkort |
| Observer + auto-svar | auto-svar, rapporter till kartan, OTA |
| Observer + fjärrstyrning | fjärrstyrning, rapporter till kartan, OTA |
| Observer + båda | auto-svar och fjärrstyrning, rapporter till kartan, OTA |

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

Fjärrstyrningen slås på från USB-konsolen, eftersom nyckeln bara kan sättas där. Raderna nedan
gäller lou-17 och senare. Repeaterguiderna under [Steg för steg](../../wizard/) kan skicka dem åt dig.

{{< region-control >}}

## Nästa versioner

lou-20 är byggd men inte släppt än; den släpps när den klarat testerna. Den gör fjärrstyrningen
enklare och mer privat:

- **Ingen region behövs.** Repeatern nås på sin egen nyckel, oavsett region och karta.
- **Krypterat till ägaren.** Varje kommando är krypterat till just den repeatern, och svaret går
  krypterat tillbaka. Ingen annan på servern kan läsa dem.
- **Repeatern hör av sig.** Ungefär var 15:e minut, och strax efter att den anslutit, skickar den
  ett krypterat livstecken till ägaren. Det är så ägarens verktyg hittar sina repeatrar. Intervallet
  ändras med `set alive.interval`.
- **Över meshen också krypterat.** Ett kommando som skickas via en annan nods radio kan inte läsas
  av den som för det vidare.

lou-21 kommer tidigast en månad efter lou-20. Den tar bort det äldre sättet att styra repeatrar, så
att bara det nya finns kvar. Uppdatera till lou-20 först.

## Bra att veta

- **Det är tillägg, inte ändringar.** lou ändrar inte MeshCores standardinställningar; funktionerna
  är avstängda tills du slår på dem.
- **Blandade versioner fungerar.** Nätet klarar att vissa noder har lou och andra inte; en nod
  utan auto-svar svarar bara inte på `test`.
- **Källkod och versioner** finns på
  [github.com/sweden-mesh/MeshCore-lou](https://github.com/sweden-mesh/MeshCore-lou/releases),
  med en lista över varje fil och vad den innehåller.
- **Om något krånglar:** [Auto-svaret svarar inte i länets testkanal](../../felsokning/auto-svar-legacy/) och [Firmwareväljaren erbjuder inte den senaste versionen](../../felsokning/firmwarevaljaren-gammal-version/).
