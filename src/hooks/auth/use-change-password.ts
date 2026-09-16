"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { changePassword, type ChangePasswordPayload } from "@/services/auth.service";

/** The server preserves the caller's own session on success - no logout, no redirect. */
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
