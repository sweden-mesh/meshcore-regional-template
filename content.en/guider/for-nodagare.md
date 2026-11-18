---
title: "Tools for node owners"
seoTitle: "Tools for MeshCore node owners"
description: "The map, MeshMapper, live traffic, firmware, remote control, the solar calculator, the site test and the USB console: what each tool is for."
url: /en/guides/for-node-owners/
weight: 90
group: repeater
date: 2026-11-18
lastmod: 2026-11-18
---
If you have a repeater or an observer, these are the tools that help you. Under each heading is
what the tool does and when it is useful.

## The map {#kartan}

[The map on the home page](/#karta) shows the nodes the observers have heard and the links between them.
There you can see whether your node shows up and which nodes it hears. If it doesn't show up: [Your repeater on
the map](../visa-pa-kartan/).

## MeshMapper {#meshmapper}

[MeshMapper](https://swe.meshmapper.net/) shows where the mesh actually reaches. People drive, bike or walk
around with the app and their companion and ping the mesh along the way (wardriving), and every successful ping becomes a
point on the map. That way you can see whether a new repeater made a difference, and where it is still quiet. How
to contribute is in MeshMapper's [Getting started](https://wiki.meshmapper.net/app_getting_started/).

## Live traffic {#livetrafiken}

Below the map, "Latest packets" shows traffic as it is heard. Click a packet to see which nodes
it passed through. Useful when you want to know whether your repeater is passing traffic on.

## Firmware {#firmware}

[Choose and flash firmware](../flasha-firmware/) covers MeshCore's own firmware and how to
install it. If you want auto-replies to tests or remote control, there is [lou special
firmware](../firmware-lou/), which works together with standard MeshCore.

## Remote control {#fjärrstyrning}

Change settings on the repeater without going there. It requires lou firmware with remote control;
the [guided setup](/wizard/repeater-guidad/) turns it on, and [lou special
firmware](../firmware-lou/) explains how it works.

## Set up a repeater {#ställ-in-en-repeater}

The [quick setup](/wizard/repeater-snabb/) and the [guided setup](/wizard/repeater-guidad/)
configure a repeater from the browser over USB, with the region's values filled in. Quick if you know what
you want, guided if you want to know why.

## Solar sizing {#räkna-på-solcell}

The [solar calculator](/wizard/solcell/) works out how big a panel and how big a battery a repeater
needs to get through the winter where you live. Use it before you buy.

## Test a site {#testa-en-plats}

[Host a node: test your site](/wizard/nodvard/) helps you find out whether a site suits a repeater,
before you set it up.

## The USB console {#usb-konsolen}

In the [USB console](../usb-konsol/) you type commands straight to the node. For what the guides don't
do.

## Your own broker {#en-egen-broker}

[Your own broker](../egen-broker/) is for a region that wants to receive its repeaters' data and
commands on its own server. Most don't need it.
