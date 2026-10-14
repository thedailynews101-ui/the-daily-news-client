"use client";

import { useQuery } from "@tanstack/react-query";

import { quoteKeys } from "@/hooks/widgets/keys";
import { listQuotes } from "@/services/quote.service";

export function useQuotes() {
  return useQuery({
    queryKey: quoteKeys.list(),
    queryFn: async () => {
      const response = await listQuotes();
      return response.data;
    },
  });
}
