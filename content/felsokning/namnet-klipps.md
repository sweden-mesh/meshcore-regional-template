---
title: "Namnet klipps av"
description: "Repeaterns eller radions namn syns bara till hälften i appen eller på kartan."
category: repeater
weight: 50
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

## Troliga orsaker

1. **Namnet är för långt för en advert.** Med position får namnet vara högst 23 byte, utan
   position 31 byte. Ett längre namn klipps när noden skickar sin advert
   ([CLI-referensen](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md), `set name`).
2. **Å, ä och ö** tar två byte var, och en emoji fyra. Ett namn på 20 tecken kan vara över 23 byte.

## Kontrollera

Räkna byten i [namnkontrollen](../../guider/namnge-noden/#längd), eller i konsolen:

```sh {title="Konsol"}
get name
```

## Åtgärda

Korta namnet, eller byt å, ä och ö mot a och o, och skicka en ny advert:

```sh {title="Konsol"}
set name SE-EXEMPEL-Plats
advert
```

## Så vet du att det fungerar

Hela namnet syns hos andra efter nästa advert. Kartan kan visa det gamla en stund.

## Fungerade inte?

Se [Namnge din repeater](../../guider/namnge-noden/).
