---
title: "Skaffa hårdvara"
seoTitle: "Vilken MeshCore-radio ska jag köpa?"
description: "Vilken MeshCore-radio ska du köpa? Companion, repeater och antenn för 868 MHz, butiker och priser i kronor, och modellerna jämförda: chip, sändeffekt och batteri."
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

## Modellerna i jämförelse

Alla modellerna nedan finns i MeshCores officiella webbflasher [^flasher]. Sändeffekten är
tillverkarens uppgift; ett streck betyder att tillverkaren inte anger den, eller att vi inte har
kunnat läsa den.

| Modell | Chip | Sändeffekt | Batteri och tålighet |
| --- | --- | --- | --- |
| Heltec V3 | ESP32-S3 | 21 ± 1 dBm [^v3] | – |
| Heltec V4 | ESP32-S3 | 28 ± 1 dBm [^v4] | solingång 4,7–6 V [^v4] |
| Heltec T114 | nRF52840 | 21 ± 1 dBm [^t114] | – |
| RAK4631 (WisBlock, WisMesh) | nRF52840 | 22 dBm [^rak] | – |
| Seeed T1000-E | nRF52840 | – | 700 mAh, IP65 [^t1000e] |
| Seeed Wio Tracker L1 Pro | nRF52840 | – | 2 000 mAh, solingång 5 V [^l1] |
| LilyGO T-Deck | ESP32 [^flasher] | – | – |

| Modell | Bäst till |
| --- | --- |
| Heltec V3, V4 | repeater på nätström, observatör (wifi) |
| Heltec T114, RAK4631 | repeater på batteri eller sol, companion |
| Seeed T1000-E, Wio Tracker L1 Pro | companion i fickan |
| LilyGO T-Deck | meddelanden utan telefon, med tangentbord |

> [!WARNING] Heltec V4 sänder starkare än inställningen
> Kortet har ett effektsteg efter radiokretsen: `set tx 22` ger cirka 28 dBm, över gränsen med en
> vanlig antenn. MeshCores FAQ anger 10 dBm i appen för 22 dBm ut [^faq]. Räkna ut din antenns
> värde i [MeshCore-inställningar i Sverige](../radioinstallningar/#sändeffekt-och-antenn).

> [!NOTE]- ESP32 eller nRF52?
> ESP32-korten har wifi, och det behövs för en observatör som skickar det den hör till kartan; se
> [Kartan och observatörer](../visa-pa-kartan/). nRF52-korten saknar wifi men är byggda för låg
> förbrukning, enligt tillverkarnas egna siffror: Heltec T114 drar cirka 11 µA i djupsömn och cirka
> 9 mA aktiv med GPS och skärm avstängda [^t114], och RAK4631 2,0 µA i sömn [^rak]. Därför väljer
> man nRF52 till en repeater på sol, där varje milliampere räknas; se [Solnoder](../solnoder/).
> Någon direkt jämförelse mellan de två chipfamiljerna i MeshCore har vi inte hittat.
>
> T-Deck kan också köra MeshCore utan telefon. Den firmwaren är gratis, men djupare kartzoom och
> fjärradministration låses upp för 10 dollar per enhet [^faq].

## Nästa steg

- [Välj och flasha firmware](../flasha-firmware/) på kortet.
- [Kom igång med en companion](../companion/), sedan [Första meddelandet](../forsta-meddelandet/).
- [Bygg en repeater](../bygg-en-repeater/) och [Sätt upp en repeater](../repeater/).

## Källor

[^flasher]: MeshCore, [webbflasherns enhetslista](https://flasher.meshcore.io/config.json), läst 18 november 2026.
[^v3]: Heltec, [WiFi LoRa 32 V3](https://heltec.org/project/wifi-lora-32-v3/).
[^v4]: Heltec, [WiFi LoRa 32 V4](https://heltec.org/project/wifi-lora-32-v4/), 868 MHz.
[^t114]: Heltec, [Mesh Node T114](https://heltec.org/project/mesh-node-t114/).
[^rak]: RAKwireless, [RAK4631 datasheet](https://docs.rakwireless.com/product-categories/wisblock/rak4631/datasheet/).
[^t1000e]: Seeed Studio, [SenseCAP Card Tracker T1000-E](https://www.seeedstudio.com/SenseCAP-Card-Tracker-T1000-E-for-Meshtastic-p-5913.html).
[^l1]: Seeed Studio, [Wio Tracker L1 Pro](https://www.seeedstudio.com/Wio-Tracker-L1-Pro-p-6454.html).
[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md), 4.9 och 7.7.
