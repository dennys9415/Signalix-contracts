import { UUID, ISODateString } from "../shared";
import { DeviceType } from "../enums";

export const MAX_ACTIVE_DEVICES_PER_USER = 5;

export interface DeviceDTO {
  id: UUID;
  userId: UUID;
  deviceName?: string;
  deviceType: DeviceType;
  createdAt: ISODateString;
  lastSeen?: ISODateString;
}

export interface DeviceSessionDTO {
  id: UUID;
  userId: UUID;
  deviceId: UUID;
  ip?: string;
  userAgent?: string;
  lastSeen?: ISODateString;
  revoked: boolean;
  expiresAt: ISODateString;
}
