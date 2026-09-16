"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { resetPassword, type ResetPasswordPayload } from "@/services/auth.service";

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      router.replace("/login");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
