---
title: "Jag hör bara en repeater"
description: "Hör radion bara en repeater? Det är oftast normalt, en räcker för att nå nätet. Så ser du när signalen är för svag och hur du får mer marginal."
category: radio
weight: 30
date: 2026-11-13
lastmod: 2026-11-16
---

**Oftast inte.** Många companion-radior hör exakt en repeater, och det räcker: den repeatern för
vidare dina meddelanden till resten av nätet. Så ser de flesta nät ut.

## När det är värt att titta närmare

- Repeatern du hör har svag signal (SNR under ungefär −10 dB) och meddelanden kommer fram
  ibland.
- Du hörde fler förut och har inte flyttat radion.

## Kontrollera

```sh {title="Konsol"}
neighbors
```

Raden visar repeaterns id, hur länge sedan den hördes och signalens SNR.

## Åtgärda

Vill du ha marginal: placera radion högre upp eller närmare ett fönster, eller använd en bättre
antenn. Två repeatrar inom hörhåll ger en reserv om den ena går ner.
