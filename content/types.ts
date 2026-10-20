/**
 * The canonical shape of every piece of content on the site, assembled from
 * the existing `content/*.ts` files (their real exported values — nothing
 * here is redefined). This is what `lib/content.ts` hands to pages once the
 * CMS snapshot (if any) has been merged over it; it is also the shape the
 * CMS's own document/catalog bindings in `lib/cms/model.ts` read and write.
 */
import { approach, expectations, journey, serviceGroups, services, servicesNote, specialties } from "./practice";
import { certificates, credentials, biography, portrait, timeline } from "./about";
import { articles } from "./articles";
import { faqGroups } from "./faq";
import { home } from "./home";
import { pages } from "./pages";
import { resultCases, resultsDisclaimer } from "./results";
import { reviews } from "./reviews";
import { contact, doctor, footer, navLabels, settings, socials, ui } from "./site";
import { videos, videosLibraryHeading } from "./videos";

export type ContentTree = {
  site: {
    doctor: typeof doctor;
    contact: typeof contact;
    socials: typeof socials;
    settings: typeof settings;
    navLabels: typeof navLabels;
    ui: typeof ui;
    footer: typeof footer;
  };
  pages: typeof pages;
  home: Omit<typeof home, "finalCta">;
  global: {
    finalCta: typeof home.finalCta;
  };
  practice: {
    specialties: typeof specialties;
    serviceGroups: typeof serviceGroups;
    services: typeof services;
    servicesNote: typeof servicesNote;
    journey: typeof journey;
    expectations: typeof expectations;
    approach: typeof approach;
  };
  about: {
    portrait: typeof portrait;
    biography: typeof biography;
    credentials: typeof credentials;
    timeline: typeof timeline;
    certificates: typeof certificates;
  };
  results: {
    cases: typeof resultCases;
    disclaimer: typeof resultsDisclaimer;
  };
  reviews: typeof reviews;
  faq: typeof faqGroups;
  articles: typeof articles;
  videos: typeof videos;
  videosLibrary: typeof videosLibraryHeading;
};

/** The site's own bundled content, reassembled into the tree shape above. */
export function defaultContentTree(): ContentTree {
  const { finalCta, ...homeRest } = home;
  return {
    site: { doctor, contact, socials, settings, navLabels, ui, footer },
    pages,
    home: homeRest,
    global: { finalCta },
    practice: { specialties, serviceGroups, services, servicesNote, journey, expectations, approach },
    about: { portrait, biography, credentials, timeline, certificates },
    results: { cases: resultCases, disclaimer: resultsDisclaimer },
    reviews,
    faq: faqGroups,
    articles,
    videos,
    videosLibrary: videosLibraryHeading,
  };
}
