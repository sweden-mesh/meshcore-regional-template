---
title: "Meddelanden skickas men kommer aldrig fram"
description: "Inget svar, ingen bock, eller bara ibland."
category: companion
weight: 20
---

## Troliga orsaker

1. **Ingen repeater hör dig.** Din radio når kanske inte fram, även om du hör repeatern; den
   sänder ofta starkare och sitter högre än du.
2. **Kanalen har region.** En kanal med region (scope) skickas bara vidare av repeatrar som bär
   den regionen. Står du utanför, eller har repeatern inte regionen, stannar meddelandet.
3. **En gammal väg till mottagaren.** Direktmeddelanden går först den väg som fungerade sist.
   Har nätet ändrats kan den vägen vara bruten.
4. Fel kanalnyckel: för hashtag-kanaler räcker namnet, men det måste vara exakt likadant.

## Åtgärda

1. Skicka `test` i regionens testkanal. Repeatrar med auto-svar svarar och visar att du når ut.
2. Nollställ vägen till kontakten i appen (*Reset path*) och skicka igen.
3. Kontrollera kanalens namn tecken för tecken, och att din app använder regionens scope.
4. Flytta radion högre upp eller närmare ett fönster.

## Så vet du att det fungerar

Ett svar i testkanalen, eller en bock vid direktmeddelandet.
