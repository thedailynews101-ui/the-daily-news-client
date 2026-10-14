import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/auth";
import type {
  CreatePublicOpinionPayload,
  PublicOpinion,
  UpdatePublicOpinionPayload,
  VotePublicOpinionPayload,
} from "@/types/widget";

const BASE = "/api/public-opinions";

export async function listPublicOpinions(): Promise<ApiResponse<PublicOpinion[]>> {
  return httpClient.get(BASE);
}

export async function createPublicOpinion(
  payload: CreatePublicOpinionPayload
): Promise<ApiResponse<PublicOpinion>> {
  return httpClient.post(BASE, payload);
}

export async function updatePublicOpinion(
  id: string,
  payload: UpdatePublicOpinionPayload
): Promise<ApiResponse<PublicOpinion>> {
  return httpClient.patch(`${BASE}/${id}`, payload);
}

export async function deletePublicOpinion(id: string): Promise<ApiResponse<null>> {
  return httpClient.delete(`${BASE}/${id}`);
}

export async function getActivePublicOpinion(): Promise<ApiResponse<PublicOpinion | null>> {
  return httpClient.get(`${BASE}/active`);
}

export async function votePublicOpinion(
  id: string,
  payload: VotePublicOpinionPayload
): Promise<ApiResponse<PublicOpinion>> {
  return httpClient.post(`${BASE}/${id}/vote`, payload);
}
