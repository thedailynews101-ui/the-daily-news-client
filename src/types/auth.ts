// Mirrors the Prisma enums in dailynews-server/prisma/schema.prisma.
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE" | "USER";

export type UserStatus = "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "BANNED";

/**
 * Machine-readable auth error codes. Keep these in sync with
 * dailynews-server/src/utils/errorCodes.ts.
 */
export const AuthErrorCode = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  ACCOUNT_RESTRICTED: "ACCOUNT_RESTRICTED",
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

/** Matches the server's `PublicUser` shape (never includes passwordHash). */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string | null;
  bio: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
}

/** Envelope every successful API response uses: `{ success, message, data }`. */
export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface LoginResponseData {
  user: AuthUser;
  accessToken: string;
}

export interface RefreshResponseData {
  accessToken: string;
}
