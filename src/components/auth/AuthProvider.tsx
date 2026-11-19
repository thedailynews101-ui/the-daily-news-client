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
      // #region agent log
      fetch("http://127.0.0.1:7750/ingest/cf35cf32-3598-447a-8d7f-fee6f91430b3", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "b31edf" },
        body: JSON.stringify({
          sessionId: "b31edf",
          runId: "pre-fix",
          hypothesisId: "E",
          location: "AuthProvider.tsx:getMe",
          message: "getMe query starting",
          data: {
            href: typeof window !== "undefined" ? window.location.href : null,
            apiBase: process.env.NEXT_PUBLIC_API_BASE_URL ?? null,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      const response = await getMe();
      // #region agent log
      fetch("http://127.0.0.1:7750/ingest/cf35cf32-3598-447a-8d7f-fee6f91430b3", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "b31edf" },
        body: JSON.stringify({
          sessionId: "b31edf",
          runId: "pre-fix",
          hypothesisId: "E",
          location: "AuthProvider.tsx:getMeSuccess",
          message: "getMe query succeeded",
          data: { hasUser: Boolean(response.data?.id), role: response.data?.role ?? null },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return response.data;
    },
  });

  React.useEffect(() => {
    // Registered once; the interceptor calls this on a definitive
    // (post-refresh-attempt) 401 so cached auth state clears without this
    // module needing to know about React Query directly.
    setOnAuthFailure(() => {
      // #region agent log
      fetch("http://127.0.0.1:7750/ingest/cf35cf32-3598-447a-8d7f-fee6f91430b3", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "b31edf" },
        body: JSON.stringify({
          sessionId: "b31edf",
          runId: "pre-fix",
          hypothesisId: "A",
          location: "AuthProvider.tsx:onAuthFailure",
          message: "auth failure listener cleared cache",
          data: { href: typeof window !== "undefined" ? window.location.href : null },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
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
