---
title: "Does auto-reply fill the mesh with traffic?"
url: /en/faq/lou/auto-reply-traffic/
category: louautosvar
weight: 120
date: 2026-11-21
lastmod: 2026-11-21
---

It is built not to:

- **The replies are spread out.** They arrive between 10 and 120 seconds after your `test`, each
  repeater in its own slot, so that they do not collide.
- **One reply per person.** The same sender gets one reply per repeater every five minutes.
- **A ceiling per repeater.** At most ten replies per five minutes, whoever asks.
- **A hop limit.** A `test` from more than eight hops away is not answered (`set autoreply.hops`).

So wait two minutes for the replies, and do not send `test` again in the meantime.
