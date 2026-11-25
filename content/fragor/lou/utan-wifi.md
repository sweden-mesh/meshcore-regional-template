---
title: "Fungerar fjärrstyrningen om wifi ligger nere, eller på kort utan wifi?"
category: loufjarr
weight: 250
date: 2026-11-21
lastmod: 2026-11-25
---

Ja, från lou-20. I lou-18 och äldre behöver repeatern wifi och kontakt med servern.

Från lou-20 kan samma signerade kommando skickas över radio, från ägarens egen companion eller
genom en av ägarens Observer-repeatrar med fjärrstyrning och samma kommandonyckel:

- **Wifi nere.** En repeater som tappat sitt wifi tar kommandon över radio, och där går det att
  ge den ett nytt wifi-namn och lösenord utan att åka dit.
- **Kort utan wifi.** Varianterna `rc` och `arrc` byggs också för kort som nRF52, och styrs då
  bara över radio.

Kontrollerna är desamma som över internet. Över radio har svaren en egen sändningsbudget. Är den
slut svarar repeatern inte alls. Vänta några minuter och skicka igen.

Hur du slår på det står i [Fjärrstyrning utan wifi](../../guider/firmware-lou/#fjärrstyrning-utan-wifi).
