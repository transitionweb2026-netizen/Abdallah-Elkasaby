import { notFound } from "next/navigation";
import { Hero, heroProps } from "@/components/hero/Hero";
import { FinalCta } from "@/components/sections/FinalCta";
import { Media } from "@/components/ui/Media";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoLibrary } from "@/components/videos/VideoLibrary";
import { ui } from "@/content/site";
import { videos } from "@/content/videos";
import { isLocale } from "@/lib/i18n";
import { topLevelMetadata } from "@/lib/metadata";

export const generateMetadata = topLevelMetadata("videos");

export default async function VideosPage({ params }: PageProps<"/[locale]/videos">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ar = locale === "ar";
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
            title={anyPublished ? (ar ? "فيديوهات تثقيفية" : "Educational videos") : ar ? "موضوعات قادمة" : "Upcoming topics"}
            subtitle={
              anyPublished
                ? ar
                  ? "شروحات قصيرة تساعدك على فهم خياراتك والاستعداد لاستشارتك."
                  : "Short explanations to help you understand your options and prepare for your consultation."
                : ar
                  ? "هذه هي الموضوعات المخطّط لها؛ ستُنشر الفيديوهات هنا فور جاهزيتها."
                  : "These are the topics being prepared — videos will be published here as soon as they are ready."
            }
          />
          <VideoLibrary
            items={videos.map((v) => ({
              id: v.id,
              topic: v.topic[locale],
              title: v.title[locale],
              summary: v.summary[locale],
              source: v.source,
              poster: <Media slot={v.poster} locale={locale} sizes="(min-width: 1024px) 760px, 100vw" decorative />,
            }))}
            text={{
              play: ar ? "تشغيل الفيديو" : "Play video",
              comingSoon: ui.comingSoon[locale],
              planned: ar ? "موضوع مخطّط" : "Planned topic",
              featured: ar ? "فيديو مميّز" : "Featured video",
              close: ui.close[locale],
            }}
          />
        </div>
      </section>
      <FinalCta locale={locale} icon="video" />
    </>
  );
}
