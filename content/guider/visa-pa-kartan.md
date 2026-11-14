---
title: "Din repeater på kartan, och som observatör"
description: "Din repeater syns på kartan när en observatör hör den; den behöver inte vara observatör själv. Så gör du den till en ändå, så att kartan också ser vad den hör."
weight: 100
source:
  title: "MeshCore till MQTT"
  url: "https://meshat.se/mqtt/meshcore-till-mqtt/"
  license: "CC BY 4.0"
  changes: "Bara observer-firmware-vägen, omskriven; regionens IATA och förinställning från sidans parametrar; övriga metoder länkade."
---

**Din repeater behöver inte vara observatör för att synas på kartan.** Den syns så fort en
observatör i närheten hör dess advert, det korta paket med namn och position som repeatern skickar
ut. Har den en position inställd (`set lat`, `set lon`) och skickar adverts, kommer den med. Av
länets repeatrar på kartan i dag är flera inte observatörer.

En observatör är en repeater som också rapporterar varje paket den hör, med signalstyrka, till en
server via wifi. Att göra din repeater till en lägger till det **den** hör: andra repeatrar,
vägarna paketen tar och hur starka länkarna är. Ju fler observatörer, desto mer av nätet syns, och
desto bättre går det att se var det behövs fler repeatrar. Står din repeater där ingen observatör
når den, är det också så den kommer med på kartan.

Att rapportera påverkar inte meshnätet: repeatern för vidare trafik precis som förut.

## Det här behöver du

- En repeater med wifi (ESP32-baserad), placerad där den når ditt wifi.
- **Observer-firmware**: välj typen *repeater* och funktionen *Observer* i
  [firmwareväljaren]({{< param "firmware.picker" >}}). Se [Flasha firmware](../flasha-firmware/).

## Kommandon

Skrivs ett i taget i en seriell konsol, som i [Sätt upp en repeater](../repeater/).

```text {title="Wifi"}
set wifi.ssid ditt-natverk
set wifi.pwd ditt-wifi-losenord
```

```text {title="Regionens kod för kartan"}
set mqtt.iata {{< iata >}}
```

```text {title="Servern som kartan hämtar från"}
set mqtt1.preset {{< param "observer.preset" >}}
```

`{{< iata >}}` är koden kartan i {{< region "name" >}} filtrerar på. Den är bara en etikett för
servern och påverkar inte vilken trafik repeatern för vidare.

{{< region-mqtt >}}

## Kontrollera

Efter några minuter ska repeatern ha en blå ring (observatör) på kartan på [startsidan](/), och
siffran för observatörer öka. Utan ring syns den redan, om en annan observatör hör den.

> [!NOTE]- Andra sätt att rapportera
> Det går också att rapportera från en dator eller en Raspberry Pi som är ansluten till en
> radio. meshat.se:s guide [MeshCore till MQTT](https://meshat.se/mqtt/meshcore-till-mqtt/)
> beskriver de vägarna.

> [!IMPORTANT] Vad som rapporteras
> Observatören skickar paketen den hör, med signalstyrka och tid. Meddelanden i Public och
> hashtag-kanaler kan alla läsa ändå; privata meddelanden förblir krypterade.
