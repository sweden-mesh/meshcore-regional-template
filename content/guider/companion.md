---
title: "Kom igång med en companion"
seoTitle: "Kom igång med MeshCore: companion-guide"
description: "Din egen radio i nätet: flasha companion-firmware, anslut appen i telefonen eller datorn, ställ in radion och skicka ditt första test i testkanalen."
weight: 20
group: start
source:
  title: "Sätt upp en egen MeshCore Companion"
  url: "https://meshat.se/meshcore/satt-upp-egen-companion/"
  license: "CC BY 4.0"
  changes: "Omskriven och förkortad; flashningen i en egen guide; regionens inställningar från sidans parametrar; integritetsråd om position tillagt."
date: 2026-11-12
lastmod: 2026-11-17
---

En **companion** är din personliga radio. Du skriver i MeshCore-appen, och radion skickar och
tar emot över LoRa. Den för inte vidare andras trafik; det gör repeatrarna. Ny med MeshCore? Läs
[Vad är MeshCore?](../vad-ar-meshcore/) först, och slå upp orden i [ordlistan](../ordlista/).

## 1. Flasha companion-firmware

Companion-firmware finns i MeshCore-projektets [webbflasher]({{< param "firmware.flasher" >}}),
inte i firmwareväljaren. Ska du använda telefonen, välj **Bluetooth Companion**; ska radion sitta
i datorn, välj **USB Companion**. Steg för steg: [Flasha firmware](../flasha-firmware/#companion).
Har du ingen radio än: [Skaffa hårdvara](../skaffa-hardvara/).

## 2. Anslut appen

MeshCore-appen är gratis och finns för:

- **Android** (Google Play) och **iPhone** (App Store),
- **Windows** och **macOS**, att ladda ned från [meshcore.io](https://meshcore.io),
- **webbläsaren**: [app.meshcore.nz](https://app.meshcore.nz), i Chrome eller Edge, som kan
  ansluta till radion via Bluetooth eller USB. Det är också vägen på Linux.

1. Starta radion och slå på Bluetooth i telefonen.
2. Öppna MeshCore-appen och välj radion i listan.
3. Ange PIN-koden om appen frågar. Har radion en skärm visas koden där; annars är den ofta
   `123456`.

Appen visar kontakter, kanaler och meddelanden. Radion sköter sändningen.

## 3. Ställ in radion

Alla som ska höra varandra måste ha samma frekvens, bandbredd och spreading factor. I
{{< region "name" >}} gäller:

{{< settings >}}

Välj förinställningen i appens radioinställningar och spara. Sändeffekten väljer du efter radio,
antenn och vad som är tillåtet; många använder 22 dBm, men kontrollera vad din radio klarar.
Värdena och reglerna bakom dem: [MeshCore-inställningar i Sverige](../radioinstallningar/).

## 4. Ge radion ett namn

Namnet syns för andra när din radio skickar en *advert*, ett kort paket som säger att den finns.
Du väljer namnet själv; regionens namnförslag gäller repeatrar. Håll det inom 23 byte om
positionen ska få plats i samma advert.

{{< namecheck kind="companion" >}}

## 5. Position, eller inte

Position är frivillig. En companion följer med dig, så en delad position kan visa var du bor.
Dela den bara om du vill, och gärna avrundad.

> [!TIP] Kartan här visar inte companions
> Kartan på den här sidan visar repeatrar, inte companions, just för att skydda var folk bor.

## 6. Skicka en advert och testa

1. Skicka en advert från appen, så att andra ser att du finns.
2. Skriv `test` i regionens testkanal {{< testchannel >}} om regionen har repeatrar med
   [auto-svar]({{< param "firmware.picker" >}}#f=ar&install=update), annars i den vanliga `#test`. Inte i
   chattkanalerna. Repeatrar med auto-svar svarar, och du ser vilka som hörde dig.

Vad svaren betyder, och varför tystnad oftast är normalt: [Första meddelandet](../forsta-meddelandet/).

{{< channels >}}

## Om något krånglar

> [!NOTE]- Appen hittar inte radion
> Kontrollera att Bluetooth är på, att du flashade en *Bluetooth* companion och att radion inte
> redan är ansluten till en annan telefon. Ta bort den ur telefonens Bluetooth-lista och anslut på
> nytt via appen om den har parats tidigare.

> [!NOTE]- Ansluten, men jag hör ingen
> Gå igenom i tur och ordning: samma radioinställningar som ovan, antennen sitter i, du har skickat
> en advert, och det finns en repeater inom räckhåll (se kartan på startsidan).

> [!NOTE]- Det fungerar nära men inte långt bort
> Räckvidd handlar om höjd och fri sikt. Prova utomhus, högre upp och borta från metall.

Fler svar i Felsökning: [Appen kan inte ansluta till radion](../../felsokning/appen-ansluter-inte/), [Meddelanden kommer inte fram](../../felsokning/meddelanden-kommer-inte-fram/) och [Jag hör andra, men de hör inte mig](../../felsokning/hor-andra-men-inte-mig/).

## Nästa steg

- [Första meddelandet](../forsta-meddelandet/): kontakter, kvittenser och vad du kan vänta dig
- [Regioner](../regioner/): skicka med rätt region i chattkanalerna
- [Flasha firmware](../flasha-firmware/): bygg om radion till repeater när du vill hjälpa nätet
