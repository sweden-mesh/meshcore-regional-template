---
title: "MeshCore eller Meshtastic?"
seoTitle: "MeshCore eller Meshtastic: skillnaden"
description: "MeshCore eller Meshtastic? Samma radior, men olika sätt att föra trafiken vidare. Så skiljer de sig, och så väljer du efter hur du ska använda nätet."
weight: 95
group: start
date: 2026-11-16
lastmod: 2026-11-16
---

MeshCore och Meshtastic är två fria system för textmeddelanden över LoRa. **De körs på samma
radior**, men de pratar inte med varandra: en MeshCore-radio hör inte en Meshtastic-radio. Du
väljer alltså nät, inte hårdvara. Här är skillnaderna som spelar roll, och vad som talar för
vilket. Är du ny, börja med [Vad är MeshCore?](../vad-ar-meshcore/).

## Den stora skillnaden: vem för trafiken vidare

**I Meshtastic hjälps alla radior åt.** Varje nod sänder som standard om det den hör, även
radion i din ficka. Ett meddelande får gå ett begränsat antal hopp (standard 3, högst 7), sedan
stannar det.

**I MeshCore gör repeatrarna det jobbet.** Din personliga radio, en *companion*, sänder bara dina
egna meddelanden och för inte vidare andras. Fasta repeatrar på höga platser bär nätet. Ett
meddelande floodas första gången, och svaret kan sedan gå *direkt* längs den väg som fungerade,
i stället för att sändas över hela nätet igen. Läs mer under
[Så tar sig ett meddelande fram](../vad-ar-meshcore/#så-tar-sig-ett-meddelande-fram).

Det får två följder:

- **Sändningstid.** Bara en radio i taget kan sända på frekvensen inom hörhåll. När färre radior
  sänder om, och svaren går direkt, räcker sändningstiden till fler användare och fler hopp.
- **Batteri.** En companion som inte sänder om andras trafik kan sova mer. Repeatrarna behöver
  i stället stå på dygnet runt, ofta med nätström eller [solcell](../solnoder/).

## Jämförelse

| | MeshCore | Meshtastic |
|---|---|---|
| Vem för trafiken vidare | repeatrar, inte companions | alla noder, som standard |
| Antal hopp | många, genom repeatrar | standard 3, högst 7 |
| Svar och direktmeddelanden | direkt längs en känd väg | floodas, i nyare versioner ibland direkt |
| Begränsa trafik till ett område | regioner (scope) | hoppgränsen |
| Radior | samma LoRa-kort | samma LoRa-kort |
| Pratar med det andra systemet | nej | nej |

## När MeshCore passar

- Du vill nå långt, genom många hopp, i ett nät med fasta repeatrar.
- Du vill att din egen radio ska hålla länge på batteri.
- Det finns ett MeshCore-nät där du bor. Se kartan på [startsidan](/).

## När Meshtastic passar

- Ni är en grupp som rör er tillsammans, utan fasta repeatrar, och alla radior ska hjälpas åt.
- Du vill ha det nät som dina vänner eller din förening redan använder.

## Kan jag byta senare?

Ja. Samma radio kan flashas om till det andra systemet när du vill; det är bara firmware. Se
[Flasha firmware](../flasha-firmware/). Inställningarna följer inte med, och radion blir en ny
nod för de andra.

## Nästa steg

- [Skaffa hårdvara](../skaffa-hardvara/): vad som spelar roll när du väljer radio
- [Kom igång med en companion](../companion/): din första MeshCore-radio
- [Vanliga frågor](../../fragor/)
