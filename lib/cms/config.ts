/**
 * CMS configuration and the one safety check every entry point runs before
 * doing anything else: refuse a secret/service-role key outright. Those keys
 * must never reach a NEXT_PUBLIC_ variable — doing so would embed them in the
 * static site's JavaScript bundle, where any visitor could read them.
 */

const MEDIA_BUCKET = "cms-media";

const MEDIA_LIMITS = {
  imageBytes: 8 * 1024 * 1024,
  videoBytes: 200 * 1024 * 1024,
  thumbnailSize: 480,
};

const LOCAL_STORE_KEY = "ae-cms-local-demo-v1";

function decodeJwtRole(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const json = typeof window === "undefined" ? Buffer.from(parts[1], "base64url").toString("utf8") : atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return (JSON.parse(json) as { role?: string }).role ?? null;
  } catch {
    return null;
  }
}

/** True if this looks like a secret/service-role key rather than a publishable/anon one. */
export function isSecretKey(key: string): boolean {
  const trimmed = key.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("sb_secret_")) return true;
  return decodeJwtRole(trimmed) === "service_role";
}

const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
const rawKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "").trim();

if (rawKey && isSecretKey(rawKey)) {
  // Fail loudly rather than silently using a privileged key in the browser.
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY looks like a secret/service-role key. " +
      "Use the publishable key instead (Supabase dashboard -> Project Settings -> API keys). " +
      "Never put the secret key in a NEXT_PUBLIC_ variable: it would ship inside the website.",
  );
}

export const supabaseUrl = rawUrl;
export const supabaseKey = rawKey;
export const isSupabaseConfigured = Boolean(rawUrl && rawKey);

export { MEDIA_BUCKET, MEDIA_LIMITS, LOCAL_STORE_KEY };
