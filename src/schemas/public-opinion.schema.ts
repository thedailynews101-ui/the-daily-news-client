import { z } from "zod";

export const publicOpinionFormSchema = z.object({
  question: z.string().trim().min(1, "Question is required").max(300),
  options: z
    .array(z.string().trim().min(1, "Option cannot be empty").max(120))
    .min(2, "At least 2 options are required.")
    .max(4, "At most 4 options are allowed.")
    .refine((options) => new Set(options.map((o) => o.toLowerCase())).size === options.length, {
      message: "Option labels must be unique.",
    }),
  activate: z.boolean().optional(),
});

export type PublicOpinionFormValues = z.infer<typeof publicOpinionFormSchema>;
