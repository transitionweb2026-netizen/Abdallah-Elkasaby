# Content inventory — what the CMS covers

Audit of every content file and page in this repository, taken on 2026-10-20
before any CMS code was written. This is the map the Supabase schema, the
admin dashboard registry and the public-site integration are all built from.
See [`CMS.md`](./CMS.md) for how to use the result and [`SUPABASE.md`](./SUPABASE.md)
for setup.

Legend: **Doc** = a `cms_documents` row (one fixed-shape JSON blob, no add/remove).
**Catalog** = its own table (rows can be added, removed, reordered, published
independently). "Wired" = the public site actually reads this through the CMS
content layer (`lib/content.ts`) today. Everything else still reads the
bundled `content/*.ts` files directly — see "Integration status" at the end.

## `content/site.ts` — sitewide identity, contact, nav, footer, UI strings

| Export | Shape | CMS key | Used by |
|---|---|---|---|
| `doctor` | name, shortName, specialty, description (all `L10n`) | Doc `settings.identity` | Header, footer, every page's hero, metadata |
| `contact` | phone, whatsapp, whatsappMessage, email, address, mapEmbedUrl, mapLink, hours | Doc `settings.contact` | Header, footer, Contact page, `lib/contact.ts` booking logic |
| `socials` | ordered list of `{ platform, label, url }` | Doc `settings.socials` (list field) | Header/hero contact panel, footer |
| `settings.showSampleContent` | boolean | Doc `settings.general` | Gates every sample/placeholder block sitewide |
| `navLabels` | one `L10n` per `PageKey` (8 keys) | Doc `settings.nav` | Header nav, footer page list, breadcrumbs |
| `ui` | ~35 shared interface strings (buttons, a11y labels, disclaimers) | Doc `settings.ui` | Nearly every component |
| `footer` | intro, 3 column titles, address-pending note, rights line | Doc `settings.footer` | Footer |

`lib/contact.ts` never renders a `REPLACE_WITH_…` value as a working link
(`isConfigured()`). The CMS must preserve that: a document field left empty
behaves the same way, whether the value came from `content/site.ts` or from
Supabase.

## `content/pages.ts` — one hero per page

`pages: Record<PageKey, PageContent>` — 8 fixed keys (`home`, `about`,
`services`, `results`, `videos`, `reviews`, `articles`, `contact`), each with
`meta.title`/`meta.description` (SEO) and `hero` (eyebrow, two-line title,
lead, primary CTA, optional secondary CTA + icon, image, a 2–3 item highlight
badge). Doc per key: `pages.home`, `pages.about`, … `pages.contact` (8
documents, same field shape). Used by `components/hero/Hero.tsx` on every page.

## `content/home.ts` — homepage sections, in page order

One document per homepage section (so each can be enabled/reordered/edited
independently in the Section Manager):

| Section | Doc key | Fields |
|---|---|---|
| Stats strip | `home.stats` | 4 `{ icon, value, suffix, label, sample? }` items |
| Intro | `home.intro` | eyebrow/title/text, 3 `{icon,text}` points, link label |
| Specialties heading | `home.specialties` | eyebrow/title/lead |
| Services heading | `home.services` | eyebrow/title/lead/cta |
| Results teaser | `home.results` | eyebrow/title/lead/cta/panelTitle/points[]/asideTitle/asideText |
| Journey heading | `home.journey` | eyebrow/title/lead |
| Expectations heading | `home.expectations` | eyebrow/title/lead |
| Reviews heading | `home.reviews` | eyebrow/title/lead/cta |
| Articles heading | `home.articles` | eyebrow/title/lead/cta |

`finalCta` (eyebrow/title/text) is promoted to a sitewide document,
`global.finalCta`, since Phase 4 made it the one closing CTA repeated on
every page (`components/sections/FinalCta.tsx`).

## `content/practice.ts` — specialties, services, journey, approach

| Export | CMS shape | Notes |
|---|---|---|
| `specialties` (5) | Catalog `specialties` | slug/icon/image/title/summary + `service` (slug reference into `services`); shown on Home + About |
| `serviceGroups` (`bariatric`, `general`) | Catalog `serviceGroups` | title/short/intro/icon; modelled as a catalog (not a fixed doc) so a third group can be added without a migration |
| `services` (8) | Catalog `services`, `group_id` → `serviceGroups` | slug/icon/image/title/summary/body/points[] |
| `servicesNote` | Doc `services.note` | one disclaimer line under the service list |
| `journey` (5 steps) | Doc `services.journey` (list field) | icon/title/text — also reused as the Home "Patient journey" section |
| `expectations` (5) | Doc `services.expectations` (list field) | icon/title/text |
| `approach` | Doc `services.approach` | eyebrow/title/paragraphs[]/principles[] — the Services page "philosophy of care" section (`pages.services.hash = "approach"`) |

## `content/about.ts` — About page

| Export | CMS shape |
|---|---|
| `portrait` | Doc `about.portrait` — image field, null = monogram plate fallback |
| `biography` | Doc `about.biography` — eyebrow/title/paragraphs[] |
| `credentials` (4) | Catalog `credentials` — icon/title/detail/sample? |
| `timeline` (4) | Catalog `timeline` — period/title/detail/sample? |
| `certificates` (6) | Catalog `certificates` — image-only gallery, sample frames until real scans are uploaded |

## `content/results.ts` — Before & After gallery

| Export | CMS shape |
|---|---|
| `resultCases` (4 placeholders) | Catalog `beforeAfterCases` — id/category/title/caption/before/after/aspect |
| `resultsDisclaimer` | Doc `results.gallery` (`disclaimer` field) |

New catalog, not present in any reference project: before/after cases need
the same **consent gate** as reviews (see Schema). A case cannot be published
without `consent_confirmed = true`, enforced in the database, not just the UI.

## `content/videos.ts` — Video library

`videos` (9 entries) → Catalog `videos`: id/topic/title/summary/poster/source.
`source` stays a tagged union (`{type:"youtube",id}` or `{type:"file",src}` —
upload or paste-a-link, never silently treated as the same thing) `| null`
("coming soon", disabled card, per `VideoLibrary.tsx`).

## `content/reviews.ts` — Patient reviews

`reviews` (3 samples) → Catalog `reviews`: id/author/context?/text/sample?.
Same consent gate as `beforeAfterCases`: a non-sample review cannot be
published without `consent_confirmed = true`. No star rating exists in the
current site — the CMS does not add one, since the brief forbids inventing a
rating that has no verifiable source.

## `content/faq.ts` — FAQ

`faqGroups` (3 groups × 3–4 items) → two catalogs: `faqCategories`
(id/icon/title) and `faqs` (q/a, `category_id` → `faqCategories`).

## `content/articles.ts` — Patient-education articles

`articles` (6) → Catalog `articles`: slug/category/title/excerpt/image/body
(rich blocks: paragraph, heading, list, note). `body` is a typed block array,
not free-form HTML — the schema's `blocks` field type renders and stores
exactly these four block kinds, so there is no unsanitized-HTML surface.
`readingMinutes()` keeps being computed from the text at render time; it is
never stored.

## `content/media.ts` — image slots

19 named slots (`heroHome`, `stethoscope`, `activeLifestyle`, …), each a
licensed stock photo used as a placeholder (`stock: true`) until real clinic
photography exists. These become the **bundled fallback** layer in the new
Media Library: every `image` field in the registry defaults to its current
`MediaKey` and keeps rendering that bundled photo until an editor uploads a
replacement and points the field at it. Uploaded photos are never required —
nothing breaks if Supabase is never connected.

## Known gap: inline copy outside `content/*.ts`

Not every visible string lives in a content file. Fixed in the CMS
integration pass: the Videos page's library heading
([`app/[locale]/videos/page.tsx`](../app/%5Blocale%5D/videos/page.tsx)) now
reads a dedicated `videosLibrary` document (CMS key `videos.library`,
title/subtitle for the "videos exist" state and emptyTitle/emptySubtitle for
the "none published yet" state) instead of inline ternaries; the Home page's
introduction photo+caption, the About page's biography photo+caption and the
"Why choose us" section's photo+caption (previously hardcoded bundled-photo
keys and `locale === "ar" ? … : …` strings) are now `image`/`caption` fields
on `home.intro`, `about.biography` and `home.expectations` respectively.

**Still not CMS-editable**, found by the same audit but left for a later
pass (see `docs/CMS.md`'s "Known limitations" for the reasoning): the About
page's credentials/timeline/certificates section headings and "Areas of
care" button; the Services page's "why trust this approach" and "from
consultation to follow-up" headings; most of the Reviews, Before & After and
Articles pages' section headings, empty-state notes and feature-grid copy;
the article detail page's sidebar/related-articles strings. Every one of
these is an ordinary bilingual ternary in a page or section component — the
same pattern already fixed elsewhere — not a technical constraint.

## Integration status (public site ↔ CMS)

Building the schema, the admin dashboard and the publish pipeline does not,
by itself, make existing pages read from them — each page/component has to
be pointed at `lib/content.ts` instead of importing `content/*.ts` directly.
That rewiring is tracked and reported honestly in the implementation report
delivered with this CMS phase (which pages were switched over vs. which
still read the static files only); this document stays a fixed snapshot of
the *content*, not a live status board.
