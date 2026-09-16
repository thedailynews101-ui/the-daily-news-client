"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";

import { ArticleStatusBadge } from "@/components/dashboard/ArticleStatusBadge";
import { TextAreaField } from "@/components/form/TextAreaField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useApproveArticle,
  useRejectArticle,
} from "@/hooks/articles/use-article-mutations";
import { useArticleQueue } from "@/hooks/articles/use-articles";
import { rejectArticleSchema } from "@/schemas/article.schema";
import type { Article } from "@/types/article";

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function RejectForm({
  articleId,
  onDone,
}: {
  articleId: string;
  onDone: () => void;
}) {
  const rejectMutation = useRejectArticle();

  const form = useForm({
    defaultValues: { reason: "" },
    validators: { onChange: rejectArticleSchema },
    onSubmit: async ({ value }) => {
      rejectMutation.mutate(
        { id: articleId, payload: { reason: value.reason } },
        { onSuccess: () => onDone() }
      );
    },
  });

  return (
    <form
      className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-3"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field name="reason">
        {(field) => (
          <TextAreaField
            field={field}
            label="Rejection reason"
            placeholder="Explain why this article is being rejected"
            rows={3}
          />
        )}
      </form.Field>
      <div className="flex flex-wrap gap-2">
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={!canSubmit || isSubmitting || rejectMutation.isPending}
            >
              {isSubmitting || rejectMutation.isPending ? "Rejecting..." : "Confirm reject"}
            </Button>
          )}
        </form.Subscribe>
        <Button type="button" variant="outline" size="sm" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function QueueItem({ article }: { article: Article }) {
  const [showReject, setShowReject] = React.useState(false);
  const approveMutation = useApproveArticle();
  const busy = approveMutation.isPending;

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg">{article.title}</CardTitle>
            <CardDescription className="mt-1">
              By {article.author.name} · Submitted {formatDate(article.submittedAt)}
            </CardDescription>
          </div>
          <ArticleStatusBadge status={article.status} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {article.excerpt && (
          <p className="text-sm text-muted-foreground">{article.excerpt}</p>
        )}
        <div className="rounded-md border border-border bg-muted/20 p-3 text-sm whitespace-pre-wrap">
          {article.content}
        </div>

        {showReject ? (
          <RejectForm articleId={article.id} onDone={() => setShowReject(false)} />
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              disabled={busy}
              onClick={() => approveMutation.mutate({ id: article.id })}
            >
              {approveMutation.isPending ? "Approving..." : "Approve"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={busy}
              onClick={() => setShowReject(true)}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RequestedArticlesView() {
  const { data, isLoading, isError } = useArticleQueue();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Requested Articles</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review user submissions waiting in the moderation queue.
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            Could not load the review queue. Please try again.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && (data?.length ?? 0) === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Queue is empty</CardTitle>
            <CardDescription>There are no pending user submissions right now.</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {data?.map((article) => (
          <QueueItem key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
