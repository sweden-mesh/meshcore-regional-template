---
title: "The firmware picker doesn't offer the latest version"
seoTitle: "MeshCore firmware picker shows an old version"
description: "Is the firmware picker not showing the latest version? The file list hasn't been rebuilt yet, or your browser is showing a cached copy. Here's the fix."
url: /en/troubleshooting/firmware-picker-old-version/
category: flasha
weight: 25
date: 2026-11-13
lastmod: 2026-11-16
---

## Likely causes {#troliga-orsaker}

1. **The page's file list hasn't been updated yet.** It is rebuilt from the releases on GitHub, usually
   within an hour of a new version, but sometimes later.
2. **The browser is showing a cached copy** of the page.

## Check {#kontrollera}

Compare the version the page selects with the latest one on the
[releases page on GitHub](https://github.com/sweden-mesh/MeshCore-lou/releases).

## Fix {#åtgärda}

1. Reload the page without the cache: **Ctrl+Shift+R** (Mac: **Cmd+Shift+R**).
2. Still old: wait a while, or download the file for your radio straight from the releases page
   and flash it as described in [Flash firmware](../../guider/flasha-firmware/).

## How to tell it worked {#så-vet-du-att-det-fungerar}

The page shows the new version preselected, and `ver` on the radio shows it after flashing.
