---
title: "Room server"
seoTitle: "MeshCore room server: how it works"
description: "What a MeshCore room server is, when it is the right choice, how to flash it and log in, its current limitations and the alternatives."
url: /en/guides/room-server/
weight: 85
group: regioner
date: 2026-11-18
lastmod: 2026-11-18
checkedFirmware: "1.18"
checkedOn: 2026-11-18
---

A **room server** is a MeshCore node that stores posts in a shared room, a bit like a bulletin
board. It solves a real problem: a message on a channel only reaches people whose radio is on and
in range at that moment, but a room server sends you what was written while you were away when you
log in again.[^faq] It is the best way MeshCore has to do that today, even though it has clear
limitations. This page covers both.

## When is a room server a good fit? {#när-passar-en-room-server}

- A group that wants to be able to catch up, for example a club, a neighborhood or an exercise.
- A place for information that should stay around for a while: status of the mesh, meetings, rules.
- People who don't have their radio on all day.

If you only want to talk with whoever is on the air right now, a [channel](../kanaler/) is enough.

## How it works {#så-fungerar-den}

- The server keeps the **32 most recent posts**, in one shared queue for everyone. Post 33 removes
  the oldest.[^code]
- A post can be at most **151 bytes**. Å, ä and ö take two bytes each.[^code]
- When you log in, the server sends the posts you haven't seen, one at a time, and waits for an
  acknowledgment for each.[^code]
- The server remembers up to 32 logged-in users.[^acl]

## Set up a room server {#sätt-upp-en-room-server}

1. **Flash room server firmware** on a radio of its own, the same way as a repeater
   ([Choose and flash firmware](../flasha-firmware/)). Don't run a repeater and a room server on the
   same radio: MeshCore recommends separate devices.[^faq]
2. **Set up the radio** with the same values the mesh uses
   ([MeshCore settings in Sweden](../radioinstallningar/)), and give it a clear
   [name](../namnge-noden/).
3. **Change the passwords.** The admin password is `password` and the guest password `hello` out of
   the box.[^faq] Change both in the console:

   ```sh {title="Console"}
   password <new admin password>
   set guest.password <password for the room>
   ```

4. **If you want everyone to be able to read** without a password, but only those with the password
   to write:

   ```sh {title="Console"}
   set allow.read.only on
   ```

   Anyone who logs in with a wrong or empty password then becomes a guest: a guest can read but not write.[^code]
5. **Put it high and in the open**, close to the people who will use it. The fewer hops to the
   server, the better it works (see below).

## Log in from the app {#logga-in-från-appen}

The room server shows up among your contacts once you have heard its advert. Open it, enter the
room's password and log in. The server then sends the posts you haven't seen, and what you write in
the room is stored there for the others. The admin password also lets you change the server's
settings over the radio, as for a repeater ([Administer the repeater from the app](../fjarradministration/)).

## Limitations today {#begränsningar-i-dag}

These are known problems in MeshCore, not faults in your mesh. Users have reported them, but they
are not fixed (November 2026):

- **The login can look like it failed even though it worked.** Over several hops the app's timeout
  runs out, but the posts still arrive.[^login]
- **Missed posts don't come back.** For each user, the server remembers the last post it got an
  acknowledgment for. If more than 32 new posts have been written in the meantime, the oldest are
  gone, and there is no way to ask for them again.[^sync]
- **An ESP32 server without a clock battery** can think it is May 2024 after a restart. New posts
  then look older than what users have already received, and they are not sent.[^clock]
- **The first message after a login with a password** has failed every time for some users, until
  the companion was restarted.[^first]

## How to make it work better {#så-får-du-den-att-fungera-bättre}

- Place the server so users reach it **directly or in few hops**.
- Check the clock after every restart with `clock`, and set it with `clock sync` from the app's
  administration if it shows the wrong year. A board with a clock chip (RTC) doesn't have this problem.[^clock]
- Don't let the room become a chat channel: with 32 slots, old posts disappear fast if many people write.
- Test with a radio a few hops away before you tell others the room exists.

## Alternatives {#alternativ}

- **A channel**, if it is enough that the people on the air read it. A channel costs no extra node.
- **A BBS on a computer** next to a companion, for example a Raspberry Pi. It answers ordinary
  direct messages and stores everything in a database, so it doesn't have the room server's cap of
  32 posts and needs no login. Several such projects are on GitHub, including
  [MeshCore-BBS](https://github.com/carsten-walther/MeshCore-BBS) and
  [supply-drop-bbs](https://github.com/Mesh-America/supply-drop-bbs). The cost is that the computer
  has to stay on.

## Sources {#källor}

[^faq]: MeshCore, [FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md), 1.2.5, 3.3 and 3.4.
[^code]: MeshCore 1.18, [simple_room_server](https://github.com/meshcore-dev/MeshCore/tree/main/examples/simple_room_server): `MAX_UNSYNCED_POSTS` 32, `MAX_POST_TEXT_LEN` 160−9, guest permission with `allow.read.only`.
[^acl]: MeshCore 1.18, [ClientACL.h](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/ClientACL.h), `MAX_CLIENTS` 32.
[^login]: MeshCore, [issue 2212](https://github.com/meshcore-dev/MeshCore/issues/2212), closed without a fix.
[^sync]: MeshCore, [issue 1696](https://github.com/meshcore-dev/MeshCore/issues/1696), closed without a fix.
[^clock]: MeshCore, [issue 3059](https://github.com/meshcore-dev/MeshCore/issues/3059), open.
[^first]: MeshCore, [issue 236](https://github.com/meshcore-dev/MeshCore/issues/236), closed without a fix.
