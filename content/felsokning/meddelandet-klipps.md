---
title: "Meddelandet klipps av eller skickas inte"
description: "Ett långt MeshCore-meddelande kommer fram avklippt eller går inte att skicka: gränsen är 160 byte, och å, ä och ö tar två byte var."
category: companion
weight: 50
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

## Troliga orsaker

1. **Meddelandet är längre än 160 byte.** Det är gränsen för ett textmeddelande i MeshCore
   ([källkoden](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.h),
   `MAX_TEXT_LEN`).
2. **Å, ä och ö** tar två byte var och en emoji fyra, så ett svenskt meddelande rymmer färre än 160
   tecken.

## Kontrollera

Räkna: ett meddelande med många å, ä och ö eller emojier når gränsen tidigare. Exempel finns i
[Kanaler](../../guider/kanaler/#hur-långt-kan-ett-meddelande-vara).

## Åtgärda

Skriv kortare, eller dela upp texten i två meddelanden. Skicka dem inte tätt efter varandra: alla
delar på sändningstiden.

## Så vet du att det fungerar

Mottagaren får hela texten, och du får ett kvitto på direktmeddelanden.

## Fungerade inte?

Se [Meddelanden skickas men kommer aldrig fram](../meddelanden-kommer-inte-fram/).
