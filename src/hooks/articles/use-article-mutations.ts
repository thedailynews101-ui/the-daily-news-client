"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { articleKeys } from "@/hooks/articles/keys";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  approveArticle,
  archiveArticle,
  createArticle,
  deleteArticle,
  publishDraft,
  rejectArticle,
  restoreArticle,
  submitArticle,
  updateArticle,
  withdrawArticle,
} from "@/services/article.service";
import type {
  ApproveArticlePayload,
  ArchiveArticlePayload,
  CreateArticlePayload,
  RejectArticlePayload,
  RestoreArticlePayload,
  UpdateArticlePayload,
} from "@/types/article";

function invalidateArticleQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: articleKeys.all });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateArticlePayload) => createArticle(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateArticleQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateArticlePayload }) =>
      updateArticle(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateArticleQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateArticleQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useSubmitArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => submitArticle(id),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateArticleQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useWithdrawArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => withdrawArticle(id),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateArticleQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useApproveArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: ApproveArticlePayload }) =>
      approveArticle(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateArticleQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function usePublishDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: ApproveArticlePayload }) =>
      publishDraft(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateArticleQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useRejectArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectArticlePayload }) =>
      rejectArticle(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateArticleQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useArchiveArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: ArchiveArticlePayload }) =>
      archiveArticle(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateArticleQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useRestoreArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: RestoreArticlePayload }) =>
      restoreArticle(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateArticleQueries(queryClient);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
