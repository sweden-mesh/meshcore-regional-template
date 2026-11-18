---
title: "Room server"
seoTitle: "Room server i MeshCore: så fungerar det"
description: "Vad en room server i MeshCore är, när den är rätt val, hur du flashar och loggar in, vilka begränsningar den har i dag och vilka alternativ som finns."
weight: 85
group: regioner
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

En **room server** är en MeshCore-nod som sparar inlägg i ett gemensamt rum, ungefär som en
anslagstavla. Den löser ett verkligt problem: ett meddelande i en kanal når bara den som har radion
på och är inom räckhåll just då, men en room server skickar det som skrivits medan du var borta när
du loggar in igen.[^faq] Det är det bästa sättet MeshCore har för det i dag, även om det har tydliga
begränsningar. Den här sidan går igenom båda delarna.

## När passar en room server?

- En grupp som vill kunna läsa ikapp, till exempel en förening, ett område eller en övning.
- En plats för information som ska finnas kvar en tid: driftinformation om nätet, möten, regler.
- Folk som inte har radion på hela dagen.

Vill du bara prata med de som är i luften just nu räcker en [kanal](../kanaler/).

## Så fungerar den

- Servern håller de **32 senaste inläggen**, i en gemensam kö för alla. Inlägg 33 tar bort det
  äldsta.[^code]
- Ett inlägg får vara högst **151 byte**. Å, ä och ö tar två byte var.[^code]
- När du loggar in skickar servern de inlägg du inte har sett, ett i taget, och väntar på kvittens
  för varje.[^code]
- Servern minns upp till 32 inloggade användare.[^acl]

## Sätt upp en room server

1. **Flasha room server-firmware** på en egen radio, på samma sätt som en repeater
   ([Välj och flasha firmware](../flasha-firmware/)). Kör inte repeater och room server på samma
   radio: MeshCore rekommenderar separata enheter.[^faq]
2. **Ställ in radion** med samma värden som nätet använder
   ([MeshCore-inställningar i Sverige](../radioinstallningar/)), och ge den ett tydligt
   [namn](../namnge-noden/).
3. **Byt lösenorden.** Administratörslösenordet är `password` och gästlösenordet `hello` från
   början.[^faq] Ändra båda i konsolen:

   ```sh {title="Konsol"}
   password <nytt adminlösenord>
   set guest.password <lösenord för rummet>
   ```

4. **Vill du att alla ska kunna läsa** utan lösenord, men bara de med lösenordet skriva:

   ```sh {title="Konsol"}
   set allow.read.only on
   ```

   Den som loggar in med fel eller tomt lösenord blir då gäst: gästen kan läsa men inte skriva.[^code]
5. **Sätt den högt och fritt**, nära dem som ska använda den. Ju färre hopp till servern, desto
   bättre fungerar den (se nedan).

## Logga in från appen

Room servern syns bland kontakterna när du har hört dess advert. Öppna den, ange rummets lösenord
och logga in. Därefter skickar servern de inlägg du inte har sett, och det du skriver i rummet
sparas där för de andra. Administratörslösenordet ger dessutom rätt att ändra serverns
inställningar över radio, som för en repeater ([Administrera repeatern från appen](../fjarradministration/)).

## Begränsningar i dag

Det här är kända problem i MeshCore, inte fel i ditt nät. De är rapporterade av användare, men inte
lösta (november 2026):

- **Inloggningen kan se misslyckad ut fast den lyckades.** Över flera hopp hinner appens tidsgräns
  gå ut, men inläggen kommer ändå fram.[^login]
- **Missade inlägg kommer inte tillbaka.** Servern minns för varje användare vilket inlägg den senast
  fick kvittens på. Har fler än 32 nya inlägg skrivits under tiden är de äldsta borta, och det finns
  inget sätt att be om dem igen.[^sync]
- **En ESP32-server utan klockbatteri** kan efter en omstart tro att det är maj 2024. Då ser nya
  inlägg äldre ut än det användarna redan har fått, och de skickas inte.[^clock]
- **Det första meddelandet efter en inloggning med lösenord** har för vissa användare misslyckats
  varje gång, tills companion startats om.[^first]

## Så får du den att fungera bättre

- Placera servern så att användarna når den **direkt eller med få hopp**.
- Kontrollera klockan efter varje omstart med `clock`, och ställ den med `clock sync` från appens
  administration om den visar fel år. Ett kort med en klockkrets (RTC) har inte problemet.[^clock]
- Låt inte rummet bli en pratkanal: med 32 platser försvinner det gamla fort om många skriver.
- Testa med en radio några hopp bort innan du berättar för andra att rummet finns.

## Alternativ

- **En kanal**, om det räcker att de som är i luften läser. Kanalen kostar ingen extra nod.
- **En BBS på en dator** bredvid en companion, till exempel en Raspberry Pi. Den svarar på vanliga
  direktmeddelanden och sparar allt i en databas, så den har inte room serverns tak på 32 inlägg och
  behöver ingen inloggning. Flera sådana projekt finns på GitHub, bland annat
  [MeshCore-BBS](https://github.com/carsten-walther/MeshCore-BBS) och
  [supply-drop-bbs](https://github.com/Mesh-America/supply-drop-bbs). Priset är att datorn måste vara
  igång.

## Källor

[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md), 1.2.5, 3.3 och 3.4.
[^code]: MeshCore 1.18, [simple_room_server](https://github.com/meshcore-dev/MeshCore/tree/main/examples/simple_room_server): `MAX_UNSYNCED_POSTS` 32, `MAX_POST_TEXT_LEN` 160−9, gästbehörighet med `allow.read.only`.
[^acl]: MeshCore 1.18, [ClientACL.h](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/ClientACL.h), `MAX_CLIENTS` 32.
[^login]: MeshCore, [issue 2212](https://github.com/meshcore-dev/MeshCore/issues/2212), stängd utan åtgärd.
[^sync]: MeshCore, [issue 1696](https://github.com/meshcore-dev/MeshCore/issues/1696), stängd utan åtgärd.
[^clock]: MeshCore, [issue 3059](https://github.com/meshcore-dev/MeshCore/issues/3059), öppen.
[^first]: MeshCore, [issue 236](https://github.com/meshcore-dev/MeshCore/issues/236), stängd utan åtgärd.
