"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { ArticleStatusBadge } from "@/components/dashboard/ArticleStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ARTICLE_STATUS_LABELS } from "@/hooks/articles/keys";
import {
  useArchiveArticle,
  useDeleteArticle,
  usePublishDraft,
  useRestoreArticle,
} from "@/hooks/articles/use-article-mutations";
import { useArticles } from "@/hooks/articles/use-articles";
import { cn } from "@/lib/utils";
import type { Article, ArticleStatus } from "@/types/article";

const STAFF_TABS: Array<ArticleStatus | "ALL"> = [
  "ALL",
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "ARCHIVED",
];

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ManageArticleActions({
  article,
  basePath,
  isOwner,
}: {
  article: Article;
  basePath: string;
  isOwner: boolean;
}) {
  const deleteMutation = useDeleteArticle();
  const archiveMutation = useArchiveArticle();
  const restoreMutation = useRestoreArticle();
  const publishMutation = usePublishDraft();
  const busy =
    deleteMutation.isPending ||
    archiveMutation.isPending ||
    restoreMutation.isPending ||
    publishMutation.isPending;

  return (
    <div className="flex flex-wrap gap-2">
      {isOwner && (
        <Button size="sm" variant="outline" render={<Link href={`${basePath}/${article.id}/edit`} />}>
          Edit
        </Button>
      )}
      {isOwner && article.status === "DRAFT" && (
        <Button
          size="sm"
          disabled={busy}
          onClick={() => publishMutation.mutate({ id: article.id })}
        >
          {publishMutation.isPending ? "Publishing..." : "Publish"}
        </Button>
      )}
      {article.status === "APPROVED" && (
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => archiveMutation.mutate({ id: article.id })}
        >
          Archive
        </Button>
      )}
      {article.status === "ARCHIVED" && (
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => restoreMutation.mutate({ id: article.id })}
        >
          Restore
        </Button>
      )}
      {isOwner && (
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

type ManageArticlesViewProps = {
  /** e.g. `/admin/dashboard/manage-articles` or `/employee/dashboard/manage-articles` */
  basePath: string;
};

export function ManageArticlesView({ basePath }: ManageArticlesViewProps) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const activeTab: ArticleStatus | "ALL" =
    statusParam && STAFF_TABS.includes(statusParam as ArticleStatus)
      ? (statusParam as ArticleStatus)
      : "ALL";

  const { data, isLoading, isError } = useArticles({
    status: activeTab === "ALL" ? undefined : activeTab,
    limit: 50,
  });

  const setTab = (tab: ArticleStatus | "ALL") => {
    const params = new URLSearchParams();
    if (tab !== "ALL") params.set("status", tab);
    const query = params.toString();
    router.replace(query ? `${basePath}?${query}` : basePath);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Manage Articles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit or delete your own articles. Archive or restore any article in the newsroom.
          </p>
        </div>
        <Button render={<Link href={`${basePath}/new`} />}>New article</Button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {STAFF_TABS.map((tab) => (
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
            Could not load articles. Please try again.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && data?.items.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No articles</CardTitle>
            <CardDescription>Create a staff article or wait for user submissions.</CardDescription>
          </CardHeader>
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
                    By {article.author.name} · Updated {formatDate(article.updatedAt)}
                  </CardDescription>
                </div>
                <ArticleStatusBadge status={article.status} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {article.excerpt && (
                <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
              )}
              <ManageArticleActions
                article={article}
                basePath={basePath}
                isOwner={article.author.id === user?.id}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
