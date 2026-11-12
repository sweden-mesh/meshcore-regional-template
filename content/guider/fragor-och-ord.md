---
title: "Vanliga frågor och ordlista"
description: "Korta svar på det folk brukar undra över MeshCore, och vad orden betyder."
weight: 110
---

## Vanliga frågor

> [!NOTE]- Behöver jag licens för att sända?
> Nej. MeshCore använder 868 MHz-bandet, som är fritt att använda med de begränsningar som gäller
> där, bland annat högsta sändeffekt och hur stor del av tiden man får sända (duty cycle). Med
> regionens standardinställningar håller du dig inom dem.

> [!NOTE]- Hur långt når en radio?
> Det beror nästan helt på höjd och fri sikt. Inomhus når en companion kanske några hundra meter;
> från en mast eller ett berg når en repeater flera mil. Därför är repeatrar högt upp så värdefulla.

> [!NOTE]- Är mina meddelanden privata?
> Direktmeddelanden och privata kanaler är krypterade. Public och hashtag-kanaler kan alla läsa,
> och observatörer kan spela in dem. Se [Kanaler](../kanaler/).

> [!NOTE]- Kan MeshCore och Meshtastic prata med varandra?
> Nej. De kan köras på samma kort, men det är olika system som inte hör varandra.

> [!NOTE]- Mitt meddelande kom inte fram. Varför?
> Vanligast: mottagaren var utom räckhåll för alla repeatrar, regionen saknades på någon repeater
> längs vägen, eller två sändningar krockade. Försök igen om en stund, och kontrollera regionen i
> [Regioner](../regioner/).

> [!NOTE]- Varför syns inte min repeater på kartan?
> Kartan visar det observatörerna hör. Din repeater syns när den har skickat en advert och en
> observatör har hört den. Ingen observatör nära? Gör din egen till en, se
> [Visa din repeater på kartan](../visa-pa-kartan/).

> [!NOTE]- Vem äger nätet?
> Ingen. Varje repeater ägs av den som satt upp den. Det finns ingen central server; kartan och den
> här sidan är tillägg, inte en förutsättning.

## Ordlista

Advert
: Ett kort paket där en nod talar om att den finns, med namn, typ och ibland position.

Companion
: Din personliga radio, som du använder med appen. För inte vidare andras trafik.

Duty cycle
: Hur stor del av tiden en sändare får sända. 10 procent på 869,618 MHz.

Firmware
: Programvaran i radion. *Flasha* betyder att installera den.

Flood
: Ett paket som varje repeater sänder vidare en gång, tills det nått så långt det kan.

LoRa
: Radiotekniken: lång räckvidd, låg datahastighet, låg strömförbrukning.

Nod
: En radio i nätet: companion, repeater, room server eller sensor.

Observatör
: En repeater som också rapporterar vad den hör till en server via wifi, så att det syns på kartan.

Region (scope)
: En etikett på ett paket som avgör vilka repeatrar som för det vidare. Här
  `{{< region "scope" >}}`.

Repeater
: En nod som tar emot och sänder vidare trafik, oftast högt placerad.

Room server
: En nod som lagrar meddelanden i gemensamma rum.

Väg (path)
: Repeatrarna ett paket passerat på väg till mottagaren.
