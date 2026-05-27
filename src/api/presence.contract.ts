import { UUID, ISODateString } from "../shared";
import { PresenceStatus } from "../enums";

export interface PresenceDTO {
  userId: UUID;
  deviceId: UUID;
  status: PresenceStatus;
  lastSeen: ISODateString;
}

export interface PresenceLookupRequest {
  userIds: UUID[];
}

export interface PresenceLookupResponse {
  presence: PresenceDTO[];
}
