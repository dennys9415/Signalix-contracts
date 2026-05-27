export enum ClientEvent {
  AUTHENTICATE = "client.authenticate",
  MESSAGE_SEND = "client.message.send",
  MESSAGE_DELIVERED = "client.message.delivered",
  MESSAGE_READ = "client.message.read",
  TYPING_START = "client.typing.start",
  TYPING_STOP = "client.typing.stop",
  PRESENCE_UPDATE = "client.presence.update",
  HEARTBEAT = "client.heartbeat"
}
