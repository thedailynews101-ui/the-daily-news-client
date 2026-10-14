import { cn } from "@/lib/utils";
import type { PublicEventGroup } from "@/types/event";

export function PinnedColumn({
  eventGroups,
  className,
}: {
  eventGroups: PublicEventGroup[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col rounded-lg border border-border bg-card p-4", className)}>
      <h3 className="font-heading text-sm font-bold text-foreground">Fixed News</h3>

      {eventGroups.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No events listed yet.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-5">
          {eventGroups.map((group) => (
            <section key={group.id}>
              <h4 className="font-heading text-sm font-bold text-foreground">{group.title}</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
