import type { Article } from "@/types/news";
import { Masthead } from "./Masthead";
import { FeedMainColumn } from "./FeedMainColumn";
import { VisualColumn } from "./VisualColumn";
import { PinnedColumn } from "./PinnedColumn";

export function NewsfeedGrid({
  mega,
  feedArticles,
  visualArticles,
  pinnedArticles,
}: {
  mega: Article | null;
  feedArticles: Article[];
  visualArticles: Article[];
  pinnedArticles: Article[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Masthead />

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
        <FeedMainColumn mega={mega} articles={feedArticles} className="lg:col-span-2" />
        <VisualColumn
          articles={visualArticles}
          className="lg:border-l lg:border-border lg:pl-8"
        />
        <PinnedColumn
          articles={pinnedArticles}
          className="lg:border-l lg:border-border lg:pl-8"
        />
      </div>
    </section>
  );
}
