# Realtime Flow

Connection:
```txt
Client connects WS
→ sends client.authenticate
→ server validates JWT
→ server responds server.authenticated
→ presence becomes online
```

Disconnect:
```txt
socket closes
→ presence becomes offline
→ last_seen updated
→ server.user.offline emitted
```
