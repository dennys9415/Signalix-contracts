import { UUID, ISODateString } from "../shared";
import { CallEndReason, CallType } from "../enums";

/**
 * v0.17.0 — WebRTC signaling payloads. See `protocol/call-flow.md`.
 *
 * Routing rules enforced by Signalix-realtime:
 * - `server.call.incoming` rings every connected device of the callee.
 * - The first callee device to accept wins; the others receive
 *   `server.call.answered_elsewhere`.
 * - After accept, SDP / ICE / media updates flow only between the
 *   caller device and the accepting callee device.
 */

export interface SessionDescriptionDTO {
  type: "offer" | "answer";
  sdp: string;
}

/** Mirrors `RTCIceCandidateInit`. */
export interface IceCandidateDTO {
  candidate: string;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
  usernameFragment?: string | null;
}

export interface ClientCallInvitePayload {
  callId: UUID;
  chatId: UUID;
  callType: CallType;
  offer: SessionDescriptionDTO;
}

export interface ServerCallIncomingPayload {
  callId: UUID;
  chatId: UUID;
  callType: CallType;
  callerId: UUID;
  callerDeviceId: UUID;
  offer: SessionDescriptionDTO;
  timestamp: ISODateString;
}

/** Callee device acknowledges it is ringing. */
export interface ClientCallRingingPayload {
  callId: UUID;
}

export interface ServerCallRingingPayload {
  callId: UUID;
  deviceId: UUID;
  timestamp: ISODateString;
}

export interface ClientCallAcceptPayload {
  callId: UUID;
  answer: SessionDescriptionDTO;
}

export interface ServerCallAcceptedPayload {
  callId: UUID;
  deviceId: UUID;
  answer: SessionDescriptionDTO;
  timestamp: ISODateString;
}

export interface ClientCallRejectPayload {
  callId: UUID;
}

export interface ClientCallHangupPayload {
  callId: UUID;
  /** Defaults to `completed` / `cancelled` depending on call state. `failed` reports a local media/ICE failure. */
  reason?: CallEndReason.FAILED;
}

export interface ServerCallEndedPayload {
  callId: UUID;
  reason: CallEndReason;
  /** User who ended the call, absent when the server ended it (timeout, disconnect). */
  endedBy?: UUID;
  timestamp: ISODateString;
}

export interface ServerCallAnsweredElsewherePayload {
  callId: UUID;
  timestamp: ISODateString;
}

export interface ClientCallIceCandidatePayload {
  callId: UUID;
  candidate: IceCandidateDTO;
}

export interface ServerCallIceCandidatePayload {
  callId: UUID;
  fromDeviceId: UUID;
  candidate: IceCandidateDTO;
}

export interface ClientCallMediaUpdatePayload {
  callId: UUID;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

export interface ServerCallMediaUpdatePayload {
  callId: UUID;
  userId: UUID;
  audioEnabled: boolean;
  videoEnabled: boolean;
}
