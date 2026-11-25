---
title: "Hur uppdateras lou, och vad händer om en uppdatering är trasig?"
category: louinstall
weight: 320
date: 2026-11-21
lastmod: 2026-11-25
---

En Observer-repeater hämtar sin firmware själv över wifi: `ota check` visar vad som finns och
`ota update` installerar det. Med `set ota.auto on` kontrollerar den en gång om dygnet, och
uppdaterar aldrig mellan 00 och 06.

- **Signerat.** Varje fil är signerad av sweden-mesh. Repeatern kontrollerar signaturen innan den
  laddar ned något, och tar bara emot filen för sitt eget kort och sin egen variant.
- **Går tillbaka själv.** Den nya versionen måste visa att den fungerar, genom att nå en server
  över wifi. Annars startar repeatern den gamla versionen igen vid nästa omstart. En dålig
  version kostar en omstart, inte ett besök.

Från lou-20 måste radion också ha skickat eller tagit emot ett paket innan den nya versionen
behålls. Kort utan wifi uppdateras med USB eller Bluetooth.
