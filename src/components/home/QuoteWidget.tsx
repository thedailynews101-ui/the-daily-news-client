import { Quote as QuoteIcon } from "lucide-react";

import type { Quote } from "@/types/widget";

export function QuoteWidget({ quote }: { quote: Quote | null }) {
  if (!quote) {
    return (
      <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5">
        <QuoteIcon className="size-6 text-brand" />
        <p className="mt-3 text-sm text-muted-foreground">No quote selected yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5">
      <QuoteIcon className="size-6 text-brand" />
      <p className="mt-3 font-heading text-lg leading-snug font-medium">“{quote.text}”</p>
      <p className="mt-3 text-sm text-muted-foreground">— {quote.authorName}</p>
    </div>
  );
}
