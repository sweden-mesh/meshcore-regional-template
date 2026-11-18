---
title: "The times are off by one or two hours"
description: "Are the times in packets and logs off by one or two hours? Usually the observer has no time zone set. Here's how to check the clock and fix it."
url: /en/troubleshooting/wrong-time/
category: mqtt
weight: 20
date: 2026-11-13
lastmod: 2026-11-16
---

## Likely causes {#troliga-orsaker}

1. **The time zone isn't set.** The observer gets the time over the internet (NTP) in UTC and converts
   it using the time zone. Without one, the time stays in UTC, one or two hours off in Sweden.
2. Without Wi-Fi the radio has no time source, and the clock stays at whatever it last got.

## Check {#kontrollera}

```sh {title="Console"}
get timezone
clock
```

## Fix {#åtgärda}

```sh {title="Console"}
set timezone Europe/Stockholm
```

Summer and winter time are then handled automatically.

## How to tell it worked {#så-vet-du-att-det-fungerar}

`clock` shows the same time as your phone.

## Didn't work? {#fungerade-inte}

- **The clock doesn't run at all, or is stuck:** the observer has no internet connection and can't
  get the time. See [The observer keeps losing Wi-Fi](../wifi-tappar/).
- **The time is right but nothing shows on the map:** see
  [The observer doesn't report to the map](../observer-syns-inte/).
