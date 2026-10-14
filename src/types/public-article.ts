import type { PublicEventGroup } from "@/types/event";

export type HomeSlot = "HERO" | "MEGA" | "FEED" | "VISUAL" | "PINNED";

export type PublicArticleAuthor = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type PublicArticleCategory = {
  id: string;
  name: string;
  slug: string;
};

export type PublicArticleTag = {
  id: string;
  name: string;
  slug: string;
};

/** Slim published article used on home, search, and detail. */
export type PublicArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  content?: string;
  isFeatured: boolean;
  isBreaking: boolean;
  homeSlot: HomeSlot | null;
  homeRank: number;
  readTimeMinutes: number;
  viewCount?: number;
  author: PublicArticleAuthor;
  category: PublicArticleCategory | null;
  tags: PublicArticleTag[];
  publishedAt: string | null;
};

export type HomeLayout = {
  hero: PublicArticle[];
  mega: PublicArticle | null;
  feed: PublicArticle[];
  visual: PublicArticle[];
  /** Fixed News uses eventGroups; kept empty for API compatibility. */
  pinned: PublicArticle[];
  eventGroups: PublicEventGroup[];
};

export type PublicSearchResult = {
  items: PublicArticle[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    q?: string;
  };
};
