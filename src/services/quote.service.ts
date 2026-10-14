import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/auth";
import type { CreateQuotePayload, Quote, UpdateQuotePayload } from "@/types/widget";

const QUOTES_BASE = "/api/quotes";

export async function listQuotes(): Promise<ApiResponse<Quote[]>> {
  return httpClient.get(QUOTES_BASE);
}

export async function createQuote(payload: CreateQuotePayload): Promise<ApiResponse<Quote>> {
  return httpClient.post(QUOTES_BASE, payload);
}

export async function updateQuote(
  id: string,
  payload: UpdateQuotePayload
): Promise<ApiResponse<Quote>> {
  return httpClient.patch(`${QUOTES_BASE}/${id}`, payload);
}

export async function deleteQuote(id: string): Promise<ApiResponse<null>> {
  return httpClient.delete(`${QUOTES_BASE}/${id}`);
}
