---
title: "Start a site for your region"
description: "This site is built on an open template. Here is how to start a site like it for your county, with its own map and its own guides."
url: /en/regional-site/
lead: false
date: 2026-11-12
lastmod: 2026-11-14
---

MeshCore is a network without a center, and the information about the network can be too. This site is
built on [meshcore-regional-template](https://github.com/sweden-mesh/meshcore-regional-template),
an open template that any county can use.

## What you get {#det-här-får-du}

- A home page with a **map that shows the network live**: repeaters, links and packets on the move.
- **Guides** and **wizards** for companions and repeaters, with your county's region and settings
  filled in.
- Everything is derived from the county code: the county's name and region come from the shared list of
  Swedish region names.

## What you need {#det-här-behöver-du}

1. **A GitHub account** (or another git service) for your site's code.
2. **A place to host the site**: everything is static files, so Cloudflare Pages, GitHub Pages,
   Codeberg Pages or any web host works.
3. **A Beacon server** for the live map, with the observers in your county. You can run it
   yourself or share one with a neighboring region.
4. Preferably your own domain name.

## How it works {#så-går-det-till}

1. Copy `exampleSite/` from the template into a repo of your own.
2. Set the county code (`region.scb`), the IATA codes of the county's observers, the map's center point and
   the address of your Beacon in `hugo.toml`.
3. Write your own introduction and a page about yourselves.
4. Build with Hugo and publish.

The troubleshooting, the FAQ and the guides come from the template and are updated when the template is. If you want to add
a troubleshooting entry or a question of your own, rewrite one or hide one, you do it with a file in your own repo;
nothing needs to be copied.

Step by step is in the template's
[README](https://github.com/sweden-mesh/meshcore-regional-template#readme). Improvements to
the template are made with pull requests and benefit every region.
