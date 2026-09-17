"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getStaffHomeLayout,
  listPublishedForPlacement,
  setHomePlacement,
} from "@/services/public-article.service";
import { getApiErrorMessage } from "@/lib/api-error";
import type { HomeSlot, PublicArticle } from "@/types/public-article";

export const homeLayoutKey = ["articles", "home-layout"] as const;

export function useStaffHomeLayout() {
  return useQuery({
    queryKey: homeLayoutKey,
    queryFn: async () => {
      const response = await getStaffHomeLayout();
      return response.data;
    },
  });
}

export function usePublishedForPlacement(q: string) {
  return useQuery({
    queryKey: ["articles", "published", q],
    queryFn: async () => {
      const response = await listPublishedForPlacement({
        q: q || undefined,
        limit: 30,
      });
      return response.data;
    },
  });
}

export function useSetHomePlacement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      homeSlot,
      homeRank,
    }: {
      id: string;
      homeSlot: HomeSlot | null;
      homeRank?: number;
    }) => setHomePlacement(id, { homeSlot, homeRank }),
    onSuccess: (response) => {
      toast.success(response.message);
      void queryClient.invalidateQueries({ queryKey: homeLayoutKey });
      void queryClient.invalidateQueries({ queryKey: ["articles", "published"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export type SlotArticle = PublicArticle;
