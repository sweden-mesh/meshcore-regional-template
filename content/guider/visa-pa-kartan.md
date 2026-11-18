---
title: "Kartan och observatörer"
seoTitle: "MeshCore-kartan och observatörer (MQTT)"
description: "Vad MeshCore-kartan visar och var det kommer ifrån, vad en observatör skickar, tre sätt att bli observatör (firmware, dator med repeater, companion), IATA-koden för ditt län och andra kartor."
weight: 100
group: repeater
source:
  title: "MeshCore till MQTT"
  url: "https://meshat.se/mqtt/meshcore-till-mqtt/"
  license: "CC BY 4.0"
  changes: "Omskriven; tre sätt med egna steg; regionens IATA och förinställning från sidans parametrar; IATA-tabellen ur länsfilerna."
date: 2026-11-12
lastmod: 2026-11-18
---

En **observatör** är en repeater, eller en dator vid en radio, som skickar det den hör till en
server, och kartan visar det. Meshnätet fungerar likadant utan observatörer. **Din repeater
behöver inte vara observatör för att synas på kartan:** det räcker att en observatör hör dess
advert.

{{< diagram "observer" >}}

## Vad kartan visar

Kartan på [startsidan](/) visar repeatrar och trafik som observatörer har hört. Positionerna är de
som ägarna själva har angett i sina noder (`set lat`, `set lon`), och linjerna mellan repeatrar
visar att den ena har hört den andra. Det som ingen observatör hör syns inte, även om det fungerar.
Companions visas inte, för att skydda var folk bor.

Ju fler observatörer, desto mer av nätet syns, och desto lättare är det att se var det behövs fler
repeatrar.

## Vad en observatör skickar

- Varje paket den hör, med signalstyrka och tid.
- Text i Public och hashtag-kanaler, som alla som vet kanalens namn redan kan läsa [^cp].
- Inte innehållet i direktmeddelanden och privata kanaler: de förblir krypterade.

## Välj sätt

| Sätt | Radio | Behöver | Bäst när |
| --- | --- | --- | --- |
| [Observer-firmware](#1-observer-firmware) | repeater med ESP32 | wifi vid repeatern | repeatern står nära wifi |
| [Dator med repeater](#2-en-dator-med-repeatern-på-usb) | vilken repeater som helst | en dator eller Raspberry Pi, egen firmware | repeatern saknar wifi, till exempel nRF52 på sol |
| [Dator med companion](#3-en-dator-med-en-companion) | en companion | en dator eller Raspberry Pi | du vill rapportera utan repeater |

### 1. Observer-firmware

1. Flasha Observer-firmware från [MeshCore Observer-projektets flasher](https://observer.gessaman.com/);
   se [Välj och flasha firmware](../flasha-firmware/#repeater). Den behöver ett kort med wifi.
2. Ställ in repeatern som vanligt, se [Sätt upp en repeater](../repeater/).
3. Skriv kommandona nedan i en seriell konsol, ett i taget.

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

`{{< iata >}}` är koden kartan i {{< region "name" >}} filtrerar på; se [IATA-koden för ditt
län](#iata-koden-för-ditt-län).


### 2. En dator med repeatern på USB

[meshcoretomqtt](https://github.com/Cisien/meshcoretomqtt) läser paketen från en repeater som sitter
i en Raspberry Pi eller annan dator med USB, och skickar dem vidare [^m2mqtt].

1. Bygg och flasha repeatern med paketloggning påslagen (byggflaggan `MESH_PACKET_LOGGING=1`);
   den vanliga firmwaren från webbflashern har inte den [^m2mqtt].
2. Anslut repeatern till datorn med USB.
3. Installera meshcoretomqtt med projektets installationsskript och ange servern när det frågar.

### 3. En dator med en companion

[meshcore-packet-capture](https://github.com/agessaman/meshcore-packet-capture) gör samma sak med en
companion, över Bluetooth, USB eller TCP, och behöver ingen egen firmware [^pktcap].

1. Ställ in companion-radion med nätets värden, se [Kom igång med en companion](../companion/).
2. Installera meshcore-packet-capture på datorn med projektets installationsskript.
3. Välj hur den ska ansluta till radion, och ange servern.

{{< region-mqtt >}}

## Kontrollera

Efter några minuter ska repeatern ha en blå ring (observatör) på kartan på [startsidan](/), och
siffran för observatörer öka. Utan ring syns den redan, om en annan observatör hör den.

{{< meshmapper >}}

Syns den inte? Se [Repeatern syns inte på kartan](../../felsokning/repeater-syns-inte-pa-kartan/), [Observatören rapporterar inte till kartan](../../felsokning/observer-syns-inte/) och [Observatören tappar Wi-Fi gång på gång](../../felsokning/wifi-tappar/).

## IATA-koden för ditt län

Kartan sorterar observatörernas rapporter efter en kod med tre bokstäver, lånad från flygplatsernas
IATA-koder. Koden är inte samma sak som regionen: regionen styr vilka repeatrar som för trafiken
vidare, IATA-koden bara var rapporten hamnar.

{{< iata-table >}}

## Andra kartor

- [map.meshcore.io](https://map.meshcore.io): MeshCore-projektets officiella karta [^faq].
- [MeshMapper](https://swe.meshmapper.net/): var nätet faktiskt når, uppmätt av folk som kör, cyklar
  eller går med en radio; se [Verktyg för dig som har en nod](../for-nodagare/).
- [meshat.se](https://meshat.se/): kartor och en guide till fler sätt att rapportera,
  [MeshCore till MQTT](https://meshat.se/mqtt/meshcore-till-mqtt/).

Vill du ha en egen server för rapporterna: [En egen broker för regionen](../egen-broker/).

## Källor

[^cp]: MeshCore, [companion-protokollet](https://github.com/meshcore-dev/MeshCore/blob/main/docs/companion_protocol.md), kanaltyper.
[^m2mqtt]: [meshcoretomqtt](https://github.com/Cisien/meshcoretomqtt), README.
[^pktcap]: [meshcore-packet-capture](https://github.com/agessaman/meshcore-packet-capture), README.
[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md), 1.2.
