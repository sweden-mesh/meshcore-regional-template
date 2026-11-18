---
title: "Regioner (scope)"
description: "Vad en region (scope) är i MeshCore, vilken region som gäller här, hur du ställer in den på en repeater, och kommunregioner och offgrid."
weight: 30
group: regioner
source:
  title: "MeshCore-regioner"
  url: "https://meshat.se/meshcore/regioner/"
  license: "CC BY 4.0"
  changes: "Omskriven efter den svenska tvånivåmodellen (se + länets namn, inga kommunkoder); regionsvärden från sidans inställningar; verktyget ersatt av färdiga kommandon."
date: 2026-11-12
lastmod: 2026-11-18
---

En **region** (i appen ibland *scope*) är en etikett på ett paket. Den talar om för repeatrarna
vilken trafik de ska föra vidare. En repeater som inte har regionen i sin lista låter paketet
vara, så trafik märkt med en region stannar inom det område där repeatrarna har den.

Regionen säger inget om var en nod står. Radiovågorna når lika långt som förut; det som ändras
är vilka repeatrar som sänder paketet vidare.

{{< diagram "region" >}}

## Varför

Utan regioner kan ett meddelande floodas över långt större område än någon behöver, och varje
sändning upptar frekvensen för alla inom hörhåll. Med regioner hålls lokal trafik lokal, och
nationell trafik når ändå hela landet.

## Regionerna här

Sverige använder två nivåer:

| Region | Används för |
|---|---|
| `se` | Trafik för hela Sverige |
| `{{< region "scope" >}}` | Trafik inom {{< region "name" >}} |
| (ingen) | Trafik utan regionetikett; i listan heter den `*` |

{{< settings >}}

Länets namn bestäms av länet självt; finns inget beslut används ett uppmätt eller föreslaget
namn. Alla läns namn finns i [meshcore-se-regioner](https://github.com/zombiefredrik/meshcore-se-regioner).
Kommunregioner använder vi inte; se [Kommuner och offgrid](#kommuner-och-offgrid).

> [!WARNING] `*` betyder inte "allt"
> `*` är trafik som saknar regionetikett, inte ett jokertecken för alla regioner.

## Ställ in en repeater

Repeatern behöver alla regioner som trafiken genom den ska kunna ha: ingen etikett (`*`),
`eu` och `europe`, `se` och länets region. Länet blir också repeaterns hemregion och `se` dess
standardregion. Regionkommandona finns sedan firmware 1.10 [^cli]; hemregion och standardregion
kräver repeater-firmware 1.16 eller senare.

### I appen

1. Öppna repeatern som kontakt och logga in som administratör.
2. Gå till inställningarna för regioner (*Manage Regions*).
3. Lägg till `eu`, `europe`, `se` och `{{< region "scope" >}}`.
4. Se till att *Allow Flood* är på för varje region, också för `*`.
5. Spara.

Menyernas namn kan skilja sig mellan appversioner.

### Med kommandon

Kommandona skrivs ett i taget i en seriell konsol, till exempel *Console* i
[MeshCore Flasher](https://meshcore.io/flasher), eller via fjärradministration i appen.

```text {title="Visa nuvarande regioner"}
region
```

```text {title="Tillåt trafik utan regionetikett, högst 16 hopp"}
set flood.max.unscoped 16
region allowf *
```

```text {title="Skapa regionerna"}
region def eu|* europe|eu se {{< region "scope" >}}
```

```text {title="Länet som hemregion, se som standardregion"}
region home {{< region "scope" >}}
region default se
```

```text {title="Spara"}
region save
```

`region def` bygger en kedja: `eu` och `europe` hamnar bredvid varandra, `se` under `eu` och
`{{< region "scope" >}}` under `se`. Kedjan styr bara hur regionerna visas, inte vad som förs
vidare.

Hemregionen används inte för vidarebefordran; firmware med autosvar tar sin testkanal därifrån.
Standardregionen är det scope repeaterns egna adverts skickas med: med `se` når de hela Sverige.

> [!TIP] Repeatrar nära länsgränsen
> En repeater som också når grannlänets repeatrar kan ha grannlänets region i listan, så att
> trafik mellan länen kommer fram. Lägg bara till regioner för län du faktiskt når. Även en
> sådan kantrepeater tillåter trafik utan regionetikett (`region allowf *`).

## Vilken region ska ett meddelande ha?

Välj den minsta region som når dem kanalen är till för.

| Kanalen är till för | Region |
|---|---|
| alla som hör den, utan avgränsning | ingen |
| hela Sverige | `se` |
| {{< region "name" >}} | `{{< region "scope" >}}` |

> [!IMPORTANT] Hela vägen måste ha regionen
> Ett paket med en region kommer bara fram genom repeatrar som har den regionen. Saknar en
> repeater mitt i vägen den, stannar trafiken där.

## Kommuner och offgrid

Du kan se två andra sorters etiketter, bland annat i [meshat.se:s regionguide](https://meshat.se/meshcore/regioner/):

Kommunregioner
: `se` följt av kommunkoden, till exempel `se0180` för Stockholms kommun. De begränsar trafik till
  en kommun.

`offgrid`
: Trafik för noder som ägaren själv bedömer har reservkraft, som batteri eller sol. Etiketten har
  ingen gemensam definition.

Vi rekommenderar länets region och `se`, inget annat. Ett paket med en region kommer bara fram
genom repeatrar som har just den regionen, så varje extra etikett måste finnas på alla repeatrar
längs vägen för att fungera. Två nivåer är lätta att hålla lika i hela länet, och länens namn
finns samlade på ett ställe. Använder ett lokalt nät redan kommunregioner kan en repeater ha
dem i listan också, utöver länets.

## Vanliga frågor

> [!NOTE]- Når mina meddelanden kortare med en mindre region?
> Nej. Radiosignalen når lika långt. Skillnaden är att repeatrar utan regionen inte sänder
> paketet vidare.

> [!NOTE]- Betyder `*` alla regioner?
> Nej. `*` är trafik som saknar regionetikett. En repeater med `region allowf *` för vidare
> sådan trafik, men inte trafik med en region den saknar.

> [!NOTE]- Är regionen samma sak som IATA-koden?
> Nej. Regionen styr vilka repeatrar som för trafiken vidare. IATA-koden är en etikett som
> observatörer sätter på det de rapporterar till kartan, och den påverkar inte meshnätet. Se
> [Din repeater på kartan](../visa-pa-kartan/).

> [!NOTE]- Måste jag använda region?
> Nej. Trafik utan region förs vidare som förut. Regioner är ett sätt att spara sändningstid
> när nätet växer.

## Läs mer

- Felsökning: [Trafiken går inte över länsgränsen](../../felsokning/trafik-gar-inte-over-lansgransen/), [Hemregionen är borta efter en omstart](../../felsokning/region-home-forsvinner/) och [Kommandot region def ger fel](../../felsokning/region-def-fungerar-inte/)
- [MeshCore CLI: Region Management](https://docs.meshcore.io/cli_commands/#region-management-v110)
- [Vad är MeshCore?](../vad-ar-meshcore/)

## Källor

[^cli]: MeshCore, [CLI-referensen](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md), Region Management (v1.10+).
