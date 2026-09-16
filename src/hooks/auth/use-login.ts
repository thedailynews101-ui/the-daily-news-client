"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AUTH_ME_QUERY_KEY } from "@/components/auth/AuthProvider";
import { getApiErrorMessage } from "@/lib/api-error";
import { login, type LoginPayload } from "@/services/auth.service";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (response) => {
      // The login response already contains the current user - seed the
      // cache directly instead of firing a redundant GET /auth/me.
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, response.data.user);
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
