"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { userKeys } from "@/hooks/users/keys";
import { getApiErrorMessage } from "@/lib/api-error";
import { updateUserRole } from "@/services/user.service";
import type { UpdateUserRolePayload } from "@/types/user";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserRolePayload }) =>
      updateUserRole(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
