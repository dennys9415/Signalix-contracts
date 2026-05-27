# Message Flow

```txt
Frontend sends ciphertext
→ API validates sender and recipient
→ API creates direct chat if none exists
→ API stores message
→ API marks sender status as sent
→ Realtime emits message to recipient if online
→ Recipient client receives message
→ Recipient sends delivered
→ Recipient opens chat
→ Recipient sends read
```

Rules:
- API is source of truth.
- WebSocket only transports realtime events.
- Message history is loaded through API.
- Offline recovery happens by pulling missing messages on reconnect.
- READ always wins.
