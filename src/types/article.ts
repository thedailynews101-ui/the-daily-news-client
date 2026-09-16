export type ArticleStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";

export type ArticleAuthor = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type ArticleCategory = {
  id: string;
  name: string;
  slug: string;
};

export type ArticleTag = {
  id: string;
  name: string;
  slug: string;
};

export type ArticleReviewer = {
  id: string;
  name: string;
};

/** Matches the server's article DTO from article.service.toArticleDTO. */
export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  status: ArticleStatus;
  isFeatured: boolean;
  isBreaking: boolean;
  readTimeMinutes: number;
  viewCount: number;
  author: ArticleAuthor;
  category: ArticleCategory | null;
  tags: ArticleTag[];
  submittedAt: string | null;
  reviewedBy: ArticleReviewer | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ArticleListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ArticleListResult = {
  items: Article[];
  meta: ArticleListMeta;
};

export type ArticleSummary = Record<ArticleStatus, number>;

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateArticlePayload = {
  title: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  categoryId?: string | null;
  tagNames?: string[];
  tagIds?: string[];
  readTimeMinutes?: number;
  status?: "DRAFT" | "APPROVED";
  isFeatured?: boolean;
  isBreaking?: boolean;
  publishedAt?: string;
};

export type UpdateArticlePayload = {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  categoryId?: string | null;
  tagNames?: string[];
  tagIds?: string[];
  readTimeMinutes?: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
};

export type ApproveArticlePayload = {
  note?: string;
  publishedAt?: string;
};

export type RejectArticlePayload = {
  reason: string;
};

export type ArchiveArticlePayload = {
  note?: string;
};

export type RestoreArticlePayload = {
  note?: string;
};

export type ListArticlesParams = {
  status?: ArticleStatus;
  authorId?: string;
  page?: number;
  limit?: number;
};

export type MineArticlesParams = {
  status?: ArticleStatus;
  page?: number;
  limit?: number;
};
