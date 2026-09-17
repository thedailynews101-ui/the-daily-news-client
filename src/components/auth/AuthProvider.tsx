"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { setOnAuthFailure } from "@/lib/axios/httpClient";
import { getMe } from "@/services/auth.service";
import type { AuthUser } from "@/types/auth";

/** Shared so login/logout mutations and other pages can read/update the same cache entry. */
export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

/**
 * Source of truth for "who is logged in" on the client. Cookies are
 * HTTP-only, so this is the only way the browser learns the session state -
 * it calls GET /auth/me on mount, and the axios interceptor transparently
 * refreshes an expired access token before this ever surfaces as logged-out.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: async (): Promise<AuthUser | null> => {
      const response = await getMe();
      return response.data;
    },
  });

  React.useEffect(() => {
    // Registered once; the interceptor calls this on a definitive
    // (post-refresh-attempt) 401 so cached auth state clears without this
    // module needing to know about React Query directly.
    setOnAuthFailure(() => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
    });

    return () => setOnAuthFailure(null);
  }, [queryClient]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user: data ?? null,
      isLoading,
      isAuthenticated: Boolean(data),
    }),
    [data, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
