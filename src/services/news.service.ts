import type { Article, Quote, WeatherSnapshot } from "@/types/news";
import articlesData from "@/data/articles.json";
import quotesData from "@/data/quotes.json";

// NOTE: Every function below reads the local demo JSON for now. Each one
// already documents the real endpoint it will call once the Express/Prisma
// API is live — swapping is a one-line change from the JSON read to the
// commented `httpClient.get(...)` call.
//
// import { httpClient } from "@/lib/axios/httpClient";

const articles = articlesData as Article[];
const quotes = quotesData as Quote[];

const unflaggedArticles = articles.filter(
  (article) => !article.isBreaking && !article.isFeatured && !article.isPinned
);

/** Breaking-news items for the top hero carousel. */
export async function getHeroArticles(): Promise<Article[]> {
  // return httpClient.get("/articles", { params: { breaking: true, limit: 5 } });
  return articles.filter((article) => article.isBreaking);
}

/** The single large "mega" story shown atop the first two feed columns. */
export async function getMegaArticle(): Promise<Article | null> {
  // return httpClient.get("/articles/featured");
  return articles.find((article) => article.isFeatured) ?? null;
}

/** 50/50 article cards that fill out columns 1 + 2 below the mega story. */
export async function getFeedArticles(): Promise<Article[]> {
  // return httpClient.get("/articles", { params: { section: "feed", limit: 6 } });
  return unflaggedArticles.slice(0, 6);
}

/** Column 3: image-first cards, picture then headline. */
export async function getVisualArticles(): Promise<Article[]> {
  // return httpClient.get("/articles", { params: { section: "visual", limit: 4 } });
  return unflaggedArticles.slice(6, 10);
}

/** Column 4: dense, "fixed"/pinned briefs curated by the newsroom. */
export async function getPinnedArticles(): Promise<Article[]> {
  // return httpClient.get("/articles", { params: { pinned: true } });
  return articles.filter((article) => article.isPinned);
}

/** Admin-curated quote of the day. */
export async function getDailyQuote(): Promise<Quote | null> {
  // return httpClient.get("/quotes/active");
  return quotes.find((quote) => quote.isActive) ?? quotes[0] ?? null;
}

/**
 * Placeholder weather snapshot. Will be replaced by a real third-party
 * weather API integration; kept here so the widget has a single import to
 * swap out later.
 */
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
