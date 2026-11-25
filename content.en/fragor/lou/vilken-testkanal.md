---
title: "Why can't I choose the test channel myself?"
url: /en/faq/lou/which-test-channel/
category: louautosvar
weight: 130
date: 2026-11-21
lastmod: 2026-11-25
---

The channel follows the repeater's region and is always `#test-` followed by the region's name.
That is on purpose:

- Every repeater that hears a `test` answers. In a channel everyone has, such as `#public`, a
  single `test` would set off replies across the whole mesh.
- One channel per region keeps the tests where they are useful.
- There is no key to hand out: anyone who knows the region's name types the channel into the app.

From lou-20 the repeater also answers in `#test-se` (`set autoreply.national auto|off|<region>`).

See [Regions](../../guider/regioner/).
