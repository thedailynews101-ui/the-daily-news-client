import { cn } from "@/lib/utils";
import type { Article } from "@/types/news";
import { MegaArticle } from "./MegaArticle";
import { ArticleCard } from "./ArticleCard";

export function FeedMainColumn({
  mega,
  articles,
  className,
}: {
  mega: Article | null;
  articles: Article[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {mega && <MegaArticle article={mega} />}

      <div className="grid grid-cols-2 gap-x-6 gap-y-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
