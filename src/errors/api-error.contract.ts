import { ErrorCode } from "./error-code.enum";

export interface ApiError {
  code: ErrorCode;
  message: string;
  context?: Record<string, unknown>;
}
