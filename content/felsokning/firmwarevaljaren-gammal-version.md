---
title: "Firmwareväljaren erbjuder inte den senaste versionen"
description: "En ny version är släppt, men sidan visar fortfarande den förra."
category: flasha
weight: 25
---

## Troliga orsaker

1. **Sidans fillista har inte hunnit uppdateras.** Den byggs om från versionerna på GitHub, normalt
   inom en timme efter en ny version, men ibland senare.
2. **Webbläsaren visar en sparad kopia** av sidan.

## Kontrollera

Jämför versionen som sidan väljer med den senaste på
[versionssidan på GitHub](https://github.com/sweden-mesh/MeshCore-lou/releases).

## Åtgärda

1. Ladda om sidan utan cache: **Ctrl+Shift+R** (Mac: **Cmd+Shift+R**).
2. Fortfarande gammal: vänta en stund, eller hämta filen för din radio direkt från versionssidan
   och flasha den enligt [Flasha firmware](../../guider/flasha-firmware/).

## Så vet du att det fungerar

Sidan visar den nya versionen förvald, och `ver` på radion visar den efter flashningen.
