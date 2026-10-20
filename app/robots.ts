import type { MetadataRoute } from "next";
import { allowIndexing, siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Until NEXT_PUBLIC_SITE_URL is set, a test upload must not be indexed.
  if (!allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    // The admin dashboard is protected by Supabase auth + RLS, not by secrecy
    // of the URL — it is still static HTML, so it is explicitly excluded here too.
    rules: { userAgent: "*", allow: "/", disallow: "/admin/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
