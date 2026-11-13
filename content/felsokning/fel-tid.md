---
title: "Tiderna är fel, en eller två timmar"
description: "Paket och loggar har tider som inte stämmer med klockan."
category: mqtt
weight: 20
---

## Troliga orsaker

1. **Tidszonen är inte satt.** Observatören hämtar tiden över nätet (NTP) i UTC och räknar om
   med tidszonen. Utan den blir tiden UTC, en eller två timmar fel i Sverige.
2. Utan Wi-Fi har radion ingen tidskälla och klockan står på det den senast fick.

## Kontrollera

```sh {title="Konsol"}
get timezone
clock
```

## Åtgärda

```sh {title="Konsol"}
set timezone Europe/Stockholm
```

Sommartid och vintertid sköts då av sig själv.

## Så vet du att det fungerar

`clock` visar samma tid som din telefon.
