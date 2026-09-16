"use client";

import { useQuery } from "@tanstack/react-query";

import { categoryKeys } from "@/hooks/articles/keys";
import { listCategories } from "@/services/category.service";

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: async () => {
      const response = await listCategories();
      return response.data;
    },
  });
}
