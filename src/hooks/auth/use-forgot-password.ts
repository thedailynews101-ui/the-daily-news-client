"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { forgotPassword } from "@/services/auth.service";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
