import { cn } from "@/lib/utils";
import type { Article, ArticleCategory } from "@/types/news";

const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  politics: "Politics",
  business: "Business",
  technology: "Technology",
  sports: "Sports",
  entertainment: "Entertainment",
  world: "World",
  health: "Health",
  science: "Science",
  lifestyle: "Lifestyle",
};

export function CategoryLabel({
  category,
  className,
}: {
  category: ArticleCategory;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-[11px] font-semibold tracking-wide text-brand uppercase",
        className
      )}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}

export function ArticleMeta({
  article,
  className,
}: {
  article: Article;
  className?: string;
}) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(article.publishedAt));

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <span>{article.author.name}</span>
      <span aria-hidden>·</span>
      <span>{formattedDate}</span>
      <span aria-hidden>·</span>
      <span>{article.readTimeMinutes} min read</span>
    </div>
  );
}
