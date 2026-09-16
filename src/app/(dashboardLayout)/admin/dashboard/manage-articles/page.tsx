import { Suspense } from "react";

import { ManageArticlesView } from "@/components/dashboard/ManageArticlesView";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-24 w-full" />
        </div>
      }
    >
      <ManageArticlesView basePath="/admin/dashboard/manage-articles" />
    </Suspense>
  );
}
