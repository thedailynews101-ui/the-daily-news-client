import type { Quote, WeatherSnapshot } from "@/types/news";
import { WeatherWidget } from "./WeatherWidget";
import { QuoteWidget } from "./QuoteWidget";
import { GameWidget } from "./GameWidget";

export function WidgetsRow({
  weather,
  quote,
}: {
  weather: WeatherSnapshot;
  quote: Quote | null;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <WeatherWidget weather={weather} />
        <QuoteWidget quote={quote} />
        <GameWidget />
      </div>
    </section>
  );
}
