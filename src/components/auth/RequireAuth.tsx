"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardPathForRole } from "@/lib/auth-routes";
import type { UserRole } from "@/types/auth";

/**
 * Client-side route guard. There is no middleware/BFF proxy in this app -
 * the API's HTTP-only cookies live on a different origin, so the only place
 * that can reliably know "am I logged in" is the browser, after AuthProvider
 * resolves GET /auth/me (with a silent refresh already attempted for an
 * expired access token). Wrap a layout in this to require a session, and
 * optionally restrict it to a set of roles.
 */
export function RequireAuth({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isRoleMismatch = Boolean(roles && user && !roles.includes(user.role));

  React.useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isRoleMismatch && user) {
      router.replace(getDashboardPathForRole(user.role));
    }
  }, [isLoading, isAuthenticated, isRoleMismatch, user, router, pathname]);

  if (isLoading || !isAuthenticated || isRoleMismatch) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
