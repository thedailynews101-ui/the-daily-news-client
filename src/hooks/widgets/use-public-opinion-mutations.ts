"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { publicOpinionKeys } from "@/hooks/widgets/keys";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  createPublicOpinion,
  deletePublicOpinion,
  updatePublicOpinion,
  votePublicOpinion,
} from "@/services/public-opinion.service";
import type {
  CreatePublicOpinionPayload,
  UpdatePublicOpinionPayload,
  VotePublicOpinionPayload,
} from "@/types/widget";

function invalidateOpinions(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: publicOpinionKeys.all });
}

export function useCreatePublicOpinion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePublicOpinionPayload) => createPublicOpinion(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateOpinions(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUpdatePublicOpinion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePublicOpinionPayload }) =>
      updatePublicOpinion(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateOpinions(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useDeletePublicOpinion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePublicOpinion(id),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateOpinions(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useVotePublicOpinion() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VotePublicOpinionPayload }) =>
      votePublicOpinion(id, payload),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
