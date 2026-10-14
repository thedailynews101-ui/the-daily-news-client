import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/auth";
import type { PublicWidgetsPayload } from "@/types/widget";

export async function getPublicWidgets(): Promise<ApiResponse<PublicWidgetsPayload>> {
  return httpClient.get("/api/public/widgets");
}
