---
title: "Varför kan jag inte välja testkanal själv?"
category: louautosvar
weight: 130
date: 2026-11-21
lastmod: 2026-11-25
---

Kanalen följer repeaterns region och heter alltid `#test-` följt av regionens namn. Det är med
flit:

- Varje repeater som hör ett `test` svarar. I en kanal som alla har, som `#public`, skulle ett
  enda `test` dra igång svar i hela nätet.
- En kanal per region håller testerna där de är till nytta.
- Det finns ingen nyckel att dela ut: den som kan regionens namn skriver in kanalen i appen.

Från lou-20 svarar repeatern också i `#test-se` (`set autoreply.national auto|off|<region>`).

Se [Regioner](../../guider/regioner/).
