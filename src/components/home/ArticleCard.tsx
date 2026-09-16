import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Article } from "@/types/news";
import { ArticleMeta, CategoryLabel } from "./ArticleMeta";

export function ArticleCard({
  article,
  className,
  imageAspect = "aspect-[4/3]",
}: {
  article: Article;
  className?: string;
  imageAspect?: string;
}) {
  const href = `/articles/${article.slug}`;

  return (
    <article className={cn("group flex flex-col gap-2.5", className)}>
      <Link
        href={href}
        className={cn(
          "relative block w-full overflow-hidden rounded-md bg-muted",
          imageAspect
        )}
      >
        <Image
          src={article.imageUrl}
          alt={article.imageAlt}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div>
        <CategoryLabel category={article.category} />
        <Link href={href}>
          <h3 className="mt-1 line-clamp-3 font-heading text-sm leading-snug font-semibold group-hover:underline sm:text-base">
            {article.title}
          </h3>
        </Link>
        <ArticleMeta article={article} className="mt-2" />
      </div>
    </article>
  );
}
