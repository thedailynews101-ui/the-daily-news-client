"use client";

import { ARTICLE_STATUS_LABELS } from "@/hooks/articles/keys";
import { cn } from "@/lib/utils";
import type { ArticleStatus } from "@/types/article";

const STATUS_STYLES: Record<ArticleStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING: "bg-amber-100 text-amber-900",
  APPROVED: "bg-emerald-100 text-emerald-900",
  REJECTED: "bg-destructive/10 text-destructive",
  ARCHIVED: "bg-secondary text-secondary-foreground",
};

export function ArticleStatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {ARTICLE_STATUS_LABELS[status]}
    </span>
  );
}
