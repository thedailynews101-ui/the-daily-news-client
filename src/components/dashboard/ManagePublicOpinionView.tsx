"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreatePublicOpinion,
  useDeletePublicOpinion,
  useUpdatePublicOpinion,
} from "@/hooks/widgets/use-public-opinion-mutations";
import { usePublicOpinions } from "@/hooks/widgets/use-public-opinions";
import {
  publicOpinionFormSchema,
  type PublicOpinionFormValues,
} from "@/schemas/public-opinion.schema";
import type { PublicOpinion } from "@/types/widget";

const emptyForm: PublicOpinionFormValues = {
  question: "",
  options: ["", ""],
  activate: true,
};

function OpinionForm({
  pending,
  onSubmit,
  onCancel,
}: {
  pending: boolean;
  onSubmit: (values: PublicOpinionFormValues) => void;
  onCancel?: () => void;
}) {
  const [values, setValues] = React.useState(emptyForm);
  const [error, setError] = React.useState<string | null>(null);

  const setOption = (index: number, label: string) => {
    setValues((prev) => {
      const options = [...prev.options];
      options[index] = label;
      return { ...prev, options };
    });
  };

  const addOption = () => {
    setValues((prev) => {
      if (prev.options.length >= 4) return prev;
      return { ...prev, options: [...prev.options, ""] };
    });
  };

  const removeOption = (index: number) => {
    setValues((prev) => {
      if (prev.options.length <= 2) return prev;
      return { ...prev, options: prev.options.filter((_, i) => i !== index) };
    });
  };

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = publicOpinionFormSchema.safeParse(values);
        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message ?? "Invalid question");
          return;
        }
        setError(null);
        onSubmit(parsed.data);
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="opinion-question">Question</Label>
        <Input
          id="opinion-question"
          value={values.question}
          onChange={(e) => setValues((prev) => ({ ...prev, question: e.target.value }))}
          disabled={pending}
          placeholder="Should campus libraries stay open later?"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Options (2–4)</Label>
        {values.options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={option}
              onChange={(e) => setOption(index, e.target.value)}
              disabled={pending}
              placeholder={`Option ${index + 1}`}
            />
            {values.options.length > 2 && (
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => removeOption(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        {values.options.length < 4 && (
          <Button type="button" variant="secondary" disabled={pending} onClick={addOption}>
            Add option
          </Button>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(values.activate)}
          onChange={(e) => setValues((prev) => ({ ...prev, activate: e.target.checked }))}
          disabled={pending}
        />
        Activate on homepage now (closes the previous active question)
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Create question"}
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

function OpinionCard({ opinion }: { opinion: PublicOpinion }) {
  const updateMutation = useUpdatePublicOpinion();
  const deleteMutation = useDeletePublicOpinion();
  const busy = updateMutation.isPending || deleteMutation.isPending;

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg">{opinion.question}</CardTitle>
            <CardDescription className="mt-1">
              Status: {opinion.status} · {opinion.totalVotes} vote
              {opinion.totalVotes === 1 ? "" : "s"}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {opinion.status !== "ACTIVE" && (
              <Button
                size="sm"
                variant="secondary"
                disabled={busy}
                onClick={() =>
                  updateMutation.mutate({ id: opinion.id, payload: { status: "ACTIVE" } })
                }
              >
                Activate
              </Button>
            )}
            {opinion.status === "ACTIVE" && (
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() =>
                  updateMutation.mutate({ id: opinion.id, payload: { status: "CLOSED" } })
                }
              >
                Close
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              disabled={busy}
              onClick={() => {
                if (window.confirm("Delete this public opinion and all responses?")) {
                  deleteMutation.mutate(opinion.id);
                }
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {opinion.options.map((option) => (
          <div key={option.id} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span>{option.label}</span>
              <span className="text-muted-foreground">
                {option.voteCount ?? 0} ({option.percent ?? 0}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-brand transition-all"
                style={{ width: `${option.percent ?? 0}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ManagePublicOpinionView() {
  const { data: opinions, isLoading, isError, error } = usePublicOpinions();
  const createMutation = useCreatePublicOpinion();
  const [showCreate, setShowCreate] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Public Opinion</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create MCQ questions (2–4 options) and review how readers answered.
          </p>
        </div>
        <Button onClick={() => setShowCreate((prev) => !prev)}>
          {showCreate ? "Close form" : "New question"}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>New public opinion</CardTitle>
          </CardHeader>
          <CardContent>
            <OpinionForm
              pending={createMutation.isPending}
              onCancel={() => setShowCreate(false)}
              onSubmit={(values) => {
                createMutation.mutate(
                  {
                    question: values.question,
                    options: values.options,
                    activate: values.activate,
                  },
                  { onSuccess: () => setShowCreate(false) }
                );
              }}
            />
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load public opinions."}
        </p>
      )}

      {opinions && opinions.length === 0 && (
        <p className="text-sm text-muted-foreground">No public opinions yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {opinions?.map((opinion) => (
          <OpinionCard key={opinion.id} opinion={opinion} />
        ))}
      </div>
    </div>
  );
}
