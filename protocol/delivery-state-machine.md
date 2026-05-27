# Delivery State Machine

```txt
CREATED → SENT → DELIVERED → READ
           ↘ FAILED
```

Rules:
- Cannot skip states.
- Cannot reverse states.
- READ is final.
- FAILED only allowed from CREATED or SENT.
