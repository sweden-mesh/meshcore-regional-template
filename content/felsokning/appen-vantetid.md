---
title: "Appen låter mig vänta innan jag kan administrera repeatern"
description: "Inloggningen på en repeater eller room server fungerar, men appen visar en väntetid."
category: companion
weight: 55
date: 2026-11-18
lastmod: 2026-11-18
---

## Troliga orsaker

1. **Väntetiden är en del av mobilappen.** Appen är gratis för meddelanden, men fjärradministration
   av repeatrar och room servers över radio har en väntetid som kan låsas upp med ett köp i appen
   ([MeshCore FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md)). Det är inget fel.

## Kontrollera

Det gäller appen för Android och iPhone. Appen för Windows och Mac har ingen sådan spärr, enligt
samma FAQ.

## Åtgärda

Välj ett av:

1. Vänta ut tiden.
2. Lås upp den med köpet i appen.
3. Administrera från datorn i stället, eller med USB-kabel; se [Skicka kommandon via
   USB](../../guider/usb-konsol/).

## Så vet du att det fungerar

Du kommer åt repeaterns inställningar utan väntetid.

## Fungerade inte?

Kommer du inte in alls: se [Administrera repeatern från appen](../../guider/fjarradministration/)
och [Jag har glömt repeaterns adminlösenord](../glomt-adminlosenord/).
