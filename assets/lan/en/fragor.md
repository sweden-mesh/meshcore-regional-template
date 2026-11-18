## Where can I get help in {{ .Name }}? {#{{ anchorize (printf "Var får jag hjälp i %s?" .Name) }}}
{{ with .Groups }}
Ask at {{ range $i, $g := . }}{{ if $i }} or {{ end }}[{{ $g.name }}]({{ $g.url }}){{ end }}.{{ else }}
No group for the county is listed here yet.{{ end }}{{ with .Chats }} Questions about all of Sweden go in
{{ range $i, $g := . }}{{ if $i }} or {{ end }}[{{ $g.name }}]({{ $g.url }}){{ end }}.{{ end }}{{ with .Chat }}

You can also write in `{{ . }}` in the app, with the region `{{ $.Scope }}`.{{ end }}

## Which channels are used in the county? {#vilka-kanaler-används-i-länet}

{{"{{<"}} channels {{">}}"}}

You add hashtag channels in the app by their name, including the `#`. See [Channels](/guider/kanaler/).

If no replies come when you write `test` in `{{ .Test }}`, see
[No one answers test in {{ .Test }}]({{ .URL }}ingen-svar-pa-test/).
{{- with .DataURL }}

## Is a channel or group missing? {#saknas-en-kanal-eller-grupp}

The county's details are in a file anyone can correct: [Correct the county's details]({{ . }}).
{{- end }}
