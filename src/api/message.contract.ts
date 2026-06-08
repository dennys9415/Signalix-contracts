import { UUID, ISODateString, PaginationRequest, PaginationResponse } from "../shared";
import type { SendableMessageType } from "../enums";
import { ChatType, MessageLifecycleState, MessageStatus, MessageType } from "../enums";

export interface MessageReactionDTO {
  emoji: string;
  count: number;
  userIds: UUID[];
}

export interface ReplyPreviewDTO {
  messageId: UUID;
  senderId: UUID;
  ciphertext: string;
}

export interface LinkPreviewDTO {
  url: string;
  domain: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

export interface MessageDTO {
  id: UUID;
  chatId: UUID;
  senderId: UUID;
  ciphertext: string;
  messageType: MessageType;
  state: MessageLifecycleState;
  createdAt: ISODateString;
  editedAt?: ISODateString;
  deletedAt?: ISODateString;
  reactions?: MessageReactionDTO[];
  replyTo?: ReplyPreviewDTO;
  isForwarded?: boolean;
  linkPreview?: LinkPreviewDTO;

  // ── Encryption envelope (v0.8.0 foundation) ─────────────────────────────
  // None of these are populated by the v0.8.0 send path — the server still
  // sees plaintext `ciphertext`. They exist so v0.9.0 can start emitting
  // them without a contract break. `encryptionVersion: 0` means plaintext;
  // 1+ will be defined when the Signal-Protocol-style flow lands.
  /** 0 = plaintext (no E2EE); 1+ = future protocol versions. */
  encryptionVersion?: number;
  senderDeviceId?: UUID;
  recipientDeviceId?: UUID;
  /** The one-time pre-key consumed when initiating this session, if any. */
  preKeyId?: number;
  /** The signed pre-key referenced by this session's handshake. */
  signedPreKeyId?: number;
}

export interface SendMessageRequest {
  chatId?: UUID;
  recipientUsername?: string;
  ciphertext: string;
  messageType: SendableMessageType;
  tempId?: string;
  replyToMessageId?: UUID;
  isForwarded?: boolean;

  // Encryption envelope (v0.8.0 foundation). Optional and ignored unless
  // `encryptionVersion >= 1`.
  encryptionVersion?: number;
  senderDeviceId?: UUID;
  recipientDeviceId?: UUID;
  preKeyId?: number;
  signedPreKeyId?: number;

  /**
   * v0.10.0 — per-recipient encrypted payloads for **group E2EE beta** (text
   * messages only). When this is non-empty and the chat is a group, the
   * server treats the top-level `ciphertext` as a sentinel (empty string)
   * and stores one row per entry in `group_message_recipients`. Each
   * recipient receives only their own envelope on the wire. Ignored for
   * direct chats and for non-TEXT message types.
   */
  recipients?: GroupRecipientPayloadDTO[];
}

/**
 * v0.10.0 — one entry per device that should be able to decrypt a group
 * encrypted text message. The sender produces one of these per recipient
 * device by running the same X3DH-like handshake used for direct
 * messages, just N times. Sender is NOT included here — sender-side
 * history is served by the local plaintext cache, identical to v0.9.x.
 */
export interface GroupRecipientPayloadDTO {
  recipientUserId: UUID;
  recipientDeviceId: UUID;
  /** Same `JSON.stringify({ v: 1, c, iv, eph })` envelope as direct E2EE. */
  ciphertext: string;
  encryptionVersion: number;
  preKeyId?: number;
  signedPreKeyId?: number;
}

/**
 * v0.10.0 — envelope returned by the API to the realtime layer so it can
 * fan a fan-out encrypted send out to each connected recipient device.
 * **Keyed by recipient deviceId** (not userId) so a multi-device recipient
 * (Brave + Chrome on the same account) gets the right per-device
 * envelope. NOT serialized to clients directly — the realtime server
 * consumes this and emits one `server.message.new` per recipient with
 * the matching fields spread onto the standard payload.
 */
export interface RecipientEnvelopeDTO {
  ciphertext: string;
  encryptionVersion: number;
  senderDeviceId?: UUID;
  recipientDeviceId?: UUID;
  preKeyId?: number;
  signedPreKeyId?: number;
}

export interface SendMessageResponse {
  message: MessageDTO;
  chatId: UUID;
  tempId?: string;
  /**
   * v0.10.0 — present only for group encrypted sends. Realtime spreads
   * each recipient's entry onto the `server.message.new` payload it
   * delivers to that recipient.
   */
  recipientPayloads?: Record<UUID, RecipientEnvelopeDTO>;
}

export interface GetMessagesRequest extends PaginationRequest {
  chatId: UUID;
  before?: ISODateString;
}

export interface GetMessagesResponse {
  messages: MessageDTO[];
  pagination: PaginationResponse;
}

export interface MessageStatusDTO {
  messageId: UUID;
  userId: UUID;
  status: MessageStatus;
  timestamp: ISODateString;
}

export interface UpdateMessageStatusRequest {
  messageId: UUID;
  status: MessageStatus.DELIVERED | MessageStatus.READ;
}

export interface DeleteMessageForMeRequest {
  messageId: UUID;
}

export interface DeleteMessageForMeResponse {
  messageId: UUID;
  deletedAt: ISODateString;
}

export interface DeleteMessageForEveryoneRequest {
  messageId: UUID;
}

export interface DeleteMessageForEveryoneResponse {
  messageId: UUID;
  chatId: UUID;
  deletedAt: ISODateString;
}

export interface EditMessageRequest {
  ciphertext: string;
  /**
   * v0.10.0 — optional envelope for re-encrypted edits. When editing a
   * v0.9.x direct E2EE message the sender re-runs the handshake to the
   * recipient and supplies these so the recipient row reflects the new
   * session. For group encrypted messages, the per-recipient ciphertexts
   * go in `recipients` instead and the top-level `ciphertext` becomes a
   * sentinel.
   */
  encryptionVersion?: number;
  senderDeviceId?: UUID;
  recipientDeviceId?: UUID;
  preKeyId?: number;
  signedPreKeyId?: number;
  /** v0.10.0 — per-recipient re-encrypted payloads for group E2EE edits. */
  recipients?: GroupRecipientPayloadDTO[];
}

export interface EditMessageResponse {
  messageId: UUID;
  chatId: UUID;
  ciphertext: string;
  editedAt: ISODateString;
  /** v0.10.0 — see `SendMessageResponse.recipientPayloads`. */
  recipientPayloads?: Record<UUID, RecipientEnvelopeDTO>;
}

export interface AddReactionRequest {
  emoji: string;
}

export interface ReactionResponse {
  messageId: UUID;
  chatId: UUID;
  reactions: MessageReactionDTO[];
}

/**
 * GET /messages/search — full-text-ish lookup over the caller's accessible
 * messages. `q` is required and matched case-insensitively against
 * `messages.ciphertext`. Only TEXT messages are returned; image / file /
 * audio payloads aren't user content. Results respect both per-user
 * message deletions and the chat_deletions visibility cutoff.
 */
export interface SearchMessagesRequest extends PaginationRequest {
  q: string;
}

/**
 * A single search hit. Self-contained: includes enough chat metadata that
 * the client can render the row even if the underlying chat isn't yet in
 * its in-memory cache. `chatLabel`/`chatAvatarUrl` resolve direct chats to
 * the other participant; for groups they hold the title/avatar.
 *
 * `ciphertext` is the message body truncated server-side (~280 chars) to
 * keep payloads small. The client highlights the matched substring locally.
 */
export interface MessageSearchResultDTO {
  messageId: UUID;
  chatId: UUID;
  chatType: ChatType;
  chatLabel: string;
  chatAvatarUrl?: string;
  senderId: UUID;
  senderName: string;
  senderAvatarUrl?: string;
  ciphertext: string;
  createdAt: ISODateString;
}

export interface SearchMessagesResponse {
  results: MessageSearchResultDTO[];
  pagination: PaginationResponse;
}

/**
 * GET /chats/:chatId/search — substring search scoped to a single chat the
 * caller participates in. Same ILIKE machinery as the global endpoint but
 * scoped to one `chat_id`. Returns the match metadata the in-chat search
 * UI needs to render "X of Y" and to jump bubble-by-bubble.
 */
export interface SearchInChatRequest extends PaginationRequest {
  q: string;
}

export interface InChatSearchMatchDTO {
  messageId: UUID;
  senderId: UUID;
  senderName: string;
  ciphertext: string;       // server-truncated to 280 chars
  messageType: MessageType;
  createdAt: ISODateString;
}

export interface SearchInChatResponse {
  chatId: UUID;
  matches: InChatSearchMatchDTO[];
  pagination: PaginationResponse;
}
