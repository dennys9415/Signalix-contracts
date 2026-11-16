/**
 * v0.17.0 — 1:1 voice / video calls (WebRTC).
 *
 * Media flows peer-to-peer (DTLS-SRTP, relayed through TURN when NAT
 * requires it). Signalix only carries signaling (SDP + ICE) over the
 * existing realtime WebSocket and persists the call log in the API.
 */
export enum CallType {
  AUDIO = "audio",
  VIDEO = "video"
}

export enum CallStatus {
  RINGING = "ringing",
  ACTIVE = "active",
  ENDED = "ended"
}

export enum CallEndReason {
  /** Answered, then one side hung up. */
  COMPLETED = "completed",
  /** Rang until the ring timeout without being answered. */
  MISSED = "missed",
  /** Callee declined. */
  REJECTED = "rejected",
  /** Callee was already in another call. */
  BUSY = "busy",
  /** Caller hung up before the callee answered. */
  CANCELLED = "cancelled",
  /** Callee had no connected device to ring. */
  UNAVAILABLE = "unavailable",
  /** Signaling or media failed (peer disconnected, ICE failure, …). */
  FAILED = "failed"
}
