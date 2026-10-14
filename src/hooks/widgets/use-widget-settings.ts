"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { widgetSettingKeys } from "@/hooks/widgets/keys";
import { getApiErrorMessage } from "@/lib/api-error";
import { getWidgetSetting, updateWidgetSetting } from "@/services/widget-setting.service";
import type { MiddleWidget } from "@/types/widget";

export function useWidgetSetting() {
  return useQuery({
    queryKey: widgetSettingKeys.current(),
    queryFn: async () => {
      const response = await getWidgetSetting();
      return response.data;
    },
  });
}

export function useUpdateWidgetSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (middleWidget: MiddleWidget) => updateWidgetSetting({ middleWidget }),
    onSuccess: (response) => {
      toast.success(response.message);
      void queryClient.invalidateQueries({ queryKey: widgetSettingKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
