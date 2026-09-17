"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toSafeCoverImageUrl } from "@/lib/to-safe-cover-image-url";
import { searchPublicArticles } from "@/services/public-article.service";

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function SearchResultsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const [input, setInput] = React.useState(q);

  React.useEffect(() => {
    setInput(q);
  }, [q]);

  const resultsQuery = useQuery({
    queryKey: ["public", "search", "page", q, page],
    queryFn: async () => {
      const response = await searchPublicArticles({ q, page, limit: 20 });
      return response.data;
    },
    enabled: q.trim().length >= 2,
  });

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams();
    params.set("q", q);
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(`/search?${params.toString()}`);
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const next = input.trim();
    if (!next) return;
    router.push(`/search?q=${encodeURIComponent(next)}`);
  };

  const totalPages = resultsQuery.data?.meta.totalPages ?? 1;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Search</h1>

      <form onSubmit={submitSearch} className="mt-6 flex gap-2">
        <Input
          type="search"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Search published articles…"
          aria-label="Search query"
        />
        <Button type="submit">Search</Button>
      </form>

      {q.trim().length < 2 && (
        <p className="mt-8 text-sm text-muted-foreground">
          Enter at least 2 characters to search published articles.
        </p>
      )}

      {q.trim().length >= 2 && resultsQuery.isLoading && (
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {q.trim().length >= 2 && resultsQuery.isError && (
        <p className="mt-8 text-sm text-destructive">Search failed. Please try again.</p>
      )}

      {q.trim().length >= 2 &&
        !resultsQuery.isLoading &&
        !resultsQuery.isError &&
        (resultsQuery.data?.items.length ?? 0) === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">
            No results for &ldquo;{q}&rdquo;.
          </p>
        )}

      <div className="mt-8 flex flex-col gap-3">
        {resultsQuery.data?.items.map((article) => {
          const coverSrc = toSafeCoverImageUrl(article.coverImageUrl);
          return (
          <Card key={article.id}>
            <CardContent className="flex gap-4 py-4">
              {coverSrc ? (
                <Link
                  href={`/articles/${article.slug}`}
                  className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted"
                >
                  <Image
                    src={coverSrc}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>
              ) : null}
              <div className="min-w-0 flex-1">
                {article.category ? (
                  <p className="text-[11px] font-semibold tracking-wide text-brand uppercase">
                    {article.category.name}
                  </p>
                ) : null}
                <Link href={`/articles/${article.slug}`}>
                  <h2 className="mt-1 font-heading text-lg font-semibold hover:underline">
                    {article.title}
                  </h2>
                </Link>
                {article.excerpt ? (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {[article.author.name, formatDate(article.publishedAt)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>

      {q.trim().length >= 2 && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            disabled={page <= 1 || resultsQuery.isFetching}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <Button
            variant="outline"
            disabled={page >= totalPages || resultsQuery.isFetching}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
