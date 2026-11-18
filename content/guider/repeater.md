---
title: "Sätt upp en repeater"
seoTitle: "Sätt upp en MeshCore-repeater: guide"
description: "Sätt upp en MeshCore-repeater: plats, flashning, radio, namn, region, duty cycle och lösenord, finjustering av fördröjningar, test före montering och en checklista."
weight: 50
group: repeater
source:
  title: "Sätt upp en egen MeshCore-repeater"
  url: "https://meshat.se/meshcore/satt-upp-egen-repeater/"
  license: "CC BY 4.0"
  changes: "Omskriven och förkortad; radio och region från sidans inställningar; grundvärdena och tabellen över sändfördröjningar återgivna med källa; test och checklista omskrivna."
date: 2026-11-12
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

En **repeater** tar emot trafik och sänder den vidare. Varje välplacerad repeater gör att fler
når varandra, och det är så nätet i {{< region "name" >}} växer. Hur repeatrar, companions och
observatörer hänger ihop står i [Vad är MeshCore?](../vad-ar-meshcore/), och orden i
[ordlistan för MeshCore](../ordlista/).

Hellre ett formulär? Använd [snabbguiden](../../wizard/repeater-snabb/) eller [den guidade
wizarden](../../wizard/repeater-guidad/), som skickar kommandona åt dig.

> [!CAUTION] Antennen först
> Skruva fast antennen innan radion får ström. En LoRa-radio som sänder utan antenn kan gå sönder.

## 1. Välj plats

Platsen betyder mer än sändeffekten. En bra repeaterplats har:

- **höjd och fri sikt**, gärna över hustak och trädtoppar,
- **stabil ström**: nätström, eller solpanel och batteri dimensionerat för vintern,
- **fast montering**, väderskyddad om den står ute.

Fri sikt är mer än en linje: radiovågorna behöver ett område runt linjen som är fritt från hinder,
och det är brett på långa avstånd. Se [Antenner](../skaffa-hardvara/antenn/#fri-sikt-är-mer-än-en-linje).

Vill du se ungefär hur långt en plats når innan du klättrar, se [Kolla platsen med MeshMapper](../kolla-platsen/).

{{< region-photo "mount" >}}

En repeater ska stå still. Nätets vägar bygger på att repeatrarna inte flyttar sig, så en
repeater i en bil gör mer skada än nytta.

> [!TIP] Prova innan du klättrar
> Ställ in och testa repeatern där du lätt når den. Montera den i masten först när du sett att
> meddelanden kommer fram.

## 2. Flasha repeater-firmware

Följ [Välj och flasha firmware](../flasha-firmware/#repeater) och välj **Repeater** i den officiella
webbflashern. Vill du att repeatern också ska synas på kartan och rapportera trafik, välj en
*Observer*-firmware; den behöver wifi. Bygger du själv: [Bygg en repeater](../bygg-en-repeater/).

## 3. Ställ in med kommandon

Kommandona skrivs ett i taget i en seriell konsol, till exempel *Console* i
[MeshCore Flasher]({{< param "firmware.flasher" >}}), med radion ansluten via USB. Vänta på
svar efter varje kommando.

> [!WARNING] Standardvärdena räcker inte
> En nyflashad repeater sänder upp till 50 procent av tiden och har kodningshastigheten CR 5, medan
> nätet använder {{< param "radio.cr" >}} [^cli]. Ställ in allt nedan, även om radion verkar fungera.

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

Administratörslösenordet är `password` från början [^cli]. Byt det, annars kan vem som helst
nära radion ändra den.

```text {title="Nytt administratörslösenord"}
password ditt-langa-losenord
```

Starta om när allt är inställt, eller efter finjusteringen i nästa steg:

```text {title="Starta om"}
reboot
```

## 4. Finjustera

Det här är frivilligt, men gör nytta där det finns många repeatrar.

> [!NOTE]- Sändfördröjning: txdelay och direct.txdelay
> När flera repeatrar hör samma paket väntar var och en en slumpad stund innan den sänder vidare,
> så att de inte krockar. `txdelay` (flood-trafik, standard 0,5) och `direct.txdelay` (direkt
> trafik, standard 0,3) styr hur lång den stunden kan bli; högre värden ger färre krockar men
> långsammare trafik [^cli]. Räkna grannarna med `neighbors` och börja här [^meshat]:
>
> | Repeatergrannar | `txdelay` | `direct.txdelay` |
> | --- | --- | --- |
> | 0–1 | 0.3 | 0.1 |
> | 2–4 | 0.5 | 0.3 |
> | 5–9 | 1.0 | 0.5 |
> | 10–14 | 1.5 | 1.0 |
> | 15 eller fler | 2.0 | 2.0 |
>
> ```text {title="Exempel: 5–9 grannar"}
> set txdelay 1.0
> set direct.txdelay 0.5
> ```

> [!NOTE]- Väg-id: path.hash.mode
> Bestämmer hur många byte av repeaterns nyckel som används i vägen för dess egna adverts: 0 ger
> 1 byte, 1 ger 2 byte och 2 ger 3 byte [^cli]. Längre id förväxlas mer sällan, men vägen får
> färre hopp: 64, 32 respektive 21 [^faq]. Repeatrar med firmware 1.14 eller senare skickar vidare
> alla storlekar.
>
> ```text {title="3 byte"}
> set path.hash.mode 2
> ```

> [!NOTE]- Grundvärden: agc.reset.interval, multi.acks och rxdelay
> meshat.se föreslår de här tre som grund [^meshat]:
>
> - `set agc.reset.interval 500`: återställer mottagarens förstärkning med jämna mellanrum, i
>   sekunder (standard 0, av) [^cli].
> - `set multi.acks 1`: slår på stöd för flera kvittenser (standard 0) [^cli].
> - `set rxdelay 0`: stänger av den experimentella fördröjningen för svagt mottagna flood-paket
>   (standard 0) [^cli].

> [!NOTE]- Hur ofta repeatern berättar att den finns
> En repeater skickar en flood-advert var 47:e timme som standard, enligt CLI-referensen;
> MeshCores FAQ säger var 12:e timme [^cli] [^faq]. Värdet ändras med
> `set flood.advert.interval <timmar>` (3–168).

## 5. Kontrollera att den hörs

1. Vänta några minuter efter omstarten. Repeatern skickar då en advert.
2. Lista de repeatrar den har hört:

   ```text {title="Grannar"}
   neighbors
   ```

3. Titta på kartan på [startsidan](/). Har en observatör hört repeatern syns den där inom en
   stund, med länkar till grannarna.

## 6. Testa innan du monterar

Gör det här med repeatern på bordet, eller där du lätt når den.

1. Ställ två companions med samma värden som repeatern, och ställ dem så långt isär att de inte
   hör varandra direkt.
2. Låt repeatern stå mittemellan.
3. Skicka en advert från båda companions.
4. Kontrollera att de ser varandra i kontaktlistan, med repeatern på vägen.
5. Skicka ett direktmeddelande och vänta på kvittot.
6. Skriv `test` i länets testkanal {{< testchannel >}}, och se att din repeater finns bland dem
   som hörde det.

## 7. Checklista

- Rätt firmware för radion, och uppdaterad
- Antennen sitter i, innan ström
- Radioinställningarna med `set radio`
- Namn och position
- `set dutycycle 10`
- Nytt administratörslösenord
- Regionerna, sparade med `region save`
- Ström och låda klarar platsen och vintern
- Testad, och syns på kartan

## Om något krånglar

[Radion hör inga repeatrar](../../felsokning/hor-inga-repeatrar/), [Repeatern syns inte på kartan](../../felsokning/repeater-syns-inte-pa-kartan/) och [Kommandot region def ger fel](../../felsokning/region-def-fungerar-inte/). Fler problem och lösningar finns i [Felsökning](../../felsokning/).

## Nästa steg

- [Administrera repeatern från appen](../fjarradministration/): ändra inställningar när den sitter
  uppe, utan USB-kabel
- [Regioner](../regioner/): vad regionerna gör med trafiken
- Kartan på [startsidan](/): se din repeater och vilka den når

## Källor

[^cli]: MeshCore, [CLI-referensen](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md): `set radio`, `set dutycycle`, `password`, `txdelay`, `direct.txdelay`, `path.hash.mode`, `agc.reset.interval`, `multi.acks`, `rxdelay`, `flood.advert.interval`.
[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md): väg-id och hopp, flood-adverts.
[^meshat]: meshat.se, [Sätt upp en egen MeshCore-repeater](https://meshat.se/meshcore/satt-upp-egen-repeater/), steg 5 (CC BY 4.0).
