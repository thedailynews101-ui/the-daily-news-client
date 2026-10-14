import { getHomePageData, getPublicWidgetsData } from "@/services/news.service";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { NewsfeedGrid } from "@/components/home/NewsfeedGrid";
import { WidgetsRow } from "@/components/home/WidgetsRow";
import { PromoBanner } from "@/components/home/PromoBanner";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [home, widgets] = await Promise.all([getHomePageData(), getPublicWidgetsData()]);

  return (
    <>
      <HeroCarousel articles={home.hero} />
      <NewsfeedGrid
        mega={home.mega}
        feedArticles={home.feed}
        visualArticles={home.visual}
        eventGroups={home.eventGroups}
      />
      <WidgetsRow widgets={widgets} />
      <PromoBanner />
    </>
  );
}
