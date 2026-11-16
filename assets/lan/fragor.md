## Var får jag hjälp i {{ .Name }}?
{{ with .Groups }}
Fråga hos {{ range $i, $g := . }}{{ if $i }} eller {{ end }}[{{ $g.name }}]({{ $g.url }}){{ end }}.{{ else }}
Ingen grupp för länet finns med här än.{{ end }}{{ with .Chats }} Frågor som gäller hela Sverige tas i
{{ range $i, $g := . }}{{ if $i }} eller {{ end }}[{{ $g.name }}]({{ $g.url }}){{ end }}.{{ end }}{{ with .Chat }}

Du kan också skriva i `{{ . }}` i appen, med regionen `{{ $.Scope }}`.{{ end }}

## Vilka kanaler används i länet?

{{"{{<"}} channels {{">}}"}}

Hashtag-kanaler lägger du till i appen med namnet, inklusive `#`. Se [Kanaler](/guider/kanaler/).

Kommer inga svar när du skriver `test` i `{{ .Test }}`? Se
[Ingen svarar på test i {{ .Test }}]({{ .URL }}ingen-svar-pa-test/).
{{- with .DataURL }}

## Saknas en kanal eller grupp?

Länets uppgifter finns i en fil som vem som helst kan rätta: [Rätta länets uppgifter]({{ . }}).
{{- end }}
