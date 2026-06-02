import { UUID, ISODateString } from "../shared";

export interface UserDTO {
  id: UUID;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  isVerified: boolean;
  createdAt: ISODateString;
}

export interface PublicUserDTO {
  id: UUID;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface ExactUsernameLookupRequest {
  username: string;
}

export interface ExactUsernameLookupResponse {
  user: PublicUserDTO | null;
}

export interface UserSearchRequest {
  q: string;
  limit?: number; // default 10, max 25
}

export interface UserSearchResponse {
  users: PublicUserDTO[];
}
