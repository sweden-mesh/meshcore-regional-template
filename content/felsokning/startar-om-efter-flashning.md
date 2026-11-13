---
title: "Radion startar om hela tiden efter flashningen"
description: "ESP32: fel fil på fel adress. Går att rädda, och inställningarna finns kvar."
category: flasha
weight: 10
---

I [USB-konsolen](../../guider/usb-konsol/) syns samma rader om och om igen, ungefär så här:

```text {title="Konsol"}
rst:0x10 (RTCWDT_RTC_RST),boot:0x29 (SPI_FAST_FLASH_BOOT)
load:0x3c120020,len:0x6fe64
Guru Meditation Error: Core 0 panic'ed (StoreProhibited)
```

## Troliga orsaker

1. **Filen utan *merged* skrevs till adress `0x0`.** Där ska radions startkod ligga. Nu försöker
   chipet starta firmwaren som om den vore startkoden, och kraschar. Raden `load:0x3c120020` är
   tecknet.
2. Firmware för en annan modell eller ett annat chip.

## Åtgärda

Flasha om med **`-merged.bin`** till adress **`0x0`**, utan att radera. Den innehåller startkod,
partitionstabell och firmware. Inställningar och identitet ligger längre in i flashen och finns
kvar.

Svarar radion inte när du ansluter: håll in **BOOT**, tryck kort på **RST** och släpp **BOOT**.
Då väntar den på ny firmware.

Enklast är firmwareväljarens knapp **Flasha via USB** med *Uppdatera*: den väljer fil och adress
själv. Se [Flasha firmware](../../guider/flasha-firmware/).

## Så vet du att det fungerar

Radion startar en gång och stannar. `ver` i konsolen visar den nya versionen.
