export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  FILE = "file"
}

/**
 * The subset of MessageType values that callers are allowed to emit through
 * client.message.send and POST /messages/send. VIDEO is reserved for a
 * future iteration; AUDIO joined the set in v0.6.1 for voice notes.
 */
export type SendableMessageType =
  | MessageType.TEXT
  | MessageType.IMAGE
  | MessageType.FILE
  | MessageType.AUDIO;
