---
title: "Sätt upp en repeater"
seoTitle: "Sätt upp en MeshCore-repeater: guide"
description: "En repeater gör nätet större. Så väljer du plats, flashar, ställer in radio, namn, position och region, och kontrollerar att den hörs."
weight: 50
group: repeater
source:
  title: "Sätt upp en egen MeshCore-repeater"
  url: "https://meshat.se/meshcore/satt-upp-egen-repeater/"
  license: "CC BY 4.0"
  changes: "Omskriven och förkortad; radio och region från sidans inställningar; finjusteringen av fördröjningar länkad i stället för återgiven."
date: 2026-11-12
lastmod: 2026-11-18
---

En **repeater** tar emot trafik och sänder den vidare. Varje välplacerad repeater gör att fler
når varandra, och det är så nätet i {{< region "name" >}} växer. Hur repeatrar, companions och
observatörer hänger ihop står i [Vad är MeshCore?](../vad-ar-meshcore/), och orden i
[ordlistan för MeshCore](../ordlista/).

> [!CAUTION] Antennen först
> Skruva fast antennen innan radion får ström. En LoRa-radio som sänder utan antenn kan gå sönder.

## 1. Välj plats

Platsen betyder mer än sändeffekten. En bra repeaterplats har:

- **höjd och fri sikt**, gärna över hustak och trädtoppar,
- **stabil ström**: nätström, eller solpanel och batteri dimensionerat för vintern,
- **fast montering**, väderskyddad om den står ute.

{{< region-photo "mount" >}}

En repeater ska stå still. Nätets vägar bygger på att repeatrarna inte flyttar sig, så en
repeater i en bil gör mer skada än nytta.

> [!TIP] Prova innan du klättrar
> Ställ in och testa repeatern där du lätt når den. Montera den i masten först när du sett att
> meddelanden kommer fram.

## 2. Flasha repeater-firmware

Följ [Flasha firmware](../flasha-firmware/) och välj typen *repeater*. Vill du att repeatern
också ska synas på kartan och rapportera trafik, välj funktionen *Observer*; den behöver wifi.

## 3. Ställ in med kommandon

Kommandona skrivs ett i taget i en seriell konsol, till exempel *Console* i
[MeshCore Flasher]({{< param "firmware.flasher" >}}), med radion ansluten via USB. Vänta på
svar efter varje kommando.

### Radio

Samma inställningar som alla andra i {{< region "name" >}} (varför de är just de här: [MeshCore-inställningar
i Sverige](../radioinstallningar/)):

{{< settings >}}

```text {title="Radioinställningar"}
set radio {{< param "radio.freq" >}},{{< param "radio.bw" >}},{{< param "radio.sf" >}},{{< param "radio.cr" >}}
```

```text {title="Sändeffekt (exempel; kontrollera vad din radio och antenn klarar)"}
set tx 22
```

### Namn och position

Namnet syns för alla när repeatern skickar adverts. Använd ortnamnet eller platsen, så att
andra förstår var den står, och håll det inom 23 byte så att positionen får plats i samma
advert.

```text {title="Namn"}
set name SE-EXEMPEL-Plats
```

```text {title="Position (decimalgrader)"}
set lat 57.7826
set lon 14.1618
```

En repeaters position är bra att dela: den står still och den visar var nätet når.

### Region

Repeatern behöver regionerna för Europa, hela Sverige och länet, med länet som hemregion och
`se` som standardregion (repeater-firmware 1.16 eller senare). Hur och varför står i
[Regioner](../regioner/):

```text {title="Regioner"}
set flood.max.unscoped 16
region allowf *
region def eu|* europe|eu se {{< region "scope" >}}
region home {{< region "scope" >}}
region default se
region save
```

### Duty cycle

Duty cycle begränsar hur stor del av tiden radion får sända. I bandet 869,4–869,65 MHz, där
869,618 MHz ligger, är kravet högst 10 procent av tiden, om radion inte använder LBT-teknik (lyssna
innan den sänder). Det gäller i hela EU, i Sverige genom [PTSFS 2025:1](https://pts.se/contentassets/b05c8a7d01a64783aafc6a19e1b78590/ptsfs-2025-1-foreskrifter-om-undantag-fran-tillstandsplikt-for-anvandning-av-vissa-radiosandare.pdf) § 146.
MeshCore räknar med 10 procent.
Det gäller varje sändare, även en repeater.

Gränsen skyddar också nätet. Medan en repeater sänder kan grannarna som hör den inte sända
själva, och sänder två samtidigt krockar paketen. En repeater som sänder för mycket dränker
repeatrarna runt sig, och deras trafik når inte fram. 10 är taket, inte ett mål: sätt den aldrig
högre.

```text {title="Duty cycle"}
set dutycycle 10
```

### Lösenord

Byt administratörslösenordet, annars kan vem som helst nära radion ändra den.

```text {title="Nytt administratörslösenord"}
password ditt-langa-losenord
```

Starta om när allt är inställt:

```text {title="Starta om"}
reboot
```

## 4. Kontrollera att den hörs

1. Vänta några minuter efter omstarten. Repeatern skickar då en advert.
2. Lista de repeatrar den har hört:

   ```text {title="Grannar"}
   neighbors
   ```

3. Titta på kartan på [startsidan](/). Har en observatör hört repeatern syns den där inom en
   stund, med länkar till grannarna.

> [!NOTE]- Finjustering
> När flera repeatrar hör samma paket kan små sändfördröjningar (`txdelay`, `direct.txdelay`)
> minska krockarna. Värdena beror på hur många grannar repeatern har; meshat.se:s
> [repeaterguide](https://meshat.se/meshcore/satt-upp-egen-repeater/) går igenom dem.

## Om något krånglar

[Radion hör inga repeatrar](../../felsokning/hor-inga-repeatrar/), [Repeatern syns inte på kartan](../../felsokning/repeater-syns-inte-pa-kartan/) och [Kommandot region def ger fel](../../felsokning/region-def-fungerar-inte/). Fler problem och lösningar finns i [Felsökning](../../felsokning/).

## Nästa steg

- [Administrera repeatern från appen](../fjarradministration/): ändra inställningar när den sitter
  uppe, utan USB-kabel
- [Regioner](../regioner/): vad regionerna gör med trafiken
- Kartan på [startsidan](/): se din repeater och vilka den når
