---
title: "Kanaler"
seoTitle: "Kanaler i MeshCore"
description: "Public, hashtag-kanaler och privata kanaler i MeshCore: vem som kan läsa vad, hur långt ett meddelande får vara, hur du skapar en privat kanal och vilken region kanalen ska ha."
weight: 80
group: regioner
date: 2026-11-12
lastmod: 2026-11-18
---

En **kanal** är ett gemensamt rum: alla som har kanalens nyckel kan läsa och skriva där. Utöver
kanaler kan du skicka direktmeddelanden till en kontakt.

## Tre sorters kanaler

Public
: Kanalen alla radior har från början. Den har en känd nyckel, så **alla kan läsa den**.

Hashtag-kanaler
: Kanaler vars namn börjar med `#`, till exempel {{< chat-example >}}. Nyckeln räknas fram ur namnet,
  så den som vet namnet kan gå med, och den som vet namnet kan också läsa. Det är så lokala och
  ämnesvisa kanaler fungerar.

Privata kanaler
: Kanaler med en slumpad hemlig nyckel som du delar med dem du vill. Bara de som har nyckeln
  kan läsa.

> [!NOTE]- Varför alla kan läsa hashtag-kanaler
> Nyckeln till en hashtag-kanal är de första 16 byten av SHA-256 av namnet, till exempel
> `sha256("#test")`. Meddelandena är krypterade i luften, men den som vet eller gissar namnet kan
> räkna fram nyckeln. MeshCores dokumentation säger att hashtag-kanaler inte ska räknas som
> privata [^cp].

> [!IMPORTANT] Inget är hemligt på Public eller i hashtag-kanaler
> Skriv aldrig något där som du inte vill att vem som helst ska kunna läsa, även långt senare.
> Meddelanden kan också spelas in av observatörer.

## Hur långt kan ett meddelande vara?

Högst 160 byte [^text]. Vanliga bokstäver tar en byte var, men å, ä och ö tar två och en emoji
fyra [^utf8]:

| Text | Tecken | Byte |
| --- | --- | --- |
| `Hej på dig` | 10 | 11 |
| `Är du där?` | 10 | 12 |
| `Ses vid sjön 👍` | 14 | 18 |

Kanalmeddelanden floodas alltid, till alla repeatrar i regionen [^faq]. Skriv kort, och dela upp
ett långt samtal hellre än att skicka många meddelanden i följd; se [God sed i nätet](../etikett/).

## Skapa en privat kanal

1. Öppna kanalerna i appen och välj att lägga till en kanal.
2. Välj att skapa en privat kanal och ge den ett namn. Appen slumpar fram en nyckel på 16 byte
   [^cp].
3. Dela kanalen med dem som ska vara med, till exempel som QR-kod eller nyckel, och helst inte
   i en öppen kanal.
4. Den som får nyckeln lägger till kanalen med den.

Menyernas namn kan skilja sig mellan appversioner. Den som har nyckeln kan alltid läsa kanalen;
byt till en ny kanal om nyckeln har spridits för långt.

## Kanaler i {{< region "name" >}} {#kanaler-i-regionen}

{{< channels >}}

Gå med i en hashtag-kanal genom att lägga till den i appen med exakt samma namn, med `#` först.

## Region på kanalen

En kanal kan ha en [region](../regioner/), så att dess meddelanden bara förs vidare inom det
området. Välj den minsta region som når dem kanalen är till för:

- lokal chatt i länet: `{{< region "scope" >}}`,
- något som gäller hela Sverige: `se`,
- utan region förs meddelandet vidare så långt det når.

## Testa på rätt ställe

Testmeddelanden kostar sändningstid för alla inom räckhåll. Har regionen repeatrar med
[auto-svar](../firmware-lou/), testa i regionens testkanal {{< testchannel >}}, annars
i den vanliga `#test`. Använd helst inte de vanliga chattkanalerna (Public och regionens chattkanal) för
testmeddelanden, och skicka inte fler test än du behöver. Repeatrar med auto-svar svarar på `test`
i testkanalen, med en fördröjning, så att svaren inte krockar.

Kommer inget svar? Se [Meddelanden kommer inte fram](../../felsokning/meddelanden-kommer-inte-fram/) och [Auto-svaret svarar inte i länets testkanal](../../felsokning/auto-svar-legacy/).

## Källor

[^cp]: MeshCore, [companion-protokollet](https://github.com/meshcore-dev/MeshCore/blob/main/docs/companion_protocol.md), kanaltyper.
[^text]: MeshCore, [BaseChatMesh.h](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.h), `MAX_TEXT_LEN`.
[^utf8]: [RFC 3629](https://www.rfc-editor.org/rfc/rfc3629), UTF-8.
[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md), 5.5.
