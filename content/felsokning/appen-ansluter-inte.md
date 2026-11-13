---
title: "Appen kan inte ansluta till radion"
description: "Bluetooth eller USB: radion syns inte, eller anslutningen bryts direkt."
category: companion
weight: 10
---

## Troliga orsaker

1. **Radion har repeater-firmware.** Appen ansluter bara till en companion.
2. **Bluetooth:** radion är redan parad med en annan telefon, eller en gammal parning ligger kvar.
3. **Fel PIN-kod.** Många radior visar koden på skärmen; utan skärm är den ofta `123456`.
4. **USB:** kabeln laddar bara, eller webbläsaren saknar Web Serial (använd Chrome eller Edge).

## Åtgärda

1. Kontrollera i [USB-konsolen](../../guider/usb-konsol/) med `ver` att radion har companion-
   firmware. Annars: [flasha om](../../guider/flasha-firmware/).
2. Ta bort radion bland telefonens Bluetooth-enheter, starta om radion och para igen från appen.
3. Koppla från radion på andra telefoner och datorer.
4. Byt kabel om du ansluter med USB.

## Så vet du att det fungerar

Appen visar radions namn och batterinivå, och kontakter börjar dyka upp.
