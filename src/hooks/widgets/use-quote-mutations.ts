"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { quoteKeys } from "@/hooks/widgets/keys";
import { getApiErrorMessage } from "@/lib/api-error";
import { createQuote, deleteQuote, updateQuote } from "@/services/quote.service";
import type { CreateQuotePayload, UpdateQuotePayload } from "@/types/widget";

function invalidateQuotes(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: quoteKeys.all });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuotePayload) => createQuote(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateQuotes(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateQuotePayload }) =>
      updateQuote(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateQuotes(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useDeleteQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteQuote(id),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateQuotes(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
