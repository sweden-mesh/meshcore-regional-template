---
title: "Jag har glömt repeaterns adminlösenord"
description: "Har du glömt repeaterns adminlösenord? Det går att byta utan det gamla, men bara med USB-kabel. Så sätter du ett nytt lösenord i konsolen."
category: repeater
weight: 30
date: 2026-11-13
lastmod: 2026-11-16
---

## Kontrollera

Lösenordet i appen är repeaterns *admin*-lösenord, inte gästlösenordet. Anslut repeatern med
USB och skriv `ver` i [USB-konsolen](../../guider/usb-konsol/). Svarar den med versionen och
byggdatumet fungerar konsolen, och du kan byta lösenordet där.

## Åtgärda

Lösenordet kan bytas utan det gamla, men bara med en kabel. Anslut repeatern till datorn,
öppna [USB-konsolen](../../guider/usb-konsol/) och skriv:

```sh {title="Konsol"}
password <nytt-lösenord>
```

Högst 15 tecken. Repeatern sparar det direkt och svarar `password now: <nytt-lösenord>`, så att
du ser att det blev rätt.

> [!CAUTION] Byt standardlösenordet
> En repeater med standardlösenordet `password` kan styras av vem som helst inom räckhåll.

## Så vet du att det fungerar

Inloggningen från appen fungerar med det nya lösenordet.

## Fungerade inte?

- **Konsolen svarar inte:** se [Skicka kommandon via USB](../../guider/usb-konsol/) och
  [Webbläsaren hittar ingen port](../ingen-port/).
- **Lösenordet är rätt, men inloggningen på distans misslyckas ändå:** då når inte din radio
  repeatern. Se [Jag hör andra, men de hör inte mig](../hor-andra-men-inte-mig/).
