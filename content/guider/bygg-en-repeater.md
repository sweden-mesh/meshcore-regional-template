---
title: "Bygg en repeater"
seoTitle: "Bygg en MeshCore-repeater: Wio, Heltec V4"
description: "Två repeaterbyggen för MeshCore: ett strömsnålt Seeed XIAO med Wio-SX1262 för batteri och sol, och ett Heltec V4 med wifi. Delar, flashning och låda."
weight: 48
group: repeater
date: 2026-11-16
lastmod: 2026-11-18
wideTables: true
---

Den här guiden bygger hårdvaran. Hur du sedan ställer in repeatern, väljer plats och kontrollerar
att den hörs står i [Sätt upp en repeater](../repeater/). Två byggen, efter hur repeatern ska
få ström:

| Egenskap | Seeed XIAO nRF52840 + Wio-SX1262 | Heltec V4 |
| --- | --- | --- |
| Passar | batteri och sol | nätström |
| Wifi (kan bli [observatör](../visa-pa-kartan/)) | nej | ja |
| Skärm | nej | ja |
| Lödning | två batterisladdar | ingen med USB-ström |
| Flashas | `.uf2`-fil som kopieras till kortet | i webbläsaren |

Inget av dem kräver att du kan radio. Vill du hellre köpa en färdig repeater: se [Skaffa
hårdvara](../skaffa-hardvara/repeater/).

> [!CAUTION] Antennen först
> Skruva fast antennen innan radion får ström. En LoRa-radio som sänder utan antenn kan gå sönder.

## Bygge 1: Seeed XIAO med Wio-SX1262

Ett litet nRF52840-kort med en radiomodul ovanpå. Det drar så lite att det kan gå på batteri och
sol året runt, om panel och batteri är rätt valda.

### Delar

- **Kitet XIAO nRF52840 & Wio-SX1262** från Seeed Studio. Det kostade 13,49 USD hos Seeed i
  november 2026, med en liten antenn men utan låda och batteri.
- **En antenn för 868 MHz.** Kitets lilla antenn duger för att prova på bordet. Ute behövs en
  bättre; se [Antenner](../skaffa-hardvara/antenn/).
- **Ett litiumjonbatteri** (3,7 V) med skyddskrets, till exempel 18650-celler.
- **En tät låda** (IP65 eller bättre) med kabelgenomföringar.
- För sol: panel och laddare enligt [Solnoder](../solnoder/), inte bara en enkel laddmodul.

### Bygg

1. **Sätt ihop kitet.** Radiomodulen sitter ovanpå XIAO-kortet. Anslut antennen till
   radiomodulen.
2. **Prova med USB först.** Flasha och ställ in kortet med USB-ström på bordet, innan något
   löds.
3. **Löd batteriet** till batteriplattorna på XIAO-kortets undersida, plus och minus enligt
   märkningen. Kortet laddar batteriet från USB-C. Fel polaritet kan förstöra kortet; mät innan
   du löder.
4. **Sol:** följ [Solnoder](../solnoder/). Där står vilken panel, laddare och
   batteristorlek en nod behöver för att klara en svensk vinter. Det skiljer sig från
   rådet på många utländska sidor, som räknar med mer vintersol.

### Flasha

Repeatern får MeshCore-projektets vanliga repeaterfirmware från den officiella webbflashern.

1. Öppna [webbflashern]({{< param "firmware.flasher" >}}), välj radion **Seeed Studio Xiao nRF52
   WIO** och **Repeater**, och ladda ner `.uf2`-filen.
2. Dubbelklicka på kortets reset-knapp. Kortet dyker upp som en USB-enhet i datorn.
3. Kopiera `.uf2`-filen dit. Kortet startar om av sig självt när filen är på plats.

Hittar datorn ingen enhet: se [nRF52-kortet syns inte som enhet](../../felsokning/nrf52-ingen-enhet/).

### Låda

Det finns många utskrivbara lådor för just det här kitet, flera med plats för solpanel och
batteri: sök på *XIAO Wio-SX1262* på Printables eller MakerWorld. Skriv ut i PETG eller ASA,
som tål sol och värme bättre än PLA. Låt ett litet dräneringshål vara öppet i botten.

### Med wifi i stället

Samma radiomodul finns i ett kit med **XIAO ESP32-S3**. Det har wifi och kan bli observatör, men
drar mer ström. Seeed har en [egen guide](https://wiki.seeedstudio.com/get_started_with_esp32s3_meshcore/)
till det kitet, med en utskrivbar låda. I webbflashern heter det **Seeed Studio Xiao S3 WIO** och
flashas som Heltec V4 nedan.

## Bygge 2: Heltec V4

Ett ESP32-S3-kort med skärm, wifi och radio på samma kort. Inget att löda om det får ström via
USB. Det drar för mycket för att gå länge på batteri: ställ det där det finns ström.

### Delar

- **Heltec WiFi LoRa 32 V4**, i 868 MHz-utförandet. Det kostade 429 kr hos Pileup i november
  2026 (annonsen säger inte vilket band; kontrollera innan du köper).
- **En antenn för 868 MHz**, med rätt kontakt för kortet. Se [Antenner](../skaffa-hardvara/antenn/#kontakter).
- **En USB-strömadapter** och en kabel som räcker fram.
- **En tät låda** om den ska stå ute.

### Sändeffekten

Heltec V4 har ett effektsteg efter radiokretsen och sänder starkare än `set tx` säger. Uppmätt
gav `set tx 22` cirka 28 dBm, vilket med en vanlig antenn är över gränsen 500 mW ERP. Med en
antenn på 3 dBi är `set tx 16` (cirka 25 dBm) inom gränsen. Har du en antenn med högre vinst
behöver du gå lägre. Uträkningen står i [MeshCore-inställningar i Sverige](../radioinstallningar/#sändeffekt-och-antenn).

```text {title="Sändeffekt för Heltec V4 med en antenn på 3 dBi"}
set tx 16
```

### Flasha

1. Öppna [webbflashern]({{< param "firmware.flasher" >}}) och välj radion **Heltec v4** eller
   **Heltec v4 R8**, efter vad som står på ditt kort, och sedan **Repeater**.
2. Ska repeatern också visa på kartan vad den hör, välj en **Observer**-firmware i stället. Den
   kommer från [MeshCore Observer-projektet](https://github.com/agessaman/MeshCore); se [Din
   repeater på kartan](../visa-pa-kartan/).
3. Anslut kortet med en USB-kabel som klarar data, starta flashningen och välj kortets port.

Mer om varje steg, och vad du gör om något krånglar, står i [Välj och flasha firmware](../flasha-firmware/).
Vill du ha auto-svar på test och fjärrstyrning finns [specialfirmware lou](../firmware-lou/) som ett
tillval; vanlig MeshCore räcker för en repeater.

## Spara ström

Repeaterfirmwaren har en inställning som låter radion sova mellan sändningarna [^cli]. Den är
avstängd från början. Slå på den på en repeater som går på batteri eller sol:

```text {title="Konsol"}
powersaving on
```

En repeater på nätström behöver den inte.

## När den är byggd

1. Ställ in radio, namn, position och region: följ [Sätt upp en repeater](../repeater/) eller
   wizarden för repeatrar. Byt administratörslösenordet; ett fabriksinställt lösenord kan vem som
   helst gissa.
2. Prova den där du lätt når den, och se att den hörs.
3. Montera den högt, med antennen lodrätt och fri från metall.

Behöver du en plats högt upp: se [Bli nodvärd](../../bli-nodvard/).

## Källor

[^cli]: MeshCore, [CLI-referensen](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md), `powersaving` (standard `off`).
