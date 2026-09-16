"use client";

import { useQuery } from "@tanstack/react-query";

import { articleKeys } from "@/hooks/articles/keys";
import { listMyArticles, getMyArticleSummary } from "@/services/article.service";
import type { MineArticlesParams } from "@/types/article";

export function useMyArticles(params?: MineArticlesParams) {
  return useQuery({
    queryKey: articleKeys.mine(params),
    queryFn: async () => {
      const response = await listMyArticles(params);
      return response.data;
    },
  });
}

export function useMyArticleSummary() {
  return useQuery({
    queryKey: articleKeys.mineSummary(),
    queryFn: async () => {
      const response = await getMyArticleSummary();
      return response.data;
    },
  });
}
