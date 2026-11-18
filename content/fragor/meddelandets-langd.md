---
title: "Hur långt kan ett meddelande vara?"
category: grunder
weight: 60
date: 2026-11-18
lastmod: 2026-11-18
---

Högst 160 byte ([MeshCores källkod](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.h), `MAX_TEXT_LEN`). Det är 160 tecken utan å, ä och ö; de tar två byte var, och en emoji tar fyra. Skriv kort.
