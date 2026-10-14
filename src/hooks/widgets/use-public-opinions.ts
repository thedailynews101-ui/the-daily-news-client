"use client";

import { useQuery } from "@tanstack/react-query";

import { publicOpinionKeys } from "@/hooks/widgets/keys";
import { listPublicOpinions } from "@/services/public-opinion.service";

export function usePublicOpinions() {
  return useQuery({
    queryKey: publicOpinionKeys.list(),
    queryFn: async () => {
      const response = await listPublicOpinions();
      return response.data;
    },
  });
}
