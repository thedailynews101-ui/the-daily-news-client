import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/auth";
import type {
  CreateEventGroupPayload,
  CreateEventItemPayload,
  EventGroup,
  EventItem,
  UpdateEventGroupPayload,
  UpdateEventItemPayload,
} from "@/types/event";

const EVENTS_BASE = "/api/events";

export async function listEventGroups(): Promise<ApiResponse<EventGroup[]>> {
  return httpClient.get(EVENTS_BASE);
}

export async function createEventGroup(
  payload: CreateEventGroupPayload
): Promise<ApiResponse<EventGroup>> {
  return httpClient.post(`${EVENTS_BASE}/groups`, payload);
}

export async function updateEventGroup(
  id: string,
  payload: UpdateEventGroupPayload
): Promise<ApiResponse<EventGroup>> {
  return httpClient.patch(`${EVENTS_BASE}/groups/${id}`, payload);
}

export async function deleteEventGroup(id: string): Promise<ApiResponse<null>> {
  return httpClient.delete(`${EVENTS_BASE}/groups/${id}`);
}

export async function createEventItem(
  groupId: string,
  payload: CreateEventItemPayload
): Promise<ApiResponse<EventItem>> {
  return httpClient.post(`${EVENTS_BASE}/groups/${groupId}/items`, payload);
}

export async function updateEventItem(
  id: string,
  payload: UpdateEventItemPayload
): Promise<ApiResponse<EventItem>> {
  return httpClient.patch(`${EVENTS_BASE}/items/${id}`, payload);
}

export async function deleteEventItem(id: string): Promise<ApiResponse<null>> {
  return httpClient.delete(`${EVENTS_BASE}/items/${id}`);
}
