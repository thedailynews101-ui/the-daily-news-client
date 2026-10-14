import { z } from "zod";

export const quoteFormSchema = z.object({
  text: z.string().trim().min(1, "Quote text is required").max(500),
  authorName: z.string().trim().min(1, "Author name is required").max(120),
  isActive: z.boolean().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
