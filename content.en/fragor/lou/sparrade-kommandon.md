---
title: "What cannot be done remotely?"
url: /en/faq/lou/blocked-commands/
category: loufjarr
weight: 230
date: 2026-11-21
lastmod: 2026-11-25
---

Some commands are blocked in remote control, whatever they contain:

- replacing or reading the repeater's private key
- clearing the command key or turning remote control off (the key is replaced with `rekey`, signed
  by the current one)
- erasing the repeater (`erase`)
- changing radio settings, position or role
- passwords

The private key, erasing and clearing the command key work from the USB console only. The rest
also works as a logged-in admin in the app. A leaked command key is therefore not enough to take over a
repeater or move it to another frequency.
