import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/auth";
import type { Category } from "@/types/article";

const CATEGORIES_BASE = "/api/categories";

export async function listCategories(): Promise<ApiResponse<Category[]>> {
  return httpClient.get(CATEGORIES_BASE);
}

export async function createCategory(payload: {
  name: string;
  description?: string;
  position?: number;
}): Promise<ApiResponse<Category>> {
  return httpClient.post(CATEGORIES_BASE, payload);
}

export async function updateCategory(
  id: string,
  payload: { name?: string; description?: string; position?: number }
): Promise<ApiResponse<Category>> {
  return httpClient.patch(`${CATEGORIES_BASE}/${id}`, payload);
}

export async function deleteCategory(id: string): Promise<ApiResponse<null>> {
  return httpClient.delete(`${CATEGORIES_BASE}/${id}`);
}
