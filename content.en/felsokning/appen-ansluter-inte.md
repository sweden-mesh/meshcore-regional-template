---
title: "The app won't connect to the radio"
description: "Bluetooth or USB: the radio doesn't show up, or the connection drops right away."
url: /en/troubleshooting/app-wont-connect/
category: companion
weight: 10
date: 2026-11-13
lastmod: 2026-11-13
---

## Likely causes {#troliga-orsaker}

1. **The radio has repeater firmware.** The app only connects to a companion.
2. **Bluetooth:** the radio is already paired with another phone, or an old pairing is still there.
3. **Wrong PIN.** Many radios show the PIN on their screen; without a screen it is often `123456`.
4. **USB:** the cable only charges, or the browser lacks Web Serial (use Chrome or Edge).

## Fix {#åtgärda}

1. In the [USB console](../../guider/usb-konsol/), run `ver` to check that the radio has companion
   firmware. If not: [flash it again](../../guider/flasha-firmware/).
2. Remove the radio from your phone's Bluetooth devices, restart the radio and pair again from the app.
3. Disconnect the radio from other phones and computers.
4. Try another cable if you connect over USB.

## How to tell it worked {#så-vet-du-att-det-fungerar}

The app shows the radio's name and battery level, and contacts start to appear.
