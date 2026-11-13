---
title: "Flashningen avbröts, och radion verkar död"
description: "Kabeln lossnade eller datorn somnade mitt i. Skärmen är svart och inget händer."
category: flasha
weight: 15
---

## Troliga orsaker

1. **Firmwaren skrevs bara till hälften.** Radion har ingen hel firmware att starta.
2. Batteriet är tomt, och radion får för lite ström från USB för att starta.

## Åtgärda

Det går nästan alltid att flasha igen; startkoden i chipet skrivs inte över.

1. Anslut med en kabel som för över data och låt den sitta.
2. Sätt radion i flashläge:
   - **ESP32:** håll in **BOOT**, tryck kort på **RST** och släpp **BOOT**.
   - **nRF52:** dubbelklicka på **RST**.
3. Flasha samma fil igen, utan att radera.
4. Låt datorn vara vaken och fliken öppen tills flashern säger att den är klar.

## Så vet du att det fungerar

Radion startar, och `ver` i [USB-konsolen](../../guider/usb-konsol/) visar versionen du
flashade.
