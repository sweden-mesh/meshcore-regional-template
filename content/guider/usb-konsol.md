---
title: "Skicka kommandon via USB"
description: "Repeatrar och room servers ställs in med textkommandon. Så öppnar du konsolen i webbläsaren och skickar dem."
weight: 60
source:
  title: "Vad är MeshCore? (avsnittet Skriv kommandon i Console)"
  url: "https://meshat.se/meshcore/meshcore-info/#skriv-kommandon-i-console"
  license: "CC BY 4.0"
  changes: "Utbyggt till en egen guide med vanliga kommandon och felsökning."
---

Repeatrar och room servers har ingen app för alla inställningar. De ställs in med korta
textkommandon, som `set name` eller `region`, i en **seriell konsol**: ett fönster där du skriver
till radion via USB-kabeln.

## Öppna konsolen

1. Anslut radion till datorn med en USB-kabel som klarar data.
2. Öppna [MeshCore Flasher]({{< param "firmware.flasher" >}}) i Chrome eller Edge.
3. Klicka på **Console** uppe till höger.
4. Välj radions port när webbläsaren frågar.
5. Skriv ett kommando och tryck Enter. **Vänta på svaret** innan du skickar nästa.

> [!TIP] En i taget
> Radion tar emot ett kommando i taget. Skickar du flera på en gång kan några tappas bort.
> `reboot` startar om radion, och konsolen tappar då anslutningen; anslut igen efteråt.

## Bra att kunna

```text {title="Visa inställningar"}
get name
get radio
region
```

```text {title="Grannar som repeatern har hört"}
neighbors
```

```text {title="Skicka en advert nu"}
advert
```

```text {title="Starta om"}
reboot
```

Inställningarna för en repeater går [Sätt upp en repeater](../repeater/) igenom. Alla kommandon
finns i MeshCore-projektets [kommandolista](https://docs.meshcore.io/cli_commands/).

## Fjärradministration

Står repeatern i en mast kan du skicka samma kommandon via radio: lägg till den som kontakt i
appen, logga in med administratörslösenordet och öppna dess kommandorad. Det fungerar så länge
du når repeatern över nätet, men ta det försiktigt: ett fel radiokommando kan göra att du inte
når den igen utan att klättra upp.

## Om något krånglar

> [!NOTE]- Ingen port att välja
> Byt till en kabel som klarar data, prova en annan USB-port och stäng andra program som kan
> använda porten (till exempel ett annat konsolfönster).

> [!NOTE]- Inget svar på kommandon
> Kontrollera att radion har repeater- eller room server-firmware; en companion svarar inte på
> konsolkommandon på samma sätt. Vänta några sekunder efter anslutningen innan första kommandot.
