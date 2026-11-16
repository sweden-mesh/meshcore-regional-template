Den här sidan samlar det som gäller i {{ .Name }}: radioinställningarna, regionen, kanalerna och var
nätet behöver växa. Hur MeshCore fungerar i stort, och hur du gör varje steg, står i de andra
guiderna. Är du helt ny, börja med [Vad är MeshCore?](/guider/vad-ar-meshcore/).

## Nätet i länet just nu

[Länets sida]({{ .URL }}) har en karta över repeatrarna och observatörerna som hörs i länet, och
trafiken mellan dem. Kartan bygger på vad observatörerna hör: där det finns få observatörer syns
bara en del av nätet.

## Radioinställningar

Alla radior i nätet måste ha samma radioinställningar för att höra varandra. I hela Sverige används
förinställningen nedan, som heter likadant i MeshCore-appen.

{{"{{<"}} settings {{">}}"}}

## Kanaler och region

Länet använder regionen (scope) `{{ .Scope }}`.{{ if .Proposal }} Regionen är ett förslag i
[listan över regioner](https://github.com/zombiefredrik/meshcore-se-regioner): ingen grupp i länet
har bestämt den än.{{ end }} En kanal med regionen `{{ .Scope }}` förs bara vidare av repeatrar som
bär den, så samtalet stannar i länet och tar inte sändningstid från grannarna. Hur det fungerar står
i [Regioner](/guider/regioner/).

{{"{{<"}} channels {{">}}"}}

Hashtag-kanaler lägger du till i appen med namnet, inklusive `#`. Testa bara i `{{ .Test }}`, inte i
en chattkanal: varje test kostar sändningstid för alla inom räckhåll. Mer om kanaler i
[Kanaler i MeshCore](/guider/kanaler/).

## Steg för steg

1. **Skaffa en radio.** Nästan vilket LoRa-kort som helst för 868 MHz fungerar som din egen radio,
   en *companion*. Modeller, priser och butiker står i
   [Skaffa hårdvara](/guider/skaffa-hardvara/).
2. **Flasha companion-firmware.** Det görs från webbläsaren, med MeshCore-projektets webbflasher:
   se [Flasha firmware](/guider/flasha-firmware/#companion).
3. **Ställ in radion i appen.** [Wizarden för companion](/wizard/companion/) visar värdena i den
   ordning appen frågar efter dem, och [Kom igång med en companion](/guider/companion/) förklarar
   varje steg.
4. **Lägg till {{ if gt (len .Channels) 1 }}kanalerna{{ else }}kanalen{{ end }}** {{ range $i, $c := .Channels }}{{ if $i }} och {{ end }}`{{ $c }}`{{ end }}, och välj regionen `{{ .Scope }}` för {{ if gt (len .Channels) 1 }}dem{{ else }}den{{ end }}.
5. **Skicka en advert,** så att de andra ser din radio.
6. **Skriv `test` i `{{ .Test }}`.** Repeatrar med auto-svar svarar med en kort rapport om vem som
   hörde dig och hur starkt. Svaren kommer utspridda under ungefär två minuter, så vänta innan du
   skriver igen. Kommer inget svar, se
   [Ingen svarar på test i {{ .Test }}]({{ .URL }}ingen-svar-pa-test/). Vad svaren betyder står i
   [Första meddelandet](/guider/forsta-meddelandet/).
7. **Säg hej**{{ with .Chat }} i `{{ . }}`{{ end }}{{ with .Groups }}, eller hos {{ range $i, $g := . }}{{ if $i }} eller {{ end }}[{{ $g.name }}]({{ $g.url }}){{ end }}{{ else }}{{ with .Chats }}, eller i {{ range $i, $g := . }}{{ if $i }} eller {{ end }}[{{ $g.name }}]({{ $g.url }}){{ end }}{{ end }}{{ end }}.

Hör du bara en repeater är det oftast helt normalt: den för vidare dina meddelanden till resten av
nätet. Se [Jag hör bara en repeater](/felsokning/bara-en-repeater/).

## Var nätet behöver repeatrar
{{ with .Wanted }}
De här platserna skulle göra störst skillnad, och de finns också som stjärnor på kartan:
{{ range . }}
- **{{ .name }}**{{ with .note }}: {{ . }}{{ end }}{{ end }}
{{ else }}
Ingen lista över platser finns för länet än. Ett högt läge med fri sikt gör nästan alltid nytta: ett
tak, en mast, en höjd eller en lägenhet högt upp.
{{ end }}
Har du tillgång till en sådan plats behöver du inte sköta repeatern själv: du kan sätta upp en egen,
eller låta någon annan sätta en hos dig. Det gäller också föreningar och arbetsplatser.

- [Testa din plats](/wizard/nodvard/) visar vad som är bra med just din.
- [Bli nodvärd](/bli-nodvard/) beskriver vad det innebär att ha en repeater hos sig.
- [Sätt upp en MeshCore-repeater](/guider/repeater/) går igenom installationen, och
  [snabbkonfigurationen](/wizard/repeater-snabb/) skickar inställningarna till radion via USB.

En repeater i länet heter `{{ .Prefix }}-` följt av en välkänd plats, till exempel
`{{ .Prefix }}-{{ .Place }}`. Mer om namnen i [Namnge din repeater](/guider/namnge-noden/).

## Hjälp och gemenskap
{{ with .Groups }}
Frågor om nätet i länet tar du hos {{ range $i, $g := . }}{{ if $i }} eller {{ end }}[{{ $g.name }}]({{ $g.url }}){{ end }}.{{ else }}
Ingen grupp för länet finns med här än.{{ end }}{{ with .Chats }} Frågor som gäller hela Sverige tas i {{ range $i, $g := . }}{{ if $i }} eller {{ end }}[{{ $g.name }}]({{ $g.url }}){{ end }}.{{ end }}
Korta svar finns under [Frågor i {{ .Short }}]({{ .URL }}fragor/) och [Frågor](/fragor/), och lösningar
på vanliga problem under [Felsökning](/felsokning/).{{ with .DataURL }} Vet du en grupp eller kanal
som saknas? [Rätta länets uppgifter]({{ . }}).{{ end }}
