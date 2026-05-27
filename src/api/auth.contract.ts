import { UUID, ISODateString } from "../shared";
import { AuthProvider } from "../enums";

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  displayName?: string;
  deviceName?: string;
  userAgent?: string;
}

export interface LoginRequest {
  identifier: string; // email or username
  password: string;
  deviceName?: string;
  userAgent?: string;
}

export interface AuthSessionDTO {
  userId: UUID;
  deviceId: UUID;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: ISODateString;
  refreshTokenExpiresAt: ISODateString;
}

export interface AuthProviderDTO {
  id: UUID;
  userId: UUID;
  provider: AuthProvider;
  providerUserId: string;
  providerEmail?: string;
  createdAt: ISODateString;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
