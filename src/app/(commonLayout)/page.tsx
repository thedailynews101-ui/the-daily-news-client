import {
  getDailyQuote,
  getHomePageData,
  getWeatherSnapshot,
} from "@/services/news.service";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { NewsfeedGrid } from "@/components/home/NewsfeedGrid";
import { WidgetsRow } from "@/components/home/WidgetsRow";
import { PromoBanner } from "@/components/home/PromoBanner";

export default async function Home() {
  const [home, quote, weather] = await Promise.all([
    getHomePageData(),
    getDailyQuote(),
    getWeatherSnapshot(),
  ]);

  return (
    <>
      <HeroCarousel articles={home.hero} />
      <NewsfeedGrid
        mega={home.mega}
        feedArticles={home.feed}
        visualArticles={home.visual}
        pinnedArticles={home.pinned}
      />
      <WidgetsRow weather={weather} quote={quote} />
      <PromoBanner />
    </>
  );
}
