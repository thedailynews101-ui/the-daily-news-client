import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long").max(100),
  description: z.string().trim().max(500).optional(),
  position: z
    .string()
    .trim()
    .optional()
    .refine((value) => value === undefined || value === "" || /^\d+$/.test(value), {
      message: "Position must be a non-negative integer",
    }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export function toCategoryPayload(values: CategoryFormValues): {
  name: string;
  description?: string;
  position?: number;
} {
  const description = values.description?.trim();
  const positionRaw = values.position?.trim();
  return {
    name: values.name.trim(),
    ...(description ? { description } : { description: undefined }),
    ...(positionRaw ? { position: Number(positionRaw) } : {}),
  };
}
