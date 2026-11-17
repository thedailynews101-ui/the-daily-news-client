import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchResultsView } from "@/components/home/SearchResultsView";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Search - inQtin",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-3xl px-4 py-10">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="mt-6 h-10 w-full" />
        </div>
      }
    >
      <SearchResultsView />
    </Suspense>
  );
}
