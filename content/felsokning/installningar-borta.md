---
title: "Inställningarna är borta efter flashningen"
description: "Namn, lösenord och regioner är tillbaka på standard, och noden syns som en ny nod."
category: flasha
weight: 40
---

## Troliga orsaker

1. **Flashen raderades.** *Erase flash*, *Full erase* eller *Ny installation* tömmer hela flashen,
   också nodens identitet (dess nyckel). För alla andra är det nu en ny nod.
2. Firmware av en annan sort skrevs in (till exempel companion på en repeater). Den läser inte
   den förra firmwarens inställningar.

## Åtgärda

Ställ in noden igen: namn, lösenord, radioinställningar och regioner. Guiderna och verktygen på
den här sidan ger kommandona.

Har du sparat nodens privata nyckel tidigare kan du ge den tillbaka sin identitet. Skriv i
[USB-konsolen](../../guider/usb-konsol/), på en rad:

```sh {title="Konsol"}
set prv.key <nyckeln>
```

Kommandot fungerar bara över USB, inte på distans.

## Så slipper du det nästa gång

- Välj *Uppdatera*, inte *Ny installation*, och lämna *Erase* av.
- Spara nyckeln innan du raderar något: `get prv.key` i USB-konsolen. Förvara den som ett
  lösenord; den som har den kan uppträda som din nod.

## Så vet du att det fungerar

Med nyckeln tillbaka har noden samma publika nyckel som förut, och grannar och kartan känner
igen den.
