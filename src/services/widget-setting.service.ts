import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/auth";
import type { MiddleWidget, WidgetSetting } from "@/types/widget";

const BASE = "/api/widget-settings";

export async function getWidgetSetting(): Promise<ApiResponse<WidgetSetting>> {
  return httpClient.get(BASE);
}

export async function updateWidgetSetting(payload: {
  middleWidget: MiddleWidget;
}): Promise<ApiResponse<WidgetSetting>> {
  return httpClient.patch(BASE, payload);
}
