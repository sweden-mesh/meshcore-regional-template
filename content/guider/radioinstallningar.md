---
title: "MeshCore-inställningar i Sverige"
seoTitle: "MeshCore i Sverige: frekvens och regler"
description: "Vilken frekvens och vilka radioinställningar MeshCore använder i Sverige, vad PTS regler säger om effekt och duty cycle på 868 MHz, och fällorna i standardvärdena."
weight: 104
group: radio
date: 2026-11-18
lastmod: 2026-11-18
---

MeshCore i Sverige använder förinställningen **{{< param "radio.preset" >}}** på {{< param "radio.freq" >}} MHz.
Inget tillstånd behövs: bandet är fritt att använda inom gränserna nedan. Alla radior i nätet måste
ha samma värden, annars hör de inte varandra.

## Värdena

{{< settings >}}

I appen väljer du förinställningen **{{< param "radio.preset" >}}**. På en repeater, i
[USB-konsolen](../usb-konsol/):

```text {title="Konsol"}
set radio {{< param "radio.freq" >}},{{< param "radio.bw" >}},{{< param "radio.sf" >}},{{< param "radio.cr" >}}
```

MeshCore har ingen egen förinställning för Sverige; nätet här använder den för EU och
Storbritannien [^presets]. Regionen (scope) beror på länet, se [Regioner](../regioner/).

## Reglerna

Reglerna står i PTS föreskrifter [PTSFS 2025:1](https://pts.se/contentassets/b05c8a7d01a64783aafc6a19e1b78590/ptsfs-2025-1-foreskrifter-om-undantag-fran-tillstandsplikt-for-anvandning-av-vissa-radiosandare.pdf) [^ptsfs]. MeshCore sänder i det delband
som tillåter mest:

| Delband | Effekt | Villkor | MeshCore? |
| --- | --- | --- | --- |
| 869,40–869,65 MHz (§ 146) | 500 mW ERP | LBT eller högst 10 % av tiden | ja, {{< param "radio.freq" >}} MHz |
| 868,0–868,6 MHz (§ 141) | 25 mW ERP | högst 1 % | nej |
| 868,7–869,2 MHz (§ 143) | 25 mW ERP | högst 0,1 % | nej |
| 433,05–434,79 MHz (§ 124) | 15 mW ERP | | nej, inte i näten här |

Därför är en annan frekvens inte ett fritt val: grannbanden tillåter en tjugondel av effekten och
en tiondel av tiden eller mindre.

## Sändeffekt och antenn

Gränsen gäller ERP, alltså radions effekt minus kabelförlusten plus antennens vinst, räknat mot en
halvvågsdipol: dBd = dBi − 2,15 [^ptsfs]. De flesta kort ger högst 22 dBm, och då håller du dig
inom 500 mW med en vanlig antenn. Kort med ett effektsteg, som Heltec V4, ger mer än `set tx`
säger.

| Uteffekt | Kabel | Antenn | ERP | Inom gränsen? |
| --- | --- | --- | --- | --- |
| 22 dBm | 1 dB | 3 dBi | cirka 150 mW | ja |
| 22 dBm | 1 dB | 6 dBi | cirka 310 mW | ja |
| 28,4 dBm (Heltec V4, `set tx 22`) | 0 dB | 3 dBi | cirka 850 mW | **nej** |
| 25,3 dBm (Heltec V4, `set tx 16`) | 0 dB | 3 dBi | cirka 420 mW | ja |

```text {title="ERP"}
ERP (dBm) = uteffekt (dBm) − kabelförlust (dB) + antennvinst (dBi) − 2,15
```

Heltec V4 gav 28,4 dBm på `set tx 22`, uppmätt med kalibrerad mätare på tre kort [^v4]. Med ett
sådant kort räknar du ut ERP innan du sätter `set tx`, och sänker den tills summan håller.

## Duty cycle

Högst 10 procent av tiden betyder högst 360 sekunders sändning per timme, för varje sändare,
även en repeater. MeshCore håller räkningen och väntar när gränsen nås; se [Duty cycle är
nådd](../../felsokning/duty-cycle/).

> [!NOTE]- LBT eller 10 procent
> § 146 tillåter en radio att sända mer än 10 procent av tiden om den använder en teknik som
> lyssnar innan den sänder (LBT) [^ptsfs]. MeshCore räknar med gränsen på 10 procent.

## Fällor i standardvärdena

Firmwarens egna standardvärden är inte nätets [^cli]:

- **Kodningshastigheten (CR)** är 5 i firmwaren, men nätet använder {{< param "radio.cr" >}}. En
  radio med CR 5 hör de andra sämre. Sätt hela raden med `set radio` ovan.
- **Duty cycle** är 50 procent i firmwaren. På en repeater sätter du `set dutycycle 10`, se
  [Sätt upp en repeater](../repeater/#duty-cycle).

## Gamla inställningar

Den äldre förinställningen för EU och Storbritannien, 869,525 MHz med SF11, BW 250 och CR 5, är
markerad som utgången [^presets]. Har du den i gamla anteckningar: byt till värdena ovan.

## Källor

[^ptsfs]: PTS, [PTSFS 2025:1](https://pts.se/contentassets/b05c8a7d01a64783aafc6a19e1b78590/ptsfs-2025-1-foreskrifter-om-undantag-fran-tillstandsplikt-for-anvandning-av-vissa-radiosandare.pdf), föreskrifter om undantag från tillståndsplikt för användning av vissa radiosändare, § 2, § 124, § 141, § 143 och § 146.
[^presets]: MeshCore, [radio presets](https://github.com/meshcore-dev/MeshCore/blob/main/docs/radio_presets.md).
[^cli]: MeshCore, [CLI-referensen](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md).
[^v4]: [MeshCore issue 1708](https://github.com/meshcore-dev/MeshCore/issues/1708).
