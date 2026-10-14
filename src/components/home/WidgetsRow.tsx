import type { PublicWidgetsPayload } from "@/types/widget";
import { WeatherWidget } from "./WeatherWidget";
import { QuoteWidget } from "./QuoteWidget";
import { PublicOpinionWidget } from "./PublicOpinionWidget";
import { GameWidget } from "./GameWidget";

export function WidgetsRow({ widgets }: { widgets: PublicWidgetsPayload }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <WeatherWidget weather={widgets.weather} />
        {widgets.middleWidget === "PUBLIC_OPINION" ? (
          <PublicOpinionWidget initialOpinion={widgets.publicOpinion} />
        ) : (
          <QuoteWidget quote={widgets.quote} />
        )}
        <GameWidget />
      </div>
    </section>
  );
}
