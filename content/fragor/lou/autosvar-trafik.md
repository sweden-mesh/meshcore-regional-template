---
title: "Fyller auto-svaret nätet med trafik?"
category: louautosvar
weight: 120
date: 2026-11-21
lastmod: 2026-11-21
---

Det är byggt för att inte göra det:

- **Svaren sprids ut.** De kommer mellan 10 och 120 sekunder efter ditt `test`, var repeater i sin
  egen lucka, så att de inte krockar.
- **Ett svar per person.** Samma avsändare får ett svar per repeater var femte minut.
- **Ett tak per repeater.** Högst tio svar per fem minuter, vem som än frågar.
- **En hoppgräns.** Ett `test` från mer än åtta hopp bort besvaras inte (`set autoreply.hops`).

Vänta därför två minuter på svaren, och skicka inte `test` igen under tiden.
