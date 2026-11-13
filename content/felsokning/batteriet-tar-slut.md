---
title: "Batteriet tar slut fort"
description: "En repeater på batteri eller sol klarar bara några dygn."
category: strom
weight: 10
---

## Troliga orsaker

1. **Strömsparläget är av.** Utan det är radion vaken hela tiden.
2. **Wi-Fi är på.** Observer-firmware med Wi-Fi drar mångdubbelt mer än en vanlig repeater, och
   passar dåligt på batteri.
3. **Skärm eller lysdioder** som står på.
4. Täta adverts, eller mycket trafik att föra vidare.

## Kontrollera

```sh {title="Konsol"}
powersaving
get flood.advert.interval
ver
```

## Åtgärda

```sh {title="Konsol"}
powersaving on
set flood.advert.interval 47
```

Använd repeater-firmware utan Observer på en nod som går på batteri. Välj *off-grid* i guiden:
den slår på strömsparläget och ger noden regionen `offgrid`.

## Så vet du att det fungerar

Batterispänningen sjunker långsammare dygn för dygn i appens status för repeatern.
