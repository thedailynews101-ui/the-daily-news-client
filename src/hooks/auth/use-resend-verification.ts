"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { resendVerification } from "@/services/auth.service";

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => resendVerification(email),
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
