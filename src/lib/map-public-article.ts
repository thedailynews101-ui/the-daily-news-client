import type { Article } from "@/types/news";
import type { PublicArticle } from "@/types/public-article";
import { toSafeCoverImageUrl } from "@/lib/to-safe-cover-image-url";

/** Maps API public articles into the home card shape expected by existing UI. */
export function toHomeArticle(article: PublicArticle): Article {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt ?? "",
    category: article.category?.name ?? article.category?.slug ?? "News",
    imageUrl: toSafeCoverImageUrl(article.coverImageUrl),
    imageAlt: article.title,
    author: {
      name: article.author.name,
      avatarUrl: article.author.avatarUrl ?? undefined,
    },
    publishedAt: article.publishedAt ?? new Date().toISOString(),
    readTimeMinutes: article.readTimeMinutes,
    isBreaking: article.isBreaking,
    isFeatured: article.isFeatured,
    isPinned: article.homeSlot === "PINNED",
  };
}
