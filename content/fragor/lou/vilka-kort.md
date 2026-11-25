---
title: "Vilka kort finns lou för?"
category: lougrunder
weight: 50
date: 2026-11-21
lastmod: 2026-11-25
---

I lou-20:

| Grund | Kort | Varianter |
|---|---|---|
| Observer (kort med wifi, ESP32) | 33 | auto-svar, fjärrstyrning eller båda |
| Vanlig MeshCore | 93 | auto-svar, fjärrstyrning över meshen eller båda |

lou byggs bara för repeatrar, inte för companion eller room server.
[Firmwareväljaren]({{< param "firmware.picker" >}}) visar vad som finns för just ditt kort.

Från lou-20 finns fjärrstyrning också för korten utan wifi. Wio-E5 mini har ingen fil med båda,
eftersom den inte får plats i kortets minne. Auto-svar och fjärrstyrning finns var för sig.
