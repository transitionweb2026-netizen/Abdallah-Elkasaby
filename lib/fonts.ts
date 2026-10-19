import { Alexandria, IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from "next/font/google";

// Fonts are downloaded at build time and self-hosted inside the static export.

/** Latin headings and text: one geometric sans family, bold for headings. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

/*
 * Arabic fonts are not preloaded: preloading is decided per layout, and the
 * English pages should not download Arabic font files.
 */

/** Arabic headings (variable). */
const alexandria = Alexandria({
  subsets: ["arabic"],
  variable: "--font-alexandria",
  display: "swap",
  preload: false,
});

/** Arabic text and interface. */
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-ar",
  display: "swap",
  preload: false,
});

export const fontVariables = [jakarta.variable, alexandria.variable, plexArabic.variable].join(" ");
