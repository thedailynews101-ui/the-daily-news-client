import { Cloud, CloudLightning, CloudRain, CloudSnow, Sun, Wind, type LucideIcon } from "lucide-react";

import type { WeatherSnapshot } from "@/types/news";

const CONDITION_ICON: Record<WeatherSnapshot["condition"], LucideIcon> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
  snowy: CloudSnow,
  windy: Wind,
};

// Placeholder widget backed by src/services/news.service.ts#getWeatherSnapshot.
// Swap for a real third-party weather API integration later.
export function WeatherWidget({ weather }: { weather: WeatherSnapshot }) {
  const Icon = CONDITION_ICON[weather.condition];

  return (
    <div className="flex items-center justify-between rounded-xl bg-primary p-5 text-primary-foreground">
      <div>
        <p className="text-xs tracking-widest text-primary-foreground/70 uppercase">
          {weather.location}
        </p>
        <p className="mt-1 font-heading text-4xl font-bold">{weather.temperatureC}°C</p>
        <p className="mt-1 text-sm text-primary-foreground/80 capitalize">
          {weather.condition} · H:{weather.high}° L:{weather.low}°
        </p>
      </div>
      <Icon className="size-12 shrink-0 text-primary-foreground/80" />
    </div>
  );
}
