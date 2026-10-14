import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/auth";
import type { ListUsersParams, ManagedUser, UpdateUserRolePayload, UserListResult } from "@/types/user";

const USERS_BASE = "/api/users";

export async function listUsers(params?: ListUsersParams): Promise<ApiResponse<UserListResult>> {
  return httpClient.get(USERS_BASE, { params });
}

export async function updateUserRole(
  id: string,
  payload: UpdateUserRolePayload
): Promise<ApiResponse<ManagedUser>> {
  return httpClient.patch(`${USERS_BASE}/${id}/role`, payload);
}
