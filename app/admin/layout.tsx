import type { Metadata } from "next";
import { AdminProvider } from "@/components/admin/AdminProvider";
import { fontVariables } from "@/lib/fonts";
import "./admin.css";

export const metadata: Metadata = {
  title: "Dashboard | Dr. Abdullah Elkasaby",
  robots: { index: false, follow: false },
};

/**
 * A fully independent root layout for /admin/** — its own <html>, its own
 * stylesheet, no RTL/bilingual logic. Still exported as static HTML (same
 * `output: "export"` build as the public site); access control is Supabase
 * Auth + Row Level Security, not the URL.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body>
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
