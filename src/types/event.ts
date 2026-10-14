export type EventItem = {
  id: string;
  title: string;
  url: string;
  position: number;
  createdAt?: string;
  updatedAt?: string;
  groupId?: string;
};

export type EventGroup = {
  id: string;
  title: string;
  position: number;
  createdAt?: string;
  updatedAt?: string;
  items: EventItem[];
};

export type CreateEventGroupPayload = {
  title: string;
  position?: number;
};

export type UpdateEventGroupPayload = {
  title?: string;
  position?: number;
};

export type CreateEventItemPayload = {
  title: string;
  url: string;
  position?: number;
};

export type UpdateEventItemPayload = {
  title?: string;
  url?: string;
  position?: number;
};

/** Public Fixed News shape from GET /api/public/home. */
export type PublicEventGroup = {
  id: string;
  title: string;
  position: number;
  items: Array<{
    id: string;
    title: string;
    url: string;
    position: number;
  }>;
};
