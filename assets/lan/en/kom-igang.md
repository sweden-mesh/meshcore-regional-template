This page collects what applies in {{ .Name }}: the radio settings, the region, the channels and where
the network needs to grow. How MeshCore works in general, and how to do each step, is in the other
guides. If you are completely new, start with [What is MeshCore?](/guider/vad-ar-meshcore/).

## The network in the county right now {#nätet-i-länet-just-nu}

[The county's page]({{ .URL }}) has a map of the repeaters and observers heard in the county, and
the traffic between them. The map is based on what the observers hear: where there are few observers, only
part of the network shows.

## Radio settings {#radioinställningar}

All radios in the network must have the same radio settings to hear each other. All of Sweden uses
the preset below, which has the same name in the MeshCore app.

{{"{{<"}} settings {{">}}"}}

## Channels and region {#kanaler-och-region}

The county uses the region (scope) `{{ .Scope }}`.{{ if .Proposal }} The region is a proposal in the
[list of regions](https://github.com/zombiefredrik/meshcore-se-regioner): no group in the county
has decided on it yet.{{ end }} A channel with the region `{{ .Scope }}` is only passed on by repeaters that
carry it, so the conversation stays in the county and does not take airtime from the neighbors. How it works is explained
in [Regions](/guider/regioner/).{{ range $r := .RegionsExtra }}{{ if $r.scope }}

{{ if $r.group }}[{{ $r.group }}]({{ $r.source }}){{ else }}A group in the county{{ end }} also adds the region `{{ $r.scope }}`{{ with $r.note }} ({{ . }}){{ end }} to its repeaters,
in addition to `{{ $.Scope }}`. It is a local addition that works together with the county's region.{{ end }}{{ end }}

{{"{{<"}} channels {{">}}"}}

You add hashtag channels in the app by their name, including the `#`. If the county has repeaters with
[auto-reply]({{ .Picker }}#f=ar&install=update), test in `{{ .Test }}`, otherwise in the ordinary `#test`. Never in
a chat channel: every test costs airtime for everyone in range. More about channels in
[Channels in MeshCore](/guider/kanaler/).

## Step by step {#steg-för-steg}

1. **Get a radio.** Almost any LoRa board for 868 MHz works as your own radio,
   a *companion*. Models, prices and shops are in
   [Get hardware](/guider/skaffa-hardvara/).
2. **Flash companion firmware.** This is done from your web browser, with the MeshCore project's web flasher:
   see [Flash firmware](/guider/flasha-firmware/#companion).
3. **Set up the radio in the app.** [The companion wizard](/wizard/companion/) shows the values in the
   order the app asks for them, and [Get started with a companion](/guider/companion/) explains
   each step.
4. **Add {{ if gt (len .Channels) 1 }}the channels{{ else }}the channel{{ end }}** {{ range $i, $c := .Channels }}{{ if $i }} and {{ end }}`{{ $c }}`{{ end }}, and choose the region `{{ .Scope }}` for {{ if gt (len .Channels) 1 }}them{{ else }}it{{ end }}.
5. **Send an advert,** so the others can see your radio.
6. **Write `test` in `{{ .Test }}`.** Repeaters with auto-reply answer with a short report on who
   heard you and how strongly. The replies arrive spread out over about two minutes, so wait before you
   write again. If no reply comes, see
   [No one answers test in {{ .Test }}]({{ .URL }}ingen-svar-pa-test/). If there are no repeaters with
   auto-reply in the county yet, test in the ordinary `#test` instead. What the replies mean is explained in
   [First message](/guider/forsta-meddelandet/).
7. **Say hello**{{ with .Chat }} in `{{ . }}`{{ end }}{{ $or := cond (ne .Chat "") ", or" "" }}{{ with .Groups }}{{ $or }} at {{ range $i, $g := . }}{{ if $i }} or {{ end }}[{{ $g.name }}]({{ $g.url }}){{ end }}{{ else }}{{ with .Chats }}{{ $or }} in {{ range $i, $g := . }}{{ if $i }} or {{ end }}[{{ $g.name }}]({{ $g.url }}){{ end }}{{ end }}{{ end }}.

If you only hear one repeater, that is usually completely normal: it passes your messages on to the rest of
the network. See [I only hear one repeater](/felsokning/bara-en-repeater/).

## Where the network needs repeaters {#var-nätet-behöver-repeatrar}
{{ with .Wanted }}
These sites would make the biggest difference, and they are also shown as stars on the map:
{{ range . }}
- **{{ .name }}**{{ with .note }}: {{ . }}{{ end }}{{ end }}
{{ else }}
There is no list of sites for the county yet. A high spot with a clear view almost always helps: a
roof, a mast, a hilltop or an apartment high up.
{{ end }}
If you have access to a site like that, you don't need to look after the repeater yourself: you can set up your own,
or let someone else put one at your place. That goes for associations and workplaces too.

- [Test your site](/wizard/nodvard/) shows what is good about yours.
- [Host a node](/bli-nodvard/) describes what it means to have a repeater at your place.
- [Set up a MeshCore repeater](/guider/repeater/) walks through the installation, and
  [the quick setup](/wizard/repeater-snabb/) sends the settings to the radio over USB.

{{ with .Naming.format }}{{ if $.Naming.group }}[{{ $.Naming.group }}]({{ $.Naming.source }}){{ else }}The county's group{{ end }}
names the repeaters in the county like this: `{{ . }}`{{ with $.Naming.example }}, for example `{{ . }}`{{ end }}. Use that format in the county. The national proposal for counties without a format of their own
is `{{ $.Prefix }}-` followed by a well-known place, like `{{ $.Prefix }}-{{ $.Place }}`.{{ else }}A repeater in the county is named `{{ .Prefix }}-` followed by a well-known place, for example
`{{ .Prefix }}-{{ .Place }}`.{{ end }} More about names in [Name your repeater](/guider/namnge-noden/).

## Help and community {#hjälp-och-gemenskap}
{{ with .Groups }}
Ask questions about the network in the county at {{ range $i, $g := . }}{{ if $i }} or {{ end }}[{{ $g.name }}]({{ $g.url }}){{ end }}.{{ else }}
No group for the county is listed here yet.{{ end }}{{ with .Chats }} Questions about all of Sweden go in {{ range $i, $g := . }}{{ if $i }} or {{ end }}[{{ $g.name }}]({{ $g.url }}){{ end }}.{{ end }}
Short answers are under [Questions in {{ .Short }}]({{ .URL }}fragor/) and [FAQ](/fragor/), and solutions
to common problems under [Troubleshooting](/felsokning/).{{ with .DataURL }} Do you know of a group or channel
that is missing? [Correct the county's details]({{ . }}).{{ end }}
