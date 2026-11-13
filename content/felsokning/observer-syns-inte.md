---
title: "Observatören rapporterar inte till kartan"
description: "Repeatern med Observer-firmware är igång, men inget av det den hör syns på kartan eller i analysverktygen."
category: mqtt
weight: 10
---

## Troliga orsaker

1. **Ingen Wi-Fi-anslutning.** Fel nätverksnamn eller lösenord, eller för svag signal där
   repeatern står.
2. **Fel IATA-kod.** Kartan läser observatörer med regionens kod, {{< iata >}}.
3. **Platsen (slot) för brokern är fel inställd**, eller brokern är nere.
4. Firmwaren saknar Observer: vanlig repeater-firmware rapporterar inte.

## Kontrollera

```sh {title="Konsol"}
ver
get wifi.status
get mqtt.status
get mqtt.iata
```

`ver` ska innehålla `observer`. `get mqtt.status` visar varje plats och om den är ansluten.

## Åtgärda

1. Wi-Fi: `set wifi.ssid <namn>` och `set wifi.pwd <lösenord>`, sedan `reboot`.
2. IATA: `set mqtt.iata {{< iata >}}`.
3. Brokern: kör MQTT-steget i guiden igen, eller se [Få med din repeater på
   kartan](../../guider/visa-pa-kartan/).
4. Saknas `observer` i `ver`: [flasha](../../guider/flasha-firmware/) Observer-firmware med
   *Uppdatera*.

## Så vet du att det fungerar

`get mqtt.status` visar platsen som ansluten, och repeatern syns som observatör (◉) på kartan
inom några minuter.
