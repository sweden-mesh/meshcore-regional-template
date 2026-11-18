---
title: "The app makes me wait before I can manage my repeater"
seoTitle: "Wait time for remote management in the MeshCore app"
description: "Logging in to a repeater or room server works, but the app shows a wait time."
url: /en/troubleshooting/app-wait-time/
category: companion
weight: 55
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

## Likely causes {#troliga-orsaker}

1. **The wait time is part of the mobile app.** The app is free for messaging, but remote management
   of repeaters and room servers over radio has a wait time that you can unlock with an in-app purchase
   ([MeshCore FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md)). Nothing is wrong.

## Check {#kontrollera}

This applies to the Android and iPhone app. The Windows and Mac app has no such limit, according to
the same FAQ.

## Fix {#åtgärda}

Pick one:

1. Wait it out.
2. Unlock it with the in-app purchase.
3. Manage the repeater from a computer instead, or over a USB cable; see [Send commands over
   USB](../../guider/usb-konsol/).

## How to tell it worked {#så-vet-du-att-det-fungerar}

You can open the repeater's settings without a wait.

## Didn't work? {#fungerade-inte}

Can't get in at all: see [Manage your repeater from the app](../../guider/fjarradministration/)
and [I forgot my repeater's admin password](../glomt-adminlosenord/).
