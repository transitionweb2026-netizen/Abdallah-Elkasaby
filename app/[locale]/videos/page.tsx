import { notFound } from "next/navigation";
import { Hero, heroProps } from "@/components/hero/Hero";
import { FinalCta } from "@/components/sections/FinalCta";
import { Media } from "@/components/ui/Media";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoLibrary } from "@/components/videos/VideoLibrary";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { topLevelMetadata } from "@/lib/metadata";

export const generateMetadata = topLevelMetadata("videos");

export default async function VideosPage({ params }: PageProps<"/[locale]/videos">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ar = locale === "ar";
  const { videos, videosLibrary, site } = getContent();
  const { ui } = site;
  const anyPublished = videos.some((v) => v.source);

  return (
    <>
      <Hero {...heroProps("videos", locale)} />
      <section className="section" aria-labelledby="library-title">
        <div className="orb-layer" aria-hidden="true"><div className="orb orb--teal orb--lg orb--tl" /></div>
        <div className="orb-layer" aria-hidden="true"><div className="orb orb--green orb--br" /></div>
        <div className="container">
          <SectionHeading
            id="library-title"
            title={anyPublished ? videosLibrary.title[locale] : videosLibrary.emptyTitle[locale]}
            subtitle={anyPublished ? videosLibrary.subtitle[locale] : videosLibrary.emptySubtitle[locale]}
          />
          <VideoLibrary
            items={videos.map((v) => ({
              id: v.id,
              topic: v.topic[locale],
              title: v.title[locale],
              summary: v.summary[locale],
              source: v.source,
              poster: (
                <Media slot={v.poster} locale={locale} sizes="(min-width: 900px) 32vw, (min-width: 640px) 46vw, 100vw" decorative />
              ),
            }))}
            text={{
              play: ar ? "تشغيل الفيديو" : "Play video",
              comingSoon: ui.comingSoon[locale],
              close: ui.close[locale],
            }}
          />
        </div>
      </section>
      <FinalCta locale={locale} />
    </>
  );
}
