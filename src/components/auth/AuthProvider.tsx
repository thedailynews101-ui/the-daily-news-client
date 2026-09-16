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

  const { data, isLoading, status, fetchStatus } = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: async (): Promise<AuthUser | null> => {
      const response = await getMe();
      return response.data;
    },
  });

  // #region agent log
  React.useEffect(() => {
    const q = queryClient.getQueryCache().find({ queryKey: AUTH_ME_QUERY_KEY });
    fetch('http://127.0.0.1:7579/ingest/dcec5555-5b6c-4a43-bb0d-e7523cdc3d5d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'35c314'},body:JSON.stringify({sessionId:'35c314',runId:'pre-fix',hypothesisId:'H1/H3',location:'AuthProvider.tsx:38',message:'AuthProvider auth state changed',data:{path:typeof window!=='undefined'?window.location.pathname:null,hasUser:!!data,dataIsNull:data===null,dataIsUndefined:data===undefined,userRole:data?.role??null,isLoading,status,fetchStatus,cacheObserverCount:q?.observers.length??-1},timestamp:Date.now()})}).catch(()=>{});
  }, [data, isLoading, status, fetchStatus, queryClient]);
  // #endregion

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
