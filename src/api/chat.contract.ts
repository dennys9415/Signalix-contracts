import { UUID, ISODateString } from "../shared";
import { ChatType, ParticipantRole } from "../enums";
import { PublicUserDTO } from "./user.contract";

export interface ChatDTO {
  id: UUID;
  type: ChatType;
  title?: string;
  /** Group avatar URL — public bucket URL, or undefined when no avatar is set. */
  avatarUrl?: string;
  /** Group description — markdown-free plain text, owner/admin editable. */
  description?: string;
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

/**
 * Owner / admin patch for a group chat. At least one field must be provided.
 * Description supports `null` to clear; missing fields are left untouched.
 */
export interface UpdateGroupChatRequest {
  title?: string;
  description?: string | null;
}

export interface UpdateGroupChatResponse {
  chatId: UUID;
  title?: string;
  description?: string | null;
}

export interface TransferGroupOwnershipRequest {
  newOwnerId: UUID;
}

/**
 * Returned after a successful ownership transfer. The full participant list
 * is included so clients can refresh their role chips without a second round-trip.
 * The previous owner is demoted to `ADMIN`.
 */
export interface TransferGroupOwnershipResponse {
  chatId: UUID;
  ownerId: UUID;
  previousOwnerId: UUID;
  participants: ChatParticipantDTO[];
}

export interface GroupAvatarUploadResponse {
  chatId: UUID;
  avatarUrl: string;
}
