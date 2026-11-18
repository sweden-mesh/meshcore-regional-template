---
title: "Välj en repeater"
seoTitle: "Vilken repeater för MeshCore?"
description: "Repeatrar för MeshCore: kort att bygga själv och färdiga solrepeatrar, med processor, ström, sändeffekt, för- och nackdelar, batteritid och priser i kronor."
url: /guider/skaffa-hardvara/repeater/
weight: 16
group: start
cardSkip: true
date: 2026-11-18
lastmod: 2026-11-18
---

En repeater för trafiken vidare och gör nätet större. Den står still, högt upp, dygnet runt. Det
som avgör valet är strömmen: på nätström duger ett billigt ESP32-kort, på batteri och sol behövs
ett strömsnålt nRF52-kort eller en färdig solrepeater. Kontrollera i
[webbflashern]({{< param "firmware.flasher" >}}) att din modell finns innan du köper.

{{< hw "repeater" >}}

Steg för steg för den som bygger själv: [Bygg en repeater](../../bygg-en-repeater/). Vad de färdiga
solrepeatrarna klarar på vintern: [Solnoder](../../solnoder/#fardiga-solrepeatrar).

## Hur länge batteriet räcker

Ungefärliga drifttider, utan solpanel. Hur mycket du skickar, skärmen, GPS:en och Bluetooth ändrar
siffrorna mycket.

| Enhet | Drifttid | Underlag |
| --- | --- | --- |
| Companion, T1000-E (700 mAh) | upp till 2 dygn | tillverkarens uppgift, för Meshtastic-firmware |
| Repeater, nRF52 (XIAO, RAK) på 3 000 mAh | cirka 17 dygn | 7,1 mA med officiell MeshCore och strömsparläge ([Solnoder](../../solnoder/)) |
| Repeater, ESP32 (Heltec) på 3 000 mAh, utan strömsparläge | cirka 2 dygn | 50 mA eller mer, enligt EasySkyMesh-projektets mätningar |
| Repeater, ESP32 med strömsparläge på 3 000 mAh | 5–12 dygn | 10–25 mA, samma källa; finns inte i alla firmware |

En repeater på ett ESP32-kort hör därför hemma på nätström. Ska den gå på batteri och sol: välj
nRF52.

## Ström till en repeater

En repeater står på dygnet runt. Med nätström är det enkelt. Med **sol och batteri** måste
batteriet räcka genom de mörkaste veckorna i december, när panelen ger en bråkdel av sommarens
energi. Räkna med:

- ett nRF52-kort, som drar lite;
- ett batteri som klarar flera dygn utan sol;
- en panel som är överdimensionerad för sommaren, så att den räcker på vintern;
- en laddregulator som tål kyla, och ett batteri som får laddas i minusgrader (LiFePO4 behöver
  skydd).

För sol: läs [Solnoder](../../solnoder/) innan du köper panel, laddare och batteri. Mycket av det
som säljs som solkit räcker inte för en svensk vinter.

## Låda och montering

En repeater utomhus behöver en tät låda (IP65 eller bättre), kabelgenomföringar som tätar och
fäste som tål vind. Låt ett litet dräneringshål vara öppet i botten så att kondens kan rinna ut.

{{< hw-credits >}}

## Nästa steg

- [Välj en antenn](../antenn/) till repeatern.
- [Flasha firmware](../../flasha-firmware/) och [Sätt upp en repeater](../../repeater/).
