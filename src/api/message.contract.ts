import { UUID, ISODateString, PaginationRequest, PaginationResponse } from "../shared";
import { MessageLifecycleState, MessageStatus, MessageType } from "../enums";

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
}

export interface SendMessageRequest {
  chatId?: UUID;
  recipientUsername?: string;
  ciphertext: string;
  messageType: MessageType.TEXT;
  tempId?: string;
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
