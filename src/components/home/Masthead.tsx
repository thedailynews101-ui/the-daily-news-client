import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Masthead() {
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {today}
        </p>
        <h1 className="font-heading text-4xl font-black tracking-tight sm:text-5xl">
          The Daily Newsfeed
        </h1>
      </div>

      <form
        role="search"
        aria-label="Search news"
        className="flex w-full max-w-xs items-center gap-2 sm:w-auto"
      >
        <Input type="search" placeholder="Search news…" aria-label="Search news" />
        <Button type="submit" size="icon" variant="outline" aria-label="Search">
          <Search className="size-4" />
        </Button>
      </form>
    </div>
  );
}
