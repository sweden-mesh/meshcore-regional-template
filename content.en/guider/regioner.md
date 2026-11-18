---
title: "Regions (scope)"
description: "What a region (scope) is in MeshCore, which region applies here, how to set it on a repeater, and municipal regions and offgrid."
url: /en/guides/regions/
weight: 30
group: regioner
source:
  title: "MeshCore-regioner"
  url: "https://meshat.se/meshcore/regioner/"
  license: "CC BY 4.0"
  changes: "Rewritten for the Swedish two-level model (se + the county's name, no municipal codes); region values from the site's settings; the tool replaced by ready-made commands."
date: 2026-11-12
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

A **region** (sometimes called *scope* in the app) is a label on a packet. It tells the repeaters
which traffic to pass on. A repeater that does not have the region in its list leaves the packet
alone, so traffic labeled with a region stays within the area where the repeaters have it.

The region says nothing about where a node is. The radio waves reach as far as before; what changes
is which repeaters send the packet on.

{{< diagram "region" >}}

## Why {#varför}

Without regions, a message can be flooded over a far larger area than anyone needs, and every
transmission occupies the frequency for everyone within earshot. With regions, local traffic stays
local, and national traffic still reaches the whole country.

## The regions here {#regionerna-här}

Sweden uses two levels:

| Region | Used for |
|---|---|
| `se` | Traffic for all of Sweden |
| `{{< region "scope" >}}` | Traffic within {{< region "name" >}} |
| (none) | Traffic without a region label; in the list it is called `*` |

{{< settings >}}

Each county decides its own name; where there is no decision, a measured or proposed name is used.
All the counties' names are in [meshcore-se-regioner](https://github.com/zombiefredrik/meshcore-se-regioner).
We suggest the county's region as the base; some groups add a municipal region, such as `se0880` in
Kalmar. See [Municipalities and offgrid](#kommuner-och-offgrid).

> [!WARNING] `*` does not mean "everything"
> `*` is traffic that has no region label, not a wildcard for all regions.

## Set up a repeater {#ställ-in-en-repeater}

The repeater needs every region that traffic through it may carry: no label (`*`),
`eu` and `europe`, `se` and the county's region. The county also becomes the repeater's home region and `se` its
default region. The region commands exist since firmware 1.10 [^cli]; home region and default region
require repeater firmware 1.16 or later.

### In the app {#i-appen}

1. Open the repeater as a contact and log in as administrator.
2. Go to the region settings (*Manage Regions*).
3. Add `eu`, `europe`, `se` and `{{< region "scope" >}}`.
4. Make sure *Allow Flood* is on for each region, including `*`.
5. Save.

The menu names can differ between app versions.

### With commands {#med-kommandon}

Type the commands one at a time in a serial console, for example *Console* in
[MeshCore Flasher](https://meshcore.io/flasher), or through remote administration in the app.

```text {title="Show the current regions"}
region
```

```text {title="Allow traffic without a region label, at most 16 hops"}
set flood.max.unscoped 16
region allowf *
```

```text {title="Create the regions"}
region def eu|* europe|eu se {{< region "scope" >}}
```

```text {title="The county as home region, se as default region"}
region home {{< region "scope" >}}
region default se
```

```text {title="Save"}
region save
```

`region def` builds a chain: `eu` and `europe` end up side by side, `se` under `eu` and
`{{< region "scope" >}}` under `se`. The chain only controls how the regions are shown, not what is
passed on.

The home region is not used for forwarding; firmware with auto-reply takes its test channel from it.
The default region is the scope the repeater's own adverts are sent with: with `se` they reach all of Sweden.

> [!TIP] Repeaters near the county border
> A repeater that also reaches the neighboring county's repeaters can have the neighboring county's region in its list, so that
> traffic between the counties gets through. Only add regions for counties you actually reach. Even such
> an edge repeater allows traffic without a region label (`region allowf *`).

## Which region should a message have? {#vilken-region-ska-ett-meddelande-ha}

Choose the smallest region that reaches the people the channel is meant for.

| The channel is meant for | Region |
|---|---|
| everyone who hears it, with no limit | none |
| all of Sweden | `se` |
| {{< region "name" >}} | `{{< region "scope" >}}` |

> [!IMPORTANT] The whole path must have the region
> A packet with a region only gets through repeaters that have that region. If a
> repeater in the middle of the path lacks it, the traffic stops there.

## Municipalities and offgrid {#kommuner-och-offgrid}

You may see two other kinds of labels, for example in [meshat.se's region guide](https://meshat.se/meshcore/regioner/):

Municipal regions
: `se` followed by the municipality code, for example `se0180` for Stockholm Municipality. They limit traffic to
  one municipality.

`offgrid`
: Traffic for nodes that the owner judges to have backup power, such as a battery or solar. The label has
  no shared definition.

We suggest the county's region and `se` as the base. A packet with a region only gets through
repeaters that have exactly that region, so each extra label must exist on every repeater
along the path to work. Two levels are easy to keep consistent across the whole county, and the counties' names
are collected in one place. If a local mesh already uses municipal regions, a repeater can have
them in its list too, in addition to the county's: Kalmar-Mesh, for example, adds `se0880` (Kalmar Municipality).

## Frequently asked questions {#vanliga-frågor}

> [!NOTE]- Do my messages reach a shorter distance with a smaller region?
> No. The radio signal reaches just as far. The difference is that repeaters without the region do not send
> the packet on.

> [!NOTE]- Does `*` mean all regions?
> No. `*` is traffic that has no region label. A repeater with `region allowf *` passes on
> such traffic, but not traffic with a region it lacks.

> [!NOTE]- Is the region the same thing as the IATA code?
> No. The region controls which repeaters pass the traffic on. The IATA code is a label that
> observers put on what they report to the map, and it does not affect the mesh. See
> [The map and observers](../visa-pa-kartan/).

> [!NOTE]- Do I have to use a region?
> No. Traffic without a region is passed on as before. Regions are a way to save airtime
> as the mesh grows.

## Read more {#läs-mer}

- Troubleshooting: [Traffic does not cross the county border](../../felsokning/trafik-gar-inte-over-lansgransen/), [The home region is gone after a restart](../../felsokning/region-home-forsvinner/) and [The region def command gives an error](../../felsokning/region-def-fungerar-inte/)
- [MeshCore CLI: Region Management](https://docs.meshcore.io/cli_commands/#region-management-v110)
- [What is MeshCore?](../vad-ar-meshcore/)

## Sources {#källor}

[^cli]: MeshCore, [the CLI reference](https://github.com/meshcore-dev/MeshCore/blob/main/docs/cli_commands.md), Region Management (v1.10+).
