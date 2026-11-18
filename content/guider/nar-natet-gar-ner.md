---
title: "MeshCore när el och mobilnät går ner"
seoTitle: "MeshCore vid strömavbrott och kris"
description: "Vad som fungerar i MeshCore när elen och mobilnätet går ner, vad som inte gör det, och vad du kan göra redan nu. MeshCore ersätter inte 112."
weight: 30
group: start
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

En companion på batteri och repeatrar på sol eller batteri fortsätter att skicka meddelanden
utan el och utan mobilnät. Repeatrar på nätström utan reservbatteri stannar. MeshCore är ett nät
byggt av frivilliga, utan garanti: **det ersätter inte 112**, och myndigheternas information
kommer via radion [^kris].

## Vad fungerar, och vad inte

| Del | Utan el | Utan mobilnät och internet |
| --- | --- | --- |
| Din companion på batteri | ja, så länge batteriet räcker | ja |
| Appen i telefonen | ja, så länge telefonen har ström | ja, den pratar med radion via Bluetooth |
| Repeater på sol eller batteri | ja | ja |
| Repeater på nätström utan reservbatteri | nej | ja, så länge den har ström |
| Kartan på den här sidan och observatörerna | nej | nej, de behöver internet |

Meddelandena går alltså fram så länge det finns repeatrar med ström mellan dig och mottagaren.
Var de står ser du på [kartan](/#karta) medan internet fungerar.

## Gör det här nu

1. **Ladda radion och en powerbank.** Krisinformation.se råder alla att ha en extra powerbank
   till mobiltelefonen [^hem]; den laddar också en companion.
2. **Ställ in radion med ditt läns värden**, se [Kom igång med en companion](../companion/).
3. **Lägg till länets kanal** och testkanalen {{< testchannel >}}, se [Kanaler](../kanaler/).
4. **Testa nu, inte när det händer.** Skriv `test` i testkanalen och se vem som svarar, se
   [Första meddelandet](../forsta-meddelandet/).
5. **Spara dina kontakter** i appen medan nätet är lugnt, så att du kan skriva direkt till dem.
6. **Skriv upp värdena på papper**: förinställning, region och kanaler, som de står i
   [Kom igång med en companion](../companion/).

## När det händer

- **Ring 112** vid nöd, om telefonen har täckning [^komm]. MeshCore når ingen larmcentral.
- **Lyssna på P4.** Sveriges Radio ska alltid kunna sända information som är viktig för
  allmänheten, och din lokala P4-kanal berättar hur läget är [^komm] [^hem]. En radio på batteri,
  sol eller vev fungerar utan el [^hem].
- **Skriv kort.** Ett meddelande rymmer högst 160 byte, och alla delar på samma sändningstid
  [^text]. Skicka inte samma meddelande flera gånger.

## Gränserna

- Ingen garanti: ett meddelande kan försvinna utan att du får veta det.
- Bara text, inga samtal och inga bilder.
- Räckvidden beror på repeatrarna omkring dig och deras ström. Där det saknas repeatrar når du bara
  dem du hör direkt.
- Nätet drivs av frivilliga och ingår inte i samhällets krisberedskap. Myndigheten för civilt försvar (MCF) och
  regeringen ger ut broschyren *Om krisen eller kriget kommer* med vad hushållen ska göra
  [^mcf] [^reg].

## Gör nätet tåligare

Varje repeater på sol eller batteri gör nätet starkare när elen går. Läs [Solnoder](../solnoder/)
innan du bygger en, [Bli nodvärd](/bli-nodvard/) om du har en bra plats, och [Hur länge räcker
batteriet?](../../fragor/#batteritid) för en companion.

Att bygga eget radionät ses som ett sätt att förbereda sig, som TV4 har berättat om [^tv4].

## Källor

[^kris]: Krisinformation.se, [Hemberedskap](https://www.krisinformation.se/din-beredskap/hemberedskap/).
[^hem]: Krisinformation.se, [Hemberedskap](https://www.krisinformation.se/din-beredskap/hemberedskap/), avsnittet Kommunikation.
[^komm]: Krisinformation.se, [Kommunikation vid kris](https://www.krisinformation.se/din-beredskap/kommunikation/).
[^text]: MeshCore, [`MAX_TEXT_LEN` i BaseChatMesh.h](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.h).
[^mcf]: MCF, [pressmeddelande om broschyren](https://mcf.mynewsdesk.com/pressreleases/snart-landar-broschyren-om-krisen-eller-kriget-kommer-hos-drygt-fem-miljoner-hushaall-i-sverige-3354652).
[^reg]: Regeringen, [En broschyr för allvarstid](https://regeringen.se/pressmeddelanden/2024/10/en-broschyr-for-allvarstid--ny-upplaga-av-om-krisen-eller-kriget-kommer/).
[^tv4]: TV4, [reportage om ett eget radionät](https://www.tv4.se/artikel/5Frw4pRToGwrcn8m6vdOaU/bygger-eget-radionaet-naesta-steg-i-den-digitala-preppingen).
