export type ArticleCategory = string;

export interface ArticleAuthor {
  name: string;
  avatarUrl?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Display label or slug from the API category. */
  category: ArticleCategory;
  /** Empty string when the article has no cover image. */
  imageUrl: string;
  imageAlt: string;
  author: ArticleAuthor;
  publishedAt: string;
  readTimeMinutes: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isPinned?: boolean;
}

