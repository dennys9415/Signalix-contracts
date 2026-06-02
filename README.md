# Signalix Contracts

Single source of truth for all shared types, events, and enums across the Signalix multi-repo system.

**Rule: no other repository may invent or duplicate types defined here.**

## What this package defines

- **API DTOs** — request/response shapes for auth, users, chats, messages, presence
- **Enums** — `MessageStatus`, `MessageLifecycleState`, `MessageType`, `PresenceStatus`, `ChatType`, `ParticipantRole`, `AuthProvider`, `DeviceType`
- **WebSocket events** — `ClientEvent` and `ServerEvent` enums, all payload interfaces
- **Error contracts** — `ApiResponse<T>`, `ErrorCode`, `WsError`
- **Protocol rules** — message lifecycle state machine, realtime routing rules

## Build

```bash
npm install
npm run build   # outputs to dist/
```

Other repos consume this package via a local `file:` reference in `package.json`:

```json
"@signalix/contracts": "file:../Signalix-contracts"
```

After any change to contracts, rebuild before running dependent services:

```bash
cd Signalix-contracts && npm run build
```

## Dependency chain

```
Signalix-contracts
  └─ Signalix-api        (REST API)
  └─ Signalix-realtime   (WebSocket server)
  └─ Signalix-frontend   (Next.js client)
```

Changes to contracts require rebuilding all three downstream services.

## v0.1 scope

| Feature                     | Included |
|-----------------------------|----------|
| Username / email login      | ✓        |
| Direct chats                | ✓        |
| Text messages (`ciphertext`)| ✓        |
| Sent / delivered / read status | ✓     |
| Global presence             | ✓        |
| Exact username lookup       | ✓        |
| JWT-authenticated WebSocket | ✓        |
| Typing indicators           | Defined, not implemented in v0.1 |
| Group chats                 | ✗        |
| Media messages              | ✗        |
| Signal Protocol / E2EE      | ✗ (contracts designed to support it in future) |
| OAuth                       | ✗        |

## Known v0.1 limitations

- `ciphertext` field carries plain text in v0.1. The field name anticipates future E2EE; no encryption is applied.
- Typing indicator events (`client.typing.start`, `client.typing.stop`, `server.typing.start`, `server.typing.stop`) are defined but not routed by `Signalix-realtime` in v0.1.
