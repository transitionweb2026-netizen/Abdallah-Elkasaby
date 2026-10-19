import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { allowIndexing, siteUrl } from "@/lib/site-url";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  robots: allowIndexing ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#e8f6fa",
  colorScheme: "light",
};

/** Root layout for the language-neutral `/` entry page. */
export default function EntryLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
