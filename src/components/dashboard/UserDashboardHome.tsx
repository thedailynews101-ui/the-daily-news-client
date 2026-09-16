"use client";

import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ARTICLE_STATUS_LABELS } from "@/hooks/articles/keys";
import { useMyArticleSummary } from "@/hooks/articles/use-my-articles";
import type { ArticleStatus } from "@/types/article";

const SUMMARY_STATUSES: ArticleStatus[] = [
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "ARCHIVED",
];

export function UserDashboardHome() {
  const { data, isLoading } = useMyArticleSummary();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A quick look at your submitted stories.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUMMARY_STATUSES.map((status) => (
            <Link
              key={status}
              href={
                status === "ARCHIVED"
                  ? "/dashboard/my-articles"
                  : `/dashboard/my-articles?status=${status}`
              }
              className="block"
            >
              <Card className="transition-colors hover:bg-muted/40">
                <CardHeader>
                  <CardDescription>{ARTICLE_STATUS_LABELS[status]}</CardDescription>
                  <CardTitle className="text-3xl tabular-nums">
                    {data?.[status] ?? 0}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">View in My Articles</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
