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
}

export interface SendMessageResponse {
  message: MessageDTO;
  chatId: UUID;
  tempId?: string;
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
}

export interface EditMessageResponse {
  messageId: UUID;
  chatId: UUID;
  ciphertext: string;
  editedAt: ISODateString;
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
