---
title: "What does auto-reply do?"
url: /en/faq/lou/what-auto-reply-does/
category: louautosvar
weight: 110
date: 2026-11-21
lastmod: 2026-11-25
---

Type `test` in the county's test channel, for example `#test-{{< region "scope" >}}`. Every
repeater with auto-reply that hears you answers with one line:

```text
you        test
STO-1      [anna] SNR 6.5 RSSI -92 0h direct
STO-2      [anna] SNR -4.0 RSSI -104 2h A3,1B
```

The line shows how strongly the repeater heard you (SNR and RSSI), how many hops away it is and
which repeaters the message passed through. Your name is in brackets, so you find your reply when
several people test at once. No login and no contact are needed.
