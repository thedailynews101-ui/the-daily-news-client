import Image from "next/image";
import Link from "next/link";

import type { Article } from "@/types/news";
import { ArticleMeta, CategoryLabel } from "./ArticleMeta";

export function MegaArticle({ article }: { article: Article }) {
  const href = `/articles/${article.slug}`;

  return (
    <article className="flex flex-col gap-4">
      {article.imageUrl ? (
        <Link
          href={href}
          className="relative block aspect-[16/10] w-full overflow-hidden rounded-lg bg-muted"
        >
          <Image
            src={article.imageUrl}
            alt={article.imageAlt}
            fill
            preload
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </Link>
      ) : null}
      <div>
        <CategoryLabel category={article.category} />
        <Link href={href}>
          <h2 className="mt-2 font-heading text-2xl leading-tight font-bold text-brand hover:underline sm:text-3xl">
            {article.title}
          </h2>
        </Link>
        {article.excerpt ? (
          <p className="mt-3 text-muted-foreground">{article.excerpt}</p>
        ) : null}
        <ArticleMeta article={article} className="mt-4" />
      </div>
    </article>
  );
}
