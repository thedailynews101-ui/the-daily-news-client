"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";

import { TextAreaField } from "@/components/form/TextAreaField";
import { TextField } from "@/components/form/TextField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCreateArticle, usePublishDraft, useUpdateArticle } from "@/hooks/articles/use-article-mutations";
import { useCategories } from "@/hooks/articles/use-categories";
import { articleFormSchema, parseTagNames, type ArticleFormValues } from "@/schemas/article.schema";
import type { Article, CreateArticlePayload, UpdateArticlePayload } from "@/types/article";

type ArticleFormProps = {
  mode: "create" | "edit";
  isStaff?: boolean;
  article?: Article;
  /** Where to go after a successful save. */
  successHref: string;
  title?: string;
  description?: string;
};

function toFormValues(article?: Article): ArticleFormValues {
  return {
    title: article?.title ?? "",
    excerpt: article?.excerpt ?? "",
    content: article?.content ?? "",
    coverImageUrl: article?.coverImageUrl ?? "",
    categoryId: article?.category?.id ?? "",
    tagNames: article?.tags.map((tag) => tag.name).join(", ") ?? "",
    readTimeMinutes: article ? String(article.readTimeMinutes) : "1",
    status: article?.status === "APPROVED" ? "APPROVED" : "DRAFT",
    isFeatured: article?.isFeatured ?? false,
    isBreaking: article?.isBreaking ?? false,
  };
}

function toCreatePayload(values: ArticleFormValues, isStaff: boolean): CreateArticlePayload {
  const readTime = Number(values.readTimeMinutes);
  return {
    title: values.title,
    content: values.content,
    excerpt: values.excerpt?.trim() || undefined,
    coverImageUrl: values.coverImageUrl?.trim() || undefined,
    categoryId: values.categoryId || null,
    tagNames: parseTagNames(values.tagNames),
    readTimeMinutes: Number.isFinite(readTime) && readTime >= 1 ? readTime : 1,
    ...(isStaff
      ? {
          status: values.status ?? "DRAFT",
          isFeatured: values.isFeatured ?? false,
          isBreaking: values.isBreaking ?? false,
        }
      : {}),
  };
}

function toUpdatePayload(values: ArticleFormValues, isStaff: boolean): UpdateArticlePayload {
  const readTime = Number(values.readTimeMinutes);
  return {
    title: values.title,
    content: values.content,
    excerpt: values.excerpt?.trim() || undefined,
    coverImageUrl: values.coverImageUrl?.trim() || undefined,
    categoryId: values.categoryId || null,
    tagNames: parseTagNames(values.tagNames),
    readTimeMinutes: Number.isFinite(readTime) && readTime >= 1 ? readTime : 1,
    ...(isStaff
      ? {
          isFeatured: values.isFeatured ?? false,
          isBreaking: values.isBreaking ?? false,
        }
      : {}),
  };
}

export function ArticleForm({
  mode,
  isStaff = false,
  article,
  successHref,
  title,
  description,
}: ArticleFormProps) {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();
  const publishMutation = usePublishDraft();
  const isPending =
    createMutation.isPending || updateMutation.isPending || publishMutation.isPending;

  const form = useForm({
    defaultValues: toFormValues(article),
    validators: { onChange: articleFormSchema },
    onSubmit: async ({ value }) => {
      if (mode === "create") {
        createMutation.mutate(toCreatePayload(value, isStaff), {
          onSuccess: () => router.push(successHref),
        });
        return;
      }

      if (!article) return;

      updateMutation.mutate(
        { id: article.id, payload: toUpdatePayload(value, isStaff) },
        { onSuccess: () => router.push(successHref) }
      );
    },
  });

  const handlePublishDraft = () => {
    if (!article) return;
    publishMutation.mutate(
      { id: article.id },
      { onSuccess: () => router.push(successHref) }
    );
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-2xl">
          {title ?? (mode === "create" ? "New article" : "Edit article")}
        </CardTitle>
        <CardDescription>
          {description ??
            (isStaff
              ? "Create or update an article for the newsroom."
              : "Write your story, save it as a draft, then submit it for review.")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="title">
            {(field) => <TextField field={field} label="Title" placeholder="Headline" />}
          </form.Field>

          <form.Field name="excerpt">
            {(field) => (
              <TextAreaField
                field={field}
                label="Excerpt (optional)"
                placeholder="A short summary for listings"
                rows={3}
              />
            )}
          </form.Field>

          <form.Field name="content">
            {(field) => (
              <TextAreaField field={field} label="Content" placeholder="Full article body" rows={12} />
            )}
          </form.Field>

          <form.Field name="coverImageUrl">
            {(field) => (
              <TextField
                field={field}
                label="Cover image URL (optional)"
                placeholder="https://..."
              />
            )}
          </form.Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="categoryId">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Category (optional)</Label>
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    className="flex h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">No category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No categories yet. An admin can add them under Manage Categories.
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="readTimeMinutes">
              {(field) => (
                <TextField field={field} label="Read time (minutes)" type="number" />
              )}
            </form.Field>
          </div>

          <form.Field name="tagNames">
            {(field) => (
              <TextField
                field={field}
                label="Tags (optional)"
                placeholder="politics, local, opinion — comma separated"
              />
            )}
          </form.Field>

          {isStaff && mode === "create" && (
            <form.Field name="status">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Publish status</Label>
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? "DRAFT"}
                    onChange={(event) =>
                      field.handleChange(event.target.value as "DRAFT" | "APPROVED")
                    }
                    onBlur={field.handleBlur}
                    className="flex h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="DRAFT">Save as draft</option>
                    <option value="APPROVED">Publish immediately</option>
                  </select>
                </div>
              )}
            </form.Field>
          )}

          {isStaff && (
            <div className="flex flex-wrap gap-4">
              <form.Field name="isFeatured">
                {(field) => (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(field.state.value)}
                      onChange={(event) => field.handleChange(event.target.checked)}
                      className="size-4 rounded border-border"
                    />
                    Featured
                  </label>
                )}
              </form.Field>
              <form.Field name="isBreaking">
                {(field) => (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(field.state.value)}
                      onChange={(event) => field.handleChange(event.target.checked)}
                      className="size-4 rounded border-border"
                    />
                    Breaking
                  </label>
                )}
              </form.Field>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting || isPending}>
                  {isSubmitting || isPending
                    ? "Saving..."
                    : mode === "create"
                      ? "Save article"
                      : "Update article"}
                </Button>
              )}
            </form.Subscribe>
            {isStaff && mode === "edit" && article?.status === "DRAFT" && (
              <Button type="button" disabled={isPending} onClick={handlePublishDraft}>
                {publishMutation.isPending ? "Publishing..." : "Publish now"}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(successHref)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
