---
title: "Kanaler"
description: "Public, hashtag-kanaler och privata kanaler: vem som kan läsa vad, vilka kanaler som används här och vilken region de ska ha."
weight: 80
---

En **kanal** är ett gemensamt rum: alla som har kanalens nyckel kan läsa och skriva där. Utöver
kanaler kan du skicka direktmeddelanden till en kontakt.

## Tre sorters kanaler

Public
: Kanalen alla radior har från början. Den har en känd nyckel, så **alla kan läsa den**.

Hashtag-kanaler
: Kanaler vars namn börjar med `#`, till exempel `#jonkoping`. Nyckeln räknas fram ur namnet,
  så den som vet namnet kan gå med, och den som vet namnet kan också läsa. Det är så lokala och
  ämnesvisa kanaler fungerar.

Privata kanaler
: Kanaler med en slumpad hemlig nyckel som du delar med dem du vill. Bara de som har nyckeln
  kan läsa.

> [!IMPORTANT] Inget är hemligt på Public eller i hashtag-kanaler
> Skriv aldrig något där som du inte vill att vem som helst ska kunna läsa, även långt senare.
> Meddelanden kan också spelas in av observatörer.

## Kanaler i {{< region "name" >}}

{{< channels >}}

Gå med i en hashtag-kanal genom att lägga till den i appen med exakt samma namn, med `#` först.

## Region på kanalen

En kanal kan ha en [region](../regioner/), så att dess meddelanden bara förs vidare inom det
området. Välj den minsta region som når dem kanalen är till för:

- lokal chatt i länet: `{{< region "scope" >}}`,
- något som gäller hela Sverige: `se`,
- utan region förs meddelandet vidare så långt det når.

## Testa på rätt ställe

Testmeddelanden kostar sändningstid för alla inom räckhåll. Testa i testkanalen, inte i
chattkanalerna, och skicka inte fler test än du behöver. Repeatrar med auto-svar svarar på `test`
i testkanalen, med en fördröjning, så att svaren inte krockar.
