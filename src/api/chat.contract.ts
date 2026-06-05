import { UUID, ISODateString } from "../shared";
import { ChatType, ParticipantRole } from "../enums";
import { PublicUserDTO } from "./user.contract";

export interface ChatDTO {
  id: UUID;
  type: ChatType;
  createdBy: UUID;
  createdAt: ISODateString;
  participants: ChatParticipantDTO[];
  unreadCount: number;
}

export interface ChatParticipantDTO {
  chatId: UUID;
  userId: UUID;
  role: ParticipantRole;
  joinedAt: ISODateString;
  user?: PublicUserDTO;
}

export interface DirectChatLookupRequest {
  recipientUsername: string;
}

export interface DeleteChatForMeResponse {
  chatId: UUID;
  deletedAt: ISODateString;
}

export interface MarkChatReadResponse {
  chatId: UUID;
  lastReadMessageId?: UUID;
  lastReadAt: ISODateString;
}
