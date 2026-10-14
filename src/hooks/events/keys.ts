export const eventKeys = {
  all: ["events"] as const,
  list: () => [...eventKeys.all, "list"] as const,
};
