"use client";

import { useQuery } from "@tanstack/react-query";

import { userKeys } from "@/hooks/users/keys";
import { listUsers } from "@/services/user.service";
import type { ListUsersParams } from "@/types/user";

export function useUsers(params?: ListUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await listUsers(params);
      return response.data;
    },
  });
}
