---
title: "The home region is gone after a restart"
description: "Is region home gone after a restart? The home region is only saved with region save. Here's how to set it again and make sure it stays."
url: /en/troubleshooting/region-home-lost/
category: regioner
weight: 20
date: 2026-11-13
lastmod: 2026-11-16
---

## Likely causes {#troliga-orsaker}

**`region save` wasn't run.** `region home` only changes the setting in memory. `region default` saves
itself, but the home region, the region chain and `region allowf` are only saved with `region save`.

## Check {#kontrollera}

```sh {title="Console"}
region home
```

If the repeater answers `home is *`, there is no home region.

## Fix {#åtgärda}

```sh {title="Console"}
region home {{< region "scope" >}}
region save
```

The repeater answers `home is now {{< region "scope" >}}` to the first command and `OK` to the second.

## How to tell it worked {#så-vet-du-att-det-fungerar}

After a restart (`reboot`), `region home` answers `home is {{< region "scope" >}}`.

## Didn't work? {#fungerade-inte}

- **`Err - unknown region`:** the region isn't in the repeater's region chain. Add it with
  `region def` first; see [Regions](../../guider/regioner/) and
  [The region def command gives an error](../region-def-fungerar-inte/).
- **`Err - save failed`:** saving failed. Restart the repeater, run the commands again and
  check with `region home` after the restart.
