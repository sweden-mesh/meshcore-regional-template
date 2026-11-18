---
title: "EasySkyMesh PowerSaving 18"
description: "EasySkyMesh PowerSaving 18 (22 oktober 2026) på svenska: den strömsnåla MeshCore-firmwaren bygger på 1.18 och får fler kommandon, även för companions."
group: easyskymesh
release: {product: easyskymesh, version: "18"}
date: 2026-10-22
lastmod: 2026-11-18
checkedOn: 2026-11-18
---

EasySkyMesh är IoTThinks strömsnåla version av MeshCore. Den drar mycket mindre ström, vilket gör
den till ett vanligt val för [solnoder](../../guider/solnoder/). PowerSaving 18 kom den 22 oktober 2026
och bygger på MeshCore 1.18 [^rel]. Du flashar den från [easyskymesh.com](https://easyskymesh.com/)
eller som ”Custom Firmware” i MeshCores webbflasher; se [Välj och flasha firmware](../../guider/flasha-firmware/).

## Det här är nytt

- **Strömsparläget är på från start** i en ny installation, för repeater, room server, companion och
  sensor. Det går att ändra från kommandoraden, och valet sparas över en omstart [^rel].
- **Samma kommandon på companions** som på repeatrar: `powersaving on` och `powersaving off`,
  `set radio.rxps balanced` (eller `off`, `overdrive`) och `get radio.rxps` [^rel].
- **`set radio.fem.rxgain off`** för Heltec V4.3, V4.3 R8, Tracker v2 och T096 [^rel].
- **GPS med strömsparläge:** en repeater eller room server slår på GPS:en en gång om dagen i högst
  tio minuter; en companion var 30:e minut och när någon ber om telemetri [^rel].
- **Batterispänning och strömsparläge** syns på repeaterns skärm, och companions visar drifttid [^rel].

## Innan du uppdaterar

- **Station G3 som BLE-companion:** partitionen har blivit större. Exportera inställningarna, gör en
  ny installation med `merged.bin` och importera dem igen [^rel].
- **T-Echo:** det finns rapporter om sämre mottagning. Tills vidare: `set radio.rxps off` [^rel].

## Källor

[^rel]: IoTThinks/EasySkyMesh, [PowerSaving 18: For Power Users with More CLI Controls](https://github.com/IoTThinks/EasySkyMesh/releases/tag/PowerSaving18), 22 oktober 2026, med anteckningar 29 och 30 oktober (på engelska).
