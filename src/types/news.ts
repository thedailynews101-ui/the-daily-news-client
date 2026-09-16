export type ArticleCategory =
  | "politics"
  | "business"
  | "technology"
  | "sports"
  | "entertainment"
  | "world"
  | "health"
  | "science"
  | "lifestyle";

export interface ArticleAuthor {
  name: string;
  avatarUrl?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  imageUrl: string;
  imageAlt: string;
  author: ArticleAuthor;
  publishedAt: string;
  readTimeMinutes: number;
  /** Shown in the hero carousel. */
  isBreaking?: boolean;
  /** Used as the large mega-article at the top of the feed. */
  isFeatured?: boolean;
  /** Shown in the dense "fixed news" column. */
  isPinned?: boolean;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  /** Name of the admin who set this as the quote of the day. */
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
