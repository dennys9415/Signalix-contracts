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
  HEARTBEAT_ACK = "server.heartbeat.ack"
}
