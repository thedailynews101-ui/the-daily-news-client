import type { ArticleStatus, ListArticlesParams, MineArticlesParams } from "@/types/article";

export const articleKeys = {
  all: ["articles"] as const,
  mine: (params?: MineArticlesParams) => [...articleKeys.all, "mine", params ?? {}] as const,
  mineSummary: () => [...articleKeys.all, "mine", "summary"] as const,
  list: (params?: ListArticlesParams) => [...articleKeys.all, "list", params ?? {}] as const,
  queue: () => [...articleKeys.all, "queue"] as const,
  detail: (id: string) => [...articleKeys.all, "detail", id] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
};

export const ARTICLE_STATUS_LABELS: Record<ArticleStatus, string> = {
  DRAFT: "Draft",
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
};
