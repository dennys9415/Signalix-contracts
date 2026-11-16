# Changelog

## Unreleased — 1:1 voice / video calls

Additive only (no breaking changes).

- `CallType`, `CallStatus`, `CallEndReason` enums.
- API: `CallDTO`, `CreateCallRequest`, `EndCallRequest`, `CallResponse`,
  `CallHistoryResponse`, `IceServerDTO`, `IceServersResponse`.
- WebSocket: `client.call.*` (invite, ringing, accept, reject, hangup,
  ice_candidate, media_update) and `server.call.*` (incoming, ringing,
  accepted, answered_elsewhere, ended, ice_candidate, media_update) with
  payloads in `websocket/call-payloads.contract.ts`.
- Protocol doc: `protocol/call-flow.md`.

## 0.1.0

Initial MVP contracts.

Includes:
- API response shape
- auth contracts
- user contracts
- device contracts
- chat contracts
- message contracts
- presence contracts
- websocket events
- websocket payloads
- message lifecycle
- domain events
