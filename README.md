# Dr. Abdullah Elkasaby — website

Bilingual (Arabic / English) static website for Dr. Abdullah Elkasaby, General & Bariatric Surgery.
Built with Next.js 16 (App Router) and exported as **plain static files** — no Node.js server,
database or CMS is needed to host it.

## Build & deploy

```bash
npm install
npm run build        # → out/   (upload the *contents* of out/ to the web root)
npm run preview      # optional: serve out/ locally at http://localhost:4173 like a static host
```

Before the production build, create `.env.production.local`:

```
NEXT_PUBLIC_SITE_URL=https://www.your-domain.com
```

Without it the site still builds, but canonical/Open Graph URLs point at `localhost`, the sitemap
is empty and every page is marked `noindex` (so a test upload is never indexed).

**Hosting:** any static host (Apache, LiteSpeed/Hostinger, Nginx, Netlify, S3…). URLs end in `/`
and each page is `…/index.html`, so refreshing nested routes works without rewrite rules. Point
the host's error page at `404.html` (most hosts do this automatically).

| Route | Purpose |
| --- | --- |
| `/` | Language chooser (redirects to the saved or browser language; Arabic by default) |
| `/ar/…`, `/en/…` | Home, about, services, before-after, videos, reviews, articles (+ 6 article pages), contact |

Other scripts: `npm run lint`, `npm run typecheck`, `npm run images` (regenerate responsive
WebP from `assets-src/`), `npm run brand` (icon, Open Graph images, ink textures),
`npm run check:content` (lists every placeholder still to replace).

## Design system

The visual language follows the Dr. Ayman Tarek site's composition and motion, re-expressed in
Dr. Abdullah's bright teal-and-green identity (`#077EA3`, `#39B54A`):

- `app/globals.css` — tokens, brand mesh background, glow orbs, light ink-glass surfaces
  (`.glass`, `--teal`, `--mint`, `--strong`, `--deep`), icon badges (round / soft / hex),
  buttons (gradient-pan primary, ghost, outline), scroll-reveal motion.
- `components/hero/Hero.tsx` — the single hero used by every page (photo, overlays, floating
  "Connect with us" card with socials │ divider │ phone on one line).
- `components/sections/*` — card family: care pillars, hex specialty cards, image-led procedure
  cards with detail modal, journey panel, showcase panels, reviews + FAQ, article cards, CTA.
- Motion: CSS reveals (content stays visible without JavaScript) plus `motion` for springs,
  the mobile drawer, modals, accordions and magnetic social icons. `prefers-reduced-motion` is honoured.

## Content still to supply before launch

All content lives in `content/*.ts`. Nothing below has been invented; placeholders are shown
with visible "Sample" / "Coming soon" labels and are never rendered as working links.

1. **Contact** (`content/site.ts`): phone, WhatsApp number, email, clinic address, Google Maps
   embed + link, opening hours, social profile URLs.
2. **Doctor portrait** (`content/about.ts → portrait.src`); a monogram plate is shown until then.
3. **Official logo** — the "AE" monogram is temporary (`components/brand/Logo.tsx`, `npm run brand`).
4. **Qualifications, career timeline, certificate scans** (`content/about.ts`).
5. **Patient reviews** (`content/reviews.ts`) — only genuine reviews, with permission.
6. **Before & after photographs** (`content/results.ts`) — written consent, non-identifying,
   unretouched, correctly paired.
7. **Videos** (`content/videos.ts`) — YouTube IDs or files for the planned topics.
8. **Photography** (`content/media.ts`) — all photos are temporary licensed stock (Unsplash) that
   do not show the doctor, his team or patients; replace with the clinic's own.
9. **Medical review** — please have Dr. Elkasaby confirm the service list (`content/practice.ts`,
   e.g. whether gastric bypass is offered) and approve all article and FAQ wording.

Set `settings.showSampleContent = false` in `content/site.ts` to hide every sample block if
the site goes live before the real material is ready.
