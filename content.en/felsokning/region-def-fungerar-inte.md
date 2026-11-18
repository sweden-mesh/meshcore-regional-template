---
title: "The region def command gives an error"
description: "Does region def give an error on your repeater? Usually the firmware is older than 1.16 or the chain is misspelled. Here's how to fix it."
url: /en/troubleshooting/region-def-error/
category: regioner
weight: 10
date: 2026-11-13
lastmod: 2026-11-16
---

## Likely causes {#troliga-orsaker}

1. **The firmware is older than 1.16.** `region def` exists from MeshCore 1.16.
2. **A typo in the chain**: the regions go in order from largest to smallest, with spaces
   between them, for example `region def eu|* europe|eu se {{< region "scope" >}}`.
3. The line is too long for the app's field; type it in the USB console instead.

## Check {#kontrollera}

```sh {title="Console"}
ver
region
```

## Fix {#åtgärda}

1. Older than 1.16: [flash](../../guider/flasha-firmware/) a new version with *Update*.
2. Copy the command from the guide or the wizard on this site instead of typing it out.

## How to tell it worked {#så-vet-du-att-det-fungerar}

`region` lists `se` and `{{< region "scope" >}}` under it, and `^` next to the county.
