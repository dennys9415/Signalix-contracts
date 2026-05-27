import { UUID, ISODateString } from "../shared";
import { ChatType, ParticipantRole } from "../enums";
import { PublicUserDTO } from "./user.contract";

export interface ChatDTO {
  id: UUID;
  type: ChatType;
  createdBy: UUID;
  createdAt: ISODateString;
  participants: ChatParticipantDTO[];
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
