---
title: "Your own broker for the region"
seoTitle: "Does your region need its own MQTT broker?"
description: "You don't need your own broker: the shared one works for every region. What a region gets with its own, what it costs and where to find instructions."
url: /en/guides/own-broker/
weight: 108
group: regioner
date: 2026-11-16
lastmod: 2026-11-25
---

**You don't need your own: the shared broker works.** The broker
`{{< param "backend.host" >}}` accepts repeaters from every region. It passes signed
commands on to repeaters with remote control and receives the packets they hear. The repeater guides
under [Step by step](../../wizard/) and [lou special firmware](../firmware-lou/) set it up
for you, and most regions will never need anything else.

A broker is the MQTT server that the repeaters keep a connection to. It reads no commands
and cannot send any of its own: every command is signed with the repeater owner's key, and the
repeater checks the signature itself.

## What a region gets with its own {#vad-en-region-får-med-en-egen}

- **Remote control on its own terms.** The region's repeater owners send their commands through a
  server the region runs itself, with its own limits on how much may be sent and its own rules for
  which keys are let in.
- **Its own packet feed.** The repeaters send every packet they hear to the broker. The region can
  read that feed into its own map or its own statistics, without going through anyone else.
- **Independence.** If the shared broker goes down, the region is not affected.

Repeaters can move between the shared broker and a region's own without being reflashed: it takes a
few `set` commands, and the site's wizards write them once the region has entered its own server.

## What it costs {#vad-det-kostar}

- **A small server.** A small VPS is enough, with a domain name and a TLS certificate (free
  from Let's Encrypt).
- **Upkeep.** Someone has to update the server, renew certificates, take backups and respond when
  it acts up. If the broker is down, the region's repeaters can only be remote controlled over the mesh, and the
  region's own packet feed stops.
- **A name to keep.** The broker's name is in every repeater's login. Pick a name the region can
  keep, so that no repeater has to be reconfigured later.

## How to set one up {#så-sätter-du-upp-en}

1. **The broker.** mcbroker is a Mosquitto plugin that handles login, permissions and
   signature checks. The code and an operations guide for other regions are not published yet;
   until they are, you can ask in [mccontrol on GitHub](https://github.com/sweden-mesh/mccontrol-cli/issues).
2. **The tool.** [mccontrol](https://github.com/sweden-mesh/mccontrol-cli) is the program
   repeater owners use to sign and send commands. It explains how to create a key, register it
   with a broker and add your repeaters.
3. **The site.** The region's site names its broker with `host` under `[params.backend]` in `hugo.toml`.
   The wizards and guides then show it instead of the shared one.
