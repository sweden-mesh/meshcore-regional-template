---
title: "Get started with a companion"
seoTitle: "Get started with MeshCore: companion guide"
description: "Your own radio on the mesh: flash companion firmware, connect the app on your phone or computer, set up the radio and send your first test on the test channel."
url: /en/guides/companion/
weight: 20
group: start
source:
  title: "Sätt upp en egen MeshCore Companion"
  url: "https://meshat.se/meshcore/satt-upp-egen-companion/"
  license: "CC BY 4.0"
  changes: "Rewritten and shortened; flashing moved to a guide of its own; the region's settings from the page parameters; privacy advice on position added."
date: 2026-11-12
lastmod: 2026-11-22
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

A **companion** is your personal radio. You type in the MeshCore app, and the radio sends and
receives over LoRa. It doesn't pass on other people's traffic; the repeaters do that. New to
MeshCore? Read [What is MeshCore?](../vad-ar-meshcore/) first, and look up terms in the [glossary](../ordlista/).

## 1. Flash companion firmware {#1-flasha-companion-firmware}

Companion firmware is in the MeshCore project's [web flasher]({{< param "firmware.flasher" >}}),
not in the firmware picker. If you will use your phone, choose **Bluetooth Companion**; if the
radio will be plugged into a computer, choose **USB Companion**. Step by step: [Flash firmware](../flasha-firmware/#companion).
No radio yet? See [Get hardware](../skaffa-hardvara/).

## 2. Connect the app {#2-anslut-appen}

The MeshCore app is available for:

- **Android** (Google Play) and **iPhone** (App Store),
- **Windows** and **macOS**, to download from [meshcore.io](https://meshcore.io),
- **the browser**: [app.meshcore.nz](https://app.meshcore.nz), in Chrome or Edge, which can
  connect to the radio over Bluetooth or USB. This is also the way to go on Linux.

1. Turn on the radio and turn on Bluetooth on your phone.
2. Open the MeshCore app and choose the radio from the list.
3. Enter the PIN if the app asks. If the radio has a screen, the code is shown there; otherwise it
   is often `123456`.

The app shows contacts, channels and messages. The radio handles the transmitting.

> [!NOTE]- Does the app cost anything?
> No, not for sending and receiving. The app is free to download and use. In the mobile app, the
> wait time for administering a repeater or room server over the radio can be removed with an
> in-app purchase; the app for Windows and Mac is completely free [^faq].

## 3. Set up the radio {#3-ställ-in-radion}

Everyone who should hear each other must use the same frequency, bandwidth and spreading factor.
In {{< region "name" >}} the settings are:

{{< settings >}}

Choose the preset in the app's radio settings and save. Pick the transmit power based on your
radio, antenna and what is allowed; many use 22 dBm, but check what your radio can handle.
The values and the rules behind them: [MeshCore settings in Sweden](../radioinstallningar/).

### Path hash: 3 bytes {#väg-id-3-byte}

The path hash is the bytes of each repeater's key that are written into your message's path. Your
companion decides the size for what you send [^faq]. The app's default is 1 byte, and then many
repeaters share the same id and are mistaken for each other. **Set 3 bytes.** 2 bytes is the least
you should use, and you should not leave it at 1 byte.

1. Open the app's settings (the gear icon).
2. Choose **Experimental Settings**.
3. Set the path hash size to 3 bytes.

This needs companion firmware 1.14 or later and app version 1.41.0 or later [^faq]. Repeaters with
firmware older than 1.14 do not pass on messages with 2 or 3 bytes [^faq].

## 4. Give the radio a name {#4-ge-radion-ett-namn}

Others see the name when your radio sends an *advert*, a short packet saying that it exists.
You choose the name yourself; the region's naming suggestions are for repeaters. Keep it within
23 bytes if the position should fit in the same advert.

{{< namecheck kind="companion" >}}

## 5. Position, or not {#5-position-eller-inte}

Position is optional. A companion goes where you go, so a shared position can show where you live.
Only share it if you want to, and preferably rounded.

> [!TIP] The map here doesn't show companions
> The map on this site shows repeaters, not companions, precisely to protect where people live.

## 6. Send an advert and test {#6-skicka-en-advert-och-testa}

1. Send an advert from the app so others can see you exist.
2. Type `test` in the region's test channel {{< testchannel >}} if the region has repeaters with
   [auto-reply](../firmware-lou/), otherwise in the regular `#test`. Not in the
   chat channels. Repeaters with auto-reply answer, and you see which ones heard you.

What the replies mean, and why silence is usually normal: [Your first message](../forsta-meddelandet/).

## 7. Test with two radios {#7-testa-med-två-radior}

If no repeater answers on the test channel, you can try with two radios of your own, or with a friend.

> [!NOTE]- How to test with two radios
> 1. Set up both radios with the same values as in step 3.
> 2. Send an advert from both.
> 3. Check that they see each other under contacts in the app.
> 4. Send a direct message from one to the other and wait for the delivery receipt.
> 5. Move apart, or put one of them higher up, and send again. That shows you how far they reach.

{{< channels >}}

## If something goes wrong {#om-något-krånglar}

> [!NOTE]- The flasher can't find the radio
> Use a USB cable that carries data, try another USB port, and start the radio in
> bootloader mode. See [The browser finds no port](../../felsokning/ingen-port/) and, for
> nRF52 boards, [The nRF52 radio doesn't show up as a USB device](../../felsokning/nrf52-ingen-enhet/).

> [!NOTE]- The app can't find the radio
> Check that Bluetooth is on, that you flashed a *Bluetooth* companion and that the radio isn't
> already connected to another phone. If it has been paired before, remove it from the phone's
> Bluetooth list and connect again through the app.

> [!NOTE]- Connected, but I don't hear anyone
> Go through these in order: the same radio settings as above, the antenna is attached, you have
> sent an advert, and there is a repeater within range (see the map on the home page).

> [!NOTE]- It works up close but not far away
> Range is about height and clear line of sight. Try outdoors, higher up and away from metal.

More answers in Troubleshooting: [The app can't connect to the radio](../../felsokning/appen-ansluter-inte/), [Messages don't get through](../../felsokning/meddelanden-kommer-inte-fram/) and [I hear others, but they don't hear me](../../felsokning/hor-andra-men-inte-mig/).

## Next steps {#nästa-steg}

- [Your first message](../forsta-meddelandet/): contacts, receipts and what to expect
- [Regions](../regioner/): send with the right region in the chat channels
- [Choose and flash firmware](../flasha-firmware/): turn the radio into a repeater when you want to help the mesh

## Sources {#källor}

[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md), on the apps, in-app purchases and the path hash.
