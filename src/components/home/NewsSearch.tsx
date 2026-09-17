"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toSafeCoverImageUrl } from "@/lib/to-safe-cover-image-url";
import { searchPublicArticles } from "@/services/public-article.service";

const DEBOUNCE_MS = 300;

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function NewsSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebouncedValue(query.trim(), DEBOUNCE_MS);

  const searchQuery = useQuery({
    queryKey: ["public", "search", "dropdown", debouncedQuery],
    queryFn: async () => {
      const response = await searchPublicArticles({ q: debouncedQuery, limit: 6, page: 1 });
      return response.data;
    },
    enabled: debouncedQuery.length >= 2,
  });

  React.useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const goToSearchPage = (value: string) => {
    const q = value.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const showDropdown = open && query.trim().length >= 2;
  const items = searchQuery.data?.items ?? [];

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-xs", className)}>
      <form
        role="search"
        aria-label="Search news"
        className="flex w-full items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          goToSearchPage(query);
        }}
      >
        <Input
          type="search"
          placeholder="Search news…"
          aria-label="Search news"
          aria-expanded={showDropdown}
          aria-controls="news-search-results"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        />
        <Button type="submit" size="icon" variant="outline" aria-label="Search">
          <Search className="size-4" />
        </Button>
      </form>

      {showDropdown && (
        <div
          id="news-search-results"
          className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border border-border bg-popover shadow-md"
        >
          {searchQuery.isFetching && (
            <p className="px-3 py-3 text-sm text-muted-foreground">Searching…</p>
          )}

          {searchQuery.isError && (
            <p className="px-3 py-3 text-sm text-destructive">Search failed. Try again.</p>
          )}

          {!searchQuery.isFetching && !searchQuery.isError && items.length === 0 && (
            <p className="px-3 py-3 text-sm text-muted-foreground">No matching articles.</p>
          )}

          {items.length > 0 && (
            <ul className="max-h-80 overflow-y-auto py-1">
              {items.map((article) => {
                const coverSrc = toSafeCoverImageUrl(article.coverImageUrl);
                return (
                <li key={article.id}>
                  <Link
                    href={`/articles/${article.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex gap-3 px-3 py-2 hover:bg-muted"
                  >
                    {coverSrc ? (
                      <span className="relative mt-0.5 size-12 shrink-0 overflow-hidden rounded bg-muted">
                        <Image
                          src={coverSrc}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </span>
                    ) : (
                      <span className="mt-0.5 size-12 shrink-0 rounded bg-muted" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-sm font-medium text-foreground">
                        {article.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {[article.category?.name, formatDate(article.publishedAt)]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                  </Link>
                </li>
                );
              })}
            </ul>
          )}

          <button
            type="button"
            className="block w-full border-t border-border px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-muted"
            onClick={() => goToSearchPage(query)}
          >
            View all results
          </button>
        </div>
      )}
    </div>
  );
}
