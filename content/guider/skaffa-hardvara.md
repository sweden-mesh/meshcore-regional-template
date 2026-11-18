---
title: "Skaffa hårdvara"
seoTitle: "Vilken MeshCore-radio ska jag köpa?"
description: "Vilken MeshCore-radio ska du köpa? En companion att bära med dig, en repeater som gör nätet större och en antenn för 868 MHz, med butiker och priser i kronor."
weight: 14
group: start
date: 2026-11-12
lastmod: 2026-11-18
---

MeshCore körs på billiga LoRa-kort. Samma kort kan oftast bli companion eller repeater beroende på
vilken firmware du flashar. Vad en companion och en repeater är förklarar [Vad är
MeshCore?](../vad-ar-meshcore/), och [ordlistan](../ordlista/) de andra orden.

> [!WARNING] 868 MHz
> Köp alltid utförandet för **868 MHz** (EU). Samma modell säljs för 433 och 915 MHz, och de
> fungerar inte i nätet här. 915 MHz är dessutom inte tillåtet i EU.

Välj efter vad du ska göra:

- **[En companion](companion/)**: radion du bär med dig och parar med appen i telefonen. Börja
  här om du bara vill skicka meddelanden.
- **[En repeater](repeater/)**: en radio som står still, högt upp, och för vidare trafiken så att
  nätet når längre.
- **[En antenn](antenn/)**: den del som betyder mest för hur långt en repeater når.

Priserna på sidorna är vad svenska butiker tog i november 2026, och de ändras. Står inget pris i
kronor har vi inte sett modellen i en svensk butik. Vi tar inga provisioner och länkar till
tillverkarnas egna produktsidor, inte till annonser.

## Var du köper

Pileup och Limmared
: Svenska butiker med LoRa-utrustning: [pileupdx.com](https://www.pileupdx.com/) och
  [butik.limmared.nu](https://butik.limmared.nu/). Svensk moms och svensk reklamationsrätt.

amazon.se
: Har många av korten. Kontrollera bandet i annonsen; står det inte, fråga eller välj en annan.
  Säljaren är ofta en annan än Amazon.

AliExpress
: Ofta billigast, med längre leveranstid. Välj 868 MHz i varianten, och se att bilden och
  beskrivningen säger samma sak. Moms tas ut vid köpet eller vid leveransen, och en retur är
  krångligare än från en svensk butik.

Tillverkarnas egna butiker
: Seeed Studio, RAK, Heltec och LilyGO säljer direkt, ofta med frakt från Asien.

## Radion

Alla kort har en LoRa-radio. Det som skiljer dem är processorn:

ESP32-kort
: Till exempel Heltec V3/V4 och LilyGO T-Beam. Billiga, ofta med skärm, och med wifi, vilket behövs
  för en **observatör**. Drar mer ström.

nRF52-kort
: Till exempel RAK WisBlock (RAK4631), Seeed XIAO nRF52840 med Wio-SX1262 och färdiga enheter som
  Seeed T1000-E. Mycket strömsnåla, bra för batteri och sol. Inget wifi.

Färdiga enheter
: Med låda och batteri, bra som companion i fickan. Se [companions](companion/).

> [!TIP] Companion eller repeater?
> För en **companion** räcker nästan vilket kort som helst. För en **repeater** på batteri eller
> sol, välj nRF52; för en repeater som också ska rapportera till kartan, välj ESP32 med wifi.

## Nästa steg

- [Flasha firmware](../flasha-firmware/) på kortet.
- [Kom igång med en companion](../companion/), sedan [Första meddelandet](../forsta-meddelandet/).
- [Bygg en repeater](../bygg-en-repeater/) och [Sätt upp en repeater](../repeater/).
