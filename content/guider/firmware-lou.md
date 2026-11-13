---
title: "Firmwarevarianterna av Louie"
description: "Vad sweden-mesh:s lou-firmware är, vilka varianter som finns (auto-svar, Observer, fjärrstyrning) och hur du väljer rätt."
weight: 45
---

Utöver MeshCore-projektets egen firmware finns modifierade varianter av Louie: repeaterfirmware som byggs av
[sweden-mesh](https://github.com/sweden-mesh/MeshCore-lou) för de svenska näten. De bygger på
MeshCore och lägger till funktioner som hjälper nätet att mäta sig självt. Allt annat fungerar som
i vanlig MeshCore, och noder med och utan lou pratar med varandra som vanligt.

Den senaste versionen är `v1.18.0-lou-16`, byggd på MeshCore 1.18.0.

## Varianterna

Auto-svar (`ar`)
: Repeatern svarar på `test` i länets testkanal med en signalrapport: vem som hörde, hur starkt
  och vägen dit. Svaren kommer med fördröjning, så att de inte krockar. Det är så nätet kan mäta
  vilka delar som når varandra. Kanalen följer nodens region, till exempel `#test-se-jkp`.

Observer
: Repeatern rapporterar vad den hör till kartan via wifi (se
  [Visa din repeater på kartan](../visa-pa-kartan/)). Bygger på agessamans Observer-firmware och
  kan uppdatera sig själv över nätet (OTA), med uppdateringar signerade av sweden-mesh.

Fjärrstyrning (`rc`)
: Ägaren kan skicka inställningskommandon till sin repeater via MQTT, signerade med ägarens
  egen nyckel. Repeatern kontrollerar signaturen innan den gör något, och vissa kommandon (till
  exempel nycklar och radering) går aldrig att skicka på distans.

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

## Bra att veta

- **Det är tillägg, inte ändringar.** lou ändrar inte MeshCores standardinställningar; funktionerna
  är avstängda tills du slår på dem.
- **Blandade versioner fungerar.** Nätet klarar att vissa noder har lou och andra inte; en nod
  utan auto-svar svarar bara inte på `test`.
- **Källkod och versioner** finns på
  [github.com/sweden-mesh/MeshCore-lou](https://github.com/sweden-mesh/MeshCore-lou/releases),
  med en lista över varje fil och vad den innehåller.
