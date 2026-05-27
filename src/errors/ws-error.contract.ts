import { ErrorCode } from "./error-code.enum";
import { ISODateString } from "../shared";

export interface WsErrorPayload {
  code: ErrorCode;
  message: string;
  timestamp: ISODateString;
  context?: Record<string, unknown>;
}
