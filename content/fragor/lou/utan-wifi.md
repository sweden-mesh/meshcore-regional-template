---
title: "Fungerar fjärrstyrningen om wifi ligger nere, eller på kort utan wifi?"
category: loufjarr
weight: 250
date: 2026-11-21
lastmod: 2026-11-21
---

Inte i lou-18. Där behöver repeatern wifi och kontakt med servern.

Från lou-20, som är byggd men inte släppt, kan samma signerade kommando skickas över radio från
ägarens egen companion:

- **Wifi nere.** En repeater som tappat sitt wifi tar kommandon över radio, och där går det att
  ge den ett nytt wifi-namn och lösenord utan att åka dit.
- **Kort utan wifi.** Varianterna `rc` och `arrc` byggs också för kort som nRF52, och styrs då
  bara över radio.

Kontrollerna är desamma som över internet, med ett eget tak på tio svar i timmen över radio.
