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

  // Render nothing while we don't yet know, or once we know the user should
  // be redirected away - avoids a flash of the login form for a signed-in user.
  if (isLoading || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
