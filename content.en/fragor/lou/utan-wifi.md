---
title: "Does remote control work when Wi-Fi is down, or on boards without Wi-Fi?"
url: /en/faq/lou/without-wifi/
category: loufjarr
weight: 250
date: 2026-11-21
lastmod: 2026-11-25
---

Yes, from lou-20. On lou-18 and older the repeater needs Wi-Fi and a connection to the server.

From lou-20 the same signed command can be sent over radio, from the owner's own companion or
through one of the owner's Observer repeaters with remote control and the same command key:

- **Wi-Fi down.** A repeater that has lost its Wi-Fi takes commands over radio, and there it can
  be given a new Wi-Fi name and password without a visit.
- **Boards without Wi-Fi.** The variants `rc` and `arrc` are also built for boards such as nRF52,
  and are then controlled over radio only.

The checks are the same as over the internet. Over radio the answers have an airtime budget of
their own. When it is used up the repeater does not answer at all. Wait a few minutes and send
again.

How to turn it on is in [Remote control without Wi-Fi](../../guider/firmware-lou/#fjärrstyrning-utan-wifi).
