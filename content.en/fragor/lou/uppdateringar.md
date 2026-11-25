---
title: "How is lou updated, and what happens if an update is broken?"
url: /en/faq/lou/updates/
category: louinstall
weight: 320
date: 2026-11-21
lastmod: 2026-11-25
---

An Observer repeater fetches its firmware itself over Wi-Fi: `ota check` shows what is on offer
and `ota update` installs it. With `set ota.auto on` it checks once a day, and never updates
between 00:00 and 06:00.

- **Signed.** Every file is signed by sweden-mesh. The repeater checks the signature before it
  downloads anything, and accepts only the file for its own board and variant.
- **Goes back by itself.** The new version has to show that it works, by reaching a server over
  Wi-Fi. Otherwise the repeater starts the old version again at the next restart. A bad version
  costs one restart, not a visit.

From lou-20 the radio must also have sent or received a packet before the new version is kept.
Boards without Wi-Fi are updated by USB or Bluetooth.
