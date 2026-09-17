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

export interface Quote {
  id: string;
  text: string;
  author: string;
  setBy: string;
  date: string;
  isActive: boolean;
}

export interface WeatherSnapshot {
  location: string;
  temperatureC: number;
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "snowy" | "windy";
  high: number;
  low: number;
  updatedAt: string;
}
