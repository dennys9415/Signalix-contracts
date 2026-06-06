# Signalix Contracts

**Version: v0.5.0**

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
| `chat.contract.ts` | `ChatDTO`, `ChatParticipantDTO`, `DeleteChatForMeResponse`, `MarkChatReadResponse`, `CreateGroupChatRequest/Response`, `AddGroupMembersRequest`, `GroupMemberUpdateResponse`, `RemoveGroupMemberResponse`, `UpdateGroupChatRequest/Response` |
| `message.contract.ts` | `MessageDTO`, `MessageReactionDTO`, `ReplyPreviewDTO`, `LinkPreviewDTO`, `GetMessagesRequest/Response`, `SendMessageRequest/Response`, `UpdateMessageStatusRequest/Response`, `DeleteMessageForMeRequest/Response`, `DeleteMessageForEveryoneRequest/Response`, `EditMessageRequest/Response`, `AddReactionRequest`, `ReactionResponse` |
| `presence.contract.ts` | `PresenceDTO`, `GetPresenceRequest/Response`, `UpdatePresenceRequest/Response` |
| `device.contract.ts` | `DeviceDTO` |

### Error codes (`src/errors/error-code.enum.ts`)

`UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL_ERROR`, `USER_NOT_FOUND`, `USERNAME_TAKEN`, `INVALID_CREDENTIALS`, `CHAT_NOT_FOUND`, `DIRECT_CHAT_ALREADY_EXISTS`, `MESSAGE_NOT_FOUND`, `INVALID_MESSAGE_STATE`, `DEVICE_LIMIT_REACHED`, `SESSION_REVOKED`, `WS_INVALID_EVENT`, `WS_AUTH_REQUIRED`, `INVALID_RESET_TOKEN`, `INVALID_VERIFICATION_TOKEN`

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

## v0.5.0 feature coverage

| Feature | Included |
|---|---|
| Username / email login | ✓ |
| Google / GitHub / Apple OAuth | ✓ |
| JWT access + refresh tokens | ✓ |
| Password reset (forgot + reset) | ✓ |
| Email verification (verify + resend) | ✓ |
| Direct 1-to-1 chats | ✓ |
| Group chats (create, rename, add / remove members, leave) | ✓ |
| Text messages (`ciphertext`) | ✓ |
| Image messages | ✓ |
| File attachments | ✓ |
| Sent / delivered / read status | ✓ |
| Delete message for me | ✓ |
| Delete message for everyone | ✓ |
| Delete chat for me | ✓ |
| Edit message | ✓ |
| Reply to message (`ReplyPreviewDTO`) | ✓ |
| Forward message (`isForwarded` flag) | ✓ |
| Emoji reactions (`MessageReactionDTO`) | ✓ |
| Link preview metadata (`LinkPreviewDTO`) | ✓ |
| Typing indicators (`client.typing.*`, `server.typing.*`) | ✓ |
| Global presence (online / offline / last seen) | ✓ |
| Exact + partial username search | ✓ |
| User profile (display name, avatar upload, providers) | ✓ |
| JWT-authenticated WebSocket | ✓ |
| Signal Protocol / E2EE | ✗ (contracts designed to support it in future) |

## v0.5.0 changelog

### Added since v0.2.0
- **Group chats** — `CreateGroupChatRequest/Response`, `AddGroupMembersRequest`, `GroupMemberUpdateResponse`, `RemoveGroupMemberResponse`, `UpdateGroupChatRequest/Response`; `ChatType.GROUP`, `ParticipantRole.OWNER/MEMBER`
- **Delete chat for me** — `DeleteChatForMeResponse`
- **Mark chat as read** — `MarkChatReadResponse` for persistent unread counts
- **Edit message** — `EditMessageRequest/Response` + `server.message.edited` event
- **Delete for everyone** — `DeleteMessageForEveryoneRequest/Response` + `server.message.deleted_for_everyone` event + `client.message.delete_for_everyone` event
- **Reactions** — `MessageReactionDTO`, `AddReactionRequest`, `ReactionResponse` + `client.message.reaction_set` / `client.message.reaction_remove` + `server.message.reaction_updated`
- **Reply / Forward** — `ReplyPreviewDTO`, `replyToMessageId` and `isForwarded` fields on send
- **Link previews** — `LinkPreviewDTO` attached to messages
- **Media + file types** — `MessageType.IMAGE`, `MessageType.FILE`
- **Typing indicators** — routed in v0.5 (events already existed in contracts)
- **Avatar URL** — `UserDTO.avatarUrl`, `PublicUserDTO.avatarUrl`
- **Error codes** — `DIRECT_CHAT_ALREADY_EXISTS`, `INVALID_MESSAGE_STATE`, `SESSION_REVOKED`, `WS_INVALID_EVENT`, `WS_AUTH_REQUIRED`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL_ERROR`

### v0.5.0 stabilization
- Frontend-only "draft chat" UX is supported via the existing send-by-`recipientUsername` flow — no contract changes required; draft chat IDs (`draft:<userId>`) are not part of the protocol.

## Known limitations

- `ciphertext` still carries plain text. The field name anticipates future E2EE; no encryption is applied.
- Multi-device key exchange / Signal Protocol session contracts are not defined.
- No contracts for push notification tokens or notification delivery receipts.

## Planned

- Signal Protocol key exchange contracts
- Push notification token registration contracts
- Read receipts per-participant in group chats (currently single `READ` state)
