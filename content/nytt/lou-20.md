---
title: "lou-20"
description: "lou-20 (24 november 2026) på svenska: fjärrstyrning på kort utan wifi, auto-svar i #test-se och nya namn på kommandona."
group: lou
date: 2026-11-24
lastmod: 2026-11-25
checkedOn: 2026-11-25
---

lou-20 kom den 24 november 2026 [^rel]. lou är repeaterfirmware från sweden-mesh som lägger till
auto-svar och fjärrstyrning i MeshCore 1.18; se [Specialfirmware lou](../../guider/firmware-lou/).
Välj din fil i [firmwareväljaren]({{< param "firmware.picker" >}}). För ESP32-kort flashar den direkt
från webbläsaren.

## Har du redan fjärrstyrning: kommandona har nya namn

Inställningarna heter inte längre `mqtt.cmd`. De gamla namnen finns inte kvar: en nod med lou-20
svarar att den inte känner igen dem.

| lou-18 | lou-20 |
|---|---|
| `set mqtt.cmd on`, `set mqtt.cmd off`, `get mqtt.cmd` | `set cmd on`, `set cmd off`, `get cmd` |
| `set mqtt.cmd.pubkey <nyckel>` | `set cmd.pubkey <nyckel>` |
| `mqtt.cmd ping` | `cmd ping` |

Dina inställningar följer med vid uppdateringen: kommandonyckeln, räknaren och serverplatsen. En nod
som ställts in med `set mqtt.cmd on <server>` behöver `set cmd on <server>` en gång till efteråt.
[mccontrol](https://mccontrol.meshcoresverige.se) klarar både lou-18 och lou-20 och väljer själv.

## Nytt

- **Fjärrstyrning på kort utan wifi.** Vanliga repeaterkort (nRF52, RP2040, STM32 och ESP32 utan
  Observer) tar signerade kommandon över meshen, från din companion eller genom en av dina egna
  Observer-repeatrar. Se [Fjärrstyrning utan wifi](../../guider/firmware-lou/#fjärrstyrning-utan-wifi).
- **Ingen region behövs för fjärrstyrning.** Repeatern nås på sin egen nyckel. Kommandon och svar
  är krypterade mellan repeatern och ägaren, och servern kan inte läsa dem.
- **Repeatern hör av sig till ägaren.** En Observer-repeater skickar ett krypterat livstecken
  ungefär var 15:e minut. Så hittar mccontrol dina repeatrar utan att du letar.
- **Auto-svar i `#test-se`.** Repeatrar svarar nu på `test` också i hela landets testkanal. Svaren
  kostar sändningstid i hela landet: skicka ett `test`, vänta två minuter och upprepa det inte.
  Testa helst i länets egen kanal.
- **Byta kommandonyckel på distans** med `rekey`, signerat med den nuvarande nyckeln.

## Bra att veta

- Uppdateringen över wifi från lou-18 är provad: `ota update` i konsolen, och inställningarna finns
  kvar.
- En nod svarar över radio inom en egen sändningsbudget. Är den slut kommer inget svar alls. Vänta
  några minuter och skicka igen.
- lou-20 tar fortfarande emot det äldre sättet att styra, så ett äldre verktyg når noden. lou-21
  tar bort det, tidigast en månad efter lou-20.
- Kort utan wifi uppdateras med USB eller Bluetooth.

## Källor

[^rel]: sweden-mesh, [v1.18.0-lou-20 på GitHub](https://github.com/sweden-mesh/MeshCore-lou/releases/tag/v1.18.0-lou-20) (på engelska), 24 november 2026.
