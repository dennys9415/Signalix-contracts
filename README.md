# Signalix Contracts

**Version: v0.2.0**

Single source of truth for all shared types, events, and enums across the Signalix multi-repo system.

**Rule: no other repository may invent or duplicate types defined here.**

## What this package defines

| Category | Contents |
|---|---|
| **API DTOs** | Request/response shapes for auth, users, chats, messages, presence |
| **Enums** | `MessageStatus`, `MessageLifecycleState`, `MessageType`, `PresenceStatus`, `ChatType`, `ParticipantRole`, `AuthProvider`, `DeviceType` |
| **Error contracts** | `ApiResponse<T>`, `ErrorCode`, `WsError` |
| **WebSocket events** | `ClientEvent` and `ServerEvent` enums, all payload interfaces |
| **Protocol rules** | Message lifecycle state machine, realtime routing rules |

### API contracts (`src/api/`)

| File | Defines |
|---|---|
| `auth.contract.ts` | `RegisterRequest`, `LoginRequest`, `RefreshTokenRequest`, `AuthSessionDTO`, `ForgotPasswordRequest/Response`, `ResetPasswordRequest/Response`, `VerifyEmailRequest/Response`, `ResendVerificationRequest/Response` |
| `user.contract.ts` | `UserDTO`, `PublicUserDTO`, `ExactUsernameLookupResponse`, `UserSearchRequest/Response`, `UserProfileResponse` |
| `chat.contract.ts` | `ChatDTO`, `ParticipantDTO` |
| `message.contract.ts` | `MessageDTO`, `GetMessagesResponse`, `SendMessageRequest/Response`, `UpdateMessageStatusRequest/Response`, `DeleteMessageForMeRequest/Response` |
| `presence.contract.ts` | `PresenceDTO`, `GetPresenceRequest/Response`, `UpdatePresenceRequest/Response` |
| `device.contract.ts` | `DeviceDTO` |

### Error codes (`src/errors/error-code.enum.ts`)

`USERNAME_TAKEN`, `EMAIL_TAKEN`, `INVALID_CREDENTIALS`, `TOKEN_EXPIRED`, `DEVICE_LIMIT_REACHED`, `CHAT_NOT_FOUND`, `MESSAGE_NOT_FOUND`, `USER_NOT_FOUND`, `INVALID_RESET_TOKEN`, `INVALID_VERIFICATION_TOKEN`

### WebSocket contracts (`src/websocket/`)

- `client-event.enum.ts` — events the client sends
- `server-event.enum.ts` — events the server sends
- `payloads.contract.ts` — payload interfaces for all events
- `connection.contract.ts` — authenticate handshake types

## Build

```bash
npm install
npm run build   # outputs to dist/
```

All downstream services consume this package via a local `file:` reference:

```json
"@signalix/contracts": "file:../Signalix-contracts"
```

After any change to contracts, rebuild before running dependent services:

```bash
cd Signalix-contracts && npm run build
```

## Typecheck

```bash
npm run typecheck   # tsc --noEmit
```

## Dependency chain

```
Signalix-contracts
  ├── Signalix-api        (REST API + email)
  ├── Signalix-realtime   (WebSocket server)
  └── Signalix-frontend   (Next.js client)
```

Changes to contracts require rebuilding all three downstream services.

## v0.2.0 feature coverage

| Feature | Included |
|---|---|
| Username / email login | ✓ |
| Google / GitHub / Apple OAuth | ✓ |
| JWT access + refresh tokens | ✓ |
| Password reset (forgot + reset) | ✓ |
| Email verification (verify + resend) | ✓ |
| Direct 1-to-1 chats | ✓ |
| Text messages (`ciphertext`) | ✓ |
| Sent / delivered / read status | ✓ |
| Delete for me | ✓ |
| Global presence (online / offline) | ✓ |
| Exact username lookup | ✓ |
| Partial username search | ✓ |
| User profile (display name, avatar, providers) | ✓ |
| JWT-authenticated WebSocket | ✓ |
| Typing indicators | Defined in contracts — not implemented |
| Group chats | ✗ |
| Media messages | ✗ |
| Signal Protocol / E2EE | ✗ (contracts designed to support it in future) |

## Known limitations

- `ciphertext` carries plain text in v0.2. The field name anticipates future E2EE; no encryption is applied.
- Typing indicator events (`client.typing.start`, `client.typing.stop`, `server.typing.start`, `server.typing.stop`) are defined but not routed in v0.2.

## Planned

- Message edit contracts
- Delete for everyone contracts
- Group chat contracts
- Media / attachment contracts
- Signal Protocol key exchange contracts
