"use client";

import * as React from "react";
import { BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useVotePublicOpinion } from "@/hooks/widgets/use-public-opinion-mutations";
import { getActivePublicOpinion } from "@/services/public-opinion.service";
import type { PublicOpinion } from "@/types/widget";

function Results({
  options,
  selectedOptionId,
}: {
  options: PublicOpinion["options"];
  selectedOptionId?: string | null;
}) {
  return (
    <div className="mt-3 flex flex-col gap-2">
      {options.map((option) => (
        <div key={option.id} className="flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span className={selectedOptionId === option.id ? "font-medium" : undefined}>
              {option.label}
            </span>
            <span className="text-muted-foreground">{option.percent ?? 0}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-brand transition-all"
              style={{ width: `${option.percent ?? 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PublicOpinionWidget({
  initialOpinion,
}: {
  initialOpinion: PublicOpinion | null;
}) {
  const [opinion, setOpinion] = React.useState<PublicOpinion | null>(initialOpinion);
  const voteMutation = useVotePublicOpinion();

  React.useEffect(() => {
    let cancelled = false;
    void getActivePublicOpinion()
      .then((response) => {
        if (!cancelled) {
          setOpinion(response.data);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!opinion) {
    return (
      <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-5 text-brand" />
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Public Opinion
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">No active question right now.</p>
      </div>
    );
  }

  const showResults = Boolean(opinion.hasVoted);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <BarChart3 className="size-5 text-brand" />
        <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Public Opinion
        </span>
      </div>
      <p className="mt-3 font-heading text-lg leading-snug font-medium">{opinion.question}</p>

      {showResults ? (
        <Results options={opinion.options} selectedOptionId={opinion.selectedOptionId} />
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {opinion.options.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              className="justify-start"
              disabled={voteMutation.isPending}
              onClick={() => {
                voteMutation.mutate(
                  { id: opinion.id, payload: { optionId: option.id } },
                  {
                    onSuccess: (response) => {
                      setOpinion(response.data);
                    },
                  }
                );
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}

      {showResults && (
        <p className="mt-3 text-xs text-muted-foreground">
          {opinion.totalVotes} response{opinion.totalVotes === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}
