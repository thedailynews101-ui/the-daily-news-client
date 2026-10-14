import type { UserRole, UserStatus } from "@/types/auth";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export type UserListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UserListResult = {
  items: ManagedUser[];
  meta: UserListMeta;
};

export type ListUsersParams = {
  q?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
};

export type UpdateUserRolePayload = {
  role: UserRole;
};
