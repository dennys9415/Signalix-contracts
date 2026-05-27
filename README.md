# Signalix Contracts

`Signalix-contracts` is the single source of truth for all shared communication contracts used across the Signalix multi-repo system.

## Purpose

This repository defines:

- API response shapes
- DTOs
- enums
- WebSocket events
- WebSocket payloads
- message lifecycle rules
- domain events
- shared protocol definitions

## Absolute Rule

No other repository may invent or duplicate contracts.

Architecture flow:

```txt
contracts → api → realtime → frontend
```

## Current Version

`0.1.0`

## Current Scope

Signalix v0.1 supports:

- username/email login
- direct chats
- text messages stored as ciphertext
- sent/delivered/read message status
- global presence
- exact username lookup
- JWT-authenticated WebSocket connection

Signal Protocol is not implemented in v0.1, but the contracts are designed to support future E2EE.
