import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https?:\/\/.+/i.test(value), {
    message: "Invalid cover image URL",
  })
  .optional();

export const articleFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long").max(200),
  excerpt: z.string().trim().max(500, "Excerpt must be at most 500 characters").optional(),
  content: z.string().trim().min(1, "Content is required"),
  coverImageUrl: optionalUrl,
  categoryId: z.string().optional(),
  tagNames: z.string().optional(),
  readTimeMinutes: z.string().optional(),
  // Staff-only fields; ignored for USER callers on the server.
  status: z.enum(["DRAFT", "APPROVED"]).optional(),
  isFeatured: z.boolean().optional(),
  isBreaking: z.boolean().optional(),
});

export const rejectArticleSchema = z.object({
  reason: z
    .string({ error: "A rejection reason is required" })
    .trim()
    .min(3, "Rejection reason must be at least 3 characters long")
    .max(1000),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;
export type RejectArticleFormValues = z.infer<typeof rejectArticleSchema>;

/** Splits a comma-separated tag string into trimmed non-empty names. */
export function parseTagNames(raw?: string): string[] | undefined {
  if (!raw?.trim()) return undefined;
  const names = raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return names.length > 0 ? names : undefined;
}
