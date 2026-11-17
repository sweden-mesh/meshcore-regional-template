Repeatrar med auto-svar (firmwaren *lou*) svarar på `test` i `{{ .Test }}`, utspridda över ungefär
två minuter så att svaren inte krockar.

## Troliga orsaker

1. **Du har inte väntat länge nog.** Svaren kommer under ungefär två minuter, några ibland
   senare.
2. **Kanalens namn är fel.** Det ska vara exakt `{{ .Test }}`, med små bokstäver.
3. **Ingen repeater med auto-svar når dig.** Bara repeatrar med lou-firmware och auto-svar på
   svarar; andra för bara vidare.
4. **Kanalen saknar regionen.** Ett test i `{{ .Test }}` ska skickas med regionen `{{ .Scope }}`.{{ with .Iata }}
5. Repeatrarna nära dig har äldre firmware och svarar i den gamla kanalen `#test-{{ . }}`.{{ end }}

## Åtgärda

1. Vänta några minuter innan du skriver igen. Skriv inte `test` flera gånger i rad.
2. Kontrollera kanalens namn i appen, tecken för tecken.
3. Välj regionen `{{ .Scope }}` för kanalen. Hur du gör det står i [Regioner](/guider/regioner/).{{ with .Iata }}
4. Prova också `#test-{{ . }}`. Svarar någon där har repeatrarna nära dig äldre firmware.{{ end }}
5. Flytta dig högre upp, eller närmare en repeater på [kartan]({{ .URL }}#karta).
6. Har länet inga repeatrar med [auto-svar]({{ .Picker }}#f=ar&install=update) än, testa i den vanliga
   `#test` i stället.

## Så vet du att det fungerar

Svar med repeatrarnas namn och hur starkt de hörde dig.
