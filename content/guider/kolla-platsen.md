---
title: "Kolla platsen med MeshMapper"
seoTitle: "Kolla en repeaterplats med MeshMapper innan du monterar"
description: "Så kollar du en tänkt repeaterplats i MeshMapper innan du klättrar: täckning från terrängen, sikt mot en repeater, rätt region och wardriving efteråt."
weight: 47
group: repeater
date: 2026-11-18
lastmod: 2026-11-18
---
Innan du bär upp en repeater på ett tak eller i en mast kan du se ungefär hur långt den skulle nå.
[MeshMapper](https://swe.meshmapper.net/) har verktyg som räknar på terrängen kring en plats och
visar vilka repeatrar den kan nå. Det tar några minuter och kan spara en klättring.

En koll är en hjälp, inte ett krav. En repeater som är uppe gör mer nytta än en som väntar på den
bästa platsen, se [En repeater som är uppe slår en perfekt som inte är det](../for-radioamatorer/#en-repeater-som-är-uppe-slår-en-perfekt-som-inte-är-det).

## Verktygen

Kartans verktyg öppnar du med knappen med hammaren och skiftnyckeln, till höger på kartan. Ett
verktyg i taget är öppet.

{{< screenshot src="images/guider/meshmapper-verktygsmeny.webp" alt="MeshMappers karta med uppmätt täckning i rutor från grönt till rött, och verktygsmenyn öppen under knappen med hammare och skiftnyckel: Line of Sight, Antenna Coverage (markerad), Coverage Timeline och Scope Finder." caption="Verktygsmenyn i MeshMapper." credit="Skärmbild: MeshMapper" >}}

Line of Sight
: Fri sikt mellan två eller flera punkter, med terrängprofil och Fresnelzon.

Antenna Coverage
: Hur långt en radio på en viss plats kan nå, räknat från terrängen.

Coverage Timeline
: Hur regionens uppmätta täckning har vuxit, uppspelat som en film.

Scope Finder
: Om ett regionnamn (scope) används i trafiken i regionen.

## Täckning från en plats

Antenna Coverage visar vart en radio på platsen troligen når.

{{< screenshot src="images/guider/meshmapper-antenna-coverage.webp" alt="Rutan Antenna Coverage i MeshMapper: fält för plats (PIN), knappar för effekt från 14 dBm (25 mW) till 30 dBm (1 W) med 22 dBm vald, TX height 6 m, RX height 2 m, frekvensen 869.618 MHz, en hopfälld del Advanced och knappen Show coverage." caption="Rutan Antenna Coverage. Välj aldrig 30 dBm (1 W): det är över gränsen." credit="Skärmbild: MeshMapper" >}}

1. **Sätt ut platsen (PIN).** Tryck på kartan där repeatern ska stå, eller på en befintlig
   repeater. Du kan också skriva in latitud och longitud, som `57.79, 13.42`.
2. **Välj effekt (POWER).** Välj det radion faktiskt sänder: de flesta kort ger högst 22 dBm.
   Gränsen i Sverige är 500 mW ERP, alltså 27 dBm räknat med antennens vinst och kabelns förlust.
   **Välj aldrig 30 dBm (1 W).** Det är dubbelt så mycket som tillåtet, och kartan visar då en
   räckvidd som ingen laglig repeater har. Se [Sändeffekt och antenn](../radioinstallningar/#sändeffekt-och-antenn).
3. **Ange antennens höjd (TX HEIGHT)** över marken, i meter. Räkna till antennen, inte till taket
   under den.
4. **Ange mottagarens höjd (RX HEIGHT).** 2 m motsvarar en handhållen radio. Vill du se vilka
   repeatrar platsen når, sätt höjden som en typisk repeater i trakten.
5. **Frekvensen** fylls i av MeshMapper, med den som används mest i regionen. I Sverige är det
   {{< param "radio.freq" >}} MHz.
6. **Låt Advanced vara.** Där finns känslighet, spreading factor, antennvinst, kabelförlust,
   marginal och miljö. Standardvärdena passar de flesta.
7. **Tryck på Show coverage.**

### Läs kartan

{{< screenshot src="images/guider/meshmapper-tackning-ulricehamn-liggande.webp" alt="Täckningskarta från MeshMapper för en plats vid Ulricehamn: en blå punkt för platsen och färgade fält som sträcker sig norrut mot Falköping längs dalgången, smala strimmor åt nordväst, och befintliga repeatrar som etiketter åt öster." caption="Täckning från en plats i Ulricehamn. Dalgången bär signalen norrut och söderut; åt öst och väst skuggar höjderna." credit="Skärmbild: MeshMapper" >}}

Färgerna visar hur säker förbindelsen är: rött är stark, orange trolig och gult i utkanten.
MeshMapper visar också hur långt varje nivå når och ungefär hur stor yta den täcker.

- **Terrängskuggor.** Täckningen är sällan en jämn cirkel. Höjder skymmer, och dalar och sjöar
  bär signalen långt åt vissa håll. Smala strimmor visar riktningar där terrängen råkar vara öppen.
- **Befintliga repeatrar** syns som etiketter på kartan. En ny repeater gör mest nytta där den når
  minst en befintlig, och samtidigt täcker ett område som ingen annan når.
- **Jämför två platser.** Kör verktyget på båda, med samma effekt och höjd, och se vilken som når
  fler repeatrar och mer nytt område.

Kartan räknar bara på bar terräng. Hus, träd, antennen och vädret ändrar räckvidden i
verkligheten, så se den som en uppskattning, inte ett löfte.

## Sikt mot en repeater

Line of Sight visar om två punkter ser varandra.

{{< screenshot src="images/guider/meshmapper-line-of-sight.webp" alt="MeshMappers karta vid Falköping och Vättern med verktygsmenyn öppen och Line of Sight markerad, över Antenna Coverage, Coverage Timeline och Scope Finder." caption="Line of Sight väljs i samma verktygsmeny." credit="Skärmbild: MeshMapper" >}}

1. Tryck på kartan eller på en repeater för punkt A och punkt B, eller skriv in koordinater. Med
   Add Point lägger du till fler.
2. Ange höjden över marken för varje punkt. En punkt på en repeater får 3 m från början.
3. Tryck på Calculate.

Svaret är en terrängprofil, med jordens krökning och den första [Fresnelzonen](../skaffa-hardvara/antenn/#fri-sikt-är-mer-än-en-linje).
Varje sträcka får ett omdöme: fri sikt (CLEAR), lite inom Fresnelzonen (Minor Fresnel Intrusion),
Fresnelzonen delvis skymd, mindre än 60 procent fri (Partially Blocked), eller skymd sikt
(OBSTRUCTED). På kartan är fri sikt grön och skymd röd.

## Rätt region

Scope Finder visar om ett regionnamn redan används i trafiken där. Skriv namnet, som `{{< region "scope" >}}`,
och tryck på Find. Svaret säger om namnet redan följs av MeshMapper, har hittats, bara liknar något,
eller inte finns. Vilken region som gäller här står i [Regioner](../regioner/).

## Hur nätet har vuxit

Coverage Timeline spelar upp hur regionens uppmätta täckning har vuxit, från de första mätningarna
till i dag. Där ser du var nätet redan är tätt och var det fortfarande är tunt.

## Efteråt: mät

När repeatern är uppe visar mätningar hur det blev. Kör MeshMappers app med din companion och åk
eller gå runt i trakten (wardriving): varje lyckad ping blir en punkt på kartan. Se också
på [kartan](/#karta) vilka repeatrar den nya hör, och läs [Kartan och observatörer](../visa-pa-kartan/).
