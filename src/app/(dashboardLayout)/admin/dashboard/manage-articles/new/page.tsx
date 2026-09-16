"use client";

import { ArticleForm } from "@/components/dashboard/ArticleForm";

export default function NewAdminArticlePage() {
  return (
    <ArticleForm
      mode="create"
      isStaff
      successHref="/admin/dashboard/manage-articles"
      title="New article"
      description="Create a newsroom article. You can publish immediately or save as a draft."
    />
  );
}
