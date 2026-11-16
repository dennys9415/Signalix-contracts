import { UUID, ISODateString } from "../shared";
import { CallEndReason, CallStatus, CallType } from "../enums";

/** v0.17.0 — one row of the call log (`calls` table). */
export interface CallDTO {
  id: UUID;
  chatId: UUID;
  callerId: UUID;
  calleeId: UUID;
  callType: CallType;
  status: CallStatus;
  endReason: CallEndReason | null;
  startedAt: ISODateString;
  answeredAt: ISODateString | null;
  endedAt: ISODateString | null;
  /** Seconds between answer and hang-up; null when never answered. */
  durationSeconds: number | null;
}

/**
 * Called by Signalix-realtime with the caller's JWT when it receives
 * `client.call.invite`. The id is generated client-side so the caller can
 * correlate ICE candidates before the API round trip completes.
 */
export interface CreateCallRequest {
  callId: UUID;
  chatId: UUID;
  callType: CallType;
}

export interface EndCallRequest {
  reason: CallEndReason;
}

export interface CallResponse {
  call: CallDTO;
}

export interface CallHistoryResponse {
  calls: CallDTO[];
}

/** Mirrors the browser's `RTCIceServer` shape. */
export interface IceServerDTO {
  urls: string[];
  username?: string;
  credential?: string;
}

/**
 * `GET /calls/ice-servers` — STUN + short-lived TURN credentials
 * (coturn `use-auth-secret` / TURN REST API scheme).
 */
export interface IceServersResponse {
  iceServers: IceServerDTO[];
  ttlSeconds: number;
}
