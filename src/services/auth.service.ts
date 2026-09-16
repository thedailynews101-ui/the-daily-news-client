import { httpClient } from "@/lib/axios/httpClient";
import type {
  ApiResponse,
  AuthUser,
  LoginResponseData,
  RefreshResponseData,
} from "@/types/auth";

const AUTH_BASE = "/api/auth";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/** Creates the account. Does not log the user in - email must be verified first. */
export async function signup(payload: SignupPayload): Promise<ApiResponse<AuthUser>> {
  return httpClient.post(`${AUTH_BASE}/signup`, payload, { skipAuthRefresh: true });
}

/** Consumes the token from the verification email link. */
export async function verifyEmail(token: string): Promise<ApiResponse<null>> {
  return httpClient.post(`${AUTH_BASE}/verify-email`, { token }, { skipAuthRefresh: true });
}

/** Always resolves with a generic message, whether or not the email exists. */
export async function resendVerification(email: string): Promise<ApiResponse<null>> {
  return httpClient.post(`${AUTH_BASE}/resend-verification`, { email }, { skipAuthRefresh: true });
}

/** Sets accessToken/refreshToken HTTP-only cookies on success. */
export async function login(payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> {
  return httpClient.post(`${AUTH_BASE}/login`, payload, { skipAuthRefresh: true });
}

/** Rotates both cookies. Normally called only by the axios interceptor. */
export async function refreshToken(): Promise<ApiResponse<RefreshResponseData>> {
  return httpClient.post(`${AUTH_BASE}/refresh-token`, undefined, { skipAuthRefresh: true });
}

/** Revokes the current session and clears both cookies. */
export async function logout(): Promise<ApiResponse<null>> {
  return httpClient.post(`${AUTH_BASE}/logout`, undefined, { skipAuthRefresh: true });
}

/** Always resolves with a generic message, whether or not the account exists. */
export async function forgotPassword(email: string): Promise<ApiResponse<null>> {
  return httpClient.post(`${AUTH_BASE}/forgot-password`, { email }, { skipAuthRefresh: true });
}

/** Consumes the token from the reset-password email link and clears cookies. */
export async function resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<null>> {
  return httpClient.post(`${AUTH_BASE}/reset-password`, payload, { skipAuthRefresh: true });
}

/** Protected. Requires the caller to already know their current password. */
export async function changePassword(
  payload: ChangePasswordPayload
): Promise<ApiResponse<null>> {
  return httpClient.post(`${AUTH_BASE}/change-password`, payload);
}

/** Protected. The source of truth for "who is logged in" on the client. */
export async function getMe(): Promise<ApiResponse<AuthUser>> {
  return httpClient.get(`${AUTH_BASE}/me`);
}
