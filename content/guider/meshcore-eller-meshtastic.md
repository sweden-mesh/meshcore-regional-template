---
title: "MeshCore eller Meshtastic?"
seoTitle: "MeshCore eller Meshtastic: skillnaden"
description: "MeshCore eller Meshtastic? Samma radior, olika sätt att föra trafiken vidare: hopp, sändningstid, batteri och kryptering jämförda, och var Reticulum passar in."
weight: 95
group: start
date: 2026-11-16
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

MeshCore och Meshtastic är två fria system för textmeddelanden över LoRa. **De körs på samma
radior**, men de pratar inte med varandra: en MeshCore-radio hör inte en Meshtastic-radio. Du
väljer alltså nät, inte hårdvara. Reticulum är ett tredje, annorlunda alternativ. Är du ny, börja
med [Vad är MeshCore?](../vad-ar-meshcore/).

## Den stora skillnaden: vem för trafiken vidare

**I Meshtastic kan alla radior hjälpas åt.** En nod som hör ett meddelande lyssnar en kort stund
och sänder det vidare bara om ingen annan redan har gjort det; en nod i rollen ROUTER sänder alltid
vidare [^mtalgo] [^mtrole]. Ett meddelande får gå ett begränsat antal hopp, som standard 3 och högst
7 [^mtlora].

**I MeshCore gör repeatrarna det jobbet.** Din personliga radio, en *companion*, sänder bara dina
egna meddelanden och för inte vidare andras. Fasta repeatrar på höga platser bär nätet, upp till
64 hopp [^mcfaq]. Ett direktmeddelande floodas första gången, och nästa kan sedan gå *direkt*
längs den väg som fungerade. Läs mer under [Så tar sig ett meddelande
fram](../vad-ar-meshcore/#så-tar-sig-ett-meddelande-fram).

Det får två följder:

- **Sändningstid.** Bara en radio i taget kan sända på frekvensen inom hörhåll. När färre radior
  sänder om, och svaren går direkt, räcker sändningstiden till fler användare och fler hopp.
- **Batteri.** En companion som inte sänder om andras trafik kan sova mer. Repeatrarna behöver
  i stället stå på dygnet runt, ofta med nätström eller [solcell](../solnoder/).

## Jämförelse

| Hur trafiken går | MeshCore | Meshtastic |
| --- | --- | --- |
| Vem för vidare | repeatrar, inte companions | noder som ingen annan hann före, ROUTER alltid |
| Antal hopp | upp till 64 | standard 3, högst 7 |
| Svar och direktmeddelanden | direkt längs en känd väg | floodas, i nyare versioner ibland direkt |
| Begränsa trafik till ett område | regioner (scope) | hoppgränsen |

| Att använda | MeshCore | Meshtastic |
| --- | --- | --- |
| Radior | samma LoRa-kort | samma LoRa-kort |
| Appar | Android, iPhone, Windows, Mac, webben | egna appar |
| Kartor i Sverige | kartan på [startsidan](/) | se [meshat.se](https://meshat.se/) |
| Pratar med det andra systemet | nej | nej |

> [!NOTE]- Kan de prata med varandra?
> Nej. De använder samma radiokretsar men olika paket, och hör inte varandras trafik.

> [!NOTE]- Är det krypterat?
> I MeshCore krypteras direktmeddelanden och privata kanaler med AES-128, med en tvåbytes
> kontrollsumma (HMAC), och varje nod har en identitet med en Ed25519-nyckel [^mccrypto]
> [^mcpayloads]. Jämförande sidor är oense om vad som ska kallas end-to-end, så vi beskriver bara
> vad koden gör. Se också [frågorna](../../fragor/#kryptering).

## När MeshCore passar

- Du vill nå långt, genom många hopp, i ett nät med fasta repeatrar.
- Du vill att din egen radio ska hålla länge på batteri.
- Det finns ett MeshCore-nät där du bor. Se kartan på [startsidan](/).

## När Meshtastic passar

- Ni är en grupp som rör er tillsammans, utan fasta repeatrar, och alla radior ska hjälpas åt.
- Du vill ha det nät som dina vänner eller din förening redan använder.

## Och Reticulum?

Reticulum är inte en app utan ett nätverkssystem. Det kan gå över vilken blandning av länkar som
helst, LoRa, wifi, internet eller en seriell kabel, och behöver inte IP [^rns]. Det pratar varken
med MeshCore eller Meshtastic.

| Egenskap | Reticulum |
| --- | --- |
| Länkar | valfri blandning, utan IP [^rns] |
| Kryptering | X25519 och Ed25519, med forward secrecy [^rns] |
| Radio | RNode är referensradion [^rns] |

meshat.se har guider till Reticulum: [Vad är Reticulum?](https://meshat.se/).

## Vad används i Sverige?

Båda. Var MeshCore-nätet finns ser du på kartan på [startsidan](/); för Meshtastic, se
[meshat.se](https://meshat.se/). Hur stora näten är har ingen mätt, så vi anger inga siffror.

## Kan jag byta senare?

Ja. Samma radio kan flashas om till det andra systemet när du vill; det är bara firmware. Se
[Välj och flasha firmware](../flasha-firmware/). Inställningarna följer inte med, och radion blir en
ny nod för de andra.

## Nästa steg

- [Skaffa hårdvara](../skaffa-hardvara/): vad som spelar roll när du väljer radio
- [Kom igång med en companion](../companion/): din första MeshCore-radio
- [Vanliga frågor](../../fragor/)

## Källor

[^mtalgo]: Meshtastic, [Mesh broadcast algorithm](https://meshtastic.org/docs/overview/mesh-algo/).
[^mtrole]: Meshtastic, [Device configuration](https://meshtastic.org/docs/configuration/radio/device/), roller.
[^mtlora]: Meshtastic, [LoRa configuration](https://meshtastic.org/docs/configuration/radio/lora/), hop limit.
[^mcfaq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md), 2.5.
[^mccrypto]: MeshCore, [MeshCore.h](https://github.com/meshcore-dev/MeshCore/blob/main/src/MeshCore.h) och [Utils.cpp](https://github.com/meshcore-dev/MeshCore/blob/main/src/Utils.cpp).
[^mcpayloads]: MeshCore, [payloads](https://github.com/meshcore-dev/MeshCore/blob/main/docs/payloads.md).
[^rns]: Reticulum, [What is Reticulum?](https://reticulum.network/manual/whatis.html)
