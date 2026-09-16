import { Suspense } from "react";

import { MyArticlesView } from "@/components/dashboard/MyArticlesView";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-24 w-full" />
        </div>
      }
    >
      <MyArticlesView />
    </Suspense>
  );
}
