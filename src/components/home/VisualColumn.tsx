import { cn } from "@/lib/utils";
import type { Article } from "@/types/news";
import { ArticleCard } from "./ArticleCard";

export function VisualColumn({
  articles,
  className,
}: {
  articles: Article[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} imageAspect="aspect-[16/10]" />
      ))}
    </div>
  );
}
