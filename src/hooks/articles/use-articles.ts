"use client";

import { useQuery } from "@tanstack/react-query";

import { articleKeys } from "@/hooks/articles/keys";
import { getArticleById, listArticleQueue, listArticles } from "@/services/article.service";
import type { ListArticlesParams } from "@/types/article";

export function useArticles(params?: ListArticlesParams) {
  return useQuery({
    queryKey: articleKeys.list(params),
    queryFn: async () => {
      const response = await listArticles(params);
      return response.data;
    },
  });
}

export function useArticleQueue() {
  return useQuery({
    queryKey: articleKeys.queue(),
    queryFn: async () => {
      const response = await listArticleQueue();
      return response.data;
    },
  });
}

export function useArticle(id: string | undefined) {
  return useQuery({
    queryKey: articleKeys.detail(id ?? ""),
    queryFn: async () => {
      const response = await getArticleById(id!);
      return response.data;
    },
    enabled: Boolean(id),
  });
}
