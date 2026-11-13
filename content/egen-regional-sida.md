---
title: "Starta en sida för din region"
description: "Den här sidan är byggd på en öppen mall. Så startar du en likadan sida för ditt län, med egen karta och egna guider."
---

MeshCore är ett nät utan centrum, och informationen om nätet kan vara det också. Den här sidan är
byggd på [meshcore-regional-template](https://github.com/sweden-mesh/meshcore-regional-template),
en öppen mall som vilket län som helst kan använda.

## Det här får du

- En startsida med en **karta som visar nätet live**: repeatrar, länkar och paket i rörelse.
- **Guider** och **verktyg** för companions och repeatrar, med ditt läns region och inställningar
  ifyllda.
- Allt räknas fram ur länskoden: länets namn och region hämtas från den gemensamma listan över
  svenska regionnamn.

## Det här behöver du

1. **Ett GitHub-konto** (eller annan git-tjänst) för din sidas kod.
2. **En plats att lägga sidan**: allt är statiska filer, så Cloudflare Pages, GitHub Pages,
   Codeberg Pages eller vilket webbhotell som helst fungerar.
3. **En Beacon-server** för livekartan, med de observatörer som finns i ditt län. Den kan du köra
   själv eller dela med en grannregion.
4. Gärna ett eget domännamn.

## Så går det till

1. Kopiera `exampleSite/` från mallen till ett eget repo.
2. Ange länskoden (`region.scb`), IATA-koderna för länets observatörer, kartans mittpunkt och
   adressen till din Beacon i `hugo.toml`.
3. Skriv din egen ingress och en sida om er.
4. Bygg med Hugo och lägg upp.

Felsökningen och guiderna kommer från mallen och uppdateras när mallen gör det. Vill ni lägga
till en egen felsökningspost, skriva om en eller dölja en gör ni det med en fil i ert eget repo;
inget behöver kopieras.

Steg för steg står i mallens
[README](https://github.com/sweden-mesh/meshcore-regional-template#readme). Förbättringar av
mallen görs med pull requests och kommer alla regioner till godo.
