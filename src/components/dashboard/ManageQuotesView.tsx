"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateQuote,
  useDeleteQuote,
  useUpdateQuote,
} from "@/hooks/widgets/use-quote-mutations";
import { useQuotes } from "@/hooks/widgets/use-quotes";
import { quoteFormSchema, type QuoteFormValues } from "@/schemas/quote.schema";
import type { Quote } from "@/types/widget";

const emptyForm: QuoteFormValues = {
  text: "",
  authorName: "",
  isActive: false,
};

function QuoteEditor({
  initial,
  submitLabel,
  pending,
  onSubmit,
  onCancel,
}: {
  initial: QuoteFormValues;
  submitLabel: string;
  pending: boolean;
  onSubmit: (values: QuoteFormValues) => void;
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
        const parsed = quoteFormSchema.safeParse(values);
        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message ?? "Invalid quote");
          return;
        }
        setError(null);
        onSubmit(parsed.data);
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="quote-text">Quote</Label>
        <textarea
          id="quote-text"
          rows={3}
          value={values.text}
          onChange={(e) => setValues((prev) => ({ ...prev, text: e.target.value }))}
          disabled={pending}
          className="flex w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder="Education is the most powerful weapon..."
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="quote-author">Person name</Label>
        <Input
          id="quote-author"
          value={values.authorName}
          onChange={(e) => setValues((prev) => ({ ...prev, authorName: e.target.value }))}
          disabled={pending}
          placeholder="Nelson Mandela"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(values.isActive)}
          onChange={(e) => setValues((prev) => ({ ...prev, isActive: e.target.checked }))}
          disabled={pending}
        />
        Show on homepage
      </label>
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

function QuoteCard({ quote }: { quote: Quote }) {
  const [editing, setEditing] = React.useState(false);
  const updateMutation = useUpdateQuote();
  const deleteMutation = useDeleteQuote();
  const busy = updateMutation.isPending || deleteMutation.isPending;

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg leading-snug">“{quote.text}”</CardTitle>
            <CardDescription className="mt-1">
              — {quote.authorName}
              {quote.isActive ? " · Active on homepage" : ""}
            </CardDescription>
          </div>
          {!editing && (
            <div className="flex flex-wrap gap-2">
              {!quote.isActive && (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => updateMutation.mutate({ id: quote.id, payload: { isActive: true } })}
                >
                  Set active
                </Button>
              )}
              <Button size="sm" variant="outline" disabled={busy} onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={busy}
                onClick={() => {
                  if (window.confirm("Delete this quote?")) {
                    deleteMutation.mutate(quote.id);
                  }
                }}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      {editing && (
        <CardContent>
          <QuoteEditor
            initial={{
              text: quote.text,
              authorName: quote.authorName,
              isActive: quote.isActive,
            }}
            submitLabel="Save changes"
            pending={busy}
            onCancel={() => setEditing(false)}
            onSubmit={(values) => {
              updateMutation.mutate(
                {
                  id: quote.id,
                  payload: {
                    text: values.text,
                    authorName: values.authorName,
                    isActive: values.isActive,
                  },
                },
                { onSuccess: () => setEditing(false) }
              );
            }}
          />
        </CardContent>
      )}
    </Card>
  );
}

export function ManageQuotesView() {
  const { data: quotes, isLoading, isError, error } = useQuotes();
  const createMutation = useCreateQuote();
  const [showCreate, setShowCreate] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Manage Quotes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add quotations for the homepage. Only one active quote is shown at a time.
          </p>
        </div>
        <Button onClick={() => setShowCreate((prev) => !prev)}>
          {showCreate ? "Close form" : "Add quote"}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>New quote</CardTitle>
          </CardHeader>
          <CardContent>
            <QuoteEditor
              initial={emptyForm}
              submitLabel="Create quote"
              pending={createMutation.isPending}
              onSubmit={(values) => {
                createMutation.mutate(
                  {
                    text: values.text,
                    authorName: values.authorName,
                    isActive: values.isActive,
                  },
                  {
                    onSuccess: () => {
                      setShowCreate(false);
                    },
                  }
                );
              }}
            />
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load quotes."}
        </p>
      )}

      {quotes && quotes.length === 0 && (
        <p className="text-sm text-muted-foreground">No quotes yet. Add one to get started.</p>
      )}

      <div className="flex flex-col gap-3">
        {quotes?.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>
    </div>
  );
}
