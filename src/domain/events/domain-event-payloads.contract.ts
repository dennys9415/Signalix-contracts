import { UUID, ISODateString } from "../../shared";
import { MessageStatus } from "../../enums";

export interface UserCreatedDomainEvent {
  userId: UUID;
  timestamp: ISODateString;
}

export interface DeviceRegisteredDomainEvent {
  userId: UUID;
  deviceId: UUID;
  timestamp: ISODateString;
}

export interface ChatCreatedDomainEvent {
  chatId: UUID;
  participantIds: UUID[];
  timestamp: ISODateString;
}

export interface MessageDomainEvent {
  messageId: UUID;
  chatId: UUID;
  senderId: UUID;
  timestamp: ISODateString;
}

export interface MessageStatusDomainEvent {
  messageId: UUID;
  chatId: UUID;
  userId: UUID;
  status: MessageStatus;
  timestamp: ISODateString;
}
