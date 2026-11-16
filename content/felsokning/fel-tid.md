---
title: "Tiderna är fel, en eller två timmar"
description: "Är tiderna i paket och loggar en eller två timmar fel? Oftast saknas tidszonen på observatören. Så kontrollerar du klockan och rättar det."
category: mqtt
weight: 20
date: 2026-11-13
lastmod: 2026-11-16
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

## Fungerade inte?

- **Klockan går inte alls, eller står kvar:** observatören har ingen kontakt med nätet och kan inte
  hämta tiden. Se [Observatören tappar Wi-Fi gång på gång](../wifi-tappar/).
- **Tiden är rätt men inget syns på kartan:** se
  [Observatören rapporterar inte till kartan](../observer-syns-inte/).
