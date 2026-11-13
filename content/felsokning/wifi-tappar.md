---
title: "Observatören tappar Wi-Fi gång på gång"
description: "Den ansluter, försvinner och kommer tillbaka; luckor i det den rapporterar."
category: mqtt
weight: 30
---

## Troliga orsaker

1. **Svag signal.** Repeatrar står ofta på vinden eller i ett uthus, långt från routern.
2. **Strömsparläge för Wi-Fi** som släpper anslutningen för ofta.
3. Routern delar ut adresser för kort tid, eller kopplar bort enheter som är tysta.
4. ESP32 klarar bara 2,4 GHz. Ett nätverk som bara har 5 GHz syns inte.

## Kontrollera

```sh {title="Konsol"}
get wifi.status
get wifi.powersave
```

`get wifi.status` visar signalstyrkan (RSSI). Sämre än ungefär −80 dBm är för svagt.

## Åtgärda

1. Flytta repeatern eller routern, eller sätt en Wi-Fi-förstärkare närmare.
2. Stäng av Wi-Fi-strömsparläget om det är på.
3. Kontrollera att nätverket har 2,4 GHz påslaget.

## Så vet du att det fungerar

`get mqtt.status` visar platsen ansluten hela dagen, och kartan visar observatören utan luckor.
