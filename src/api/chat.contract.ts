import { UUID, ISODateString } from "../shared";
import { ChatType, ParticipantRole } from "../enums";
import { PublicUserDTO } from "./user.contract";

export interface ChatDTO {
  id: UUID;
  type: ChatType;
  title?: string;
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

export interface CreateGroupChatRequest {
  title: string;
  memberIds: UUID[];
}

export interface CreateGroupChatResponse {
  chat: ChatDTO;
}

export interface AddGroupMembersRequest {
  userIds: UUID[];
}

export interface GroupMemberUpdateResponse {
  chatId: UUID;
  participants: ChatParticipantDTO[];
}

export interface RemoveGroupMemberResponse {
  chatId: UUID;
  userId: UUID;
}

export interface UpdateGroupChatRequest {
  title: string;
}

export interface UpdateGroupChatResponse {
  chatId: UUID;
  title: string;
}
