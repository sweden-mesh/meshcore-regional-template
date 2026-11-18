---
title: "Repeatern hörs dåligt fast inställningarna ser rätt ut"
seoTitle: "MeshCore-repeatern hörs dåligt: fel kodningshastighet"
description: "Frekvens, bandbredd och spreading factor stämmer, men repeatern hör bara de närmaste, eller bara ibland."
category: radio
weight: 50
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

## Troliga orsaker

1. **Fel kodningshastighet (CR).** Firmwarens standard är `869.618,62.5,8,5`, alltså CR 5, men
   nätet använder CR {{< param "radio.cr" >}} ([CLI-referensen](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md), `set radio`). En repeater där
   bara frekvensen ändrats har kvar CR 5.
2. Antennen eller platsen; se [Räckvidden är mycket kortare än väntat](../kort-rackvidd/).

## Kontrollera

```sh {title="Konsol"}
get radio
```

Svaret ska sluta på `,{{< param "radio.cr" >}}`.

## Åtgärda

Sätt hela raden på en gång och starta om:

```sh {title="Konsol"}
set radio {{< param "radio.freq" >}},{{< param "radio.bw" >}},{{< param "radio.sf" >}},{{< param "radio.cr" >}}
reboot
```

## Så vet du att det fungerar

`get radio` visar alla fyra värdena som ovan, och `neighbors` listar fler repeatrar efter en
stund.

## Fungerade inte?

Gå igenom [Radion hör inga repeatrar](../hor-inga-repeatrar/). Värdena och varför de är just de
här: [MeshCore-inställningar i Sverige](../../guider/radioinstallningar/).
