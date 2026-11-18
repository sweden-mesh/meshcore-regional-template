---
title: "För radioamatörer"
seoTitle: "MeshCore för radioamatörer: 868 MHz"
description: "Du kan antenner och vågutbredning. Här är det som skiljer MeshCore: 868 MHz utan licens, ERP med antennvinsten, duty cycle, LoRa-parametrarna och flooding."
weight: 105
group: radio
date: 2026-11-16
lastmod: 2026-11-17
---

Du som har amatörradiocertifikat kan redan det mesta som avgör hur långt en LoRa-nod når: höjd,
fri sikt, antennvinst, kabelförluster. Den här sidan tar upp det som är annorlunda. De andra
guiderna förutsätter ingen radiovana; slå upp orden i [ordlistan](../ordlista/).

## Det här är inte amatörradio

MeshCore i Europa sänder i 868 MHz-bandet för kortdistansradio (SRD), som är undantaget från
tillståndsplikt. Det betyder:

- **Ingen licens behövs**, och ditt certifikat ger inga extra rättigheter här. Effektgränsen är
  densamma för dig som för alla andra.
- **Ingen anropssignal.** En nod identifieras av sin publika nyckel och ett namn som ägaren väljer.
  Du kan använda din signal i namnet, men det krävs inte.
- **Kryptering är normalt.** Direktmeddelanden och privata kanaler är krypterade, något som
  amatörradions regler i regel inte tillåter. Se [Kryptering i MeshCore](../../fragor/#kryptering).
- **Alla delar på samma kanal.** Hela nätet ligger på en frekvens, och det finns ingen
  kanalplan att välja i.

## Bandet och gränserna

Nätet här använder {{< param "radio.freq" >}} MHz, i delbandet **869,4–869,65 MHz**. Där gäller
i hela EU, och i Sverige genom PTS föreskrifter:

Effekt
: Högst **500 mW ERP** (27 dBm ERP).

Duty cycle
: Högst **10 procent** av tiden, det vill säga 360 sekunder sändning per timme. Det gäller varje
  sändare, även en repeater. MeshCore håller räkningen; se [Duty cycle i
  repeaterguiden](../repeater/#duty-cycle).

### Antennvinsten räknas in

Gränsen gäller ERP, inte uteffekten från kortet. ERP räknas mot en halvvågsdipol, som har
2,15 dBi:

```text {title="ERP"}
ERP (dBm) = uteffekt (dBm) − kabelförlust (dB) + antennvinst (dBi) − 2,15
```

| Uteffekt | Kabel | Antenn | ERP | Inom gränsen? |
| --- | --- | --- | --- | --- |
| 22 dBm | 1 dB | 3 dBi | cirka 150 mW | ja |
| 22 dBm | 1 dB | 6 dBi | cirka 310 mW | ja |
| 28,4 dBm (Heltec V4, `set tx 22`) | 0 dB | 3 dBi | cirka 850 mW | **nej** |
| 25,3 dBm (Heltec V4, `set tx 16`) | 0 dB | 3 dBi | cirka 420 mW | ja |

De flesta kort har en SX1262 som ger högst 22 dBm, och då håller du dig inom gränsen med en
vanlig antenn. Kort med ett effektsteg efter radiokretsen ger mer än `set tx` säger. Heltec V4
gav 28,4 dBm på `set tx 22`, uppmätt med kalibrerad mätare på tre kort ([MeshCore issue
1708](https://github.com/meshcore-dev/MeshCore/issues/1708)). Det finns också kort på 1 W
(30 dBm). Med dem räknar du ut ERP innan du sätter `set tx`, och sänker den tills summan håller.

## LoRa-parametrarna

LoRa är en chirp-modulation (CSS) som kan tas emot under brusgolvet. Frekvens, bandbredd och
spreading factor måste vara samma på alla noder i nätet, annars hör de inte varandra:

{{< settings >}}

Spreading factor (SF)
: Hur många chirps varje symbol sprids över. Varje steg uppåt fördubblar tiden i luften och tål
  ungefär 2,5 dB sämre signal-brusförhållande. Vid SF8 tas signaler emot ned till cirka 10 dB
  under bruset.

Bandbredd (BW)
: En halverad bandbredd fördubblar tiden i luften och sänker brusgolvet cirka 3 dB. 62,5 kHz är
  smalt för LoRa; det ger räckvidd utan att gå upp i SF.

Kodningsgrad (CR)
: Felkorrigeringen. 4/8 skickar dubbelt så många bitar som datan och tål störningar bäst, men tar
  längst tid.

Valet är en avvägning. Längre tid i luften ger räckvidd, men varje paket upptar kanalen längre
för alla. Med SF8 och 62,5 kHz tar ett kort textmeddelande ungefär en halv sekund i luften.

## Så förs trafiken vidare

Det liknar digipeatrar i APRS, men med skillnader:

- **Flooding med minne.** En repeater sänder ett paket vidare en gång, och känner igen det om det
  kommer tillbaka. Paketet bär listan över repeatrarna det passerat (vägen).
- **Direkt när vägen är känd.** Ett svar kan gå tillbaka längs den väg som fungerade, i stället
  för att floodas igen. Bara repeatrarna i vägen sänder.
- **Regioner begränsar spridningen.** En flood med en region förs bara vidare av repeatrar som
  bär den regionen, så lokal trafik stannar lokalt. Se [Regioner](../regioner/).
- **Companions för inte vidare.** Bara repeatrar gör det. En handenhet i fickan bidrar inte till
  nätets täckning.

Eftersom alla delar en frekvens är sändningstid nätets knappaste resurs. En repeater som sänder
krockar med grannarna som också vill sända, och flera repeatrar inom hörhåll för varandra kostar
mer än de ger. Se [Sändningstid är gemensam](../etikett/).

## Vad du kan bidra med

Det du kan om antenner, master och placering är just det ett meshnät saknar oftast. En repeater
högt upp med fri sikt gör mer för nätet än tio companions. Se [Antenner](../antenner/), [Sätt
upp en repeater](../repeater/) och [Bli nodvärd](../../bli-nodvard/).
