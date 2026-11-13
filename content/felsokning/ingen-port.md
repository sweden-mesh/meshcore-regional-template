---
title: "Webbläsaren hittar ingen port"
description: "Listan med enheter är tom, eller radion syns inte i den."
category: flasha
weight: 30
---

## Troliga orsaker

1. **Kabeln laddar bara.** Många USB-kablar har inga dataledare.
2. **Webbläsaren saknar Web Serial.** Bara Chrome och Edge på dator har det; Firefox och Safari
   har det inte.
3. **Radion är inte i flashläge**, eller en annan flik eller ett annat program har porten öppen.
4. På Windows: **drivrutin saknas** för kortets USB-krets (CP210x eller CH340 på äldre kort).

## Åtgärda

1. Byt till en kabel som du vet för över data, och prova en annan USB-port direkt i datorn.
2. Använd Chrome eller Edge.
3. Stäng andra flikar med flasher eller konsol, och program som kan ha porten öppen.
4. ESP32: håll in **BOOT**, tryck kort på **RST** och släpp **BOOT**. nRF52: dubbelklicka på
   **RST** så att radion syns som en USB-enhet.
5. Visar Enhetshanteraren en okänd enhet: installera drivrutinen för CP210x eller CH340 från
   tillverkaren.

## Så vet du att det fungerar

Radion syns i listan när du klickar på *Connect*, och försvinner när du drar ur kabeln.
