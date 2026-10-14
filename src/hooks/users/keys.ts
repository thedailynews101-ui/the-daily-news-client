import type { ListUsersParams } from "@/types/user";

export const userKeys = {
  all: ["users"] as const,
  list: (params?: ListUsersParams) => [...userKeys.all, "list", params ?? {}] as const,
};
