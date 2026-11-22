---
title: "From zero to a companion in your hand"
seoTitle: "Quick start: your first MeshCore radio"
description: "The shortest way to your own MeshCore radio: a ready-made device with a case, firmware from the browser, the app and your county's values."
url: /en/guides/quickstart-companion/
weight: 1
group: snabbstart
date: 2026-11-18
lastmod: 2026-11-22
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

The shortest way to a MeshCore radio of your own in your pocket. You need no soldering iron and no
license, just a computer with Chrome or Edge, a USB cable that carries data, and a phone.

## 1. Buy a ready-made radio {#1-köp-en-färdig-radio}

Choose a device that already has a case, battery and antenna and is sold for 868 MHz. Two that
Swedish shops carry:

- **Seeed Wio Tracker L1 Pro**: screen, GPS and a 2000 mAh battery. 725 kr at Limmared in November
  2026.
- **RAK WisMesh Tag**: a slim tracker without a screen, with GPS. 667 kr at Pileup in November 2026.

A Heltec board with a case also works, but the battery is not included, and the Heltec V3 easily
loses its Bluetooth connection to the phone because the antenna on the board is small.

Read more: [Choose a companion](../skaffa-hardvara/companion/), with more devices, battery life
and the sources for the prices.

## 2. Flash companion firmware {#2-flasha-companion-firmware}

Most devices ship with Meshtastic and need new firmware first. You do that in the browser:

1. Open [MeshCore's web flasher]({{< param "firmware.flasher" >}}) in Chrome or Edge.
2. Choose your model and **Bluetooth Companion**.
3. Connect the radio with the USB cable and follow the steps in the flasher.

If the flasher finds no radio, try another cable or port. Read more: [Flash
firmware](../flasha-firmware/#companion) and [The browser finds no
port](../../felsokning/ingen-port/).

## 3. Install the app and pair the radio {#3-installera-appen-och-para-radion}

1. Install **MeshCore** from Google Play or the App Store.
2. Turn on the radio and turn on Bluetooth on your phone.
3. Open the app and choose the radio in the list.
4. Enter the PIN if the app asks. If the radio has a screen, the code is shown there; otherwise it
   is often `123456`.

The app is free for sending and receiving.

## 4. Set up the radio for {{< region "name" >}}

Everyone who needs to hear each other needs the same values. Choose the preset in the app's radio
settings and save:

{{< settings >}}

Also set the **path hash to 3 bytes** under **Experimental Settings** in the app's settings.
2 bytes is the least you should use; with 1 byte, repeaters are mistaken for each other.

Give the radio a name you want others to see. Position is optional: a companion goes home with you,
so share it only if you want to.

Read more: [Set up a companion](/wizard/companion/), step by step with your county's values.

## Done {#klart}

The radio is ready. Next quick start: [Write your first message](../snabbstart-forsta-meddelandet/).
The long guide with everything about companions: [Get started with a companion](../companion/).
