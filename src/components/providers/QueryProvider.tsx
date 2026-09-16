"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState (not a module-level singleton) so each request gets its own
  // client during SSR, while still being stable across client re-renders.
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // A 401 is meaningful (logged out / expired session), not a
            // transient network blip - retrying it three times is wasted
            // work and delays the auth/me → guard redirect decision.
            retry: false,
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
