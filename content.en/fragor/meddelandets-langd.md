---
title: "How long can a message be?"
url: /en/faq/message-length/
category: grunder
weight: 60
date: 2026-11-18
lastmod: 2026-11-18
---

At most 160 bytes ([MeshCore's source code](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.h), `MAX_TEXT_LEN`). That is 160 characters without å, ä and ö; those take two bytes each, and an emoji takes four. Keep it short.
