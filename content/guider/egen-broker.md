---
title: "En egen broker för regionen"
seoTitle: "En egen MQTT-broker för regionen?"
description: "Du behöver ingen egen broker: den gemensamma fungerar för alla regioner. Vad en region får med en egen, vad den kostar och var instruktionerna finns."
weight: 85
group: regioner
date: 2026-11-16
lastmod: 2026-11-18
---

**Du behöver ingen egen: den gemensamma brokern fungerar.** Brokern
`{{< param "backend.host" >}}` tar emot repeatrar från alla regioner. Den skickar vidare
signerade kommandon till repeatrar med fjärrstyrning och tar emot paketen de hör. Repeaterguiderna
under [Wizards](../../wizard/) och [Firmwarevarianterna av Louie](../firmware-lou/) ställer in den
åt dig, och de flesta regioner kommer aldrig att behöva något annat.

En broker är den MQTT-server som repeatrarna håller en anslutning till. Den läser inga kommandon
och kan inte skicka några egna: varje kommando är signerat med repeaterägarens nyckel, och
repeatern kontrollerar signaturen själv.

## Vad en region får med en egen

- **Fjärrstyrning i egen regi.** Regionens repeaterägare skickar sina kommandon genom en server
  som regionen själv sköter, med egna gränser för hur mycket som får skickas och egna regler för
  vilka nycklar som släpps in.
- **Ett eget paketflöde.** Repeatrarna skickar alla paket de hör till brokern. Det flödet kan
  regionen läsa till en egen karta eller egen statistik, utan att gå via någon annan.
- **Oberoende.** Går den gemensamma brokern ner, påverkas inte regionen.

Repeatrar kan flytta mellan den gemensamma brokern och en egen utan att flashas om: det är några
`set`-kommandon, och sidans wizards skriver dem när regionen har angett sin egen server.

## Vad det kostar

- **En liten server.** En liten VPS räcker, med ett domännamn och ett TLS-certifikat (gratis
  från Let's Encrypt).
- **Skötsel.** Någon måste uppdatera servern, förnya certifikat, ta backup och svara när den
  krånglar. Ligger brokern nere kan regionens repeatrar inte fjärrstyras, och regionens eget
  paketflöde stannar.
- **Ett namn att behålla.** Brokerns namn finns i varje repeaters inloggning. Välj ett namn som
  regionen kan ha kvar, så slipper alla repeatrar ställas om senare.

## Så sätter du upp en

1. **Brokern.** mcbroker är ett tillägg till Mosquitto som sköter inloggning, behörigheter och
   kontroll av signaturer. Koden och en driftsguide för andra regioner är inte publicerade än;
   tills de är det kan du fråga i [mccontrol på GitHub](https://github.com/sweden-mesh/mccontrol-cli/issues).
2. **Verktyget.** [mccontrol](https://github.com/sweden-mesh/mccontrol-cli) är programmet som
   repeaterägare signerar och skickar kommandon med. Där står hur du skapar en nyckel, registrerar
   den hos en broker och lägger till dina repeatrar.
3. **Sidan.** Regionens sida anger sin broker med `host` under `[params.backend]` i `hugo.toml`.
   Då skriver wizards och guider ut den i stället för den gemensamma.
