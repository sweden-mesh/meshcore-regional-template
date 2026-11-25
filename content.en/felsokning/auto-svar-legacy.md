---
title: "The auto-reply doesn't answer in my county's test channel"
seoTitle: "MeshCore auto-reply doesn't answer in the test channel"
description: "Auto-reply answering in an older test channel, not your county's? Usually the firmware is older than lou-16 or region home isn't saved. Here's the fix."
url: /en/troubleshooting/auto-reply-legacy-channel/
category: regioner
weight: 40
date: 2026-11-13
lastmod: 2026-11-25
---

This applies to repeaters with auto-reply (the *lou* firmware). The auto-reply takes the county from
`region home` and answers in `#test-<county>`. If no county is set, it answers {{< legacy-test >}}.
A repeater without Observer has no older channel and then does not answer at all.

## Likely causes {#troliga-orsaker}

1. **The firmware is older than lou-16.** Older versions only look at `region default`, and with
   `se` there you get the older channel.
2. **`region home` isn't set**, or wasn't saved (`region save`).

## Check {#kontrollera}

```sh {title="Console"}
ver
region home
get autoreply
```

## Fix {#åtgärda}

1. Older than lou-16: [flash](../../guider/flasha-firmware/) the latest version with
   *Update*. Your settings are kept.
2. `home is *`: `region home {{< region "scope" >}}` and `region save`.

## How to tell it worked {#så-vet-du-att-det-fungerar}

`get autoreply` shows `#test-{{< region "scope" >}} (region home)`.
