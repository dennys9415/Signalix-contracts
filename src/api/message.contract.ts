import { UUID, ISODateString, PaginationRequest, PaginationResponse } from "../shared";
import type { SendableMessageType } from "../enums";
import { MessageLifecycleState, MessageStatus, MessageType } from "../enums";

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
}

export interface SendMessageRequest {
  chatId?: UUID;
  recipientUsername?: string;
  ciphertext: string;
  messageType: SendableMessageType;
  tempId?: string;
  replyToMessageId?: UUID;
  isForwarded?: boolean;
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
