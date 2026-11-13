---
title: "Jag hör andra, men de hör inte mig"
description: "Meddelanden från andra kommer in, men ingen svarar på dina."
category: radio
weight: 15
---

## Troliga orsaker

1. **Repeatern sänder starkare än du.** Den sitter ofta högt med bra antenn; din radio i handen
   når inte lika långt tillbaka.
2. **Sändeffekten är låg** eller antennen sitter dåligt.
3. Du skickar i en kanal med region som repeatrarna runt dig inte bär.

## Kontrollera

```sh {title="Konsol"}
get tx
```

Skicka `test` i regionens testkanal: kommer det svar når du ut.

## Åtgärda

1. Gå högre upp eller till ett fönster och prova igen.
2. Kontrollera antennen och sändeffekten.
3. Prova att skicka utan region, eller i regionens egen kanal.

## Så vet du att det fungerar

Svar i testkanalen.
