import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Article } from "@/types/news";
import { ArticleMeta, CategoryLabel } from "./ArticleMeta";

function PinnedItem({ article, index }: { article: Article; index: number }) {
  return (
    <li className="flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="font-heading text-lg font-bold text-muted-foreground/40 tabular-nums">
        {String(index).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <CategoryLabel category={article.category} />
        <Link href={`/articles/${article.slug}`}>
          <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug hover:underline">
            {article.title}
          </h4>
        </Link>
        <ArticleMeta article={article} className="mt-1.5" />
      </div>
    </li>
  );
}

export function PinnedColumn({
  articles,
  className,
}: {
  articles: Article[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col rounded-lg border border-border bg-card p-4", className)}>
      <h3 className="font-heading text-xs font-bold tracking-widest text-muted-foreground uppercase">
        Fixed News
      </h3>
      <ul className="mt-3 flex flex-col gap-3">
        {articles.map((article, i) => (
          <PinnedItem key={article.id} article={article} index={i + 1} />
        ))}
      </ul>
    </div>
  );
}
