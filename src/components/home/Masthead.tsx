import { NewsSearch } from "@/components/home/NewsSearch";

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

      <NewsSearch />
    </div>
  );
}
