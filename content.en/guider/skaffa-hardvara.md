---
title: "Get hardware"
seoTitle: "Which MeshCore radio should I buy?"
description: "Which MeshCore radio should you buy? Companion, repeater and antenna for 868 MHz, shops and prices in kronor, and the models compared side by side."
url: /en/guides/get-hardware/
weight: 14
group: start
date: 2026-11-12
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

MeshCore runs on cheap LoRa boards. The same board can usually become a companion or a repeater
depending on the firmware you flash. [What is MeshCore?](../vad-ar-meshcore/) explains what a
companion and a repeater are, and the [glossary](../ordlista/) covers the other terms.

> [!WARNING] 868 MHz
> Always buy the **868 MHz** (EU) version. The same model is sold for 433 and 915 MHz, and those
> don't work on the mesh here. 915 MHz is also not allowed in the EU.

Choose by what you want to do:

- **[A companion](companion/)**: the radio you carry with you and pair with the app on your phone.
  Start here if you just want to send messages.
- **[A repeater](repeater/)**: a radio that stays in one place, high up, and passes traffic on so
  the mesh reaches further.
- **[An antenna](antenn/)**: the part that matters most for how far a repeater reaches.

The prices on these pages are what Swedish shops charged in November 2026, and they change. If no
price in kronor is given, we haven't seen the model in a Swedish shop. We take no commissions and
link to the manufacturers' own product pages, not to ads.

## Where to buy {#var-du-köper}

Pileup and Limmared
: Swedish shops with LoRa gear: [pileupdx.com](https://www.pileupdx.com/) and
  [butik.limmared.nu](https://butik.limmared.nu/). Swedish VAT and Swedish consumer warranty rights.

amazon.se
: Has many of the boards. Check the band in the listing; if it isn't stated, ask or choose another.
  The seller is often someone other than Amazon.

AliExpress
: Often cheapest, with longer delivery times. Choose 868 MHz in the variant, and check that the
  picture and description say the same thing. VAT is charged at purchase or on delivery, and a
  return is more hassle than from a Swedish shop.

The manufacturers' own shops
: Seeed Studio, RAK, Heltec and LilyGO sell direct, often shipping from Asia.

## The radio {#radion}

Every board has a LoRa radio. What sets them apart is the processor:

ESP32 boards
: For example Heltec V3/V4 and LilyGO T-Beam. Cheap, often with a screen, and with Wi-Fi, which an
  **observer** needs. Use more power.

nRF52 boards
: For example RAK WisBlock (RAK4631), Seeed XIAO nRF52840 with Wio-SX1262, and ready-made devices
  like the Seeed T1000-E. Very low power, good for battery and solar. No Wi-Fi.

Ready-made devices
: With a case and battery, good as a pocket companion. See [companions](companion/).

> [!TIP] Companion or repeater?
> Almost any board will do for a **companion**. For a **repeater** on battery or solar, choose
> nRF52; for a repeater that should also report to the map, choose ESP32 with Wi-Fi.

## The models compared {#modellerna-i-jämförelse}

All the models below are in MeshCore's official web flasher [^flasher]. Transmit power is the
manufacturer's figure; a dash means the manufacturer doesn't state it, or that we haven't been
able to find it.

| Model | Chip | Transmit power | Battery and ruggedness |
| --- | --- | --- | --- |
| Heltec V3 | ESP32-S3 | 21 ± 1 dBm [^v3] | – |
| Heltec V4 | ESP32-S3 | 28 ± 1 dBm [^v4] | solar input 4.7–6 V [^v4] |
| Heltec T114 | nRF52840 | 21 ± 1 dBm [^t114] | – |
| RAK4631 (WisBlock, WisMesh) | nRF52840 | 22 dBm [^rak] | – |
| Seeed T1000-E | nRF52840 | – | 700 mAh, IP65 [^t1000e] |
| Seeed Wio Tracker L1 Pro | nRF52840 | – | 2,000 mAh, solar input 5 V [^l1] |
| LilyGO T-Deck | ESP32 [^flasher] | – | – |

| Model | Best for |
| --- | --- |
| Heltec V3, V4 | repeater on mains power, observer (Wi-Fi) |
| Heltec T114, RAK4631 | repeater on battery or solar, companion |
| Seeed T1000-E, Wio Tracker L1 Pro | pocket companion |
| LilyGO T-Deck | messaging without a phone, with a keyboard |

> [!WARNING] The Heltec V4 transmits stronger than the setting
> The board has a power amplifier after the radio chip: `set tx 22` gives about 28 dBm, over the
> limit with an ordinary antenna. MeshCore's FAQ gives 10 dBm in the app for 22 dBm out [^faq].
> Work out the value for your antenna in [MeshCore settings in Sweden](../radioinstallningar/#sändeffekt-och-antenn).

> [!NOTE]- ESP32 or nRF52?
> The ESP32 boards have Wi-Fi, which an observer needs to send what it hears to the map; see
> [The map and observers](../visa-pa-kartan/). The nRF52 boards have no Wi-Fi but are built for low
> power draw, going by the manufacturers' own figures: the Heltec T114 draws about 11 µA in deep
> sleep and about 9 mA active with GPS and screen off [^t114], and the RAK4631 2.0 µA in sleep [^rak].
> That is why people choose nRF52 for a solar repeater, where every milliampere counts; see
> [Solar nodes](../solnoder/). We haven't found a direct comparison of the two chip families in MeshCore.
>
> The T-Deck can also run MeshCore without a phone. That firmware is free, but deeper map zoom and
> remote administration are unlocked for 10 dollars per device [^faq].

## Next steps {#nästa-steg}

- [Choose and flash firmware](../flasha-firmware/) on the board.
- [Get started with a companion](../companion/), then [Your first message](../forsta-meddelandet/).
- [Build a repeater](../bygg-en-repeater/) and [Set up a repeater](../repeater/).

## Sources {#källor}

[^flasher]: MeshCore, [the web flasher's device list](https://flasher.meshcore.io/config.json), read November 18, 2026.
[^v3]: Heltec, [WiFi LoRa 32 V3](https://heltec.org/project/wifi-lora-32-v3/).
[^v4]: Heltec, [WiFi LoRa 32 V4](https://heltec.org/project/wifi-lora-32-v4/), 868 MHz.
[^t114]: Heltec, [Mesh Node T114](https://heltec.org/project/mesh-node-t114/).
[^rak]: RAKwireless, [RAK4631 datasheet](https://docs.rakwireless.com/product-categories/wisblock/rak4631/datasheet/).
[^t1000e]: Seeed Studio, [SenseCAP Card Tracker T1000-E](https://www.seeedstudio.com/SenseCAP-Card-Tracker-T1000-E-for-Meshtastic-p-5913.html).
[^l1]: Seeed Studio, [Wio Tracker L1 Pro](https://www.seeedstudio.com/Wio-Tracker-L1-Pro-p-6454.html).
[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md), 4.9 and 7.7.
