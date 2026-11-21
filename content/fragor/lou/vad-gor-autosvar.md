---
title: "Vad gör auto-svaret?"
category: louautosvar
weight: 110
date: 2026-11-21
lastmod: 2026-11-21
---

Skriv `test` i länets testkanal, till exempel `#test-{{< region "scope" >}}`. Varje repeater med
auto-svar som hör dig svarar med en rad:

```text
du         test
STO-1      [louie] SNR 6.5 RSSI -92 0h direct
STO-2      [louie] SNR -4.0 RSSI -104 2h A3,1B
```

Raden visar hur starkt repeatern hörde dig (SNR och RSSI), hur många hopp bort den är och vilka
repeatrar meddelandet gick genom. Ditt namn står inom hakparentes, så att du hittar ditt svar när
flera testar samtidigt. Det behövs ingen inloggning och ingen kontakt.
