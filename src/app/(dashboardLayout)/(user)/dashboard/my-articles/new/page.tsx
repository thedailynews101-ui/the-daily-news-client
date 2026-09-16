"use client";

import { ArticleForm } from "@/components/dashboard/ArticleForm";

export default function NewMyArticlePage() {
  return (
    <ArticleForm
      mode="create"
      successHref="/dashboard/my-articles"
      title="Request an article"
      description="Write your story and save it as a draft. You can submit it for review from My Articles."
    />
  );
}
