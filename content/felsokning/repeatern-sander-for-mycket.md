---
title: "Repeatern sänder för mycket"
description: "En ny repeater tycks ta mycket sändningstid, och grannarna hör sämre sedan den kom upp."
category: repeater
weight: 55
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

## Troliga orsaker

1. **Duty cycle står kvar på standardvärdet 50 procent.** Firmwaren tillåter 50 procent från
   början ([CLI-referensen](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md), `set dutycycle`), men gränsen på 869,4–869,65 MHz är 10 procent
   för en radio utan LBT-teknik ([PTSFS 2025:1](https://pts.se/contentassets/b05c8a7d01a64783aafc6a19e1b78590/ptsfs-2025-1-foreskrifter-om-undantag-fran-tillstandsplikt-for-anvandning-av-vissa-radiosandare.pdf) § 146).
2. Ett kort intervall för adverts.

## Kontrollera

```sh {title="Konsol"}
get dutycycle
get flood.advert.interval
```

## Åtgärda

```sh {title="Konsol"}
set dutycycle 10
```

Låt `flood.advert.interval` stå på standardvärdet, 47 timmar.

## Så vet du att det fungerar

`get dutycycle` svarar `10.0%`.

## Fungerade inte?

Se [Radion slutar sända en stund](../duty-cycle/) och [Sätt upp en repeater](../../guider/repeater/#duty-cycle).
