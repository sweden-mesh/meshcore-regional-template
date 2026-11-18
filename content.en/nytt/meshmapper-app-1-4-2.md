---
title: "MeshMapper app 1.4.2"
description: "MeshMapper app 1.4.2 (November 11, 2026): location used only while the radio is connected, export of all sessions, and a count of scope replies."
url: /en/news/meshmapper-app-1-4-2/
group: meshmapper
release: {product: meshmapper-app, version: "1.4.2"}
date: 2026-11-11
lastmod: 2026-11-18
checkedOn: 2026-11-18
---

MeshMapper is the app and map that show where the mesh really reaches: you drive or walk with the app
and your companion, and every successful ping becomes a point on the [map](https://swe.meshmapper.net/).
Version 1.4.2 of the app came out on November 11, 2026 [^rel]. More about MeshMapper in
[For node owners](../../guider/for-nodagare/#meshmapper).

## Location {#platsen}

- **The app uses your location in the background only while the radio is connected.** With no radio,
  GPS stops when you leave the app [^rel].
- **Android no longer asks for "Allow all the time".** "While using the app" is enough; background
  wardriving runs in the app's own service, which shows a notification while the radio is connected [^rel].
- **The app checks that precise location is on** when you connect, because approximate location is too
  rough for the map [^rel].

## Also new {#annat-nytt}

- **Export all offline sessions** at once: Settings > Data > Offline Sessions > Export all [^rel].
- **Scope reply count:** the top bar shows how many repeaters answered a scope request [^rel]. What a
  scope is: [Regions](../../guider/regioner/).
- **The map remembers** the zoom and panels as you left them [^rel].
- **Android gets a position every second** while moving, like iPhone, so pings land where you were [^rel].
- **Many fixes** to reconnecting, history and Android notifications, and a crash after long sessions on
  Android 15 and newer [^rel].

Version 1.4.1 never reached Google Play; with 1.4.2, Play users also get those changes [^rel].

## Sources {#källor}

[^rel]: MeshMapper, [MeshMapper App v1.4.2](https://wiki.meshmapper.net/release-notes/app/v1.4.2/), November 11, 2026.
