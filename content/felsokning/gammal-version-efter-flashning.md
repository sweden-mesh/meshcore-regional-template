---
title: "Radion visar fortfarande den gamla versionen efter flashningen"
description: "Flashningen gick bra, men `ver` säger samma version som förut."
category: flasha
weight: 20
---

## Troliga orsaker

1. **Radion startar från den andra firmwareplatsen.** En ESP32 har två platser för firmware. Har
   den uppdaterats trådlöst (OTA) startar den från den andra. En fil utan *merged*, skriven till
   `0x10000`, hamnar på den första, som inte används.
2. **Du laddade ner den gamla versionen.** Firmwareväljaren visar en ny version först en stund
   efter att den släppts, och en fil som laddats ner tidigare kan ligga kvar i Hämtade filer.
3. Flashern skrev till en annan radio, om flera är anslutna.

## Kontrollera

```sh {title="Konsol"}
ver
```

Jämför med versionsnumret i filnamnet du flashade.

## Åtgärda

1. Kontrollera att filnamnet har den version du vill ha. Ladda ner den på nytt om du är osäker.
2. Flasha **`-merged.bin`** till adress **`0x0`**, utan att radera. Den innehåller en tom
   startpost som pekar tillbaka på den första platsen.
3. Eller använd firmwareväljarens **Flasha via USB** med *Uppdatera*.

## Så vet du att det fungerar

`ver` visar den nya versionen efter en omstart.
