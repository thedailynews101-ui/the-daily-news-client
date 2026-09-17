import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/auth";
import type { HomeLayout, HomeSlot, PublicArticle, PublicSearchResult } from "@/types/public-article";

const PUBLIC_BASE = "/api/public";
const ARTICLES_BASE = "/api/articles";

export async function getPublicHome(): Promise<ApiResponse<HomeLayout>> {
  return httpClient.get(`${PUBLIC_BASE}/home`);
}

export async function getPublicArticleBySlug(slug: string): Promise<ApiResponse<PublicArticle>> {
  return httpClient.get(`${PUBLIC_BASE}/articles/${encodeURIComponent(slug)}`);
}

export async function searchPublicArticles(params: {
  q?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PublicSearchResult>> {
  return httpClient.get(`${PUBLIC_BASE}/search`, { params });
}

/** Staff: current homepage slot layout. */
export async function getStaffHomeLayout(): Promise<ApiResponse<HomeLayout>> {
  return httpClient.get(`${ARTICLES_BASE}/home-layout`);
}

export async function listPublishedForPlacement(params?: {
  q?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PublicSearchResult>> {
  return httpClient.get(`${ARTICLES_BASE}/published`, { params });
}

export async function setHomePlacement(
  id: string,
  payload: { homeSlot: HomeSlot | null; homeRank?: number }
): Promise<ApiResponse<PublicArticle>> {
  return httpClient.patch(`${ARTICLES_BASE}/${id}/home-placement`, payload);
}
