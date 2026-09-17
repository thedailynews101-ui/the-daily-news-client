import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getPublicArticleBySlug } from "@/services/public-article.service";
import { toSafeCoverImageUrl } from "@/lib/to-safe-cover-image-url";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function loadArticle(slug: string) {
  try {
    const response = await getPublicArticleBySlug(slug);
    return response.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);

  if (!article) {
    return { title: "Article not found - The Daily Newsfeed" };
  }

  return {
    title: `${article.title} - The Daily Newsfeed`,
    description: article.excerpt ?? undefined,
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await loadArticle(slug);

  if (!article) {
    notFound();
  }

  const publishedLabel = article.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(article.publishedAt))
    : null;

  const coverSrc = toSafeCoverImageUrl(article.coverImageUrl);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {article.category ? (
        <p className="text-[11px] font-semibold tracking-wide text-brand uppercase">
          {article.category.name}
        </p>
      ) : null}

      <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {article.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>{article.author.name}</span>
        {publishedLabel ? (
          <>
            <span aria-hidden>·</span>
            <time dateTime={article.publishedAt ?? undefined}>{publishedLabel}</time>
          </>
        ) : null}
        <span aria-hidden>·</span>
        <span>{article.readTimeMinutes} min read</span>
      </div>

      {article.excerpt ? (
        <p className="mt-6 text-lg text-muted-foreground">{article.excerpt}</p>
      ) : null}

      {coverSrc ? (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={coverSrc}
            alt={article.title}
            fill
            preload
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="prose-news mt-10 whitespace-pre-wrap text-base leading-7 text-foreground">
        {article.content}
      </div>

      {article.tags.length > 0 ? (
        <ul className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          {article.tags.map((tag) => (
            <li
              key={tag.id}
              className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {tag.name}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
