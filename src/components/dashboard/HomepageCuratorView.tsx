"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePublishedForPlacement,
  useSetHomePlacement,
  useStaffHomeLayout,
} from "@/hooks/articles/use-home-placement";
import type { HomeSlot, PublicArticle } from "@/types/public-article";

const SLOTS: Array<{ slot: HomeSlot; title: string; description: string; single?: boolean }> = [
  {
    slot: "HERO",
    title: "Hero carousel",
    description: "Top stories rotating in the homepage hero.",
  },
  {
    slot: "MEGA",
    title: "Mega story",
    description: "The single large story spanning columns 1–2.",
    single: true,
  },
  {
    slot: "FEED",
    title: "Feed (cols 1–2)",
    description: "Cards under the mega story.",
  },
  {
    slot: "VISUAL",
    title: "Visual column (col 3)",
    description: "Image-first cards.",
  },
  {
    slot: "PINNED",
    title: "Pinned column (col 4)",
    description: "Dense text list on the right.",
  },
];

function SlotList({
  slot,
  title,
  description,
  single,
  articles,
}: {
  slot: HomeSlot;
  title: string;
  description: string;
  single?: boolean;
  articles: PublicArticle[];
}) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const placementMutation = useSetHomePlacement();
  const publishedQuery = usePublishedForPlacement(query);

  const moveRank = (article: PublicArticle, direction: -1 | 1) => {
    const index = articles.findIndex((item) => item.id === article.id);
    const swapWith = articles[index + direction];
    if (!swapWith) return;

    placementMutation.mutate({ id: article.id, homeSlot: slot, homeRank: swapWith.homeRank });
    placementMutation.mutate({ id: swapWith.id, homeSlot: slot, homeRank: article.homeRank });
  };

  const assign = (articleId: string) => {
    const nextRank = articles.length === 0 ? 0 : Math.max(...articles.map((a) => a.homeRank)) + 1;
    placementMutation.mutate(
      { id: articleId, homeSlot: slot, homeRank: single ? 0 : nextRank },
      {
        onSuccess: () => {
          setPickerOpen(false);
          setQuery("");
        },
      }
    );
  };

  const remove = (articleId: string) => {
    placementMutation.mutate({ id: articleId, homeSlot: null });
  };

  const moveTo = (articleId: string, nextSlot: HomeSlot) => {
    placementMutation.mutate({ id: articleId, homeSlot: nextSlot, homeRank: 0 });
  };

  const busy = placementMutation.isPending;
  const canAdd = !single || articles.length === 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {canAdd && (
            <Button size="sm" variant="outline" onClick={() => setPickerOpen((open) => !open)}>
              <Plus className="size-4" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {pickerOpen && (
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search published articles by title…"
              className="mb-2"
            />
            <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
              {publishedQuery.isLoading && <Skeleton className="h-8 w-full" />}
              {publishedQuery.data?.items.map((article) => (
                <button
                  key={article.id}
                  type="button"
                  disabled={busy}
                  onClick={() => assign(article.id)}
                  className="rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                >
                  {article.title}
                  {article.homeSlot ? (
                    <span className="ml-2 text-xs text-muted-foreground">({article.homeSlot})</span>
                  ) : null}
                </button>
              ))}
              {!publishedQuery.isLoading && (publishedQuery.data?.items.length ?? 0) === 0 && (
                <p className="px-2 py-1 text-sm text-muted-foreground">No published articles found.</p>
              )}
            </div>
          </div>
        )}

        {articles.length === 0 && (
          <p className="text-sm text-muted-foreground">No articles in this slot yet.</p>
        )}

        {articles.map((article, index) => (
          <div
            key={article.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{article.title}</p>
              <p className="text-xs text-muted-foreground">Rank {article.homeRank}</p>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {!single && (
                <>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    disabled={busy || index === 0}
                    onClick={() => moveRank(article, -1)}
                    aria-label="Move up"
                  >
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    disabled={busy || index === articles.length - 1}
                    onClick={() => moveRank(article, 1)}
                    aria-label="Move down"
                  >
                    <ArrowDown className="size-3.5" />
                  </Button>
                </>
              )}
              <select
                className="h-7 rounded-md border border-border bg-background px-2 text-xs"
                value={slot}
                disabled={busy}
                onChange={(event) => moveTo(article.id, event.target.value as HomeSlot)}
                aria-label="Move to slot"
              >
                {SLOTS.map((option) => (
                  <option key={option.slot} value={option.slot}>
                    Move to {option.title}
                  </option>
                ))}
              </select>
              <Button
                size="icon-sm"
                variant="destructive"
                disabled={busy}
                onClick={() => remove(article.id)}
                aria-label="Remove from homepage"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function HomepageCuratorView() {
  const { data, isLoading, isError } = useStaffHomeLayout();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-destructive">Could not load homepage layout.</p>;
  }

  const bySlot: Record<HomeSlot, PublicArticle[]> = {
    HERO: data.hero,
    MEGA: data.mega ? [data.mega] : [],
    FEED: data.feed,
    VISUAL: data.visual,
    PINNED: data.pinned,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Homepage</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose which published stories appear in the hero, mega, feed, visual, and pinned
          columns. Shuffle by moving articles between slots.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {SLOTS.map((config) => (
          <SlotList
            key={config.slot}
            slot={config.slot}
            title={config.title}
            description={config.description}
            single={config.single}
            articles={bySlot[config.slot]}
          />
        ))}
      </div>
    </div>
  );
}
