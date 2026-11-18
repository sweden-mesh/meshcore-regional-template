Repeaters with auto-reply (the *lou* firmware) answer `test` in `{{ .Test }}`, spread out over about
two minutes so the replies don't collide.

## Likely causes {#troliga-orsaker}

1. **You haven't waited long enough.** The replies arrive over about two minutes, some of them sometimes
   later.
2. **The channel name is wrong.** It must be exactly `{{ .Test }}`, in lower case.
3. **No repeater with auto-reply reaches you.** Only repeaters with lou firmware and auto-reply turned on
   answer; others only pass messages on.
4. **The channel is missing the region.** A test in `{{ .Test }}` should be sent with the region `{{ .Scope }}`.{{ with .Iata }}
5. The repeaters near you have older firmware and answer in the old channel `#test-{{ . }}`.{{ end }}

## Fix it {#åtgärda}

1. Wait a few minutes before you write again. Don't write `test` several times in a row.
2. Check the channel name in the app, character by character.
3. Choose the region `{{ .Scope }}` for the channel. How to do it is explained in [Regions](/guider/regioner/).{{ with .Iata }}
4. Also try `#test-{{ . }}`. If someone answers there, the repeaters near you have older firmware.{{ end }}
5. Move higher up, or closer to a repeater on [the map]({{ .URL }}#karta).
6. If the county has no repeaters with [auto-reply]({{ .Picker }}#f=ar&install=update) yet, test in the ordinary
   `#test` instead.

## How you know it works {#så-vet-du-att-det-fungerar}

Replies with the repeaters' names and how strongly they heard you.
