---
title: "MeshCore 1.18"
description: "MeshCore 1.18 (15 oktober 2026) på svenska: kommandoraden för companions, fjärrstyrning av en companion, trafik utan region och fler ändringar som berör repeatrar i Sverige."
date: 2026-10-15
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

MeshCore 1.18 kom den 15 oktober 2026, för companion, repeater och room server [^rel]. Uppdatera
från [webbflashern]({{< param "firmware.flasher" >}}); se [Välj och flasha
firmware](../../guider/flasha-firmware/).

## För dig med en companion

- **Kommandorad i appen.** En companion tar nu emot textkommandon, som en repeater. I appen från
  version 1.50.0 finns *Command Line* under inställningarna [^blog]. Kommandona är samma sorts som i
  [USB-konsolen](../../guider/usb-konsol/).
- **Fjärrstyrning av en companion.** En kontakt kan få rätt att skicka kommandon till din companion
  över nätet, bland annat för att ändra radioinställningar, namn och starta om [^blog]. Ge den
  rätten bara till någon du litar på.

## För dig med en repeater

- **Trafik med transportkod 0 räknas som trafik utan region** [^blog]. Det påverkar vad
  `flood.max.unscoped` och `region allowf *` gäller för; se [Regioner](../../guider/regioner/).
- **Kvittenser som går direkt väntar nu enligt `direct.txdelay`**; förut väntade de inte alls
  [^blog]. Se [Finjustera](../../guider/repeater/#4-finjustera).
- **Skydd mot slingor** i minsta läget är nu standard på repeatrar [^blog].
- **En repeater med adverts avstängda** syns inte heller när någon söker efter noder [^blog].
- **Spärren vid låg batterispänning** när kortet startar är avstängd på de flesta nRF52-kort
  [^blog]. Det berör repeatrar på [sol](../../guider/solnoder/).
- **Klockan behålls** vid en omstart [^blog].

## Källor

[^rel]: MeshCore, [versionerna på GitHub](https://github.com/meshcore-dev/MeshCore/releases): repeater-, companion- och room server-v1.18.0.
[^blog]: MeshCore, [Release v1.18.0](https://blog.meshcore.io/2026/10/15/release-1-18-0), 15 oktober 2026.
