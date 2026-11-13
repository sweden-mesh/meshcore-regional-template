---
title: "nRF52-radion syns inte som en USB-enhet"
description: "RAK4631, T1000-E och andra nRF52-kort: ingen enhet att dra firmwarefilen till."
category: flasha
weight: 35
---

nRF52-kort uppdateras ofta genom att man drar en `.uf2`-fil till en enhet som radion visar när
den står i bootloader-läge.

## Troliga orsaker

1. **Radion är inte i bootloader-läge.**
2. **Kabeln laddar bara.**
3. Kortet saknar UF2-bootloader. Då flashas det i stället med webbflashern över USB.

## Åtgärda

1. Dubbelklicka snabbt på **RST** (reset). En enhet dyker upp i datorn, ofta med kortets
   namn.
2. Hjälper det inte: byt till en kabel som för över data och prova igen.
3. Visas enheten men filen inte tas emot: kontrollera att filen slutar på `.uf2` och är för
   din modell.
4. Ingen enhet alls: flasha med [webbflashern](../../guider/flasha-firmware/), som använder
   seriell port i stället.

## Så vet du att det fungerar

Enheten försvinner av sig själv när filen är kopierad, radion startar om och `ver` visar den
nya versionen.
