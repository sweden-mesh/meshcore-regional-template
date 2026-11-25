---
title: "Administrera repeatern från appen"
seoTitle: "Administrera en MeshCore-repeater på distans"
description: "Logga in som administratör på din MeshCore-repeater från appen, över radio och via andra repeatrar: vad du kan ändra och vad som kräver USB."
weight: 61
group: repeater
date: 2026-11-18
lastmod: 2026-11-25
---

När repeatern sitter i masten når du den inte med en USB-kabel. Du kan i stället logga in på den
som administratör från MeshCore-appen, över radio. Inloggningen går också via andra repeatrar:
känner appen ingen väg till repeatern skickas den som flood, annars direkt längs vägen [^login].

## Logga in

1. Se till att repeatern finns bland kontakterna i appen. Den hamnar där när din radio har hört
   dess advert.
2. Välj repeatern och logga in med **administratörslösenordet**.
3. När du är inloggad kan du läsa av repeatern och skicka kommandon till den.

Lösenordet är `password` från fabriken [^cli]. Byt det innan repeatern sätts upp, i
[USB-konsolen](../usb-konsol/):

```text {title="Konsol"}
password ditt-nya-lösenord
```

Den som kan lösenordet blir administratör [^cli]. Välj ett eget, långt lösenord.

## Vad du kan ändra

De flesta kommandon i MeshCores [CLI-referens](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md)
går att skicka från appen, till exempel namn, sändeffekt, regioner och adverts. Några går bara över
USB [^cli]:

- frekvensen (`set freq`),
- radering och fabriksåterställning (`erase`),
- att läsa ut nodens privata nyckel (`get prv.key`),
- statistik och loggen som skrivs till konsolen.

Ändra inte radioinställningarna på distans om du inte är säker: blir de fel hör repeatern inte
längre nätet, och då når du den bara med kabel igen.

> [!NOTE]- Appen ber mig vänta
> I mobilappen kan väntetiden för fjärradministration över radio låsas upp med ett köp i appen
> [^faq]. Själva fjärradministrationen fungerar utan.

## Fjärrstyrning via internet

En repeater med [Specialfirmware lou](../firmware-lou/) kan också styras med signerade
kommandon, via internet eller över meshen, utan att du behöver vara inom radioräckhåll. Det är ett tillägg; inloggningen ovan fungerar med vanlig
MeshCore.

## Källor

[^login]: MeshCore, `sendLogin` i [BaseChatMesh.cpp](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.cpp) (flood när vägen är okänd, annars direkt), och vägtyperna i [paketformatet](https://github.com/meshcore-dev/MeshCore/blob/main/docs/packet_format.md).
[^cli]: MeshCore, [CLI-referensen](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md): `password`, standardvärdet `password`, och vilka kommandon som bara går över seriell port.
[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md).
