import { UUID, ISODateString } from "../shared";
import { MessageStatus, MessageType } from "../enums";
import type { LinkPreviewDTO, MessageReactionDTO, ReplyPreviewDTO } from "../api/message.contract";

export interface ClientMessageSendPayload {
  chatId?: UUID;
  recipientUsername?: string;
  ciphertext: string;
  messageType: MessageType.TEXT | MessageType.IMAGE | MessageType.FILE;
  tempId?: string;
  replyToMessageId?: UUID;
  isForwarded?: boolean;
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
}

export interface ServerMessageEditedPayload {
  messageId: UUID;
  chatId: UUID;
  ciphertext: string;
  editedAt: ISODateString;
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
