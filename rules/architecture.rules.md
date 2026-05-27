# Signalix Architecture Rules

Active repositories:
- Signalix-contracts
- Signalix-api
- Signalix-realtime
- Signalix-frontend
- Signalix-infra

Future repositories:
- Signalix-crypto-sdk
- Signalix-auth
- Signalix-notifications
- Signalix-media
- Signalix-monitoring

## Boundaries

Signalix-contracts contains DTOs, enums, websocket events, protocol constants, and shared API responses.

Signalix-api contains business logic, PostgreSQL persistence, auth, chats, and messages.

Signalix-realtime contains websocket gateway, presence, realtime transport, typing, and delivery/read events.

Signalix-frontend contains UI, state management, API client, and WebSocket client.

Signalix-infra contains Docker Compose, local infrastructure, and Flyway orchestration.
