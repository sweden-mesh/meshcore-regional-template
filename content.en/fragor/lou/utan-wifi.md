---
title: "Does remote control work when Wi-Fi is down, or on boards without Wi-Fi?"
url: /en/faq/lou/without-wifi/
category: loufjarr
weight: 250
date: 2026-11-21
lastmod: 2026-11-21
---

Not in lou-18. There the repeater needs Wi-Fi and a connection to the server.

From lou-20, which is built but not released, the same signed command can be sent over radio from
the owner's own companion:

- **Wi-Fi down.** A repeater that has lost its Wi-Fi takes commands over radio, and there it can
  be given a new Wi-Fi name and password without a visit.
- **Boards without Wi-Fi.** The variants `rc` and `arrc` are also built for boards such as nRF52,
  and are then controlled over radio only.

The checks are the same as over the internet, with a separate ceiling of ten answers an hour over
radio.
