import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/auth";
import type {
  ApproveArticlePayload,
  ArchiveArticlePayload,
  Article,
  ArticleListResult,
  ArticleSummary,
  CreateArticlePayload,
  ListArticlesParams,
  MineArticlesParams,
  RejectArticlePayload,
  RestoreArticlePayload,
  UpdateArticlePayload,
} from "@/types/article";

const ARTICLES_BASE = "/api/articles";

export async function listMyArticles(
  params?: MineArticlesParams
): Promise<ApiResponse<ArticleListResult>> {
  return httpClient.get(`${ARTICLES_BASE}/mine`, { params });
}

export async function getMyArticleSummary(): Promise<ApiResponse<ArticleSummary>> {
  return httpClient.get(`${ARTICLES_BASE}/mine/summary`);
}

export async function listArticles(
  params?: ListArticlesParams
): Promise<ApiResponse<ArticleListResult>> {
  return httpClient.get(ARTICLES_BASE, { params });
}

export async function listArticleQueue(): Promise<ApiResponse<Article[]>> {
  return httpClient.get(`${ARTICLES_BASE}/queue`);
}

export async function getArticleById(id: string): Promise<ApiResponse<Article>> {
  return httpClient.get(`${ARTICLES_BASE}/${id}`);
}

export async function createArticle(
  payload: CreateArticlePayload
): Promise<ApiResponse<Article>> {
  return httpClient.post(ARTICLES_BASE, payload);
}

export async function updateArticle(
  id: string,
  payload: UpdateArticlePayload
): Promise<ApiResponse<Article>> {
  return httpClient.patch(`${ARTICLES_BASE}/${id}`, payload);
}

export async function deleteArticle(id: string): Promise<ApiResponse<null>> {
  return httpClient.delete(`${ARTICLES_BASE}/${id}`);
}

export async function submitArticle(id: string): Promise<ApiResponse<Article>> {
  return httpClient.post(`${ARTICLES_BASE}/${id}/submit`, {});
}

export async function withdrawArticle(id: string): Promise<ApiResponse<Article>> {
  return httpClient.post(`${ARTICLES_BASE}/${id}/withdraw`, {});
}

export async function approveArticle(
  id: string,
  payload: ApproveArticlePayload = {}
): Promise<ApiResponse<Article>> {
  return httpClient.post(`${ARTICLES_BASE}/${id}/approve`, payload);
}

export async function rejectArticle(
  id: string,
  payload: RejectArticlePayload
): Promise<ApiResponse<Article>> {
  return httpClient.post(`${ARTICLES_BASE}/${id}/reject`, payload);
}

export async function archiveArticle(
  id: string,
  payload: ArchiveArticlePayload = {}
): Promise<ApiResponse<Article>> {
  return httpClient.post(`${ARTICLES_BASE}/${id}/archive`, payload);
}

export async function restoreArticle(
  id: string,
  payload: RestoreArticlePayload = {}
): Promise<ApiResponse<Article>> {
  return httpClient.post(`${ARTICLES_BASE}/${id}/restore`, payload);
}
