---
title: "Regioner (scope)"
description: "Vad en region är i MeshCore, vilken region som gäller här och hur du ställer in den på en repeater."
weight: 30
source:
  title: "MeshCore-regioner"
  url: "https://meshat.se/meshcore/regioner/"
  license: "CC BY 4.0"
  changes: "Omskriven efter den svenska tvånivåmodellen (se + länets namn, inga kommunkoder); regionsvärden från sidans inställningar; verktyget ersatt av färdiga kommandon."
---

En **region** (i appen ibland *scope*) är en etikett på ett paket. Den talar om för repeatrarna
vilken trafik de ska föra vidare. En repeater som inte har regionen i sin lista låter paketet
vara, så trafik märkt med en region stannar inom det område där repeatrarna har den.

Regionen säger inget om var en nod står. Radiovågorna når lika långt som förut; det som ändras
är vilka repeatrar som sänder paketet vidare.

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

Länets namn bestäms av länet självt; finns inget beslut används ett uppmätt eller föreslaget
namn. Det finns inga kommunregioner.

> [!NOTE] `*` betyder inte "allt"
> `*` är trafik som saknar regionetikett, inte ett jokertecken för alla regioner.

## Ställ in en repeater

Repeatern behöver alla regioner som trafiken genom den ska kunna ha: ingen etikett (`*`),
`se` och länets region.

### I appen

1. Öppna repeatern som kontakt och logga in som administratör.
2. Gå till inställningarna för regioner (*Manage Regions*).
3. Lägg till `se` och `{{< region "scope" >}}`.
4. Se till att *Allow Flood* är på för varje region, också för `*`.
5. Spara.

Menyernas namn kan skilja sig mellan appversioner.

### Med kommandon

Kommandona skrivs ett i taget i en seriell konsol, till exempel *Console* i
[MeshCore Flasher](https://meshcore.io/flasher), eller via fjärradministration i appen.

```text {title="Visa nuvarande regioner"}
region
```

```text {title="Skapa regionerna"}
region def se {{< region "scope" >}}
```

```text {title="Tillåt trafik utan regionetikett"}
region allowf *
```

```text {title="Spara"}
region save
```

`region def` bygger en kedja: `se` hamnar under `*` och `{{< region "scope" >}}` under `se`.
Kedjan styr bara hur regionerna visas, inte vad som förs vidare.

> [!TIP] Repeatrar nära länsgränsen
> En repeater som också når grannlänets repeatrar kan ha grannlänets region i listan, så att
> trafik mellan länen kommer fram. Lägg bara till regioner för län du faktiskt når.

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

## Vanliga frågor

> [!NOTE]- Når mina meddelanden kortare med en mindre region?
> Nej. Radiosignalen når lika långt. Skillnaden är att repeatrar utan regionen inte sänder
> paketet vidare.

> [!NOTE]- Måste jag använda region?
> Nej. Trafik utan region förs vidare som förut. Regioner är ett sätt att spara sändningstid
> när nätet växer.

## Läs mer

- [MeshCore CLI: Region Management](https://docs.meshcore.io/cli_commands/#region-management-v110)
- [Vad är MeshCore?](../vad-ar-meshcore/)
