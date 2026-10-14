"use client";

import { useQuery } from "@tanstack/react-query";

import { eventKeys } from "@/hooks/events/keys";
import { listEventGroups } from "@/services/event.service";

export function useEventGroups() {
  return useQuery({
    queryKey: eventKeys.list(),
    queryFn: async () => {
      const response = await listEventGroups();
      return response.data;
    },
  });
}
