---
title: "Who can control my repeater?"
url: /en/faq/lou/who-can-control/
category: loufjarr
weight: 220
date: 2026-11-21
lastmod: 2026-11-25
---

Only whoever holds your private command key. You create the key yourself and it never leaves
your computer; the repeater gets only the public half, which cannot sign anything. Someone who
steals the repeater and reads out its memory therefore cannot control any repeater, not even the
stolen one.

The repeater checks every command before it does anything:

1. The signature matches your key, and the command is addressed to that repeater.
2. The command is new: a copied command cannot be sent again.
3. It has not expired.
4. It is not one of the blocked commands.
5. The ceiling is not reached: 50 commands an hour, even with the right key.

The repeater does not trust the server that passes the commands on at all.
