"use client";

import { ArticleForm } from "@/components/dashboard/ArticleForm";

export default function NewEmployeeArticlePage() {
  return (
    <ArticleForm
      mode="create"
      isStaff
      successHref="/employee/dashboard/manage-articles"
      title="New article"
      description="Create a newsroom article. You can publish immediately or save as a draft."
    />
  );
}
