---
title: "MeshMapper-appen 1.4.2"
description: "MeshMapper-appen 1.4.2 (11 november 2026) på svenska: platsen används bara när radion är ansluten, export av alla sessioner och ett antal svar på scope."
group: meshmapper
release: {product: meshmapper-app, version: "1.4.2"}
date: 2026-11-11
lastmod: 2026-11-18
checkedOn: 2026-11-18
---

MeshMapper är appen och kartan som visar var nätet faktiskt når: du kör eller går med appen och din
companion, och varje lyckad ping blir en punkt på [kartan](https://swe.meshmapper.net/). Version 1.4.2 av
appen kom den 11 november 2026 [^rel]. Mer om MeshMapper i [För nodägare](../../guider/for-nodagare/#meshmapper).

## Platsen

- **Appen använder din plats i bakgrunden bara medan radion är ansluten.** Utan radio slutar GPS:en
  när du lämnar appen [^rel].
- **Android frågar inte längre efter ”Tillåt hela tiden”.** ”När appen används” räcker; körning i
  bakgrunden sker i appens egen tjänst, som visar en notis medan radion är ansluten [^rel].
- **Appen kollar att exakt plats är på** när du ansluter, eftersom ungefärlig plats är för grov för
  kartan [^rel].

## Annat nytt

- **Exportera alla offlinesessioner** på en gång: Settings > Data > Offline Sessions > Export all [^rel].
- **Antal svar på scope:** överst syns hur många repeatrar som svarade på en scope-förfrågan [^rel].
  Vad en scope är står i [Regioner](../../guider/regioner/).
- **Kartan minns** zoomen och panelerna som du lämnade dem [^rel].
- **Android får en position varje sekund** under färd, som iPhone, så att pingarna hamnar där du var [^rel].
- **Många rättningar** kring återanslutning, historiken och notiser på Android, och en krasch efter
  långa sessioner på Android 15 och senare [^rel].

Version 1.4.1 kom aldrig ut på Google Play; med 1.4.2 får Play-användare även de ändringarna [^rel].

## Källor

[^rel]: MeshMapper, [MeshMapper App v1.4.2](https://wiki.meshmapper.net/release-notes/app/v1.4.2/), 11 november 2026 (på engelska).
