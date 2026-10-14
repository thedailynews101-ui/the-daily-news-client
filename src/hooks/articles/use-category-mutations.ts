"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { categoryKeys } from "@/hooks/articles/keys";
import { getApiErrorMessage } from "@/lib/api-error";
import { createCategory, deleteCategory, updateCategory } from "@/services/category.service";

function invalidateCategoryQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: categoryKeys.all });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; description?: string; position?: number }) =>
      createCategory(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateCategoryQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { name?: string; description?: string; position?: number };
    }) => updateCategory(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateCategoryQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateCategoryQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
