"use client";

import { use } from "react";

import { ArticleForm } from "@/components/dashboard/ArticleForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticle } from "@/hooks/articles/use-articles";

export default function EditMyArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: article, isLoading, isError } = useArticle(id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full max-w-3xl" />
      </div>
    );
  }

  if (isError || !article) {
    return <p className="text-sm text-destructive">Article not found or unavailable.</p>;
  }

  if (article.status !== "DRAFT" && article.status !== "REJECTED") {
    return (
      <p className="text-sm text-muted-foreground">
        This article can no longer be edited. Withdraw it first if it is pending review.
      </p>
    );
  }

  return (
    <ArticleForm
      mode="edit"
      article={article}
      successHref="/dashboard/my-articles"
      title="Edit article"
    />
  );
}
