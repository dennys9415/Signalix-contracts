export enum ServerEvent {
  AUTHENTICATED = "server.authenticated",
  MESSAGE_NEW = "server.message.new",
  MESSAGE_SENT = "server.message.sent",
  MESSAGE_DELIVERED = "server.message.delivered",
  MESSAGE_READ = "server.message.read",
  TYPING_START = "server.typing.start",
  TYPING_STOP = "server.typing.stop",
  USER_ONLINE = "server.user.online",
  USER_OFFLINE = "server.user.offline",
  ERROR = "server.error",
  HEARTBEAT_ACK = "server.heartbeat.ack",
  MESSAGE_DELETED_FOR_EVERYONE = "server.message.deleted_for_everyone",
  MESSAGE_EDITED = "server.message.edited",
  MESSAGE_REACTION_UPDATED = "server.message.reaction_updated",
  /**
   * v0.10.2 — fan-out from `client.chat.created`. Delivered to every
   * connected participant of a newly-created chat (groups today; direct
   * chats remain message-bootstrapped). Recipients dedupe by `chat.id`
   * because the creating user receives it too.
   */
  CHAT_CREATED = "server.chat.created"
}
