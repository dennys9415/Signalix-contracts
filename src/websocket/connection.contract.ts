import { UUID, ISODateString } from "../shared";

export interface WsAuthenticatePayload {
  accessToken: string;
}

export interface WsAuthenticatedPayload {
  userId: UUID;
  deviceId: UUID;
  connectedAt: ISODateString;
}

export interface WsHeartbeatPayload {
  timestamp: ISODateString;
}
