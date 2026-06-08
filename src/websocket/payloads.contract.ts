import { UUID, ISODateString } from "../shared";
import type { SendableMessageType } from "../enums";
import { MessageStatus, MessageType } from "../enums";
import type { ChatDTO } from "../api/chat.contract";
import type { GroupRecipientPayloadDTO, LinkPreviewDTO, MessageReactionDTO, ReplyPreviewDTO } from "../api/message.contract";

export interface ClientMessageSendPayload {
  chatId?: UUID;
  recipientUsername?: string;
  ciphertext: string;
  messageType: SendableMessageType;
  tempId?: string;
  replyToMessageId?: UUID;
  isForwarded?: boolean;
  // ── Encryption envelope (v0.8.0 foundation) ─────────────────────────────
  // Optional and unused until v0.9.0. `encryptionVersion: 0` == plaintext.
  encryptionVersion?: number;
  senderDeviceId?: UUID;
  recipientDeviceId?: UUID;
  preKeyId?: number;
  signedPreKeyId?: number;
  /** v0.10.0 — per-recipient encrypted payloads for group E2EE text sends. */
  recipients?: GroupRecipientPayloadDTO[];
}

export interface ServerMessageSentPayload {
  messageId: UUID;
  chatId: UUID;
  senderId: UUID;
  tempId?: string;
  timestamp: ISODateString;
  linkPreview?: LinkPreviewDTO;
}

export interface ServerMessageNewPayload {
  messageId: UUID;
  chatId: UUID;
  senderId: UUID;
  ciphertext: string;
  messageType: MessageType;
  timestamp: ISODateString;
  replyTo?: ReplyPreviewDTO;
  isForwarded?: boolean;
  linkPreview?: LinkPreviewDTO;
  // ── Encryption envelope (v0.8.0 foundation) ─────────────────────────────
  encryptionVersion?: number;
  senderDeviceId?: UUID;
  recipientDeviceId?: UUID;
  preKeyId?: number;
  signedPreKeyId?: number;
}

export interface MessageStatusPayload {
  messageId: UUID;
  chatId: UUID;
  userId: UUID;
  status: MessageStatus.DELIVERED | MessageStatus.READ;
  timestamp: ISODateString;
}

export interface TypingPayload {
  chatId: UUID;
  userId: UUID;
  timestamp: ISODateString;
}

export interface PresenceEventPayload {
  userId: UUID;
  deviceId: UUID;
  timestamp: ISODateString;
}

export interface ClientMessageDeleteForEveryonePayload {
  messageId: UUID;
  chatId: UUID;
}

export interface ServerMessageDeletedForEveryonePayload {
  messageId: UUID;
  chatId: UUID;
  deletedAt: ISODateString;
}

export interface ClientMessageEditPayload {
  messageId: UUID;
  chatId: UUID;
  ciphertext: string;
  /** v0.10.0 — envelope for re-encrypted direct edits (carried through unchanged). */
  encryptionVersion?: number;
  senderDeviceId?: UUID;
  recipientDeviceId?: UUID;
  preKeyId?: number;
  signedPreKeyId?: number;
  /** v0.10.0 — per-recipient re-encrypted payloads for group E2EE edits. */
  recipients?: GroupRecipientPayloadDTO[];
}

export interface ServerMessageEditedPayload {
  messageId: UUID;
  chatId: UUID;
  ciphertext: string;
  editedAt: ISODateString;
  /** v0.10.0 — when forwarded for a group encrypted edit, the per-recipient envelope. */
  encryptionVersion?: number;
  senderDeviceId?: UUID;
  recipientDeviceId?: UUID;
  preKeyId?: number;
  signedPreKeyId?: number;
}

export interface ClientMessageReactionSetPayload {
  messageId: UUID;
  chatId: UUID;
  emoji: string;
}

export interface ClientMessageReactionRemovePayload {
  messageId: UUID;
  chatId: UUID;
}

export interface ServerMessageReactionUpdatedPayload {
  messageId: UUID;
  chatId: UUID;
  reactions: MessageReactionDTO[];
}

/**
 * v0.10.2 — emitted by the creating client right after a REST chat
 * create call succeeds (today: `POST /chats/group`). The realtime
 * server fetches the canonical ChatDTO with the caller's JWT and fans
 * out `server.chat.created` to every connected participant.
 */
export interface ClientChatCreatedPayload {
  chatId: UUID;
}

/**
 * v0.10.2 — delivered to every connected participant of a newly-
 * created chat. The full `ChatDTO` is included so the recipient can
 * drop it into their sidebar without an extra `GET /chats` round trip.
 * Recipients dedupe by `chat.id` because the originating user also
 * receives this event.
 */
export interface ServerChatCreatedPayload {
  chat: ChatDTO;
}
