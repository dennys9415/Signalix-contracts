import { ApiError } from "../errors";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
