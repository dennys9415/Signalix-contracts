export enum DomainEvent {
  USER_CREATED = "user.created",
  DEVICE_REGISTERED = "device.registered",
  SESSION_CREATED = "session.created",

  CHAT_CREATED = "chat.created",

  MESSAGE_CREATED = "message.created",
  MESSAGE_SENT = "message.sent",
  MESSAGE_DELIVERED = "message.delivered",
  MESSAGE_READ = "message.read",

  USER_ONLINE = "user.online",
  USER_OFFLINE = "user.offline"
}
