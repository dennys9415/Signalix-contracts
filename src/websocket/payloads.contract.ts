import { UUID, ISODateString } from "../shared";
import { MessageStatus, MessageType } from "../enums";

export interface ClientMessageSendPayload {
  chatId?: UUID;
  recipientUsername?: string;
  ciphertext: string;
  messageType: MessageType.TEXT;
  tempId?: string;
}

export interface ServerMessageSentPayload {
  messageId: UUID;
  chatId: UUID;
  senderId: UUID;
  tempId?: string;
  timestamp: ISODateString;
}

export interface ServerMessageNewPayload {
  messageId: UUID;
  chatId: UUID;
  senderId: UUID;
  ciphertext: string;
  messageType: MessageType;
  timestamp: ISODateString;
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
