"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { eventKeys } from "@/hooks/events/keys";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  createEventGroup,
  createEventItem,
  deleteEventGroup,
  deleteEventItem,
  updateEventGroup,
  updateEventItem,
} from "@/services/event.service";
import type {
  CreateEventGroupPayload,
  CreateEventItemPayload,
  UpdateEventGroupPayload,
  UpdateEventItemPayload,
} from "@/types/event";

function invalidateEvents(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: eventKeys.all });
}

export function useCreateEventGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEventGroupPayload) => createEventGroup(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateEvents(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUpdateEventGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEventGroupPayload }) =>
      updateEventGroup(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateEvents(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useDeleteEventGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEventGroup(id),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateEvents(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useCreateEventItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, payload }: { groupId: string; payload: CreateEventItemPayload }) =>
      createEventItem(groupId, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateEvents(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUpdateEventItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEventItemPayload }) =>
      updateEventItem(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateEvents(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useDeleteEventItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEventItem(id),
    onSuccess: (response) => {
      toast.success(response.message);
      void invalidateEvents(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
