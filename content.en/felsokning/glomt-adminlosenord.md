---
title: "I forgot my repeater's admin password"
description: "Forgot your repeater's admin password? You can change it without the old one, but only over a USB cable. Here's how to set a new password in the console."
url: /en/troubleshooting/forgot-admin-password/
category: repeater
weight: 30
date: 2026-11-13
lastmod: 2026-11-16
---

## Check {#kontrollera}

The password in the app is the repeater's *admin* password, not the guest password. Connect the repeater
over USB and type `ver` in the [USB console](../../guider/usb-konsol/). If it answers with the version and
build date, the console works and you can change the password there.

## Fix {#åtgärda}

The password can be changed without the old one, but only over a cable. Connect the repeater to the computer,
open the [USB console](../../guider/usb-konsol/) and type:

```sh {title="Console"}
password <new-password>
```

At most 15 characters. The repeater saves it right away and answers `password now: <new-password>`, so
you can see it came out right.

> [!CAUTION] Change the default password
> A repeater with the default password `password` can be controlled by anyone within range.

## How to tell it worked {#så-vet-du-att-det-fungerar}

Logging in from the app works with the new password.

## Didn't work? {#fungerade-inte}

- **The console doesn't answer:** see [Send commands over USB](../../guider/usb-konsol/) and
  [The browser can't find a port](../ingen-port/).
- **The password is right, but remote login still fails:** then your radio isn't reaching the
  repeater. See [I can hear others, but they can't hear me](../hor-andra-men-inte-mig/).
