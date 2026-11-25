---
title: "Vem kan styra min repeater?"
category: loufjarr
weight: 220
date: 2026-11-21
lastmod: 2026-11-25
---

Bara den som har din privata kommandonyckel. Nyckeln skapar du själv och den lämnar aldrig din
dator; repeatern får bara den publika halvan, som inte går att signera med. Den som stjäl
repeatern och läser ut minnet kan alltså inte styra någon repeater, inte ens den stulna.

Repeatern kontrollerar varje kommando innan den gör något:

1. Signaturen stämmer med din nyckel, och kommandot är ställt till just den repeatern.
2. Kommandot är nytt: ett kopierat kommando går inte att skicka igen.
3. Det har inte gått ut i tid.
4. Det är inte ett av de spärrade kommandona.
5. Taket är inte nått: 50 kommandon i timmen, också med rätt nyckel.

Servern som för kommandona vidare litar repeatern inte på alls.
