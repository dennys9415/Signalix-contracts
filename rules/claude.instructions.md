# Signalix Claude Instructions

You are working on Signalix, a multi-repo realtime messaging system inspired by Signal and WhatsApp.

## Absolute Rules

1. NEVER invent new contracts outside Signalix-contracts.
2. ALWAYS use Signalix-contracts as source of truth.
3. NEVER duplicate DTOs locally in API, realtime, or frontend.
4. NEVER modify enums without a version bump.
5. NEVER remove fields from exported contracts.
6. Only add optional fields unless a breaking version is explicitly requested.
7. ALL WebSocket events must exist in Signalix-contracts.
8. ALL API responses must use ApiResponse<T>.
9. Work one repository at a time.
10. If unsure, stop and ask.

## Architecture Flow

contracts → api → realtime → frontend

## Current MVP Scope

v0.1 includes:
- username/email password login
- direct chats
- exact username lookup
- messages stored as ciphertext
- API history loading
- WebSocket realtime only
- sent/delivered/read status
- global presence
- no edit
- no delete
