# Signalix Contracts

**Version: v0.16.0**

> ⚠️ **v0.10.0 extends E2EE to group text messages (beta)** via per-recipient encryption fan-out. New shared types: `GroupRecipientPayloadDTO` and `RecipientEnvelopeDTO`. `SendMessageRequest`, `EditMessageRequest`, `ClientMessageSendPayload`, and `ClientMessageEditPayload` gain an optional `recipients?: GroupRecipientPayloadDTO[]`. `SendMessageResponse` and `EditMessageResponse` gain an optional `recipientPayloads?: Record<UUID, RecipientEnvelopeDTO>`. `EditMessageRequest` + `ClientMessageEditPayload` + `ServerMessageEditedPayload` also pick up the optional envelope fields so direct E2EE edits re-route correctly. All additions are optional — a v0.9.x consumer compiles against this package with zero changes. **Not production-grade**: per-recipient fan-out is `O(participants)`; Sender Keys is v0.11.0+. Group media / files / voice notes remain plaintext.

Single source of truth for all shared types, events, and enums across the Signalix multi-repo system.

**Rule: no other repository may invent or duplicate types defined here.**

## What this package defines

| Category | Contents |
|---|---|
| **API DTOs** | Request/response shapes for auth, users, chats, messages, presence |
| **Enums** | `MessageStatus`, `MessageLifecycleState`, `MessageType`, `PresenceStatus`, `ChatType`, `ParticipantRole`, `AuthProvider`, `DeviceType` |
| **Type aliases** | `SendableMessageType` — subset of `MessageType` that callers may emit through `client.message.send` and `POST /messages/send` (TEXT, IMAGE, FILE, AUDIO; VIDEO reserved) |
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

## v0.16.0 changelog — Mobile foundation MVP

### Fixed
- **`.npmignore`** — anchored the `src` / `rules` / `protocol` / `schema` / `tools` / `versions` exclusion patterns with a leading `/` so they only match the top-level repo folders, not the same-named subdirectories under `dist/`. The previous patterns excluded `dist/protocol/` from the npm pack, which broke `@signalix/contracts` consumers (including the new `Signalix-mobile` app) at runtime — `dist/index.js` re-exports `./protocol` so the missing folder surfaced as `Unable to resolve module ./protocol`.

### Not changed
- No DTO, enum, response, request, or event changes. The TypeScript surface of the published package is byte-identical to v0.15.0. The fix is packaging-only.

## v0.15.0 changelog — Key backup & device recovery (contracts no-op)

### Not changed
- No DTO, enum, response, request, or event changes. v0.15.0's backup/restore feature is purely client-side; the shared contracts package is byte-identical to v0.14.0 apart from the version bump.

## v0.14.0 changelog — Read receipts contract additions

### Added
- **`GetMessageRecipientsStatusResponse { messageId: UUID; statuses: MessageStatusDTO[] }`** — return shape for the new `GET /messages/:id/recipients/status` endpoint. Used by the Message Info dialog.
- **`GetMessagesRequest.since?: ISODateString`** — reconnect-sync cursor. Additive optional field.
- **`GetMessagesResponse.statusUpdates?: MessageStatusDTO[]`** — receipts that fired strictly after the request's `since` cursor. Only present when `since` was provided.

### Not changed
- All other DTOs, event names, payloads — identical to v0.13.0.

## v0.13.0 changelog — Message search (contracts no-op)

### Not changed
- `MessageSearchResultDTO`, `InChatSearchMatchDTO`, `SearchMessagesRequest`/`Response`, `SearchInChatRequest`/`Response` are all from v0.7.1 and unchanged. v0.13.0 reuses them across both server-side and client-side hit sources.

## v0.12.0 changelog — Safety number / device verification UI (contracts no-op)

### Not changed
- No DTO, enum, response, request, or event changes. v0.12.0's verification feature is local-only (lives in the frontend's IndexedDB); the shared contracts package is byte-identical to v0.11.0 apart from the version bump.

## v0.11.0 changelog — Media / file / voice E2EE beta (contracts no-op)

### Not changed
- No DTO field additions or removals; no new events.
- v0.11.0 reuses the existing `recipients[]` + per-device envelope pipeline. The semantic change — the per-recipient ciphertext for IMAGE / FILE / AUDIO is an envelope around the attachment's metadata JSON instead of an envelope around plaintext text — happens entirely client-side and server-side; the wire shapes are unchanged.

## v0.10.1 changelog — Chat-created event + payload routing keying

### Added
- **`ClientEvent.CHAT_CREATED = "client.chat.created"`** + payload `ClientChatCreatedPayload { chatId }`. Emitted by the creator after a REST chat-create succeeds so the realtime layer can fan out.
- **`ServerEvent.CHAT_CREATED = "server.chat.created"`** + payload `ServerChatCreatedPayload { chat: ChatDTO }`. Delivered to every participant connection. Recipients dedupe by `chat.id`.

### Clarified
- **`RecipientEnvelopeDTO`** doc updated: the API → realtime fan-out map is keyed by **`deviceId`** (not userId) so multi-device recipients each get their own envelope. No type change.

### Not changed
- No DTO field additions or removals. The two new events are additive on existing enums.

## v0.10.0 changelog — Group E2EE beta

### Added
- **`GroupRecipientPayloadDTO`** — one entry per device that should be able to decrypt a group encrypted text message. Fields: `recipientUserId`, `recipientDeviceId`, `ciphertext`, `encryptionVersion`, optional `preKeyId`, optional `signedPreKeyId`.
- **`RecipientEnvelopeDTO`** — API → realtime hand-off shape for the per-recipient ciphertext + envelope used to build the personalized `server.message.new` / `server.message.edited` payloads. Keyed by recipient userId in `recipientPayloads`.
- **`SendMessageRequest.recipients?`** + **`EditMessageRequest.recipients?`** — per-recipient payloads for group encrypted text. Ignored for direct chats and non-TEXT message types.
- **`ClientMessageSendPayload.recipients?`** + **`ClientMessageEditPayload.recipients?`** — same shape over the WS wire.
- **`SendMessageResponse.recipientPayloads?`** + **`EditMessageResponse.recipientPayloads?`** — internal to the API → realtime fan-out; clients never see this directly.
- **Envelope fields on `EditMessageRequest`, `ClientMessageEditPayload`, `ServerMessageEditedPayload`** (`encryptionVersion`, `senderDeviceId`, `recipientDeviceId`, `preKeyId`, `signedPreKeyId`). Lets direct E2EE edits re-route the recipient's session state when the sender re-encrypts, and lets group encrypted edits ship their per-recipient envelope on the existing event.

### Not changed
- v0.9.x crypto DTOs (`SignedPreKeyDTO`, `PreKeyDTO`, `DeviceKeyBundleDTO`, register / rotate / upload / key-bundle) — unchanged.
- All other DTOs, response shapes, event names, enums — unchanged. No breaking changes.

## v0.9.1 changelog — E2EE hardening

### Not changed
- No DTO, enum, response, request, or event changes. v0.9.1 is purely an API + frontend hardening release; the shared contracts package is byte-identical to v0.9.0 apart from the version bump.
- All v0.8.0 crypto DTOs and the five message envelope fields are unchanged. A v0.9.0 consumer compiles against this version with zero changes.

## v0.9.0 changelog — Signal Protocol Beta

### Not changed
- The v0.8.0 crypto contracts (`DeviceIdentityKeyDTO`, `PreKeyDTO`, `SignedPreKeyDTO`, `DeviceKeyBundleDTO`, `KeyBundleResponse`, and the four request/response shapes) are unchanged. The v0.9.0 frontend simply starts using them at login.
- The optional envelope fields on `MessageDTO`, `SendMessageRequest`, `ClientMessageSendPayload`, `ServerMessageNewPayload` are unchanged. The v0.9.0 frontend now populates them with real values (`encryptionVersion: 1`, sender/recipient device ids, prekey ids).
- No new types. No breaking changes. v0.7.x / v0.8.0 consumers continue to compile against this package.

## v0.8.0 changelog

### Added — Encryption foundation (NOT real E2EE yet)

> v0.8.0 reserves the wire format for a future Signal-Protocol-style E2EE layer. The types describe the data shapes; nothing in this package performs encryption. v0.9.0 is the real-E2EE beta.

- **`src/api/crypto.contract.ts`** — new file:
  - `KeyAlgorithm` (string-literal union, currently `'x25519'`).
  - `DeviceIdentityKeyDTO`, `PreKeyDTO`, `SignedPreKeyDTO`, `DeviceKeyBundleDTO`, `KeyBundleResponse`.
  - Request / response shapes for the four crypto endpoints: `RegisterDeviceKeysRequest`/`Response`, `RotateSignedPreKeyRequest`/`Response`, `UploadPreKeysRequest`/`Response`.
  - All key/signature blobs are base64url strings on the wire.
- **Envelope fields on existing message types** — `MessageDTO`, `SendMessageRequest`, `ClientMessageSendPayload`, `ServerMessageNewPayload` each gain optional:
  - `encryptionVersion?: number` (0 == plaintext, 1+ reserved for future protocols)
  - `senderDeviceId?`, `recipientDeviceId?`, `preKeyId?`, `signedPreKeyId?`
  - All optional and ignored by v0.7.x consumers. v0.8.0 server persists them when provided; mock client never populates them.

### Not changed
- `MessageType`, `ChatType`, `ParticipantRole`, error codes, every existing DTO continues to match v0.7.x.

## v0.7.1 changelog

### Added
- **`SearchMessagesRequest extends PaginationRequest`** `{ q, limit?, cursor? }`.
- **`MessageSearchResultDTO`** `{ messageId, chatId, chatType, chatLabel, chatAvatarUrl?, senderId, senderName, senderAvatarUrl?, ciphertext, createdAt }`. Self-contained so the client can render a result even when the underlying chat isn't in its cache.
- **`SearchMessagesResponse`** `{ results, pagination: { hasMore, nextCursor? } }`.
- **`SearchInChatRequest extends PaginationRequest`** `{ q, limit?, cursor? }` — in-chat scoped variant.
- **`InChatSearchMatchDTO`** `{ messageId, senderId, senderName, ciphertext, messageType, createdAt }` — slim payload for the per-bubble navigation UX.
- **`SearchInChatResponse`** `{ chatId, matches, pagination }`.

### Changed
- `api/message.contract.ts` now also imports the `ChatType` enum, used by `MessageSearchResultDTO.chatType`.

## v0.7.0 changelog

### Added
- **`ChatDTO.avatarUrl`** and **`ChatDTO.description`** — optional fields surfaced for group chats so consumers can render avatar + description without an extra round-trip.
- **`TransferGroupOwnershipRequest`** `{ newOwnerId }`.
- **`TransferGroupOwnershipResponse`** `{ chatId, ownerId, previousOwnerId, participants }`.
- **`GroupAvatarUploadResponse`** `{ chatId, avatarUrl }`.

### Changed
- **`UpdateGroupChatRequest`** — `title` made optional; new optional `description?: string | null`. At least one field is expected at runtime (API enforces). `null` on description clears the column.
- **`UpdateGroupChatResponse`** — both `title` and `description` are now optional, mirroring the partial-update shape.

### Not changed
- No new enums or events. WebSocket protocol unchanged.

## v0.6.1 changelog

### Added
- **`SendableMessageType`** — new exported type alias from `enums/message-type.enum.ts`: `MessageType.TEXT | MessageType.IMAGE | MessageType.FILE | MessageType.AUDIO`. Single source of truth for "what callers may actually send"; consumed by API DTO, realtime WS payloads and frontend store cast.
- **AUDIO is now a sendable type** — `ClientMessageSendPayload.messageType` and `SendMessageRequest.messageType` widened from `TEXT | IMAGE | FILE` to `SendableMessageType` so voice messages (v0.6.1 feature) pass validation end-to-end.

### Fixed
- `MessageType.AUDIO` was always part of the persistence layer (DB CHECK allows it) and of the broadcast payload (`ServerMessageNewPayload.messageType: MessageType` is the full enum), but the *sender-side* payload types silently restricted it. Voice messages would upload to MinIO successfully but then be rejected with a 400 from `class-validator` in the API. Widening the contracts removes that bottleneck.

## v0.6.0 changelog

No contract-level changes for PWA / Web Push themselves — the WS event surface for v0.6.0 stayed identical to v0.5.0. Web Push subscription endpoints are defined in the API repo only (REST), since they don't map to any client/server WS event.

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
