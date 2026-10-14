import type { PublicEventGroup } from "@/types/event";
import type { Article, Quote, WeatherSnapshot } from "@/types/news";
import { toHomeArticle } from "@/lib/map-public-article";
import { getPublicHome } from "@/services/public-article.service";
import quotesData from "@/data/quotes.json";

const quotes = quotesData as Quote[];

export type HomePageData = {
  hero: Article[];
  mega: Article | null;
  feed: Article[];
  visual: Article[];
  eventGroups: PublicEventGroup[];
};

/** Fetches the staff-curated homepage layout from the public API. */
export async function getHomePageData(): Promise<HomePageData> {
  try {
    const response = await getPublicHome();
    const layout = response.data;
    return {
      hero: layout.hero.map(toHomeArticle),
      mega: layout.mega ? toHomeArticle(layout.mega) : null,
      feed: layout.feed.map(toHomeArticle),
      visual: layout.visual.map(toHomeArticle),
      eventGroups: layout.eventGroups ?? [],
    };
  } catch {
    return { hero: [], mega: null, feed: [], visual: [], eventGroups: [] };
  }
}

export async function getHeroArticles(): Promise<Article[]> {
  const data = await getHomePageData();
  return data.hero;
}

export async function getMegaArticle(): Promise<Article | null> {
  const data = await getHomePageData();
  return data.mega;
}

export async function getFeedArticles(): Promise<Article[]> {
  const data = await getHomePageData();
  return data.feed;
}

export async function getVisualArticles(): Promise<Article[]> {
  const data = await getHomePageData();
  return data.visual;
}

export async function getEventGroups(): Promise<PublicEventGroup[]> {
  const data = await getHomePageData();
  return data.eventGroups;
}

export async function getDailyQuote(): Promise<Quote | null> {
  return quotes.find((quote) => quote.isActive) ?? quotes[0] ?? null;
}

export async function getWeatherSnapshot(): Promise<WeatherSnapshot> {
  return {
    location: "Dhaka",
    temperatureC: 26,
    condition: "cloudy",
    high: 31,
    low: 25,
    updatedAt: new Date().toISOString(),
  };
}
