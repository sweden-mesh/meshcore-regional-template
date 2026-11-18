---
title: "MQTT Observer 1.18"
description: "MQTT Observer v1.18.0 på svenska: agessamans firmware för observatörer bygger nu på MeshCore 1.18, med sex brokerplatser och uppdatering över wifi."
group: observer
release: {product: observer, version: "1.18.0"}
date: 2026-11-09
lastmod: 2026-11-18
checkedOn: 2026-11-18
---

MQTT Observer är agessamans firmware för en repeater som också rapporterar vad den hör, över wifi
till en MQTT-server. Det är så kartan här och andra kartor får sina paket. Version 1.18.0 bygger på
MeshCore 1.18.0, och den stabila versionen byggdes senast den 9 november 2026 [^rel]. Vad som är nytt i
själva MeshCore står i [MeshCore 1.18](../meshcore-1-18/).

## Det här finns i versionen

- **Upp till sex MQTT-servrar samtidigt**, med färdiga val för bland annat MeshMapper och flera
  amerikanska nät [^rel]. Kartan i Sverige har inget eget färdigval där; hur din observer kommer med
  på kartan står i [Kartan och observatörer](../../guider/visa-pa-kartan/).
- **Inloggning** med användarnamn och lösenord, eller med en signerad nyckel (JWT, Ed25519) [^rel].
- **En inställningssida i noden själv** som du når med webbläsaren, och USB-konsolen som förut
  (115200 baud) [^rel].
- **Uppdatering över wifi.** `ota branch prod` eller `ota branch beta` väljer stabil version eller
  betaversion, och `ota update` hämtar den [^rel].
- **Grannar rapporteras** till servern på de kort som klarar det [^rel].

Firmwaren som lou-versionerna bygger på är just den här; se [lou-firmware](../../guider/firmware-lou/).

## Källor

[^rel]: agessaman/MeshCore, [MQTT Observer Firmwares](https://github.com/agessaman/MeshCore/releases/tag/observer-mqtt-latest) (taggen `observer-mqtt-latest`), och [instruktionerna](https://github.com/agessaman/MeshCore/blob/observer-firmware/MQTT_IMPLEMENTATION.md).
