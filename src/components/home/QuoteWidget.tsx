import { Quote as QuoteIcon } from "lucide-react";

import type { Quote } from "@/types/news";

// Backed by src/services/news.service.ts#getDailyQuote — the admin panel
// will let Admins set the active quote; this widget just renders it.
export function QuoteWidget({ quote }: { quote: Quote | null }) {
  if (!quote) return null;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5">
      <QuoteIcon className="size-6 text-brand" />
      <p className="mt-3 font-heading text-lg leading-snug font-medium">“{quote.text}”</p>
      <p className="mt-3 text-sm text-muted-foreground">— {quote.author}</p>
    </div>
  );
}
