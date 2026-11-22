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
lastmod: 2026-11-22
checkedFirmware: "1.18"
checkedOn: 2026-11-18
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

MeshCore-appen finns för:

- **Android** (Google Play) och **iPhone** (App Store),
- **Windows** och **macOS**, att ladda ned från [meshcore.io](https://meshcore.io),
- **webbläsaren**: [app.meshcore.nz](https://app.meshcore.nz), i Chrome eller Edge, som kan
  ansluta till radion via Bluetooth eller USB. Det är också vägen på Linux.

1. Starta radion och slå på Bluetooth i telefonen.
2. Öppna MeshCore-appen och välj radion i listan.
3. Ange PIN-koden om appen frågar. Har radion en skärm visas koden där; annars är den ofta
   `123456`.

Appen visar kontakter, kanaler och meddelanden. Radion sköter sändningen.

> [!NOTE]- Kostar appen något?
> Nej, inte för att skicka och ta emot. Appen är gratis att ladda ned och använda. I mobilappen kan
> väntetiden för att administrera en repeater eller room server över radio låsas upp med ett köp i
> appen; appen för Windows och Mac är helt gratis [^faq].

## 3. Ställ in radion

Alla som ska höra varandra måste ha samma frekvens, bandbredd och spreading factor. I
{{< region "name" >}} gäller:

{{< settings >}}

Välj förinställningen i appens radioinställningar och spara. Sändeffekten väljer du efter radio,
antenn och vad som är tillåtet; många använder 22 dBm, men kontrollera vad din radio klarar.
Värdena och reglerna bakom dem: [MeshCore-inställningar i Sverige](../radioinstallningar/).

### Väg-id: 3 byte

Väg-id (path hash) är de byte av varje repeaters nyckel som skrivs in i ditt meddelandes väg. Det
är din companion som bestämmer storleken för det du skickar [^faq]. Appens standard är 1 byte, och
då delar många repeatrar samma id och förväxlas med varandra. **Ställ in 3 byte.** 2 byte är det
minsta du bör använda, och 1 byte ska du inte lämna kvar.

1. Öppna appens inställningar (kugghjulet).
2. Välj **Experimental Settings**.
3. Sätt storleken på path hash till 3 byte.

Det kräver companion-firmware 1.14 eller senare och appen 1.41.0 eller senare [^faq]. Repeatrar
med äldre firmware än 1.14 för inte vidare meddelanden med 2 eller 3 byte [^faq].

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
   [auto-svar](../firmware-lou/), annars i den vanliga `#test`. Inte i
   chattkanalerna. Repeatrar med auto-svar svarar, och du ser vilka som hörde dig.

Vad svaren betyder, och varför tystnad oftast är normalt: [Första meddelandet](../forsta-meddelandet/).

## 7. Testa med två radior

Svarar ingen repeater i testkanalen kan du prova med två egna radior, eller med en vän.

> [!NOTE]- Så testar du med två radior
> 1. Ställ in båda radiorna med samma värden som i steg 3.
> 2. Skicka en advert från båda.
> 3. Kontrollera att de ser varandra under kontakter i appen.
> 4. Skicka ett direktmeddelande från den ena till den andra och vänta på kvittot.
> 5. Gå isär, eller ställ den ena högre upp, och skicka igen. Så ser du hur långt de når.

{{< channels >}}

## Om något krånglar

> [!NOTE]- Flashern hittar inte radion
> Använd en USB-kabel som klarar data, prova en annan USB-port, och starta radion i
> bootloader-läge. Se [Webbläsaren hittar ingen port](../../felsokning/ingen-port/) och, för
> nRF52-kort, [nRF52-radion syns inte som en USB-enhet](../../felsokning/nrf52-ingen-enhet/).

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
- [Välj och flasha firmware](../flasha-firmware/): bygg om radion till repeater när du vill hjälpa nätet

## Källor

[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md), om apparna, köp i appen och väg-id (path hash).
