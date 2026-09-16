"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { signup, type SignupPayload } from "@/services/auth.service";

/** Creates the account. The user is not logged in yet - email verification is required first. */
export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => signup(payload),
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
