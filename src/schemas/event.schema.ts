import { z } from "zod";

export const eventGroupFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  position: z
    .string()
    .trim()
    .optional()
    .refine((value) => value === undefined || value === "" || /^\d+$/.test(value), {
      message: "Position must be a non-negative integer",
    }),
});

export const eventItemFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  url: z
    .string()
    .trim()
    .url("Enter a valid URL")
    .refine((value) => /^https?:\/\//i.test(value), {
      message: "URL must start with http:// or https://",
    }),
  position: z
    .string()
    .trim()
    .optional()
    .refine((value) => value === undefined || value === "" || /^\d+$/.test(value), {
      message: "Position must be a non-negative integer",
    }),
});

export type EventGroupFormValues = z.infer<typeof eventGroupFormSchema>;
export type EventItemFormValues = z.infer<typeof eventItemFormSchema>;
