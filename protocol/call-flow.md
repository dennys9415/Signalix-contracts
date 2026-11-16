# Call Flow (v0.17.0 — 1:1 voice / video)

Signalix calls use WebRTC. Media (audio/video) flows peer-to-peer, encrypted
with DTLS-SRTP, and is relayed through TURN only when NAT requires it.
Signalix servers never see media — they carry **signaling** (SDP + ICE)
over the realtime WebSocket and persist a **call log** in the API.

Scope: direct (1:1) chats only. Group calls need an SFU and are out of scope.

## Actors

| Actor | Responsibility |
|---|---|
| Caller device | Creates the offer, generates `callId` (UUID v4). |
| Signalix-realtime | Routes signaling, rings callee devices, enforces busy / ring timeout, ends calls on disconnect. Holds call sessions in memory. |
| Signalix-api | Validates the call (direct chat, caller is participant), persists the `calls` row, issues TURN credentials. |
| Callee devices | All connected devices ring; the first to accept wins. |

## Happy path

```
Caller device            Realtime                         API                Callee devices
     │ GET /calls/ice-servers ───────────────────────────▶│
     │ client.call.invite {callId, chatId, callType, offer}
     │────────────────────▶│ POST /calls (caller JWT) ───▶│ INSERT status=ringing
     │                      │◀──────────── {call} ─────────│
     │                      │ server.call.incoming ───────────────────────────────▶│ (all devices)
     │                      │◀──────────────────────────────── client.call.ringing │
     │◀── server.call.ringing                                                       │
     │                      │◀──────────────────── client.call.accept {answer} ────│ (device B)
     │                      │ POST /calls/:id/accept (callee JWT) ▶│ status=active
     │◀── server.call.accepted {answer}                                             │
     │                      │ server.call.answered_elsewhere ─────────────────────▶│ (other devices)
     │ client.call.ice_candidate ⇄ server.call.ice_candidate ⇄ client.call.ice_candidate
     │ ═════════════ media (DTLS-SRTP, P2P or via TURN) ══════════════════════════ │
     │ client.call.hangup ─▶│ POST /calls/:id/end {completed} ▶│ status=ended
     │                      │ server.call.ended ──────────────────────────────────▶│
```

## ICE candidate ordering

- The **caller** buffers its local candidates until `server.call.accepted`
  (the callee device is unknown before that), then flushes them.
- Both sides queue remote candidates that arrive before
  `setRemoteDescription` completes.
- Realtime drops `client.call.ice_candidate` for calls that are not yet
  accepted.

## End reasons

| Reason | Trigger |
|---|---|
| `completed` | Either side hangs up an active call. |
| `cancelled` | Caller hangs up while ringing. |
| `rejected` | A callee device declines while ringing. |
| `missed` | No answer within 45 s (realtime ring timeout). |
| `busy` | Callee already has a ringing/active call. |
| `unavailable` | Callee has no connected device. |
| `failed` | API rejected the call, a participant's socket closed mid-call, or a client reported ICE/media failure. |

`server.call.ended` is sent to every device involved in the call except
the device that triggered it.

## State machine

```
ringing ──accept──▶ active ──hangup/fail──▶ ended
   │
   └──reject/cancel/timeout/busy/unavailable/fail──▶ ended
```

`ended` is terminal. `POST /calls/:id/end` on an already-ended call is a
no-op that returns the stored row.

## Security notes

- Media is always encrypted (DTLS-SRTP is mandatory in WebRTC).
- The realtime server could in theory substitute SDP fingerprints
  (MITM). Signing the SDP fingerprint with the device identity key is
  planned as a follow-up; until then call encryption is
  transport-to-peer, not identity-verified.
- TURN credentials are short-lived HMAC credentials bound to the user id.
