"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AUTH_ME_QUERY_KEY } from "@/components/auth/AuthProvider";
import { getApiErrorMessage } from "@/lib/api-error";
import { logout } from "@/services/auth.service";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: (response) => {
      // Write the logged-out value into the *live* auth/me query first, while
      // AuthProvider is still subscribed to it. clear() destroys that query
      // object, and anything written afterwards lands on a replacement with no
      // observers - which is why the navbar used to keep the old user until a
      // manual refresh.
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
      // Everything else in the cache belonged to the session that just ended.
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== AUTH_ME_QUERY_KEY[0],
      });
      toast.success(response.message);
      router.replace("/");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
