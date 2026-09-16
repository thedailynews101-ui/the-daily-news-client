"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { ArticleStatusBadge } from "@/components/dashboard/ArticleStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ARTICLE_STATUS_LABELS } from "@/hooks/articles/keys";
import {
  useDeleteArticle,
  useSubmitArticle,
  useWithdrawArticle,
} from "@/hooks/articles/use-article-mutations";
import { useMyArticles } from "@/hooks/articles/use-my-articles";
import { cn } from "@/lib/utils";
import type { Article, ArticleStatus } from "@/types/article";

const USER_TABS: Array<ArticleStatus | "ALL"> = [
  "ALL",
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REJECTED",
];

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ArticleActions({ article }: { article: Article }) {
  const submitMutation = useSubmitArticle();
  const withdrawMutation = useWithdrawArticle();
  const deleteMutation = useDeleteArticle();
  const busy =
    submitMutation.isPending || withdrawMutation.isPending || deleteMutation.isPending;

  const canEdit = article.status === "DRAFT" || article.status === "REJECTED";
  const canSubmit = article.status === "DRAFT" || article.status === "REJECTED";
  const canWithdraw = article.status === "PENDING";
  const canDelete =
    article.status === "DRAFT" ||
    article.status === "PENDING" ||
    article.status === "REJECTED";

  return (
    <div className="flex flex-wrap gap-2">
      {canEdit && (
        <Button
          size="sm"
          variant="outline"
          render={<Link href={`/dashboard/my-articles/${article.id}/edit`} />}
        >
          Edit
        </Button>
      )}
      {canSubmit && (
        <Button
          size="sm"
          disabled={busy}
          onClick={() => submitMutation.mutate(article.id)}
        >
          Submit
        </Button>
      )}
      {canWithdraw && (
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => withdrawMutation.mutate(article.id)}
        >
          Withdraw
        </Button>
      )}
      {canDelete && (
        <Button
          size="sm"
          variant="destructive"
          disabled={busy}
          onClick={() => {
            if (window.confirm("Delete this article? This cannot be undone.")) {
              deleteMutation.mutate(article.id);
            }
          }}
        >
          Delete
        </Button>
      )}
    </div>
  );
}

export function MyArticlesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const activeTab: ArticleStatus | "ALL" =
    statusParam && USER_TABS.includes(statusParam as ArticleStatus)
      ? (statusParam as ArticleStatus)
      : "ALL";

  const { data, isLoading, isError } = useMyArticles({
    status: activeTab === "ALL" ? undefined : activeTab,
    limit: 50,
  });

  const setTab = (tab: ArticleStatus | "ALL") => {
    const params = new URLSearchParams();
    if (tab !== "ALL") params.set("status", tab);
    const query = params.toString();
    router.replace(query ? `/dashboard/my-articles?${query}` : "/dashboard/my-articles");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">My Articles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Draft, submit, and track the status of your stories.
          </p>
        </div>
        <Button render={<Link href="/dashboard/my-articles/new" />}>New article</Button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {USER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setTab(tab)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {tab === "ALL" ? "All" : ARTICLE_STATUS_LABELS[tab]}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            Could not load your articles. Please try again.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && data?.items.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No articles yet</CardTitle>
            <CardDescription>
              Start a draft and submit it when you&apos;re ready for review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/dashboard/my-articles/new" />}>Write an article</Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {data?.items.map((article) => (
          <Card key={article.id}>
            <CardHeader className="gap-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription className="mt-1">
                    Updated {formatDate(article.updatedAt)}
                    {article.submittedAt ? ` · Submitted ${formatDate(article.submittedAt)}` : ""}
                  </CardDescription>
                </div>
                <ArticleStatusBadge status={article.status} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {article.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
              )}
              {article.status === "REJECTED" && article.rejectionReason && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  Rejection reason: {article.rejectionReason}
                </p>
              )}
              <ArticleActions article={article} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
