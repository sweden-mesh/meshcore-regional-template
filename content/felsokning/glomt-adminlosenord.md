---
title: "Jag har glömt repeaterns adminlösenord"
description: "Appen säger att lösenordet är fel när du försöker logga in på distans."
category: repeater
weight: 30
---

## Åtgärda

Lösenordet kan bytas utan det gamla, men bara med en kabel. Anslut repeatern till datorn,
öppna [USB-konsolen](../../guider/usb-konsol/) och skriv:

```sh {title="Konsol"}
password <nytt-lösenord>
```

Högst 15 tecken. Repeatern svarar med det nya lösenordet.

> [!WARNING] Byt standardlösenordet
> En repeater med standardlösenordet `password` kan styras av vem som helst inom räckhåll.

## Så vet du att det fungerar

Inloggningen från appen fungerar med det nya lösenordet.
