export const quoteKeys = {
  all: ["quotes"] as const,
  list: () => [...quoteKeys.all, "list"] as const,
};

export const publicOpinionKeys = {
  all: ["public-opinions"] as const,
  list: () => [...publicOpinionKeys.all, "list"] as const,
  active: () => [...publicOpinionKeys.all, "active"] as const,
};

export const widgetSettingKeys = {
  all: ["widget-settings"] as const,
  current: () => [...widgetSettingKeys.all, "current"] as const,
};
