---
title: "Vad går inte att göra på distans?"
category: loufjarr
weight: 230
date: 2026-11-21
lastmod: 2026-11-25
---

En del kommandon är spärrade i fjärrstyrningen, vad som än står i dem:

- byta eller läsa repeaterns privata nyckel
- ta bort kommandonyckeln eller stänga av fjärrstyrningen (nyckeln byts med `rekey`, signerat med
  den nuvarande)
- radera repeatern (`erase`)
- ändra radioinställningar, position eller roll
- lösenord

Den privata nyckeln, raderingen och att ta bort kommandonyckeln går bara från USB-konsolen. Det
övriga går också som inloggad administratör i appen. En läckt kommandonyckel räcker därför inte för att ta över en
repeater eller flytta den till en annan frekvens.
