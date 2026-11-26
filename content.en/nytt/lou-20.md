---
title: "lou-20"
description: "lou-20 (24 November 2026): remote control of repeaters without Wi-Fi and without a region, auto-reply on #test-se and new names for the commands."
url: /en/news/lou-20/
group: lou
date: 2026-11-24
lastmod: 2026-11-26
checkedOn: 2026-11-26
---

lou-20 was released on 24 November 2026 [^rel]. lou is repeater firmware from sweden-mesh that adds
auto-reply and remote control to MeshCore 1.18; see [The lou firmware](../../guider/firmware-lou/).
The largest change is remote control, which now reaches repeaters without Wi-Fi.

## Remote control reaches more repeaters

With remote control you send console commands to your own repeater without going there: read
settings, see which neighbours it hears, update it over Wi-Fi or restart it. Each command is signed with
your key, and the repeater runs only what your key has signed.

Up to lou-18 that needed an Observer repeater with Wi-Fi and a region. With lou-20:

- **Boards without Wi-Fi can be controlled.** nRF52, RP2040, STM32 and ESP32 without the Observer
  take commands over the mesh, from your companion or through one of your own Observer repeaters.
- **No region is needed.** The repeater is reached on its own key.
- **The server can read nothing.** Commands and answers are encrypted between the repeater and its
  owner.
- **Your repeaters show up by themselves.** An Observer repeater sends an encrypted sign of life
  about every 15 minutes, and only your key opens it.

To get started:

1. Get lou-20 in [the firmware picker]({{< param "firmware.picker" >}}). For ESP32 boards it flashes
   straight from the browser.
2. Open [mccontrol](https://mccontrol.meshcoresverige.se) in your browser and make your key. It
   stays in your browser.
3. Give the repeater the key on its console with `set cmd.pubkey <key>` and switch it on with
   `set cmd on`.

The full description is in the firmware's documentation on GitHub:
[the overview](https://github.com/sweden-mesh/MeshCore-lou#readme) and
[remote control in detail](https://github.com/sweden-mesh/MeshCore-lou/blob/fork/observer/docs/mqtt-control.md).

## If you already use remote control: the commands have new names

The settings are no longer called `mqtt.cmd`. The old names are gone: a node on lou-20 answers that
it does not know them.

| lou-18 | lou-20 |
|---|---|
| `set mqtt.cmd on`, `set mqtt.cmd off`, `get mqtt.cmd` | `set cmd on`, `set cmd off`, `get cmd` |
| `set mqtt.cmd.pubkey <key>` | `set cmd.pubkey <key>` |
| `mqtt.cmd ping` | `cmd ping` |

Your settings carry over in the update: the command key, the counter and the server slot. A node
set with `set mqtt.cmd on <server>` needs `set cmd on <server>` once more afterwards.
[mccontrol](https://mccontrol.meshcoresverige.se) handles both lou-18 and lou-20 and picks by itself.

## Everything that is new

- **Remote control without Wi-Fi and without a region**, see above and
  [Remote control without Wi-Fi](../../guider/firmware-lou/#fjärrstyrning-utan-wifi).
- **Auto-reply on `#test-se`.** Repeaters now answer `test` on the national test channel too.
  Replies there cost airtime in the whole country: send one `test`, wait two minutes and do not
  repeat it. Prefer your county's own channel.
- **Changing the command key from afar** with `rekey`, signed by the current key.

## Good to know

- The update over Wi-Fi from lou-18 has been tried: `ota update` on the console, and the settings
  stay.
- A node answers over radio on an airtime budget of its own. When it is used up there is no answer
  at all. Wait a few minutes and send again.
- lou-20 still accepts the older way of control, so an older tool reaches the node. lou-21 removes
  it, no earlier than a month after lou-20.
- Boards without Wi-Fi are updated by USB or Bluetooth.

## Sources

[^rel]: sweden-mesh, [v1.18.0-lou-20 on GitHub](https://github.com/sweden-mesh/MeshCore-lou/releases/tag/v1.18.0-lou-20), 24 November 2026.
