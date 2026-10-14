"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/articles/use-category-mutations";
import { useCategories } from "@/hooks/articles/use-categories";
import {
  categoryFormSchema,
  toCategoryPayload,
  type CategoryFormValues,
} from "@/schemas/category.schema";
import type { Category } from "@/types/article";

const emptyForm: CategoryFormValues = {
  name: "",
  description: "",
  position: "0",
};

function CategoryEditor({
  initial,
  submitLabel,
  pending,
  onSubmit,
  onCancel,
}: {
  initial: CategoryFormValues;
  submitLabel: string;
  pending: boolean;
  onSubmit: (values: CategoryFormValues) => void;
  onCancel?: () => void;
}) {
  const [values, setValues] = React.useState(initial);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setValues(initial);
    setError(null);
  }, [initial]);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = categoryFormSchema.safeParse(values);
        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message ?? "Invalid category");
          return;
        }
        setError(null);
        onSubmit(parsed.data);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="category-name">Name</Label>
          <Input
            id="category-name"
            value={values.name}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Politics"
            disabled={pending}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="category-description">Description (optional)</Label>
          <textarea
            id="category-description"
            rows={3}
            value={values.description ?? ""}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, description: event.target.value }))
            }
            disabled={pending}
            className="flex w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category-position">Position</Label>
          <Input
            id="category-position"
            value={values.position ?? ""}
            onChange={(event) => setValues((prev) => ({ ...prev, position: event.target.value }))}
            placeholder="0"
            disabled={pending}
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" disabled={pending} onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const [editing, setEditing] = React.useState(false);
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const busy = updateMutation.isPending || deleteMutation.isPending;

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg">{category.name}</CardTitle>
            <CardDescription className="mt-1">
              slug: {category.slug} · position: {category.position}
            </CardDescription>
          </div>
          {!editing && (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" disabled={busy} onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={busy}
                onClick={() => {
                  if (
                    window.confirm(
                      `Delete "${category.name}"? Articles in this category will become uncategorized.`
                    )
                  ) {
                    deleteMutation.mutate(category.id);
                  }
                }}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {editing ? (
          <CategoryEditor
            initial={{
              name: category.name,
              description: category.description ?? "",
              position: String(category.position),
            }}
            submitLabel="Update category"
            pending={updateMutation.isPending}
            onCancel={() => setEditing(false)}
            onSubmit={(values) => {
              updateMutation.mutate(
                { id: category.id, payload: toCategoryPayload(values) },
                { onSuccess: () => setEditing(false) }
              );
            }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            {category.description?.trim() || "No description."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function ManageCategoriesView() {
  const { data: categories = [], isLoading, isError } = useCategories();
  const createMutation = useCreateCategory();
  const [createKey, setCreateKey] = React.useState(0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Manage Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add, edit, or delete news categories used when creating or editing articles.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New category</CardTitle>
          <CardDescription>Categories appear in the article form dropdown.</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryEditor
            key={createKey}
            initial={emptyForm}
            submitLabel="Create category"
            pending={createMutation.isPending}
            onSubmit={(values) => {
              createMutation.mutate(toCategoryPayload(values), {
                onSuccess: () => setCreateKey((key) => key + 1),
              });
            }}
          />
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            Could not load categories. Please try again.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && categories.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No categories yet</CardTitle>
            <CardDescription>Create your first category to use it on articles.</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
