"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Article } from "@/types/news";

const AUTO_ADVANCE_MS = 6000;

export function HeroCarousel({ articles }: { articles: Article[] }) {
  const count = articles.length;
  const [index, setIndex] = React.useState(0);

  const goTo = React.useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  React.useEffect(() => {
    if (count <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [count]);

  if (count === 0) return null;
  const active = articles[index];

  return (
    <section
      aria-label="Top stories"
      className="relative isolate h-[280px] w-full overflow-hidden sm:h-[360px] lg:h-[460px]"
    >
      {articles.map((article, i) => (
        <div
          key={article.id}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "opacity-0"
          )}
        >
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.imageAlt}
              fill
              preload={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
        </div>
      ))}

      <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-8 sm:px-6 lg:px-8">
        {active.isBreaking ? (
          <span className="mb-2 inline-flex w-fit items-center rounded-sm bg-brand px-2 py-0.5 text-xs font-semibold tracking-wide text-brand-foreground uppercase">
            Breaking
          </span>
        ) : null}
        <Link href={`/articles/${active.slug}`} className="max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            {active.title}
          </h2>
        </Link>
        {active.excerpt ? (
          <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-white/80 sm:text-base">
            {active.excerpt}
          </p>
        ) : null}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous story"
            className="absolute top-1/2 left-2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 sm:left-4"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next story"
            className="absolute top-1/2 right-2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 sm:right-4"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {articles.map((article, i) => (
              <button
                key={article.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to story ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
