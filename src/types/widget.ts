export type MiddleWidget = "QUOTE" | "PUBLIC_OPINION";

export type Quote = {
  id: string;
  text: string;
  authorName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateQuotePayload = {
  text: string;
  authorName: string;
  isActive?: boolean;
};

export type UpdateQuotePayload = {
  text?: string;
  authorName?: string;
  isActive?: boolean;
};

export type PublicOpinionStatus = "DRAFT" | "ACTIVE" | "CLOSED";

export type PublicOpinionOptionResult = {
  id: string;
  label: string;
  position: number;
  voteCount?: number;
  percent?: number;
};

export type PublicOpinion = {
  id: string;
  question: string;
  status: PublicOpinionStatus;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
  totalVotes: number;
  options: PublicOpinionOptionResult[];
  hasVoted?: boolean;
  selectedOptionId?: string | null;
};

export type CreatePublicOpinionPayload = {
  question: string;
  options: string[];
  activate?: boolean;
};

export type UpdatePublicOpinionPayload = {
  question?: string;
  status?: PublicOpinionStatus;
};

export type VotePublicOpinionPayload = {
  optionId: string;
};

export type WidgetSetting = {
  id: string;
  middleWidget: MiddleWidget;
  updatedAt: string;
};

export type WeatherCondition = "sunny" | "cloudy" | "rainy" | "stormy" | "snowy" | "windy";

export type WeatherSnapshot = {
  location: string;
  temperatureC: number;
  condition: WeatherCondition;
  high: number;
  low: number;
  updatedAt: string;
};

export type PublicWidgetsPayload = {
  weather: WeatherSnapshot;
  middleWidget: MiddleWidget;
  quote: Quote | null;
  publicOpinion: PublicOpinion | null;
};
