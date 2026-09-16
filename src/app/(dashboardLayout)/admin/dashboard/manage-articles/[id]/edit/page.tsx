"use client";

import { use } from "react";

import { ArticleForm } from "@/components/dashboard/ArticleForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticle } from "@/hooks/articles/use-articles";

export default function EditAdminArticlePage({
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

  return (
    <ArticleForm
      mode="edit"
      isStaff
      article={article}
      successHref="/admin/dashboard/manage-articles"
      title="Edit article"
    />
  );
}
