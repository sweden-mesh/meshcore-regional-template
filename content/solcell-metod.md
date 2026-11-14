---
title: "Solcellskalkylatorn: metod och verifiering"
description: "Hur batteribehovet för en solcellsdriven MeshCore-repeater räknas fram: modell, antaganden, data, kontroller, kända svagheter och hur du räknar om siffrorna själv."
url: "/wizard/solcell/metod/"
lead: false
build:
  list: never
sitemap:
  disable: true
---

Den här sidan beskriver metoden bakom [solcellskalkylatorn](/wizard/solcell/). Den är skriven för
den som vill granska eller räkna om siffrorna. Avsnitten är numrerade B.1–B.16; referensskriptet
hänvisar till dem.

Siffror i texten är märkta med hur de ska läsas:

| Märkning | Betydelse |
|---|---|
| *aktuell* | Hämtad ur kalkylatorns data för att förklara. Datafilen gäller alltid före texten. |
| *historisk* | Från en ersatt version av modellen. Visar bara vad som ändrats. |
| *känslighet* | En tänkt körning. Används aldrig för dimensionering. |
| *exempel* | Ett steg i det räknade exemplet (B.8). |
| *testvektor* | För den som räknar om. Jönköpingsvärden gäller den avrundade punkten 57,78° N, 14,16° Ö, som datan också använder. |
| *fältmätning* | Från fälttestet inomhus, med en annan laddare. Används aldrig för dimensionering. |
| *kontrollresultat* | Utfallet av en kontroll. |

Formelkonstanter och indata i B.2–B.7 är inte märkta: de definierar metoden.

## B.1 Vad siffrorna svarar på, och inte {#b1}

**Frågan.** Hur stor batterikapacitet behöver en solcellsdriven MeshCore-repeater för att inte bli
strömlös en dålig vinter? En dålig vinter är här den sämsta vintern på fem år.

**Svaret.** Ett batteribehov i mAh, före säkerhetsmarginal, per plats, panelvinkel, trädlinje,
firmware och panelstorlek. Varje fall har tre värden: ett centralt, ett lågt (optimistiskt) och ett
högt (pessimistiskt). Kalkylatorn lägger sedan till snödagar och marginal och räknar om till ett
antal celler.

**Det besvarar inte:** radioräckvidd, täckning eller placering; sommarens beteende, utom som den
tid då batteriet laddas fullt; priser eller vilken cell man ska köpa; repeatrar med annan hårdvara,
andra laddare eller mycket högre förbrukning (metoden går att överföra, siffrorna inte).

## B.2 Systemet som modelleras {#b2}

| Del | Antagande |
|---|---|
| Radiokort | Seeed XIAO nRF52840 med radiomodulen Wio-SX1262, matad från en grupp litiumjonceller parallellt (1S) |
| Laddare | CN3791-solladdarkort. Håller panelen vid en fast spänning, inställningen, här 5,0 V. Högst 2 A in i batteriet. Kortets lysdioder borttagna. |
| Batteri | 1S litiumjon, 18650-celler parallellt. Kalkylatorn räknar med 3000 mAh per cell, nominellt. |
| Panel | Clas Ohlsons panel "Northlight Flexible Solar System", såld som 15 W (art. 36-9423), med elektroniken borttagen. Ett laminat av 10 eller 11 skurna cellremsor i serie, tomgångsspänning cirka 6,0–6,6 V i full sol. Modellerad som cirka 10 W verklig effekt i full sol. |
| Andra panelstorlekar | Samma paneltyp skalad efter yta: samma spänning, samma beteende i svagt ljus, mer eller mindre yta |
| Placering | Rakt mot söder. Lodrät (standard), 60° eller 40°. |
| Träd | Inga träd (PVGIS egen terränghorisont), eller en jämn trädlinje runt om på 10°, 15°, 20°, 30° eller 50° |

**Panelens spänning spelar roll.** Alla panelstorlekar i datan antas vara 6 V-paneler av den här
typen, hållna vid 5,0 V, cirka 77 % av tomgångsspänningen i full sol.

- En vanlig 12 V-panel (36 celler, cirka 21 V tomgång) på en laddare inställd på 5,0 V skulle
  förlora det mesta av sin effekt. Siffrorna gäller inte den.
- Inställd på samma andel av sin egen tomgångsspänning (cirka 16 V), och med celler som beter sig
  som den här panelens, ger en sådan panel samma resultat i modellens ekvationer utom för
  laddarens egen förbrukning, som är ungefär tre gånger större vid 16 V än vid 5,0 V. *Känslighet:*
  i Jönköping, lodrät, 20° träd, höjer det det centrala behovet med cirka 35–65 % för paneler på
  5–30 W och det höga med cirka 5–15 %. För sådana paneler är siffrorna optimistiska.

**Repeaterns förbrukning.** Antas konstant dygnet runt.

| Firmware | Medelström vid batteriet | Per dygn |
|---|---|---|
| EasySkyMesh (strömsparande gren), `powersaving on` och `set radio.rxps max` | 4,5 mA | 108 mAh |
| Officiell MeshCore med `powersaving on` | 7,1 mA | 170,4 mAh |

**Var förbrukningen kommer ifrån.** Ingen av siffrorna är uppmätt på en färdig nod. Båda är
uppskattningar från september 2026, byggda på publicerade mätningar på samma XIAO nRF52840 +
Wio-SX1262.

- **EasySkyMesh, 4,5 mA** (trolig; spann 4,1–5,4 mA). Radio och processor ger 4,3 mA, från en
  anpassning till 20 publicerade strömmätningar av grenens mottagningscykling (cirka 0,66 mA plus
  6,29 mA gånger den andel av tiden radion lyssnar), framskriven till läget `max` i release
  PowerSaving 17.1.3: 0,66 + 6,29 × 0,58 ≈ 4,3 mA. Sändning lägger till cirka 0,16 mA (2 minuter
  sändtid per dygn vid 118 mA). Läckströmmar lägger till cirka 0,05 mA, mest laddkortets egen
  förbrukning på natten.
- **Officiell firmware, 7,1 mA** (trolig; spann 5,9–8,0 mA). Utgår från en publicerad mätning på
  6,92 mA på det här kortet, med strömsparläge, radion alltid lyssnande och ingen trafik, plus samma
  tillägg för sändning och läckage.
- **Trafik.** Båda antar ett lugnt nät: 2 minuter sändning per dygn och ingen extra mottagningstid.
  En upptagen repeater drar mer; för upptagna platser är förbrukningen optimistisk.
- En strömlogg över ett dygn på en riktig nod skulle ersätta båda (B.13).

**Var 10 W kommer ifrån.** Ett planeringsantagande från den första dimensioneringen i september
2026: ett billigt laminat med skurna celler, sålt som 15 W, antogs ge ungefär två tredjedelar av
märkningen. Det är inte uppmätt i full sol. *Känslighet:* den enda fältmätningen (B.4 steg 4)
extrapolerar till cirka 10–15 W, med en typisk fyllnadsfaktor 0,7 och 340–500 W/m² på panelen;
10 W är alltså på den försiktiga sidan. Uppskattningen gjordes när det här dokumentet skrevs och är
inte granskad. I kalkylatorn väljer besökaren panelens verkliga effekt, så antagandet sätter bara
standardvärdet 10 W.

## B.3 Väderdata {#b3}

**Källa.** PVGIS version 5.3, EU:s gemensamma forskningscentrums fria soldatabas, tjänsten
"seriescalc" med timvärden för åren 2005–2023: 166 536 timmar per fil.

**Dataset.**

- PVGIS-SARAH3, satellitbaserade solljusdata, för 19 av de 20 punkterna.
- PVGIS-ERA5, en återanalys från ECMWF, för Norrbotten, vars punkt ligger norr om SARAH3:s täckning
  (som slutar vid cirka 65° N).
- Lufttemperatur och vindhastighet ingår i samma fil; för SARAH3-punkter tar PVGIS dem från ERA5.

En *återanalys* som ERA5 är en vädermodell körd bakåt över tidigare decennier, matad med
observationer, som ger konsekventa timvärden överallt.

**Anropet, exakt som det gjordes.**

```text
https://re.jrc.ec.europa.eu/api/v5_3/seriescalc?lat={lat}&lon={lon}&raddatabase={db}&startyear=2005&endyear=2023&components=1&outputformat=csv&angle={tilt}&aspect=0
```

- `angle` är lutningen från horisontalplanet: 90, 60 eller 40. `aspect=0` betyder söder.
- `components=1` delar ljuset på panelen i direkt (`Gb(i)`), diffust (`Gd(i)`) och markreflekterat
  (`Gr(i)`), i W/m².
- För en trädlinje på h grader läggs `&userhorizon=h,h,h,h,h,h,h,h` till: åtta lika värden, en jämn
  horisont på h° runt om.
- **Trädlinje 0 skickar ingen `userhorizon`.** PVGIS använder då sin egen terränghorisont för
  punkten, som inte är platt. I kuperade norra trakter skymmer terrängen ensam en del vintersol.
- För trädlinjer från 10° ersätter den jämna horisonten PVGIS terränghorisont; den läggs inte till.
- Inga andra parametrar skickas.
- En fil per punkt, vinkel och trädlinje: 20 × 3 × 6 = 360 filer, cirka 2,9 GB.

**Filen.** Dataraderna följer raden som börjar med `time,` och slutar vid första tomma rad.
Modellen använder `time` (t.ex. `20050101:0011`; SARAH3-rader ligger på minut 11, ERA5-rader på
minut 30; tiderna är UTC), `Gb(i)`, `Gd(i)`, `Gr(i)` (W/m²), `T2m` (lufttemperatur 2 m, °C) och
`WS10m` (vind 10 m, m/s). `H_sun` och `Int` används inte; *kontrollresultat:* `Int`, som markerar
rekonstruerade timmar, var 0 i alla timmar i de nio filerna i B.14.

**Dygn.** Ett dygn är ett UTC-datum, de första 8 tecknen i tidsstämpeln. UTC-midnatt är kl. 01
svensk vintertid, alltså mörkt, så inga dagsljustimmar delas.

**De 20 punkterna.** Varje län representeras av en punkt: tyngdpunkten av länets observatörer.
Stockholm och Uppsala delar punkt. Treställiga koder är etiketter lånade från en flygplatskod i
länet; punkterna ligger inte vid flygplatserna. Höjden är värdet i PVGIS-filens huvud. *Indata.*

| Kod | Län | Latitud | Longitud | Höjd (m) | Dataset |
|---|---|---|---|---|---|
| JKG | Jönköping | 57,78 | 14,16 | 104 | SARAH3 |
| BLE | Dalarna | 60,972 | 14,37 | 290 | SARAH3 |
| GOT | Västra Götaland | 58,318 | 12,91 | 77 | SARAH3 |
| GVX | Gävleborg | 61,477 | 16,3 | 228 | SARAH3 |
| HAD | Halland | 56,976 | 12,827 | 149 | SARAH3 |
| KLR | Kalmar | 57,252 | 16,05 | 107 | SARAH3 |
| KSD | Värmland | 59,786 | 13,154 | 65 | SARAH3 |
| LLA | Norrbotten | 66,951 | 20,1 | 387 | **ERA5** |
| LPI | Östergötland | 58,368 | 15,662 | 89 | SARAH3 |
| MMX | Skåne | 55,964 | 13,603 | 145 | SARAH3 |
| NYO | Södermanland | 59,094 | 16,7 | 45 | SARAH3 |
| ORB | Örebro | 59,376 | 14,998 | 208 | SARAH3 |
| OSD | Jämtland | 63,267 | 14,329 | 294 | SARAH3 |
| RNB | Blekinge | 56,296 | 15,204 | 35 | SARAH3 |
| SDL | Västernorrland | 63,116 | 17,271 | 217 | SARAH3 |
| STO | Stockholm och Uppsala | 59,794 | 17,872 | 45 | SARAH3 |
| UME | Västerbotten | 64,87 | 17,837 | 325 | SARAH3 |
| VBY | Gotland | 57,482 | 18,514 | 34 | SARAH3 |
| VST | Västmanland | 59,82 | 16,341 | 71 | SARAH3 |
| VXO | Kronoberg | 56,803 | 14,585 | 151 | SARAH3 |

**Jönköpingspunkten.** Jönköpings punkt är avrundad till två decimaler. Kalkylatorns data (v4) är
räknad i exakt den punkten, så tabellen, datan och referensskriptet stämmer exakt. Tidigare versioner
använde en privat plats i närheten. *Historisk:* bytet till den avrundade punkten ändrade 317 av
1 836 behovsvärden för Jönköping, med högst 8,3 mAh; inget golv ändrades; ett värde nära gränsen
där inget batteri räcker blev null (lodrät, officiell firmware, 50° träd, 3 W, låg variant); inget
avrundat tabellvärde och inget resultat i kalkylatorn ändrades.

## B.4 Från solljus till laddning, timme för timme {#b4}

Varje rad i PVGIS-filen är en timme. Modellen kör stegen nedan för varje timme 2005–2023.

**Steg 1. Träden skymmer en del av den diffusa himlen.** Trädlinjen döljer himlens nedre del.
Modellen behandlar träden som svarta och jämna runt om och multiplicerar det diffusa ljuset med en
himmelsfaktor R:

```text
G = Gb(i) + R × Gd(i) + Gr(i)        [W/m² på panelen]
```

- **R** är den andel av den panelviktade himmelsljusstyrkan som syns ovanför en trädlinje på h
  grader. R = 1 utan träd.
- **Himlens ljusstyrka** följer Muneers lag för mulen himmel: proportionell mot (1 + b·sin e) vid
  höjden e, med b = 5,73, Muneers index för skuggade ytor (ur hans publicerade konstant
  2b/[π(3+2b)] = 0,25227).
- **Varför den himlen.** PVGIS räknar `Gd(i)` med Muneers modell och använder konstanten 0,25227
  när solen är bakom horisonten. R använder samma himmelsform, så den stämmer med PVGIS antagande
  de timmar solen är bakom träden. Bakom 20° träd i Jönköping gäller det alla dagsljustimmar från
  slutet av oktober till mitten av februari. När solen står över trädlinjen är R något mildare än
  PVGIS egen himmelsform skulle ge.
- **Beräkning.** Numeriskt över himlahalvsfären 0–90° höjd, på ett rutnät 180 × 180 med
  cellmittpunkter: 0,5° i höjd och 2° i azimut, symmetriskt kring söder. Varje cell viktas med
  ljusstyrkan, med cosinus för vinkeln mellan cellen och panelens riktning (noll bakom panelen) och
  med cos(e) för cellens rymdvinkel. R är summan av vikterna för celler med mittpunkt ovanför h,
  delad med summan över alla celler.
- `Gb(i)` och `Gr(i)` används som PVGIS ger dem i filen för den trädlinjen; PVGIS har redan tagit
  bort direkt sol när solen är bakom horisonten.
- **Varför R ändå behövs.** De timmar solen är bakom den angivna horisonten skiljer sig `Gd(i)` och
  `Gr(i)` från filen med fri horisont. *Kontrollresultat:* på en lodrät panel är `Gd(i)` cirka 0,71
  gånger värdet med fri horisont i mulna timmar. Det är PVGIS som byter från sin solbelysta till sin
  skuggade Muneer-formel, ett byte av antagen himmelsform; den delen av himlen som döljs av träden
  tas inte bort. Därför används R ändå.

| Vinkel | 10° träd | 15° | 20° | 30° | 50° |
|---|---|---|---|---|---|
| Lodrät | 0,9041 | 0,8351 | 0,7550 | 0,5742 | 0,2264 |
| 60° | 0,9495 | 0,9091 | 0,8587 | 0,7309 | 0,4136 |
| 40° | 0,9681 | 0,9400 | 0,9026 | 0,7992 | 0,4891 |

*Känslighet, används inte:* med jämn himmel (b = 0) vore R för lodrät vid 20° 0,5732 i stället för
0,7550; med b = 2, CIE:s klassiska mulna himmel, 0,6910.

**Steg 2. Panelens effekt i bästa arbetspunkt.**

```text
P_mpp = Wp × G/1000 × LL(G) × (1 + 0.004 × (25 − T2m))      [W]
```

- `Wp` är panelens verkliga effekt i full sol (1000 W/m², 25 °C), inte märkeffekten: 0,15–300 W i
  datan, 10 W för Clas Ohlsons panel.
- `(1 + 0.004 × (25 − T2m))` är kristallint kisels vanliga vinst i kyla, 0,4 % per grad, med
  lufttemperatur, inte paneltemperatur (B.12).
- `LL(G)` är kurvan för svagt ljus: panelens verkningsgrad relativt full sol, linjärt interpolerad i
  log10(G) mellan punkterna nedan. 0 vid högst 3 W/m², 1 över 400 W/m².

| G (W/m²) | 3 | 5 | 10 | 20 | 50 | 100 | 200 | 400 |
|---|---|---|---|---|---|---|---|---|
| Standardkurva | 0 | 0,35 | 0,55 | 0,70 | 0,85 | 0,92 | 0,97 | 1,0 |
| Pessimistisk kurva | 0 | 0,20 | 0,40 | 0,58 | 0,78 | 0,88 | 0,95 | 1,0 |

Kurvorna är en bedömning av formen för ett billigt monokristallint laminat med skurna celler, i
stil med kurvorna i standarden IEC 61853-1. De är inte uppmätta på panelen. IEC 61853-1 slutar vid
100 W/m², så kurvan därunder saknar stöd i standarden. Publicerade mätningar på 41 celler från åtta
tillverkare (Reich m.fl. 2009) gav verkningsgrader vid cirka 3 W/m² från ungefär 0,1 till 0,8 av
värdet i full sol, med stora skillnader även inom samma tillverkare. Kurvorna är alltså ett band,
inte ett känt värde; därför använder den höga varianten den pessimistiska kurvan.

**Steg 3. Panelens temperatur** (Faimans modell):

```text
Tc = T2m + G / (25.0 + 6.84 × WS10m)      [°C]
```

25,0 och 6,84 är Faimans ursprungliga koefficienter och standardvärdena i pvlib. PVGIS använder 26,9
och 6,2 för fristående kristallina paneler, vilket ger nästan samma temperatur vid vanliga
vindhastigheter. Tc används bara för panelens spänning i steg 4.

**Steg 4. Startar laddaren, och vad får den?** CN3791 börjar ladda först när panelens
tomgångsspänning når cirka 1,02 gånger inställningen, alltså 5,10 V. Faktorn kommer från databladet:
MPPT-stiftet startar vid 1,23 V och reglerar vid 1,205 V, och 1,23/1,205 ≈ 1,02. I svagt ljus
sjunker panelens spänning, så en mörk dag startar laddaren kanske aldrig.

Panelens spänning modelleras som en ideal diod utan serie- eller parallellresistans:

```text
I/Isc = 1 − (e^(V/a) − 1) / (e^(Voc/a) − 1)
a(Tc) = Ns × n × k × (Tc + 273.15) / q          Ns = 11, k = 1.380649e-23 J/K, q = 1.602176634e-19 C
Voc(G, Tc) = Voc_stc × (1 − 0.003 × (Tc − 25)) + a(Tc) × ln(G/1000)
```

- `Isc` är kortslutningsströmmen, `Voc` tomgångsspänningen, `Vmp` spänningen vid högsta effekt.
- `n` är diodens idealitetsfaktor. Den avgör hur fort spänningen faller i svagt ljus, och är den
  viktigaste omätta panelparametern; de tre varianterna i B.6 skiljer sig i den.
- Bara produkten Ns × n spelar roll. Varje variant ger en mätbar spänningslutning: ökningen av Voc
  per tiodubbling av kortslutningsströmmen, 0,85 V (låg), 0,98 V (central) och 1,30 V (hög) vid
  25 °C. Med 10 celler i stället för 11 vore n 10 % högre för samma lutning; cellantalet påverkar
  alltså inte resultatet.
- Timmar med G = 0 har f = 0; logaritmen tas aldrig av noll.

**Kalibrering.** `Voc_stc` sätts så att modellen återger den enda fältmätningen (*fältmätning*):
Voc 5,897 V med kortslutningsström 1,115 A, i början av november 2026, inomhus, panelen stående i
ett söderfönster bakom två glasrutor. Modellen antar 340 W/m² på panelen och 30 °C i cellen vid
mätningen:

```text
Voc_stc = (5.897 − a(30 °C) × ln(340/1000)) / (1 − 0.003 × 5)
        = 6.3959 V (n = 1.3), 6.4589 V (n = 1.5), 6.6163 V (n = 2.0)
```

- **Räkna Voc_stc med full dubbel precision ur formeln.** De fyrdecimala värdena är avrundade för
  visning; att sätta in dem ändrar vissa behov med upp till 0,6 mAh, och några testvektorer i B.14
  stämmer då inte.
- Hur 340 W/m² och 30 °C uppskattades skrevs inte ner. *Kontrollresultat:* 340 W/m² motsvarar en
  kortslutningsström i full sol på cirka 3,3 A, nära fältanteckningarnas förväntan på cirka 3 A.
- *Kontrollresultat:* en senare granskning bedömde 350–500 W/m² och 35–45 °C i cellen som
  troligare. De två felen verkar åt olika håll och tar till stor del ut varandra. *Känslighet:*
  kalibreringspunkten ensam är värd cirka ±25 % på resultatet vid 5,0 V.

**Laddarens andel.** Om panelens Voc den timmen är minst 1,02 × 5,0 V går laddaren, och får
panelens effekt vid 5,0 V i stället för i bästa punkten:

```text
f = P(5.0 V) / P(Vmp)    om Voc ≥ 5.10 V,   annars f = 0
```

Med y = Voc/a och x_m = Vmp/a löser x_m ekvationen x + ln(1 + x) = y. Då är
P(Vmp) ∝ x_m × (1 − (e^x_m − 1)/(e^y − 1)) och P(5.0 V) ∝ x_s × (1 − (e^x_s − 1)/(e^y − 1)) med
x_s = 5.0/a; den gemensamma faktorn a × Isc tar ut sig. Modellens kod löser x_m med 30 varv av
iterationen x ← y − ln(1 + x) från x = y; vilken exakt lösare som helst ger samma publicerade
värden. f begränsas till mellan 0 och 1.

**Två panelbeskrivningar, ingen dubbelräkning.** Panelens effekt kommer bara från `Wp` och `LL(G)` i
steg 2. Diodmodellen används bara för laddarens startvillkor och kvoten f; dess absoluta ström och
effekt används aldrig (*känslighet:* de skulle motsvara en panel på cirka 16 W i full sol).
Fysikgranskningen (B.9) kontrollerade att LL och f inte räknar samma förlust två gånger: LL skalar
verkningsgraden i bästa punkten, f är den extra förlusten av att hålla panelen vid 5,0 V.
*Kontrollresultat:* diodmodellens egen relativa verkningsgrad i svagt ljus, 0,83, 0,75 och 0,69 vid
50, 20 och 10 W/m² för n = 1,5, har liknande form som standardkurvans 0,85, 0,70 och 0,55; med n = 2
ligger den nära den pessimistiska kurvan.

*Exempel:* ljus som behövs för att laddaren ska starta, W/m², vid olika paneltemperatur:

| Variant (n) | −10 °C | 0 °C | 10 °C | 25 °C |
|---|---|---|---|---|
| Låg (1,3) | 2,3 | 5,1 | 10,7 | 29,4 |
| Central (1,5) | 4,3 | 8,7 | 16,6 | 40,5 |
| Hög (2,0) | 11,9 | 20,5 | 34,1 | 68,4 |

**Steg 5. Från paneleffekt till laddning i batteriet.**

```text
P_batt  = 0.90 × max(0, P_mpp × f − 5.0 V × I_chip/1000)     [W, med I_chip i mA]
Ah_hour = min(P_batt × 0.92 / 3.9 V, 2.0)                      [Ah den timmen; 0 om f = 0]
```

| Konstant | Värde | Står för |
|---|---|---|
| 0,90 | 90 % | Verkningsgraden i CN3791:s switchande steg |
| I_chip | 3,5 mA (central, hög), 1,0 mA (låg) | Laddkretsens egen ström medan den går, tagen från panelsidan vid 5,0 V; dras bara av de timmar laddaren går. Databladet anger 0,7–1,3 mA utan switchning; switchningen lägger till cirka 1,5–3,6 mA, så 3,5 mA är den centrala uppskattningen med lysdioderna borttagna. Den låga variantens 1,0 mA är databladsvärdet utan switchning, alltså optimistiskt. |
| 0,92 | 92 % | En samlad förlust från den första modellen för ledningar, smuts, rimfrost och drift av panelens bästa spänning. Spänningsdriften modelleras nu i steg 4 och snö i B.7, så den dubbelräknar delvis och gör resultatet något försiktigt. |
| 3,9 V | | Cellspänning under laddning, för omräkning från Wh till Ah. Granskningen bedömde den 3–5 % försiktig. |
| 2,0 A | | CN3791:s högsta laddström, per timme på batterisidan, efter 0,90, 0,92 och 3,9 V |

*Känslighet:* en kretsström på 6 mA i stället för 3,5 mA höjer behovet med cirka 20 % (räknat vid
4,8 V). Om kortets laddlysdiod sitter kvar (7–18 mA; 13,5 mA totalt antogs) höjs det centrala
behovet med cirka 50 % i Jönköping, lodrät, 20° träd, 10 W.

**Steg 6. Dygnsskörd.** Timvärdena `Ah_hour` summeras per UTC-datum.

## B.5 Från dygnsskörd till batteristorlek {#b5}

**Dygnsbalans.** Varje dygn förbrukar noden `ström × 24 h` (0,108 Ah eller 0,1704 Ah) och får
dygnets skörd. Modellen följer underskottet, hur långt batteriet är från fullt:

```text
underskott = max(0, underskott + dygnsförbrukning − skörd)        från 0 (fullt) den 1 januari 2005
```

Batteriet blir aldrig fullare än fullt: överskott kastas. Underskottet nollställs aldrig mellan
säsonger; ett underskott som följer med in i nästa vinter fortsätter växa.

**Ett tal per vinter.** En vinter går från 1 juli till 30 juni: 18 vintrar, 2005/06–2022/23. För
varje vinter noteras dess största underskott och D, episodens längd i dygn. En episod är en följd
dygn med underskott över noll; D räknas från episodens första dygn till dygnet med vinterns största
underskott, båda inräknade. Episoden kan ha börjat före 1 juli, även ett tidigare år. Inträffar
samma största underskott två gånger räknas det första. En vinter utan underskott har maximum 0 och
D = 0. Januari–juni 2005 och juli–december 2023 simuleras men räknas inte.

**Den sämsta vintern på fem.** De 18 vintermaxima sorteras från sämst till bäst; lika värden behåller
tidsordningen. Återkomstnivån för fem år tas med Weibulls plotposition r = (N + 1)/T, med N = 18 och
T = 5, alltså r = 3,8:

```text
nivå = w3 + 0.8 × (w4 − w3)
```

där w3 och w4 är det tredje och fjärde sämsta vintermaximumet. D tas från den vinter vars maximum
ligger närmast nivån; med de här talen är det den fjärde sämsta. Är flera lika nära tas den första i
ordningen sämst till bäst; i den publicerade datan ändrar det aldrig D.

**Varför en vinter på fem.** Projektet valde den som dimensioneringspunkt. En ovanligare vinter vore
byggd på bara 18 vintrar data; sådana vintrar lämnas åt marginalen (B.7, och överlevnaden i B.8).

**Från underskott till batteristorlek.**

```text
behov [mAh] = nivå [Ah] / (0.92 × 0.85 × 0.90) / (1 − 0.03 × D/30) × 1000
```

| Faktor | Värde | Betydelse | Grund | Riktning |
|---|---|---|---|---|
| Kyla | 0,92 | Kapacitet kvar med cellen vid −20 °C vid den här mycket låga strömmen | Vid så låga strömmar bestäms förlusten av cellens tomgångsspänning, inte dess resistans (Ji, Zhang och Wang 2013, cell vid C/1000 och −20 °C). −20 °C är ungefär mediannatten med lägst temperatur en vinter vid Jönköpings flygplats. | Försiktig i söder, optimistisk i norra inlandet (B.12) |
| Användbart fönster | 0,85 | Andel av kapaciteten mellan fullt (4,2 V) och 3,4 V | Bedömning ur urladdningskurvorna för LG MJ1 och Samsung 35E, som ger cirka 88–90 % över 3,4 V. 3,4 V är en planeringsgräns strax över 3,3 V, exempelgränsen för omstartsspärr i MeshCores dokumentation om strömhantering på nRF52. | Endera |
| Åldrande | 0,90 | Kapacitet kvar batteriets tredje vinter | Bedömning | Optimistisk efter tredje vintern |
| Självurladdning | 3 % per månad | Förlust under episoden på D dygn | Battery University: cirka 2 % per månad vid 0 °C och halv laddning, cirka 6 % vid full laddning. | Troligen försiktig vid låg temperatur |

`0,92 × 0,85 × 0,90 = 0,7038`. Termen (1 − 0,03 × D/30) är densamma som (1 − 0,001 × D). Behovet
innehåller ingen marginal och inga snödagar; de läggs till i B.7. Datan lagrar behovet avrundat till
0,1 mAh, utan avrundning uppåt.

**"Inget batteri räcker" (null).** Ibland kan panelen inte ladda upp batteriet ens på sommaren, och
underskottet växer år efter år. Ett fall är null när antingen D för den sämsta vintern på fem är
längre än 365 dygn, eller fler än 3 av de 18 vintrarna har D längre än 365 dygn. Regeln tillämpas
inom varje fall, före det löpande minimumet nedan. Kalkylatorn visar null som "panelen räcker inte
ens på sommaren".

**Golv: behovet med obegränsad panel.** För varje plats, vinkel och trädlinje räknas också behovet om
panelen vore obegränsad: varje timme då laddaren kan starta (Voc ≥ 5,10 V) ger fulla 2 A, utan andra
förluster, oavsett ljusnivå. Det inkluderar timmar under 3 W/m², där kurvan för svagt ljus inte ger
någon effekt för en ändlig panel, så golvet är något lägre än gränsvärdet när panelen växer.
*Känslighet:* att bara räkna timmar över 3 W/m² skulle höja vissa norra golv, t.ex. med 13 % för
Norrbotten, lodrät, 20° träd, låg variant. Golvet går igenom samma regler och beror inte på
panelstorleken. Är besökarens batteri mindre än golvet säger kalkylatorn att ingen panelstorlek
räcker.

**Löpande minimum.** En större panel ska aldrig behöva ett större batteri. För varje plats, vinkel,
firmware, trädlinje och variant gås panelstorlekarna igenom från liten till stor; ett värde över det
minsta hittills ersätts med det. Null förblir null och hoppas över. Golven justeras inte.
*Kontrollresultat:* det ändrade 14 av 36 720 värden, vart och ett med mindre än 1 %.

**De 17 panelstorlekarna:** 0,15, 0,5, 1, 1,5, 3, 5, 10, 15, 20, 25, 30, 40, 50, 100, 150, 200 och
300 W.

## B.6 Tre varianter: låg, central, hög {#b6}

Panelens beteende i svagt ljus är den största omätta indatan. Modellen ger därför tre värden för
varje fall.

| Variant | Idealitet n | Voc_stc | Kurva för svagt ljus | Laddkretsens ström |
|---|---|---|---|---|
| Central (bästa uppskattning) | 1,5 | 6,4589 V | Standard | 3,5 mA |
| Låg (optimistisk) | 1,3 | 6,3959 V | Standard | 1,0 mA |
| Hög (pessimistisk) | 2,0 | 6,6163 V | Pessimistisk | 3,5 mA |

Allt annat är gemensamt.

**Vad bandet är och inte är.** De tre varianterna spänner bara över panelens parametrar i svagt ljus
och kretsens ström. De är inte ett statistiskt konfidensintervall, och "hög" är ingen övre gräns.
Horisonten, kalibreringen, inställningens tolerans, förbrukningen, läckage i panelen och cellernas
verkliga kapacitet (B.12) verkar ovanpå varje variant.

**Ordningen gäller inte alltid för de minsta panelerna.** Nära gränsen där inget batteri räcker kan
den valda episoden D och null-regeln skilja mellan varianterna. *Kontrollresultat:* i 30 av 12 240
tripplar, alla för paneler på högst 3 W, är det höga värdet lägre än det centrala, med högst 3,8 %. I
ett fall är det centrala null medan lågt och högt är ändliga (Halland, lodrät, officiell firmware,
10° träd, 0,5 W). I 2 tripplar är det låga något över det centrala, med högst 1,0 %.

**Vilken som används var.** Kalkylatorn och guiden dimensionerar efter det **större av centralt och
högt**, och visar "inget batteri räcker" om något av dem är null. Byggguiden för Jönköpingsnoden
dimensionerar efter det **centrala** värdet och anger det höga bredvid.

**Vad underlaget säger.** Fälttestets mörka dagar återges av den centrala och den låga varianten; den
höga förutsäger mindre skörd än som mättes (B.11). Fysikgranskningen bedömde n = 1,3–2,0 som rätt
intervall och fann två parameterfel som ungefär tar ut varandra (B.10).

## B.7 Från modellens behov till en rekommendation {#b7}

**Snö- och frostdagar.** En panel täckt av snö eller frost skördar ingenting. Datan innehåller ett
tillägg i dygn utan skörd:

| Plats | Söder om 60° N | 60° N och norrut |
|---|---|---|
| Skyddad (standard) | 2 dygn | 5 dygn |
| Utsatt: höjd, topp | 4 dygn | 8 dygn |

Varje dygn kostar `ström × 24 h / 0,7038`; datan lagrar det avrundat till 0,1 mAh (*aktuell*: 153,5
mAh för EasySkyMesh, 242,1 mAh för officiell firmware), före marginal. Det läggs till behovet före
marginalen. Antalet dygn är en bedömning med stöd i litteraturen, främst en studie av RISE i Piteå,
65° N, vintern 2018/19, där även en lodrät panel var helt täckt hela januari. De utsatta värdena,
ungefär dubbla, följer isbildningskartor över Sverige. Rimfrost ensam får inget tillägg. Tillägget
gäller tillfällig täckning; norr om cirka 63° N kan en lodrät panel vara begravd i 2–3 veckor, vilket
kalkylatorn anger som en notis i stället för att dimensionera för det.

**Marginal.** En ren multiplikator, sist. Kalkylatorn låter besökaren välja 0–100 %, standard 50 %.
Marginalen ska täcka ovanligare vintrar än en på fem och osäkerheterna i B.12.

**Avrundning.** Batterisiffror avrundas alltid **uppåt**: kalkylatorn till ett helt antal celler.

**Kalkylatorns regel** (sidans kod och datafil är auktoriteten):

```text
celler = ceil( (max(central, hög) + snödagar × per_dygn_mAh) × (1 + marginal) / cellkapacitet ),   minst 2 celler
```

- Cellkapaciteten är 3000 mAh, säljarens nominella värde för den föreslagna cellen (Biltema
  art. 84-1378); besökaren kan ändra den. Inget oberoende kapacitetstest av cellen hittades.
  *Känslighet:* med 2400 mAh per cell behöver exemplet i B.8 10 celler i stället för 8.
- Minst 2 celler, eftersom laddaren kan ge upp till 2 A och cellen är specificerad för 1,5 A laddning.
- 60° och 40° erbjuds bara för paneler som någon borstar fria från snö; lodrät är standard.
- Inga värden interpoleras eller extrapoleras mellan eller utanför panelstorlekarna i datan.

## B.8 Räknat exempel: Jönköping, lodrät, 20° träd, 10 W, central, EasySkyMesh {#b8}

Alla tal här är *exempel*; steg 7 är lika med *aktuell* data.

1. R(lodrät, 20°) = 0,7550.
2. Timskörden summeras per dygn. Medelskörden över alla december- och januaridygn är 61,7 mAh per
   dygn, mot en förbrukning på 108 mAh.
3. Största underskott per vinter, Ah, med episodlängd D i dygn:

| Vinter | Max (Ah) | D | Vinter | Max (Ah) | D |
|---|---|---|---|---|---|
| 2005/06 | 3,9755 | 60 | 2014/15 | 3,7832 | 78 |
| 2006/07 | 4,5731 | 72 | 2015/16 | 3,1230 | 67 |
| 2007/08 | 4,5170 | 71 | 2016/17 | 3,9146 | 74 |
| 2008/09 | 4,4715 | 85 | 2017/18 | 4,1050 | 60 |
| 2009/10 | 2,9293 | 70 | 2018/19 | 4,1223 | 76 |
| 2010/11 | 1,3868 | 50 | 2019/20 | **5,0329** | 78 |
| 2011/12 | 3,1577 | 66 | 2020/21 | 4,7799 | 79 |
| 2012/13 | 3,5918 | 69 | 2021/22 | 3,8185 | 80 |
| 2013/14 | 3,7742 | 66 | 2022/23 | 4,1436 | 77 |

4. Plats 3 och 4 är 2006/07 (4,5731) och 2007/08 (4,5170). Nivå = 4,5731 + 0,8 × (4,5170 − 4,5731) =
   **4,5282 Ah**.
5. Vintern närmast nivån är 2007/08, så **D = 71 dygn**.
6. Behov = 4,5282 / 0,7038 / (1 − 0,071) × 1000 = **6 925,7 mAh**, utan marginal.
7. Datan ger fallet som [central 6 925,7, låg 4 248,8, hög 14 667,4].
8. Kalkylatorn, 50 % marginal, skyddad plats: (14 667,4 + 2 × 153,5) × 1,5 = 22 461,6 mAh, alltså
   7,49 celler, så **8 celler = 24 000 mAh**.

**Hur ofta hade de här batterierna tagit slut?** *Känslighet:* för var och en av de 18 vintrarna
jämfördes vinterns eget behov plus 2 snödagar med batteriet.

- Den sämsta vintern, 2019/20, central: 5,0329 / 0,7038 / (1 − 0,078) × 1000 = 7 756 mAh, 12 % över
  behovet för den sämsta vintern på fem.
- Beter sig panelen som den höga varianten behöver den sämsta vintern cirka 15 601 mAh.
  Kalkylatorns 24 000 mAh hade klarat alla 18 vintrar; ett batteri på 12 000 mAh bara 1 av dem.
- Beter sig panelen som den centrala varianten behöver den sämsta vintern cirka 8 063 mAh inklusive
  snödagar.

## B.9 Hur modellen kontrollerades {#b9}

**Vem som gjorde kontrollerna.** Alla kontroller utom fälttestet gjordes av AI-agenter: separata
sessioner av Anthropics Claude, september–november 2026. "Oberoende" betyder att en agent byggde om
modellen från en skriftlig beskrivning utan att få modellens kod. Beskrivningarna skrevs av sessionen
som byggde modellen. **Ingen oberoende mänsklig expert har granskat modellen.** Fälttestet (B.11) är
det enda underlaget gjort av människor.

| # | Kontroll | Omfattning | Resultat |
|---|---|---|---|
| 0 | Granskning av första utkastet (sept. 2026) | Den första Jönköpingssimuleringen: en oberoende ombyggnad och två granskare | Koden stämde med specifikationen utom två fel i hjälpskript. 11 problem listades, mest i antagandena. Bland rättelserna: himmelsfaktorn bytte från jämn himmel till Muneers; laddkretsens egen ström lades till; vinst i kyla lades till; en pessimistisk kurva för svagt ljus lades till; antagandet "ingen skörd när det ligger snö" togs bort för lodräta paneler. |
| 1 | Oberoende ombyggnad, länsmodell | Den första vintermodellen (5,6 V) | Återgav Jönköpingsfallet exakt; räknade även Skåne, Jämtland och Norrbotten med samma resultat. |
| 2 | Granskning för norr | Gäller Jönköpings antaganden norr om cirka 61° N? | Tabellerna är optimistiska i norr på fyra sätt: kyla, ERA5, rimfrost och laddning under 0 °C. Blev varningar (B.12). |
| 3 | Faktagranskning av den första guidetexten | Varje tal och påstående mot fem källor, två granskare | 8 talfel och 15 påståendefel; 28 punkter bekräftade. De flesta rättade. |
| 4 | Oberoende ombyggnad, panelstorlekar | Modellen skalad efter panelstorlek (5,6 V) | Stämde på decimalen. |
| 5 | Cellgranskning | Biltemas 3000 mAh-cell | Bara säljarens uppgifter finns; inget oberoende test. Behålls som nominell, märkt overifierad. |
| 6 | SMHI:s snötäckesstatistik | 348 stationer, snödjup per dygn, 2005/06–2022/23 | *Kontrollresultat:* längsta snötäcke den sämsta vintern på fem från 21 dygn (Skåne) till 113–151 dygn (Dalarna och norrut). Snö på marken, inte på panelen. Ledde till "lodrät om ingen borstar". |
| 7 | **Oberoende ombyggnad, nuvarande modell (5,0 V)** | Timvis panelspänning och laddarmodell | Återgav alla rapporterade tal. *Kontrollresultat:* Jönköping lodrät 20° 10 W blev 6 925,7 / 4 248,7 / 14 667,4, identiskt utom sista decimalen i det låga värdet (publicerat 4 248,8). |
| 8 | Fysikgranskning av 5,0 V-modellen | Kalibrering, n, temperaturkoefficienter, läckage, startvillkor, dubbelräkning | "Inget räkne- eller implementationsfel" och ingen dubbelräkning. Två parameterfel tar ungefär ut varandra (B.10). *Kontrollresultat:* total osäkerhet cirka ±25–50 % tills panelens beteende i svagt ljus är uppmätt. |
| 9 | Avstämning mot fälttestet | Motsäger fälttestet modellen? | Inte på mörka dagar. Säsongsuppskattningarna stämmer bara om testfönstret hade cirka 10° horisont (B.11). |
| 10 | Snö och frost | Behöver lodräta paneler ett snötillägg? | Ja. Ledde till tillägget 2/4/5/8 dygn. |
| 11 | Byggguiden | Varje tabellcell och påstående i Jönköpingsguiden | Alla 72 celler och 8 kapacitetsrader omräknade rätt; 11 textfel rättade. |
| 12 | Små paneler | 0,15, 0,5, 1,5 och 3 W | Alla 28 080 värden gemensamma med föregående version identiska. |
| 13 | Specifikationskontroll | En ny implementation ur den här beskrivningen, Jönköping och Norrbotten, utvalda fall | Alla 120 behovstripplar och 24 golvtripplar stämde till 0,1 mAh, null inräknat. |
| 14 | **Återgivning ur dokumentet ensamt** | En ny agent fick bara ett tidigare utkast av den här beskrivningen och PVGIS-filerna, och skrev referensskriptet (B.14) | *Kontrollresultat:* alla 36 720 behov och 2 160 golv i kalkylatordata v3 återgavs exakt, 0,0 mAh skillnad, alla 3 494 null på samma ställen. Den publicerade kopian använder Jönköpings avrundade punkt, som även kalkylatordata v4 använder (kontroll 16). |
| 15 | Datans konsekvens | Alla 12 240 tripplar i v3, upprepat för v4 | *Kontrollresultat:* högre trädlinje sänker aldrig behovet; inget behov under sitt golv; officiell firmware behöver aldrig mindre än EasySkyMesh. Variantordningen har undantagen i B.6, desamma i båda versionerna. |
| 16 | Jönköping omräknad för kalkylatordata v4 | Produktionsmodellen, oförändrad, körd i den avrundade punkten för alla 36 Jönköpingsfall | *Kontrollresultat:* alla andra punkter identiska med v3. Referensskriptet återger alla 1 944 behov och golv för Jönköping i v4 exakt. Inget tabellvärde vid 10 W och inget resultat i kalkylatorn ändrades, vid någon marginal 0–100 %. |

**Inte gjort.**

- Ingen jämförelse med ett etablerat verktyg, som PVGIS eget off-grid-verktyg eller pvlib med samma
  indata.
- Ingen jämförelse med vinterloggar från riktiga MeshCore- eller Meshtastic-noder i Norden.
- Ingen oberoende mänsklig expertgranskning.
- Kontroll 7, 13 och 14 använde PVGIS-filer modellen redan laddat ner; själva nedladdningen prövades
  bara av kontroll 1 och av referensskriptets avrundade Jönköpingspunkt.

## B.10 Vad som rättades på vägen {#b10}

Modellen har gått igenom fem dataversioner; bara den sista gäller.

| Version | Vad som ändrades | Status |
|---|---|---|
| Länstabeller | Laddaren på 5,6 V, 20 % marginal, avrundat till närmaste 100 mAh | *Historisk.* Används inte. |
| Kalkylatordata v1 | Panelstorlekar 1–300 W, 50° träd, null-regel, 2 A-tak; fortfarande 5,6 V | *Historisk.* Dragen tillbaka. |
| Kalkylatordata v2 | Inställning 5,0 V, timvis panelspänning, snötillägg | *Historisk.* v3 upprepar alla dess värden. |
| Kalkylatordata v3 | 0,15, 0,5, 1,5 och 3 W tillagda | *Historisk.* v4 upprepar alla dess värden utom Jönköpings. |
| **Kalkylatordata v4** | Jönköping räknad i den avrundade punkten | **Aktuell** |

**Den stora rättelsen: laddaren 5,6 V → 5,0 V.**

- *Utlösare:* webbsidans team frågade om värdena med fri horisont var för optimistiska.
- *Orsak, historisk:* den första guiden ställde laddaren på 5,6 V i tron att panelen ger cirka 7 V.
  Fälttestet mätte 5,90 V, vilket placerar panelen vid cirka 6,4–6,6 V i full sol. Vid 5,6 V startar
  laddaren först över cirka 30–100 W/m²; bakom träd är det mesta av midvinterljuset svagare.
- *Effekt, historisk, Jönköping lodrät 10 W, EasySkyMesh, utan marginal:* bakom 20° träd var det
  gamla publicerade värdet 5 651 mAh. Med 5,6 V korrekt modellerat blev det 20 621 mAh centralt;
  med 5,0 V blir det 6 926 mAh centralt, 4 249–14 667 över varianterna.
- *Känslighet, används inte:* 4,8 V skulle behöva 15–40 % mindre batteri bakom träd, men bara på kort
  med litet spänningsfall på ingången och utan seriediod. 5,0 V är det säkra valet.

**Andra rättelser.** Panelens spänning i svagt ljus (n) lades till i varianterna. Null-regeln lades
till när små paneler gav meningslösa (negativa) behov, eftersom självurladdningstermen bryter ihop
för episoder längre än ett år. Ett uttryckligt snötillägg infördes. Marginalen höjdes från 20 % till
50 %. Avrundningen ändrades från "närmaste 100 mAh" till "alltid uppåt". Himmelsmodellen bytte från
jämn himmel (R = 0,573 lodrät bakom 20°, *historisk*) till Muneers (0,755). Texten om panelens
spänning ändrades från "cirka 7 V" till "cirka 6,0–6,6 V", och soldatumen bakom träd rättades: vid
57,8° N stänger en trädlinje på 20° ute direkt sol från slutet av oktober till mitten av februari.

**Kända fel som lämnats kvar med avsikt** (*känslighet*, Jönköping lodrät 20° 10 W central, 6 926 mAh
publicerat):

- Panelspänningens temperaturkoefficient −0,30 %/K är troligen för liten; −0,38 till −0,40 %/K är
  fysikaliskt för 11 celler. Det fysikaliska värdet ger cirka 5 364 mAh (−23 %): modellen är försiktig
  här.
- n = 1,5 är troligen optimistiskt för skurna celler; cirka 1,7 är troligare. n = 1,7 ensamt ger
  9 372 mAh (+35 %).
- Båda tillsammans ger cirka 7 115 mAh, nära det publicerade värdet. Därför behölls det centrala
  värdet.
- Den låga variantens 1,0 mA kretsström nås troligen inte medan kretsen switchar, så den låga
  varianten är optimistisk på den punkten.

## B.11 Fälttestet {#b11}

En lokal byggare testade panel, laddare och batteri inomhus i Jönköping från mitten av oktober till
mitten av november 2026, med ett motstånd i stället för en nod. Alla tal här är *fältmätning* eller
avstämningsvärden för en uppställning inomhus med en annan laddare. De används aldrig för
dimensionering.

**Uppställning.** Panelen stod upprätt i ett söderfönster bakom två gamla glasrutor. Omgång 1 (slutet
av oktober): en liten trädgårdslampspanel på cirka 1,5 W. Omgång 2 (från början av november): Clas
Ohlsons panel. Laddare: ett HW-736-kort, en linjär laddare av CN3065-typ med schottkydiod på
ingången, som behöver cirka 4,7 V innan någon ström går; **inte** den CN3791 modellen antar. Batteri:
två 18650-celler sålda som 3000 mAh, parallellt; en av dem mättes till cirka 1,7 Ah. Last: ett
motstånd på 531 Ω, cirka 7,5 mA eller 180 mAh per dygn. Mätning: batterispänning med multimeter,
främst vilade morgonvärden. Ljus: en närliggande väderstation med en vågrät sensor som visar cirka
25–35 % för lite, använd för vädrets form och för att välja jämförbara mörka dagar.

**Resultat.** Kalibreringsmätningen: Voc 5,897 V och kortslutningsström 1,115 A. På mörkgrå dagar gav
panelen i omgång 2 cirka 50–100 mAh per dygn. De första fem dygnen täckte den cirka 70 % av lasten
på 180 mAh per dygn, den första veckan cirka 90 %. Testarnas egen grova uppskattning av ett
vinterunderskott i fönstret var 5–8 Ah, osäker med en faktor två åt endera hållet.

**Vad det bekräftar.** Det gav kalibreringspunkten som avslöjade felet med 5,6 V. Avstämningen körde
om modellens fysik för fönstret med Jönköpings väder, 112 analoga dygn valda efter det uppmätta
ljuset; fönstrets ljusfaktor k (0,35–0,65) och horisonten från fönstret (0°, 10° eller 20°) var
okända och varierades. På mörka dagar återger modellen de uppmätta 50–100 mAh per dygn för den
centrala och den låga varianten vid k cirka 0,35–0,5; den höga förutsäger mindre än som mättes.
*Känslighet:* under samma förhållanden hade en CN3791 vid 5,6 V skördat ingenting någon mörk dag;
vid 5,0 V 13–76 mAh per dygn.

**Vad som inte stämde.** Med fri sikt från fönstret ger modellen ett underskott mitten av november–
mitten av februari på bara 0,4–1,5 Ah (median), 0,8–2,3 Ah den sämsta vintern på fem, mot testarnas
5–8 Ah. De stämmer bara om fönstrets sikt mot den låga vintersolen skymdes av cirka 10° horisont. Frågan
är öppen tills loggar från december eller en mätning med lutningsmätare vid fönstret avgör.

**Vad det inte kan visa.** Annan laddare, inomhus, bakom glas, med två fria parametrar: en
konsekvenskontroll, inte en oberoende validering. Skörden härleddes ur spänning, cirka ±70 mAh per
avläsning. Inga data från december eller januari, utomhus, med kallt batteri eller med snö. Panelens
spänningskurva i svagt ljus mättes inte direkt.

## B.12 Antaganden och begränsningar {#b12}

"Försiktig" betyder att det publicerade behovet troligen är för högt; "optimistisk" att det troligen
är för lågt. Storlekar är *känslighet* för Jönköping, lodrät, 20° träd, 10 W, EasySkyMesh, central,
om inget annat anges.

| Antagande | Riktning | Storlek |
|---|---|---|
| Jämn trädlinje runt om | Endera | Mer än tiofaldig: cirka 500 mAh med fri horisont mot cirka 6 900 vid 20° träd (*aktuell*) |
| Panelens beteende i svagt ljus (n, kurva) | Endera | Låg till hög: 4 249–14 667 mAh (*aktuell*) |
| Inget läckage (shunt) i panelmodellen | Optimistisk | +36 % vid 300 Ω, +76 % vid 150 Ω |
| Ljus och temperatur vid kalibreringen | Endera | Cirka ±25 % |
| Temperaturkoefficient −0,30 %/K | Försiktig | −23 % med det fysikaliska värdet |
| Laddarens inställning ±0,1 V | Endera | Cirka 5 900–8 800 mAh |
| Laddkretsens ström 3,5 mA | Endera | +20 % vid 6 mA (vid 4,8 V) |
| Förbrukning, lugnt nät | Optimistisk för upptagna platser | 1,6 gånger förbrukningen ger 1,6–2,3 gånger behovet |
| Nominell cellkapacitet | Optimistisk | 25 % fler celler om verklig kapacitet är 80 % av märkningen |
| Köldfaktor 0,92 (−20 °C) | Försiktig i söder, optimistisk i norra inlandet | ×1,08 till ×1,23 i norr |
| Åldrande 0,90 (tredje vintern) | Optimistisk efter tredje vintern | Inte kvantifierat |
| Självurladdning 3 % per månad | Försiktig | Liten |
| 3,9 V laddspänning | Försiktig | 3–5 % |
| 0,92 samlad förlust | Försiktig | Liten |
| Snö på marken reflekterar inget extra ljus | Försiktig | Cirka −14 % (*historisk*) |
| Träden behandlas som svarta | Försiktig | R 0,780 i stället för 0,755 om träden reflekterade 20 % |
| Vinst i kyla från lufttemperatur, inte paneltemperatur | Optimistisk | Liten, inte kvantifierad |
| Startvillkor per timme | Försiktig | Liten |
| ERA5 för Norrbotten | Optimistisk | 11–29 % lodrät (*historisk*) |
| Panelens åldrande, delvis skuggning av grenar, omstart under fullt, panel inte rakt mot söder | Optimistisk | Inte kvantifierat |
| Nivån för en vinter på fem ur 18 vintrar | Endera | Cirka −2 % till +6 % (*historisk*) |

**Sammantaget** kan ingen enskild nettoriktning påstås. Avdrag och förluster lutar åt det försiktiga;
panelens omätta beteende i svagt ljus, förbrukningen, cellkapaciteten och norr lutar åt det
optimistiska. De två största posterna, horisonten och panelen, kan gå åt båda hållen.

**I ordning efter hur mycket de kan flytta svaret:**

1. **Platsens verkliga horisont.** Den överlägset största faktorn. Modellen antar en jämn trädlinje
   runt om; en plats med fri himmel mot sydost eller sydväst behöver mindre, så raden för de högsta
   träden i södra halvan av himlen är det säkra valet.
2. **Panelens beteende i svagt ljus** (n, läckage, kurva). Läckage modelleras inte; en ideal diod är
   bästa fallet i svagt ljus. *Känslighet:* ett shuntmotstånd på 300 Ω ger 9 424 mAh (+36 %), 150 Ω
   12 208 mAh (+76 %).
3. **Kalibreringspunkten.** Ljus och celltemperatur vid den enda fältmätningen är uppskattade.
4. **Laddkortet.** Inställningens noggrannhet är cirka ±0,1 V. Ett diodfall på 0,3–0,5 V i kortets
   ingång kan hålla panelen så mycket över inställningen; en seriediod efter switchen (0,25–0,45 V)
   höjer i stället den ingångsspänning som behövs för fulla 4,2 V. Startvillkoret prövas en gång i
   timmen; en timme som går under startspänningen räknas helt förlorad, vilket är försiktigt.
5. **Förbrukningen.** 4,5 och 7,1 mA är uppskattningar för ett lugnt nät. Firmware ensam ändrar
   behovet med en faktor cirka 1,6–2,3 (*aktuell*, Jönköping, lodrät, 10 W).
6. **Cellkapaciteten.** 3000 mAh är säljarens nominella värde. *Fältmätning:* en av fälttestets
   "3000 mAh"-celler mättes till cirka 1,7 Ah.
7. **Kyla i norr.** Modellen antar att batteriet håller sig över −20 °C; rimligt upp till
   Gävleborgskusten men optimistiskt i inlandet i Jämtland, Västerbotten och Norrbotten, där −35 till
   −40 °C förekommer en dålig vinter. *Känslighet, inte tillämpad i datan:* köldfaktor 0,85 i stället
   för 0,92 höjer alla värden med 8 %, 0,75 med 23 %. Kyla höjer också cellens inre resistans, så
   sändpulser kan få en kall, nästan tom cell att slå av tidigt; det modelleras inte.
8. **Laddning under 0 °C** antas fungera; CN3791 saknar temperaturspärr. Laddströmmarna är oftast
   mycket låga, men månader av kall laddning innebär viss risk för litiumplätering, som inte
   modelleras. Den föreslagna cellen är specificerad för laddning först från 0 °C.
9. **ERA5 för Norrbotten** överskattar molnigt vinterljus i norr; Norrbottens siffror ska läsas som
   optimistiska. Jämförelsen är inte upprepad med den nuvarande modellen.
10. **Snö, frost och rimfrost.** Snötillägget är en bedömning; rimfrost på utsatta norra platser
    modelleras inte. Extra ljus från snötäckt mark mot en lodrät panel räknas inte, vilket är
    försiktigt.
11. **SARAH3 nära sin kant.** Västerbottens punkt ligger nära täckningsgränsen vid 65° N.
12. **En punkt per län.** Kust och inland, skog och fjäll kan skilja mer inom ett län än mellan
    sydliga län.
13. **"Inga träd" är PVGIS terränghorisont, inte platt.** I kuperade norra trakter skymmer terrängen
    ensam mycket vintersol.
14. **Fälttestet** är en konsekvenskontroll, inte en validering av siffror utomhus (B.11).
15. **Optimistiska effekter som inte modelleras:** panelens åldrande; delvis skuggning (en gren över
    en del av en seriesträng skurna celler sänker hela strängens ström); laddaren fyller på först
    när batteriet sjunkit lite; panel som inte pekar rakt mot söder; trafik över det antagna; ett
    batteri som inte är fullt inför första vintern.
16. **Mindre poster.** Självurladdningen är troligen hög vid låg temperatur (försiktigt). Vinsten i
    kyla överskattas något i soliga timmar. Nivån för en vinter på fem vilar på 18 vintrar.
    *Kontrollresultat:* antalet dygn med snötäcke i Götaland har minskat med cirka 40 % sedan 1960
    (SMHI faktablad 23, 2005), så 2005–2023 behöver inte representera framtida vintrar.

## B.13 Mätningar som skulle skärpa siffrorna mest {#b13}

I ordning efter väntad effekt:

1. **Platsens horisont.** Svep med lutningsmätare från sydost via söder till sydväst och notera den
   högsta vinkeln. Kan flytta svaret en storleksordning.
2. **Panelens spänningslutning i svagt ljus.** Inom cirka 2 minuter, vid samma paneltemperatur: mät
   tomgångsspänning och kortslutningsström vid 4–6 ljusnivåer, från cirka 1 A ner till 0,03 A. Dämpa
   hela panelen jämnt med tyll eller myggnät; skugga aldrig bara en del. Rita spänningen mot
   logaritmen av strömmen. Cirka 0,85–0,9 V ökning per tiodubbling pekar på den låga varianten, cirka
   1,0 V på den centrala, cirka 1,3 V på den höga. Punkter som böjer nedåt visar läckage.
3. **Kortslutningsström och paneltemperatur i full sol**, utomhus, för att förankra kalibreringen.
4. **Ett dygns batteriström** på den verkliga noden och firmwaren.
5. **CN3791 loggad grå dagar** vid vald inställning: bekräfta inställningen vid panelens anslutning
   under laddning, mät kortets spänningsfall på ingången, leta efter seriediod, mät kretsens egen
   ström med lysdioderna borttagna.
6. **Batteriloggar december–januari** från en riktig nod utomhus.
7. **Verklig cellkapacitet:** ladda ur en köpt cell vid cirka 0,2 C till 3,4 V.
8. **För norr:** batteritemperatur i en riktig låda över en vinter, och isbildningskartor för utsatta
   höjder.
9. **För datan:** upprepa jämförelsen ERA5 mot SARAH3 i Västerbotten med den nuvarande modellen.
10. **Extern jämförelse:** kör PVGIS off-grid-verktyg för några fall och jämför.

## B.14 Räkna om siffrorna själv {#b14}

**Du behöver** Python 3 med numpy och tillgång till PVGIS.

{{< solar-files >}}

**Referensskriptet** är en oberoende referensimplementation, skriven av en AI-agent enbart ur den här
beskrivningen, utan modellens kod (B.9 kontroll 14). Det laddar ner de PVGIS-filer det behöver och
sparar dem.

```sh {title="Exempel"}
python reference_solar_need.py JKG --tilt 90 --trees 20 --firmware esm
python reference_solar_need.py --check
python reference_solar_need.py --tables
python reference_solar_need.py --example
```

Den första raden skriver behovstripplarna för alla 17 panelstorlekar, före och efter det löpande
minimumet, plus golvet. `--check` kör testvektorerna nedan, `--tables` skriver R, Voc_stc och
tabellen över startljus, `--example` skriver exemplet i B.8. Skriptet använder Jönköpings avrundade
punkt, samma punkt som kalkylatordata v4, och återger dess Jönköpingsvärden exakt.

**Recept.**

```text
för varje punkt, vinkel i (90, 60, 40), trädlinje h i (0, 10, 15, 20, 30, 50):
    ladda ner PVGIS seriescalc-CSV (B.3)
    R = 1 om h == 0 annars sky_view(vinkel, h)                                (B.4 steg 1)
    varje timme: G = Gb + R*Gd + Gr ;  Tc = T2m + G/(25 + 6.84*WS10m)
    för variant (n, kurva LL, I_chip i mA) i central, låg, hög:              (B.6)
        Voc_stc ur kalibreringen, full precision                            (B.4 steg 4)
        f = P(5.0 V)/P(Vmp) om Voc(G, Tc) >= 5.10 V annars 0
        för var och en av de 17 panelstorlekarna Wp:
            Ah_hour = 0 om f == 0 annars min(2.0, 0.90*max(0, Wp*G/1000*LL(G)*(1 + 0.004*(25 - T2m))*f - 5.0*I_chip/1000) * 0.92/3.9)
            skörd per UTC-datum = summan av Ah_hour
            för dygnsförbrukning i (0.108, 0.1704) Ah:
                underskott per dygn -> 18 vintermaxima och D -> nivå för en vinter på fem och D
                -> null-regel -> behov = nivå/0.7038/(1 - 0.001*D)*1000, avrundat till 0.1 mAh   (B.5)
        golv: skörd per UTC-datum = 2.0 * (antal timmar med f > 0) -> samma steg
sedan, per variant: löpande minimum över panelstorlekarna; null förblir null; golv justeras inte.
Snötillägget lagras separat och läggs till av kalkylatorn (B.7).
```

**Fallgropar.**

- Räkna Voc_stc med full precision (B.4 steg 4).
- Tillämpa null-regeln inom varje fall, före det löpande minimumet; annars sprider sig negativa
  behov från de minsta panelerna till alla större.
- Använd R på `Gd(i)` ur filen för den trädlinjen, inte ur filen med fri horisont.
- Vinsten i kyla använder lufttemperaturen `T2m`; panelspänningen Faimans paneltemperatur `Tc`.
- `I_chip` är i mA, så kretsens effekt är 5,0 × I_chip / 1000 W, och dras bara av när laddaren går.
- Taket 2 A gäller på batterisidan, efter 0,90, 0,92 och 3,9 V.
- Golvet räknar varje timme med Voc ≥ 5,10 V, oavsett ljusnivå.
- Underskottet börjar på 0 den 1 januari 2005 och nollställs aldrig; en episod kan börja före den
  vinter den hör till.
- Modellens kod räknade behovet med en gammal marginal ×1,2, delade bort den och avrundade till
  0,1 mAh. Referensskriptet stämde exakt, men en skillnad på ±0,1 mAh i sista siffran är godtagbar
  för andra implementationer.

**Datafilen.** Ett JSON-objekt med en nyckel per punktkod. Varje punkt har `place`, `lat`, `lon`,
`source` (PVGIS-dataset) och `panels` (de 17 storlekarna i W); `need[vinkel][firmware][träd]`, en
lista med 17 tripplar [central, låg, hög] i samma ordning som `panels`, i mAh utan marginal eller
snödagar, till 0,1 mAh, null betyder att inget batteri räcker (vinkelnycklar `vertical`, `tilt60`,
`tilt40`; firmware `esm`, `official`; träd `"0"`, `"10"`, `"15"`, `"20"`, `"30"`, `"50"`);
`floor[vinkel][firmware][träd]`, en trippel; `snow_allowance` med `days` (sheltered, exposed) och
`per_day_mAh` (esm, official); och `setpoint_V`: 5,0.

**Testvektorer** (*testvektor*, behov utan marginal i mAh, [central, låg, hög]). Jönköpingsrader
gäller den avrundade punkten 57,78° N, 14,16° Ö och stämmer exakt med kalkylatordata v4.

| Punkt | Vinkel | Firmware | Träd | Panel | Behov [central, låg, hög] |
|---|---|---|---|---|---|
| JKG | lodrät | EasySkyMesh | 20° | 10 W | 6 925,7; 4 248,8; 14 667,4 |
| JKG | lodrät | EasySkyMesh | 0° | 10 W | 501,7; 355,7; 847,8 |
| JKG | lodrät | officiell | 20° | 10 W | 15 455,2; 10 861,0; 26 540,6 |
| JKG | 60° | EasySkyMesh | 20° | 10 W | 1 746,5; 568,9; 6 471,8 |
| JKG | 40° | EasySkyMesh | 20° | 10 W | 516,3; 324,5; 3 145,8 |
| JKG | lodrät | EasySkyMesh | 20° | 1 W | 22 093,4; 20 403,9; 22 485,5 |
| JKG | lodrät | EasySkyMesh | 20° | 0,15 W | null; null; null |
| JKG | lodrät | EasySkyMesh | 50° | 3 W | 44 168,4; 30 583,4; null |
| MMX | lodrät | EasySkyMesh | 10° | 5 W | 1 195,5; 884,0; 1 697,1 |
| LLA | lodrät | EasySkyMesh | 20° | 10 W | 16 918,7; 15 061,7; 22 768,4 |
| OSD | 60° | officiell | 30° | 20 W | 17 420,9; 15 602,4; 23 330,5 |
| GVX | lodrät | EasySkyMesh | 50° | 25 W | högt värde 40 700,2 efter löpande minimum; 40 983,3 före |

| Punkt | Vinkel | Firmware | Träd | Golv [central, låg, hög] |
|---|---|---|---|---|
| JKG | lodrät | EasySkyMesh | 20° | 307,5; 184,3; 2 526,4 |
| LLA | lodrät | EasySkyMesh | 20° | 8 108,8; 6 259,5; 13 262,6 |

**Mellanliggande testvektorer**, för att hitta var en misslyckad omräkning går fel. JKG vid den
avrundade punkten, lodrät, 20° träd, 10 W. *Testvektor.*

| Dygn (UTC) | Skörd, central | Låg | Hög |
|---|---|---|---|
| 2010-12-15 | 120,34 mAh | 140,28 mAh | 64,48 mAh |
| 2013-12-20 | 43,18 mAh | 70,75 mAh | 0 |
| 2022-01-10 | 4,09 mAh | 24,61 mAh | 0 |

| Timme (UTC) | Gb, Gd, Gr | T2m, WS10m | G, Tc | Central: Voc, f, mAh | Låg: Voc, f, mAh | Hög: Voc, f, mAh |
|---|---|---|---|---|---|---|
| 2013-12-20 09:11 | 0; 13,17; 3,7 | 1,31; 3,86 | 13,643; 1,575 | 5,235; 0,5787; 7,611 | 5,392; 0,8205; 14,998 | 4,845; 0; 0 |
| 2013-12-20 11:11 | 0; 21,72; 6,1 | 1,66; 4,14 | 22,499; 2,082 | 5,418; 0,8054; 26,538 | 5,549; 0,9276; 33,782 | 5,091; 0; 0 |
| 2013-12-20 13:11 | 0; 8,54; 2,4 | 2,38; 4,00 | 8,848; 2,549 | 5,041; 0; 0 | 5,221; 0,5947; 5,208 | 4,591; 0; 0 |

Timmen 11:11 visar startvillkoret: den höga variantens Voc på 5,091 V ligger just under 5,10 V, så den
får ingenting.

**Indatans fingeravtryck.** Skiljer en omräkning, kontrollera först om PVGIS har ändrat sin data.
Filerna bakom testvektorerna, nedladdade i november 2026. *Testvektor.*

| Fil | Rader | Summa Gb(i) | Summa Gd(i) | Summa Gr(i) | Medel T2m | sha256 |
|---|---|---|---|---|---|---|
| 57.7800_14.1600_PVGIS-SARAH3_t90_h20.csv | 166 536 | 6 381 525,54 | 5 378 320,95 | 1 679 744,70 | 7,1367 | `dea57214bb93f352dbc8a818c13746c86630707e204428c3f6b14c1ccee03cfd` |
| 57.7800_14.1600_PVGIS-SARAH3_t90_h0.csv | 166 536 | 8 574 941,48 | 6 014 701,75 | 1 760 378,40 | 7,1367 | `c17c097cde22244829c2025ca5aaa12f36fd688fea78a1e5db12617338baf609` |
| 57.7800_14.1600_PVGIS-SARAH3_t60_h20.csv | 166 536 | 9 317 286,17 | 7 902 062,91 | 849 450,85 | 7,1367 | `dfd54b82803a9726463398915faaaf13702ed28644e9341a7b00fd2962204cf5` |
| 57.7800_14.1600_PVGIS-SARAH3_t40_h20.csv | 166 536 | 9 931 132,13 | 8 998 538,00 | 397 463,76 | 7,1367 | `ffb00c160bb93bee907d6e4727066555ec46f1c15a42c5773313af3a052382de` |
| 55.9640_13.6030_PVGIS-SARAH3_t90_h10.csv | 166 536 | 7 919 314,22 | 6 036 084,07 | 1 830 670,30 | 8,1924 | `9c97ffb797d759951fc18dc42a384f10eba1c82bea57bf437b8a6a0cb915537d` |
| 66.9510_20.1000_PVGIS-ERA5_t90_h20.csv | 166 536 | 6 631 646,38 | 4 226 017,45 | 1 339 620,34 | 0,4467 | `02816af991b2209756b00068963ade949664c30420861408995bec159a147504` |
| 63.2670_14.3290_PVGIS-SARAH3_t60_h30.csv | 166 536 | 5 819 471,49 | 6 656 339,14 | 653 251,20 | 3,2091 | `2ea1677df988d756a5dedda29f08457960b0c717219be4ba18ce3e4692ec9d18` |
| 61.4770_16.3000_PVGIS-SARAH3_t90_h50.csv | 166 536 | 363 217,60 | 3 221 812,90 | 918 814,40 | 5,7654 | `31d127421db182c90c29572838375af5c3afc1332b87c8054d3384f7cb1ce5a4` |
| 57.7800_14.1600_PVGIS-SARAH3_t90_h50.csv | 166 536 | 869 900,68 | 3 625 597,35 | 1 058 368,70 | 7,1367 | `f4c2ed2b5d2d41947d2ada44dc968bf243baf97c6f951cf35d3053f8a22e806a` |

PVGIS kan uppdatera eller byta sina dataset; summorna ovan visar om en senare nedladdning skiljer.
Hela uppsättningen PVGIS-filer (cirka 2,9 GB) publiceras inte; vem som helst kan ladda ner den igen
med anropet i B.3.

## B.15 Källor {#b15}

Varje källa är märkt med hur den användes: **[modell]** sätter en indata, konstant eller formel;
**[kontroll]** användes av granskare och sätter ingen konstant; **[bakgrund]** lästes för den första
dimensioneringen och sätter ingen konstant i den nuvarande modellen. Alla länkar prövades den 14
november 2026. "Spärrad" betyder att servern vägrade automatisk åtkomst; en vanlig webbläsare öppnar
den troligen.

**Väder- och instrålningsdata**

- [modell] PVGIS 5.3, EU:s gemensamma forskningscentrum. Verktyg: <https://re.jrc.ec.europa.eu/pvg_tools/en/>. API-dokumentation: <https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/using-pvgis-5/api-non-interactive-service_en>
- [modell] PVGIS datakällor och beräkningsmetoder, inklusive Muneers diffusmodell och PVGIS egna Faiman-koefficienter: <https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/general-information/data-sources-calculation-methods_en>
- [modell] PVGIS beskrivning av ERA5, skälet till att Norrbotten använder ERA5: <https://joint-research-centre.ec.europa.eu/preliminary-description-new-reanalysis-based-data-pvgis_en>
- [kontroll] Pfeifroth m.fl., "SARAH-3: satellite-based climate data records of surface solar radiation", Earth System Science Data 16, 5243–5265, 2024. <https://essd.copernicus.org/articles/16/5243/2024/>
- [kontroll] Urraca m.fl., "Extensive validation of CM SAF surface radiation products over Europe", Remote Sensing of Environment 199, 171–186, 2017. DOI 10.1016/j.rse.2017.07.013
- [kontroll] Urraca m.fl., "Evaluation of global horizontal irradiance estimates from ERA5 and COSMO-REA6 reanalyses using ground and satellite-based data", Solar Energy 164, 339–354, 2018. DOI 10.1016/j.solener.2018.02.059
- [kontroll] Babar, Luppino, Boström, Anfinsen, "Random forest regression for improved mapping of solar irradiance at high latitudes", Solar Energy 198, 81–92, 2020. DOI 10.1016/j.solener.2020.01.034
- [kontroll] ECMWF Forecast User Guide, avsnitt 9.2.2 "Regional temperature biases": <https://confluence.ecmwf.int/spaces/FUG/pages/673551684/Section+9.2.2+Regional+temperature+biases>
- [kontroll] SMHI öppna data, snödjup (parameter 8), 348 stationer: <https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/8.json>
- [kontroll] SMHI om den kalla januari 2026 och rekordlåga temperaturer: <https://www.smhi.se/blogg/blogg/2026-02-03-extremt-kall-januari-i-norra-tornedalen> och <https://www.smhi.se/pd/klimat/pdf_stats/year/SMHI_vov_temperature_25.pdf>
- [bakgrund] SMHI:s solljusmodell STRÅNG: <https://strang.smhi.se/>

**Panel- och himmelsmodeller**

- [modell] Muneer, T., "Solar radiation model for Europe", Building Services Engineering Research and Technology 11(4), 153–163, 1990. DOI 10.1177/014362449001100405 (spärrad). Källan till lagen för mulen himmel och b = 5,73.
- [modell] Faimans modell för paneltemperatur, dokumenterad i pvlib: <https://pvlib-python.readthedocs.io/en/stable/reference/generated/pvlib.temperature.faiman.html>
- [modell] Clas Ohlson Northlight Flexible Solar System solpanel 15 W, art. 36-9423: <https://www.clasohlson.com/se/Northlight-Flexible-Solar-System-solpanel-15-W/p/36-9423> (slut i lager den 14 november 2026)
- [kontroll] Reich, van Sark, Alsema m.fl., "Crystalline silicon cell performance at low light intensities", Solar Energy Materials and Solar Cells 93(9), 1471–1481, 2009. DOI 10.1016/j.solmat.2009.03.018
- [kontroll] Fell m.fl., Fraunhofer ISE, rekombination i kanterna på skurna celler, 33rd EU PVSEC 2017: <https://www.ise.fraunhofer.de/content/dam/ise/de/documents/publications/conference-paper/33-eupvsec-2017/Fell_2CV236.pdf>. Stöder n cirka 1,7 i skurna celler.
- [bakgrund] IEC 61853-1, provning av solcellsmodulers prestanda vid olika instrålning och temperatur.
- [bakgrund] Karhu m.fl., FMI:s solcellsdataset med snödetektering, Geoscience Data Journal 2025; dataset DOI 10.57707/fmi-b2share.d7407bbaca2145afa109d757b00cf086.
- [bakgrund] Offgridtec ETFE V2, datablad: <https://www.offgridtec.com/media/product_attachements/Datasheet_ETFE-V2-modules.pdf>
- [bakgrund] Kiwa PVEL, modulers tillförlitlighet: <https://scorecard.pvel.com/>

**Laddare och elektronik**

- [modell] CN3791, datablad Rev 1.0, Consonance (kopia hos tredje part; ingen officiell länk finns): <https://static.chipdip.ru/lib/174/DOC013174086.pdf>. Startvillkoret (1,23 / 1,205 V), referensens ±2 % och kretsens egen ström.
- [modell] Wio-SX1262, datablad: <https://files.seeedstudio.com/products/SenseCAP/Wio_SX1262/Wio-SX1262_Module_Datasheet.pdf>, och Semtech SX1262: <https://www.semtech.com/products/wireless-rf/lora-connect/sx1262>. Sändströmmen 118 mA.
- [modell] Seeed XIAO nRF52840, wiki och schema: <https://wiki.seeedstudio.com/XIAO_BLE/> och <https://files.seeedstudio.com/wiki/XIAO-BLE/Seeed-Studio-XIAO-nRF52840-Sense-v1.1.pdf>; TI BQ25101, XIAO:ns egen laddare: <https://www.ti.com/product/BQ25101>; DW01-P, skyddskrets, datablad Rev 1.6 (kopia hos tredje part): <https://static.procontact74.ru/media/product/8e498b70ad97aed070e5a5e91773e30a.pdf>. Läckströmmarna i förbrukningen.
- [bakgrund] nRF52840, produktblad (kopia): <https://www.mouser.com/pdfdocs/Nordic_nRF52840_PB.pdf>

**Firmware och förbrukning**

- [modell] EasySkyMesh-releaser från IoTThinks: PowerSaving 17.1 (<https://github.com/IoTThinks/EasySkyMesh/releases/tag/PowerSaving17.1>), PowerSaving 17 (<https://github.com/IoTThinks/EasySkyMesh/releases/tag/PowerSaving17>) och wikisidan <https://github.com/IoTThinks/EasySkyMesh/wiki/PowerSaving>. 4,5 mA gäller release 17.1.3 med `rxps max`; den nyare PowerSaving 18 (22 oktober 2026) är inte bedömd.
- [modell] IoTThinks/MeshCore pull request 11, "Added RX duty-cycle power saving support": <https://github.com/IoTThinks/MeshCore/pull/11>. Källan till mätningen 6,92 mA bakom 7,1 mA.
- [modell] MeshCores dokumentation om strömhantering på nRF52, omstartsspärren vid 3,3 V bakom planeringsgränsen 3,4 V: <https://github.com/meshcore-dev/MeshCore/blob/main/docs/nrf52_power_management.md>
- [kontroll] Meshtastic-diskussion 478, strömmätningar på samma hårdvara med Meshtastic: <https://github.com/orgs/meshtastic/discussions/478>. Bara för att jämföra storleksordningen; dess siffror används inte.
- [bakgrund] MeshCore: <https://github.com/meshcore-dev/MeshCore>, pull requests 1238, 1353, 1562 och 2286 om strömsparande på nRF52.

**Batterier och kyla**

- [modell] Ji, Zhang, Wang, "Li-Ion Cell Operation at Low Temperatures", Journal of The Electrochemical Society 160(4), A636–A649, 2013. DOI 10.1149/2.047304jes. Grunden för köldfaktorn 0,92.
- [modell] Battery University BU-802b, självurladdning: <https://batteryuniversity.com/article/bu-802b-what-does-elevated-self-discharge-do>. Grunden för 3 % per månad.
- [modell] Celldatablad för det användbara fönstret 0,85 (kopior hos tredje part): LG INR18650 MJ1 (<https://cdn.shopify.com/s/files/1/0721/2761/1190/files/LG-MJ1.pdf>) och Samsung INR18650-35E (<https://cdn.shopify.com/s/files/1/0613/3327/4870/files/35eDatasheet.pdf>).
- [modell] Biltema ICR18650 3000 mAh, art. 84-1378: <https://www.biltema.se/kontor---teknik/batterier/uppladdningsbara-batterier/laddningsbart-icr18650-batteri-3000-mah-2000064536>. Kalkylatorns 3000 mAh per cell och minimum två celler. Säljarens uppgifter: 3000 mAh, oskyddad platt topp, högst 1,5 A laddning, laddning 0–50 °C.
- [kontroll] Kasper m.fl., "Low-temperature discharging performance comparison of sodium-ion and lithium-ion cylindrical batteries", Monatshefte für Chemie 157, 851–857, 2026. DOI 10.1007/s00706-026-03462-5 (spärrad). En av källorna till de norra köldfaktorerna 0,85 och 0,75.
- [kontroll] lygte-info.dk, index över batteritester (ingen Biltema-post): <https://lygte-info.dk/info/batteryIndex.html>
- [bakgrund] Battery University BU-502 (urladdning i kyla) och BU-410 (laddning i kyla): <https://batteryuniversity.com/article/bu-502-discharging-at-high-and-low-temperatures> och <https://batteryuniversity.com/article/bu-410-charging-at-high-and-low-temperatures>
- [bakgrund] Molicel INR-21700-P42A, datablad (kopia hos tredje part).
- [bakgrund] Litiumplätering vid låg temperatur: Burns, Stevens, Dahn, JES 162(6), A959–A964, 2015, DOI 10.1149/2.0621506jes; Ouyang m.fl., J. Power Sources 286, 309–320, 2015, DOI 10.1016/j.jpowsour.2015.03.178; Zinth m.fl., J. Power Sources 271, 152–159, 2014, DOI 10.1016/j.jpowsour.2014.07.168

**Snö, frost och isbildning**

- [modell] Granlund, Narvesjö, Petersson (RISE), "The Influence of Module Tilt on Snow Shadowing of Frameless Bifacial Modules", 36th EU PVSEC 2019, s. 1650–1654. DOI 10.4229/EUPVSEC20192019-5CV.4.36. Fulltext: <https://www.diva-portal.org/smash/get/diva2:1384575/FULLTEXT01.pdf>. Huvudgrunden för snötillägget.
- [modell] Isbildningskarta över Sverige (Byrkjedal, Kjeller Vindteknikk): <https://www.slideshare.net/slideshow/kvt-mapping-oficing/16696876>. Det utsatta tillägget, ungefär dubbla det skyddade.
- [kontroll] Granlund, "Snow impacts", EU PVSEC 2024, IEA-PVPS: <https://iea-pvps.org/wp-content/uploads/2024/08/02_AGranlund_Snow-Impacts_PVSEC2024.pdf>. Grunden för "lodrät om ingen borstar".
- [kontroll] Øgaard m.fl., "Analyzing and modeling snow loss and snow loss accumulation in ground-mounted photovoltaic systems", EPJ Photovoltaics 17, 9, 2026. DOI 10.1051/epjpv/2026004 (spärrad).
- [kontroll] IEA-PVPS T13-40 2026, Arctic PV, sammanfattning: <https://iea-pvps.org/wp-content/uploads/2026/02/IEA-PVPS-T13-40-2026-EXEC-SUMM-Arctic-PV.pdf>
- [kontroll] SMHI faktablad 23, snöklimat (2005), minskningen med 40 % av dygn med snötäcke: <https://www.smhi.se/download/18.18f5a56618fc9f08e832d674/1717805952680/faktablad_snoklimat%5B1%5D.pdf>
- [kontroll] SMHI om snöklimat: <https://www.smhi.se/kunskapsbanken/meteorologi/arstider/julvader> och <https://www.smhi.se/klimat/klimatet-da-och-nu/klimatindikatorer/sno>
- [kontroll] pvlib snömodell (Marion): <https://pvlib-python.readthedocs.io/en/stable/reference/generated/pvlib.snow.coverage_nrel.html>

**Erfarenhet från fältet**

- [kontroll] YYCMesh, "Cold Weather Charging of Lithium-Ion Batteries": <https://yycmesh.com/blog/cold-weather-charging>. Ett Meshtastic-nät i Calgary, inte MeshCore; underlag bara för tålighet mot kyla, inte för dimensionering.
- [modell] Fälttestet i Jönköping (B.11). Ingen offentlig länk.

**Konstanter som vilar på bedömning:** kurvorna för svagt ljus (B.4 steg 2); kretsströmmen 3,5 mA;
den samlade förlusten 0,92 och laddspänningen 3,9 V; det användbara fönstret 0,85 och åldrandet
0,90; temperaturkoefficienten −0,30 %/K; antalet snödygn; panelens verkliga 10 W; 340 W/m² och
30 °C vid kalibreringen.

## B.16 Ordlista {#b16}

| Term | Betydelse |
|---|---|
| PVGIS | EU:s fria soldatabas och kalkylator (Photovoltaic Geographical Information System) |
| SARAH3 | Satellitbaserade solljusdata i PVGIS; täcker Europa upp till cirka 65° N |
| ERA5 | En global återanalys från ECMWF; PVGIS använder den där satellitdata saknas |
| SMHI | Sveriges meteorologiska och hydrologiska institut |
| STRÅNG | SMHI:s modell för solljus över Sverige |
| RISE | Research Institutes of Sweden |
| Skurna celler | Solceller skurna i smala remsor så att en liten panel får användbar spänning; kanterna förlorar något i svagt ljus |
| Återanalys | En vädermodell körd över tidigare decennier, matad med observationer |
| Weibulls plotposition | Ett standardsätt att uppskatta hur ofta ett värde överskrids ur en rangordnad lista: r = (N + 1)/T |
| Lutningsmätare | Vinkelmätare (klinometer), för att mäta hur högt träd eller kullar når över horisonten |
| MPPT | Maximum power point tracking: en laddare som försöker hålla panelen vid bästa spänning; CN3791 gör det med en fast inställning |
| Inställning | Den panelspänning CN3791 håller under laddning; här 5,0 V |
| Wp | Här: panelens verkliga effekt i full sol, inte märkeffekten |
| Voc | Tomgångsspänning: panelens spänning utan något anslutet |
| Isc | Kortslutningsström: ungefär proportionell mot ljuset |
| Fyllnadsfaktor | Panelens högsta effekt delad med Voc × Isc; cirka 0,7 för typiska billiga paneler |
| Idealitetsfaktor n | En diodparameter; avgör här hur fort panelens spänning faller i svagt ljus |
| Shuntresistans | Inre läckage i en panel; skadar mest i svagt ljus |
| Himmelsfaktor R | Den andel av det diffusa himmelsljuset en panel fortfarande ser ovanför trädlinjen |
| Trädlinje | Vinkeln över horisonten under vilken träd eller kullar skymmer himlen |
| Rimfrost | Is som byggs upp ur underkyld dimma, främst på utsatta höjder |
| Underskott | Hur långt batteriet är från fullt, i Ah |
| Episod, D | En följd dygn med underskott; D är dess längd fram till vinterns största underskott |
| Återkomstnivå | Det underskott som väntas nås eller överskridas en gång på ett givet antal vintrar; här fem |
| Avdrag | En faktor under 1 för kapacitet som inte kan användas: kyla, användbart fönster, åldrande |
| Behov | Batterikapacitet i mAh, före marginal, snödagar och avrundning |
| Golv | Behovet med obegränsad panel; ingen panelstorlek kan göra bättre |
| Null | Inget batteri räcker, eftersom panelen inte kan ladda upp det ens på sommaren |
| C-tal | Ström relativt kapacitet; 1 C tömmer en cell på en timme |
