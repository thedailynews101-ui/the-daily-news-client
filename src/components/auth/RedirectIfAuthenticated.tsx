"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { getDashboardPathForRole } from "@/lib/auth-routes";

/** Keeps a logged-in user off the login/register/forgot-password pages. */
export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(getDashboardPathForRole(user.role));
    }
  }, [isLoading, isAuthenticated, user, router]);

  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7579/ingest/dcec5555-5b6c-4a43-bb0d-e7523cdc3d5d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'35c314'},body:JSON.stringify({sessionId:'35c314',runId:'pre-fix',hypothesisId:'H4',location:'RedirectIfAuthenticated.tsx:22',message:'auth gate decision',data:{path:typeof window!=='undefined'?window.location.pathname:null,isLoading,isAuthenticated,rendersChildren:!(isLoading||isAuthenticated)},timestamp:Date.now()})}).catch(()=>{});
  }, [isLoading, isAuthenticated]);
  // #endregion

  // Render nothing while we don't yet know, or once we know the user should
  // be redirected away - avoids a flash of the login form for a signed-in user.
  if (isLoading || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
