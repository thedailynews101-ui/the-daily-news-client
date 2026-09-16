import {
  getDailyQuote,
  getFeedArticles,
  getHeroArticles,
  getMegaArticle,
  getPinnedArticles,
  getVisualArticles,
  getWeatherSnapshot,
} from "@/services/news.service";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { NewsfeedGrid } from "@/components/home/NewsfeedGrid";
import { WidgetsRow } from "@/components/home/WidgetsRow";
import { PromoBanner } from "@/components/home/PromoBanner";
import { NewsletterBar } from "@/components/home/NewsletterBar";

export default async function Home() {
  const [heroArticles, megaArticle, feedArticles, visualArticles, pinnedArticles, quote, weather] =
    await Promise.all([
      getHeroArticles(),
      getMegaArticle(),
      getFeedArticles(),
      getVisualArticles(),
      getPinnedArticles(),
      getDailyQuote(),
      getWeatherSnapshot(),
    ]);

  return (
    <>
      <HeroCarousel articles={heroArticles} />
      <NewsfeedGrid
        mega={megaArticle}
        feedArticles={feedArticles}
        visualArticles={visualArticles}
        pinnedArticles={pinnedArticles}
      />
      <WidgetsRow weather={weather} quote={quote} />
      <PromoBanner />
      <NewsletterBar />
    </>
  );
}
