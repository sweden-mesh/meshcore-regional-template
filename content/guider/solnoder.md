---
title: "Solnoder"
linkTitle: "Solnoder"
description: "Varför en repeater på solcell, vad som gör vintern svår så här långt norrut, och vad som krävs: panel, batteri, laddare och firmware. Med batteritabeller och ett fälttest från hösten 2026."
weight: 40
---

## Varför sol?

En repeater gör mest nytta högt upp med fri sikt: på en höjd, i en mast, vid en skogskant mot en
dal. Där finns sällan ett eluttag. En solcellsdriven repeater kan stå där den behövs i stället
för där det råkar finnas ström, och den fortsätter fungera när elnätet ligger nere.

Priset är att den måste klara sig själv hela vintern. En repeater på solcell klarar sommaren
nästan oavsett hur den byggs; det är vintern som avgör hur stort batteri som behövs och hur
panelen ska sitta. Siffrorna på den här sidan gäller ett vanligt bygge med
[Clas Ohlsons panel](https://www.clasohlson.com/se/Northlight-Flexible-Solar-System-solpanel-15-W/p/36-9423)
där du bor, och de är räknade för **den sämsta vintern på fem år, plus 50 procent
marginal**, avrundade uppåt. Laddaren är inställd på **5,0 V**. En vinter av det slag som kommer en gång på hundra år klarar de inte säkert.

## Det korta svaret

{{% solar "where" %}}

{{% solar "short" %}}

Det som ändrar behovet mest är trädlinjen, panelens vinkel och hur mycket ström firmwaren drar.
Vädret en enskild vinter betyder mindre.

## Utmaningen: vintern

Instrålning mot en lodrät panel mot söder, kWh/m² per dag, medel per månad 2005–2023 (PVGIS):

{{% solar "irradiation" %}}

Exemplet nedan gäller Jönköping (57,8° N). Längre norrut är vintern mörkare och solen lägre; längre söderut tvärtom.

- December ger 19 procent av junis ljus. En vanlig decemberdag ger 0,31 kWh/m², och varje
  vinter har en period på fem, sex dagar under 0,1.
- Middagssolen står bara cirka 10° över horisonten i början av december, 9° vid vintersolståndet
  och cirka 15° i slutet av januari.
- Bakom en trädlinje på 20° kommer ingen direkt sol alls från slutet av oktober till slutet av
  februari. Bakom 15° gäller det ungefär 20 november till slutet av januari. Då lever panelen
  bara på ljuset från himlen.
- Med en trädlinje på 20° runt om ger panelen per kilowatt märkeffekt 79 Wh per dag i december
  och 119 Wh i januari. Med fri horisont är det 656 och 912 Wh. Träden tar alltså bort nästan
  90 procent av december och januari.

Underskottet på vintern är därför inte otur. Det byggs upp från ungefär mitten av november till
slutet av januari varje år, och skiljer sig bara cirka ±15 procent mellan vintrar.

## Hjälper det att panelerna är kalla?

Det stämmer att en solcell ger mer i kyla, men för vintern spelar det nästan ingen roll. Siffrorna gäller Jönköping.

| | Värde |
|---|---|
| Cellen vid −5 / −10 °C jämfört med databladets 25 °C | +11 % / +13 % |
| Vinsten som faktiskt kommer batteriet till godo, december–februari | +5–6 % |
| Instrålning i december jämfört med juni | 19 % |
| Energi i december jämfört med juni, allt inräknat | 21 % |

- Vinsten räknas per enhet solljus, och solljuset är litet. Den låga solen tar bort cirka
  2 500 Wh per kWp och dag jämfört med juni; kylan ger tillbaka cirka 40.
- En solbelyst panel är 10–20 °C varmare än luften, och de soliga vinterdagarna är oftast de
  mildare. När vinterns energi faktiskt kommer är cellerna därför runt +9 till +12 °C, inte −5.
- Svagt grått ljus omvandlas några procent sämre, vilket äter upp det mesta av köldvinsten.

Det som verkligen styr vinterskörden är trädlinjen, som tar bort cirka 90 procent av december
bakom 20°, och nysnö på marken, som kan ge upp till 15 procent mer i januari på en lodrät panel.

> [!NOTE]- Laddning av kalla celler
> Vid så små strömmar är risken begränsad men inte noll. Inga publicerade tester täcker så låga
> laddströmmar mellan 0 och −10 °C. Utifrån de data som finns hamnar gränsen ungefär vid
> 0,15–0,25 C vid −10 °C (1 C betyder att hela kapaciteten laddas på en timme). Vanlig
> vinterladdning av ett paket på 7 000 mAh ligger på 0,02–0,03 C, långt under. De ljusaste
> dagarna, ungefär en på tjugo, når den bästa timmen 0,24–0,33 C. Ett större paket eller en
> laddström begränsad till 1 A sänker toppen, och bakom en trädlinje på 20° är strömmarna i
> december och januari ungefär tio gånger mindre. Hälften av energin december–februari kommer när
> luften är under 0 °C, så en laddare som vägrar ladda under 0 °C kastar bort halva vintern.
>
> Erfarenhet från ett annat kallt nät: [YYCMesh](https://yycmesh.com/blog/cold-weather-charging),
> ett Meshtastic-nät i Calgary i Kanada, har haft solcellsnoder utan värme i Alberta i ungefär två
> vintrar, bland annat på tre bergstoppar över 2 100 meter. Cellerna laddades med låg ström genom
> vintrar ner mot −40 °C, utan något fel i nätet. En cell som mättes efteråt hade cirka 6 procent
> mindre kapacitet än nya celler. Det är erfarenhet från ett nät, inte ett kontrollerat test, och
> cellernas temperatur loggades inte. Det säger något om kylan, inte om batteristorlek: Calgary
> ligger på 51° N, där middagssolen i december fortfarande står cirka 15° över horisonten.

## Vad som krävs

I korthet, för en nod som ska klara sig själv:

- **Panel:** Clas Ohlsons panel (urplockad, bara solcellsarket), **lodrät mot söder** om ingen
  borstar bort snön, och så fri sikt mot söder som platsen tillåter.
- **Batteri:** litiumjon, **minst två celler** parallellt, med skyddskort, i en isolerad låda. Storleken beror
  på trädlinjen och var i landet noden står; se tabellerna nedan.
- **Laddare:** en MPPT-solladdare (CN3791), inställd på **5,0 V** med Clas Ohlsons panel. Undvik laddare som slutar
  ladda under 0 °C: hälften av vinterns energi kommer när det är minusgrader.
- **Firmware:** en strömsnål repeater. Med EasySkyMesh drar den cirka 4,5 mA i snitt, med
  officiell MeshCore cirka 7,1 mA, och det ändrar batteribehovet ungefär två gånger om.
- **Radio:** Seeed XIAO nRF52840 med Wio-SX1262, och inget annat som drar ström på batteriet.

Detaljerna står under [Vad siffrorna förutsätter](#vad-siffrorna-förutsätter).

### Clas Ohlsons panel, och om du köper en annan

Clas Ohlsons panel håller på att gå ur sortimentet, men många har redan en. Siffrorna för den kan
vägleda dig när du väljer en annan panel:

| | Clas Ohlsons panel |
|---|---|
| Märkeffekt enligt butiken | 15 W |
| Verklig effekt i full sol, uppmätt | cirka 10 W |
| Tomgångsspänning i full sol, beräknad från fälttestet | cirka 6,4–6,6 V |
| Inomhus bakom två glasrutor, 4 november kl. 13.04 | 5,90 V tomgång, 1,12 A kortslutning, cirka 4,7 W |

Väljer du en annan panel:

- **Räkna med verklig effekt, inte märkeffekt.** Clas Ohlsons panel ger cirka två tredjedelar av
  sin märkeffekt i full sol. En panel som verkligen ger cirka 10 W ger ungefär samma vinterskörd
  som i tabellerna; en mindre panel behöver ett större batteri.
- **Spänningen ska passa laddaren.** Tabellerna förutsätter Clas Ohlsons panel (cirka 6,4–6,6 V
  tomgång i full sol) och CN3791 inställd på 5,0 V. CN3791 laddar bara när panelens
  tomgångsspänning är över cirka 1,02 gånger inställningen; ställs den för högt startar laddaren
  bara i starkt ljus och missar vinterns svaga ljus. Har din panel en annan spänning ställer du in
  laddaren efter den.
- **Mät den själv** innan vintern: tomgångsspänningen i sol, utomhus, utan något anslutet.

## Hur stort batteri

Vill du räkna på en annan panel eller ett annat antal celler? Använd
[solcellskalkylatorn](/wizard/solcell/): välj plats, trädlinje och firmware, och dra i reglagen.

### Efter batteriets kapacitet

Panelen lodrät mot söder. *Dagar i totalmörker* är hur länge batteriet ensamt håller repeatern
igång utan någon sol alls, med kyla, urladdningsgräns, åldrande och självurladdning inräknat.
*Klarar* betyder att batteriet aldrig går under 3,4 V under den sämsta vintern på fem år, med
marginalen. Snö på panelen är inte med i tabellerna; se [Snö och frost](#snö-och-frost-på-panelen).
*Utan träd* betyder att bara terrängen runt platsen skymmer; i kuperade trakter längre
norrut skymmer den ensam en stor del av vintersolen.

{{% solar "capacity" %}}

I Jönköping är 47 dagar (9 000 mAh) fler än den längsta solfria period som uppmätts. De
långa underskottsperioderna bakom träd är dunkla, inte mörka: panelen ger lite varje dag.

### Efter trädlinje och panelvinkel

Batteri i mAh för den sämsta vintern på fem år, med EasySkyMesh om inget annat står. Inom parentes
hur mycket beräkningen kan slå fel. Bygg aldrig med färre än **två celler** (6 000 mAh med
3000 mAh-celler), vad tabellen än säger: laddaren ger upp till 2 A, mer än en ensam cell brukar tåla.

{{% solar "trees" %}}

- **Mät trädlinjen:** ställ dig där panelen ska sitta, öppna en lutningsmätare (klinometer) i
  telefonen, svep från sydost via söder till sydväst och notera den högsta vinkel där träd, hus
  eller berg skär av himlen.
- **Lutning och snö:** en lutad panel ser mycket mer himmel och behöver därför mycket mindre
  batteri under en trädlinje, men bara om någon borstar bort snön. En panel på 60° håller snön
  ungefär lika länge som en på 40°; bara en lodrät panel blir oftast fri av sig själv (se [Snö och frost](#snö-och-frost-på-panelen)). Varje dag under
  snö kostar cirka 154 mAh (EasySkyMesh) eller 242 mAh (officiell firmware), så tre veckor med
  snö kräver cirka 3 200 mAh till, före marginalen. För en plats som ingen besöker på
  vintern: använd den lodräta kolumnen.
- **Riktning:** söder är bäst. Sydväst ändrade behovet lite med fri horisont i den första
  beräkningen och har inte räknats om. Mot väster fungerar inte, se fälttestet nedan.

## Vad ett fälttest i Jönköping visade

Ett fälttest från 17 oktober till 13 november 2026 mätte en riktig laddaruppställning under
senhösten. Omgång 2 använde Clas Ohlsons panel, men med en annan laddare (en billig linjär HW-736
i stället för CN3791) och inomhus bakom två glasrutor, så testet prövar inte beräkningens
siffror. Det visar hur en liten verklig solcellsuppställning beter sig på senhösten.

**Uppställning:** panelen lodrätt i ett söderfönster inomhus, bakom två gamla glasrutor.
Laddaren HW-736, en billig linjär laddare som behöver cirka 4,7 V från panelen innan någon ström
går. Två billiga 18650-celler parallellt. Ett motstånd på 531 Ω som last, cirka 7,5 mA eller
180 mAh per dygn, i stället för en repeater med XIAO nRF52840 och Wio-SX1262 utan hård
strömsparning. Ljuset mättes av en väderstation på taket med en vågrät sensor som visar cirka
25–35 procent för lite, så de siffrorna visar vädrets form, inte absoluta värden.

**Omgång 1, en liten trädgårdslampspanel på 1,5 W (8 × 15 cm):**

| Förhållanden | Resultat |
|---|---|
| Natt, ingen sol | batteriet tappar cirka 180 mAh per dygn, mycket jämnt |
| Klar dag, 18 oktober | minst 760 mAh in, topp 208 mA, cirka 1 W |
| Soliga dagar, 28–29 oktober | cirka +280 till +300 mAh netto per dygn (450–480 mAh från panelen, cirka 2,5 dygns last) |
| Mest grå vecka, 22–27 oktober | panelen gav cirka 90 mAh per dygn, halva lasten |
| Mörkgrå dag, 1 november | panelen gav i stort sett ingenting |
| Nio dygn, 23 oktober–1 november | gick jämnt ut med ungefär en solig dag av tre eller fyra |
| Samma panel mot väster, med en kulle i öster | 3–6 mA mot upp till 208 mA mot söder, cirka 40 gånger mindre |

**Omgång 2, Clas Ohlsons panel** (från 4 november, samma laddare, celler och last). Den 4 november
kl. 13.04, inomhus bakom glaset och med cirka 145 W/m² på takets sensor: tomgångsspänning 5,90 V,
kortslutningsström 1,12 A, cirka 4,7 W i det ögonblicket.

| Förhållanden | Resultat |
|---|---|
| Veckan 5–11 november, i snitt ungefär hälften av ljuset den lilla panelen behövde för att gå jämnt ut | panelen täckte cirka 70–90 procent av lasten på 180 mAh per dygn |
| Mörka dagar, högsta ljus bara 35–60 W/m² | cirka 50–100 mAh per dygn, där den lilla panelen gav noll |
| Bra ljus | laddarens gräns på 500 mA, inte panelen, blev flaskhalsen |

Det testet visade:

- **Skörden är mycket olinjär.** Under en viss ljusnivå ger en linjär laddare ingenting alls,
  eftersom panelen inte orkar hålla spänningen över tröskeln. Clas Ohlsons panel gjorde mörka
  dagar från noll till 50–100 mAh. Testarna tror att en laddare som arbetar vid lägre ljus (en
  MPPT-laddare som CN3791) också hjälper, men det prövades inte.
- **Ett fullt batteri ser ut som att det inte laddar:** laddaren drar ner strömmen nära 4,2 V och
  den gröna lysdioden tänds.
- **Billiga celler märkta "3000 mAh" gav ungefär hälften.**
- **Jämför bara spänningar uppmätta på morgonen,** efter natten och innan solen når panelen.
  Kvällsvärden efter laddning ligger 30–50 mV för högt.

Testarnas grova uppskattning utifrån mätningarna hittills: ett vinterunderskott från november
till mitten av februari på cirka 14 Ah vid 180 mAh per dygn för den lilla panelen, och cirka
5–8 Ah för Clas Ohlsons panel i samma fönster. Båda kan vara fel med en faktor två åt endera
hållet. De räknar med att Clas Ohlsons panel ger ungefär 30–50 procent mer utomhus utan glas,
men det är inte uppmätt.

## Vad siffrorna förutsätter

Tabellerna ovan gäller bara för det här bygget:

- **Panel:** Clas Ohlsons panel, urplockad så att bara solcellsarket används. Det inbyggda
  batteriet, laddkortet och skymningssensorn är borttagna. Verklig effekt i full sol är cirka
  10 W.
- **Radio:** Seeed XIAO nRF52840 med Wio-SX1262, strömförsörjd från batteriet bara via XIAO:ns
  BAT+ och BAT−.
- **Firmware:** EasySkyMesh, MeshCores strömsparande gren, repeaterbygget, med `powersaving on`
  och `set radio.rxps max`: cirka 4,5 mA i snitt. Officiell MeshCore med `powersaving on`: cirka
  7,1 mA.
- **Laddare:** justerbart CN3791-solladdarkort inställt på **5,0 V** (aldrig 5,6 V med den här panelen), med lysdiodernas motstånd
  borttagna, laddström högst 2 A.
- **Batteri:** litiumjon, 3,6–3,7 V, celler parallellt, med skyddskort, i en isolerad låda.
- **Montering:** lodrät, mot söder, underkanten över höjden där snön driver.
- **Inget annat på batteriet:** inga extra kort, inga statuslysdioder.

### Innan första vintern

1. Mät spänningen mellan panelens två utgångstrådar i sol, utan något anslutet. Räkna med cirka
   6,0–6,6 V i full sol (fälttestet mätte 5,90 V inomhus bakom glas). Visar den cirka 12–13 V är
   arket kopplat åt andra hållet, och laddaren ska då ställas på 10,0 V i nästa steg. Vid alla
   andra värden: stanna och kontrollera att du har rätt trådar.
2. Ställ in laddaren med ett labbaggregat på **5,0 V** (eller 10,0 V, se steg 1) tills kortets
   MPPT-stift visar 1,205 V. Kontrollera att laddströmmen är högst 2 A. CN3791:s referens är
   noggrann på cirka ±2 procent, ungefär ±0,1 V, så mät sedan spänningen vid panelens anslutning
   medan kortet laddar och justera mot 5,0 V. 4,8 V är ännu lite bättre bakom träd, men bara om
   kortets spänningsfall på ingången är under cirka 0,15 V och det inte har någon seriediod före
   spolen; annars 5,0 V.
3. Ta bort laddarens lysdiodmotstånd: kortets egen ström äter av det svaga ljusets skörd. Koppla
   laddare → skyddskort → XIAO:ns batteriplattor.
4. Kontrollera att en provladdning slutar mellan 4,16 och 4,25 V och börjar igen av sig själv
   under 4,0 V.
5. Täck panelen och kontrollera att batteriet tappar mindre än 0,1 mA på natten.
6. Flasha firmwaren och slå på strömsparinställningarna.
7. Kör batteriet tomt, ställ panelen i sol och kontrollera att noden startar av sig själv.
8. Montera, och se till att batteriet är fulladdat i slutet av oktober.

Ett dygns strömlogg vid batteriet innan du köper celler är värd mer än vilken beräkning som
helst.

> [!TIP]- Valfritt: mät panelens spänning i svagt ljus
> Hur mycket batteri som behövs beror på hur panelens spänning faller i svagt ljus, och det har
> ingen mätt än. Det är skillnaden mellan tabellernas låga, väntade och höga värde. Så mäter du:
>
> 1. Inom cirka två minuter, med panelen vid samma temperatur, mät tomgångsspänning och
>    kortslutningsström vid 4–6 ljusnivåer.
> 2. Dämpa hela panelen jämnt med lager av tyll eller myggnät; skugga aldrig bara en del.
> 3. Täck kortslutningsströmmar från cirka 1 A ner till cirka 0,03 A.
> 4. Rita spänningen mot logaritmen av strömmen. Hur mycket spänningen stiger när strömmen
>    tiodubblas visar vilket värde som gäller: cirka 0,85–0,9 V det låga, cirka 1,0 V det väntade,
>    cirka 1,3 V det höga.

### Snö och frost på panelen

Även en lodrät panel kan täckas av snö som fastnar på glaset genom ett tunt lager frost eller is;
i ett försök i Piteå (65° N) var till och med den lodräta modulen helt täckt hela januari. Rimfrost
försvinner efter en timme eller två med låg sol och behöver ingen egen marginal. Räkna med dagar
utan skörd och lägg till dem innan marginalen, cirka 154 mAh per dag med EasySkyMesh och 242 mAh
med officiell firmware:

| | Skyddad plats | Utsatt höjd eller topp |
|---|---|---|
| Söder om 60° N | 2 dagar | 4 dagar |
| Norr om 60° N | 5 dagar | 8 dagar |

Norr om ungefär 63° N kan en lodrät panel vara begravd i 2–3 veckor mitt i vintern; det är inte
med i siffrorna. [Solcellskalkylatorn](/wizard/solcell/) lägger till snödagarna åt dig.

## Så togs siffrorna fram

En simulering timme för timme över de 18 vintrarna 2005–2023, med PVGIS satellitdata för
instrålning och temperatur för regionens plats (Jönköping: 57,78° N, 14,16° Ö). Trädlinjen stänger ute den direkta solen och
en del av himlen. Modellen räknar med panelens sämre verkningsgrad i svagt ljus, laddarens egna
förluster och repeaterns förbrukning. Varje vinter ger det största underskott batteriet måste
överbrygga. Tabellerna använder den sämsta vintern på fem år och lägger till 50 procent,
avrundat uppåt till närmaste hundratal mAh.

Laddaren modelleras timme för timme vid 5,0 V: panelens spänning i svagt ljus avgör när CN3791
startar. Den första versionen av beräkningen antog att laddaren arbetade i ljus där den inte kan
starta vid 5,6 V, och gav därför för låga siffror; den här sidan visar den rättade versionen.
Modellen stämmer med fälttestet om fönstret i testet hade en skyline på cirka 10°, vilket visar
att trädlinjen, eller horisonten, är det som betyder mest.

En oberoende omskrivning av batterisimuleringen, gjord bara utifrån dess beskrivning, gav exakt
samma värden i båda batteritabellerna. En annan gav samma instrålning och temperatur per månad
på tre decimaler.

> [!NOTE]- Formeln för batteristorleken
> batteri (mAh) = (underskott / (0,92 × 0,85 × 0,90) / (1 − 0,03 × dagar/30) + snödagar) × 1,50
>
> - 0,92: kapacitet kvar vid −20 °C vid så liten urladdning
> - 0,85: användbart fönster, 4,2 V ner till en gräns på 3,4 V
> - 0,90: åldrande, dimensionerat för tredje vintern
> - 3 %: självurladdning per månad under underskottsperioden
> - snödagar: dagar utan skörd × dygnets förbrukning genom samma faktorer (bara i kalkylatorn)
> - 1,50: marginal, och svaret avrundas uppåt

Inte med i tabellerna: snö eller frost på panelen (se ovan), och extra ljus som reflekteras från
nysnö på marken. De största osäkerheterna är panelens spänning i svagt ljus (se mätningen ovan),
firmwarens verkliga medelförbrukning och den verkliga trädlinjen. Osäkerheten är stor, cirka
±25–50 procent, tills panelens beteende i svagt ljus är uppmätt.

**Källor:** PVGIS v5.3 (EU:s Joint Research Centre), SARAH3 timvis instrålning med
ERA5-temperatur, 2005–2023; SMHI:s stationsdata för Jönköping-Axamo och Växjö; strömmätningar av
MeshCore- och EasySkyMesh-byggen på XIAO nRF52840 med Wio-SX1262; CN3791-databladet;
modultemperaturer från FMI:s fältmätningar i Sodankylä och laminatdatablad; köldegenskaper för
celler från tillverkarnas datablad och publicerade tester; fälttestet i Jönköping oktober och
november 2026.

Har din solnod redan tystnat? Se [Solnoden dör på vintern](/felsokning/sol-dor-pa-vintern/).
