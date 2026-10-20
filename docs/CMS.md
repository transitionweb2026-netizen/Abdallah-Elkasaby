# The content dashboard

`/admin/` lets Dr. Elkasaby's team edit the website's text, images and lists
without touching code. This page explains how it works, what is and isn't
wired up to the public site yet, and where its limits are.

Setup (connecting Supabase, creating the first admin) is in
[`SUPABASE.md`](./SUPABASE.md). The content model it was built from is in
[`cms-content-inventory.md`](./cms-content-inventory.md).

## Two modes, one dashboard

- **Local demo** (no Supabase configured): every screen works, seeded with
  the website's current content, but edits are saved only in your browser's
  `localStorage` and never reach anyone else. Good for trying the dashboard
  out. A banner on the Overview page always says which mode is active —
  the dashboard never lets a local-demo edit look like a real save.
- **Connected** (Supabase configured + signed in): the real thing. Row
  Level Security — not this app's code — decides what your account can do.

## Documents and catalogs

Two kinds of editable content, matching how the site is actually built:

- **Documents** — one fixed-shape block per page section or settings group
  (the homepage's stats strip, the About page's biography, the global
  contact details, …). You edit its fields; you can't add or remove a
  document.
- **Catalogs** — repeatable, reorderable rows: services, specialties,
  videos, reviews, FAQ items, articles, before/after cases, credentials,
  timeline entries, certificates. You can create, edit, reorder and delete
  rows (deleting is admin-only, and blocked while something else still
  refers to the row — e.g. a service group with services in it).

Both work the same way underneath: a **draft** you edit freely, and a
**published** copy that only changes when you press **Publish**. Editing a
draft never affects what's already published, so you can make changes over
time without anything half-finished going live by accident.

## Draft → Publish, and the rules that protect real content

Every document and catalog row shows a status: **draft** (never published),
**published** (live copy matches your draft), or **modified** (published,
but the draft has since changed).

Publishing is blocked (not just discouraged — the database itself enforces
this) for:

- a **review** or **before/after case** that isn't marked as a demo
  placeholder, until you've confirmed documented patient consent for it;
- an **article** that isn't marked as a demo placeholder, until it has a
  named medical reviewer.

This is the same rule the site's content files already stated in plain
English (never publish a review or a photo without consent, never invent a
reviewed-and-approved article) — the dashboard just makes it impossible to
skip by accident, rather than relying on someone remembering.

Required fields that are still empty block **publishing** but not
**saving** — you can always save a half-finished draft and come back to it.
Actively wrong values (a malformed URL, a phone number with letters in it)
block saving outright.

## Media library

One place for every photo and video, backed by Supabase Storage. Files are
sniffed by their real content (not the extension or the browser's guess),
size-limited, and get an automatically generated thumbnail. A file that is
still used by any draft or published content — published **or** draft, not
only published — can't be deleted: the library tells you exactly where it's
used first, and this is enforced by the database itself
(`cms_media_delete_guard`), not only by the dashboard disabling a button.

The site's existing stock photos (`content/media.ts`) are also listed here,
marked "bundled", so the library shows the complete picture. Every image
field — including the ones that already show a bundled stock photo by
default (hero photos, specialty/service/article images, video posters) —
offers the same **Choose from library** picker (bundled photos and anything
already uploaded, in one grid) plus a real **upload** button for a brand-new
replacement. Uploading needs the Supabase connection (disabled with that
exact reason in the local demo); choosing something already in the library,
bundled included, works in both modes.

Video fields work the same way: paste a YouTube id, or upload a video file
(or choose one already in the library) — never an image picker mistakenly
standing in for the video control.

## Bilingual content

Every text field is two independent inputs, English and Arabic, side by
side. Nothing is auto-translated — saving one language never touches the
other, and it's fine for a draft to have one language finished before the
other.

## Publishing: how it actually works

**Publishing in the dashboard changes the database. It does not change the
live website by itself.** This site is a static export — plain HTML/CSS/JS
files uploaded to a host — so "live" content is whatever was baked into
those files at the last build. Nothing it serves talks to Supabase at
request time.

The real publish pipeline has three steps, and the **Publishing** screen in
the dashboard always shows whether step 1 is overdue:

1. **`npm run cms:sync`** — downloads everything currently published in the
   database (and the media files it uses) into `content/cms-snapshot.json`
   and `public/media/cms/`. Uses only the public, publishable key — never
   a secret key, and it refuses to run if one is configured by mistake.
2. **`npm run build`** — the static build reads that snapshot and overlays
   it on the site's bundled defaults (see `lib/content.ts`). Everything not
   covered by the snapshot keeps working exactly as before.
3. **Upload `out/`** to your static host, replacing what's there.

The dashboard's Overview page fetches the *live* site's own `/cms-build.json`
and compares its timestamp with the database's — if the database has
published changes the live build doesn't have yet, it says so explicitly,
rather than implying the site is already up to date.

## Users & access

Two roles, enforced in the database (never a flag the browser can set
itself):

- **editor** — can create, edit, publish and reorder content; cannot
  delete catalog rows or media files, and cannot manage other users.
- **admin** — everything an editor can do, plus deleting, and granting or
  removing access for other people from **Users & access**.

There is no self-service sign-up. A new team member is first invited from
the Supabase dashboard (which only an existing project owner can do), then
granted a role from this screen — see [`SUPABASE.md`](./SUPABASE.md#4-create-the-first-administrator).

## Integration status — what editing something here actually changes today

**Every public page now reads through the content layer.** Home, About,
Services, Before & After, Videos, Reviews & FAQ, Articles, Contact, the
header, the footer, the sitemap, and every page's SEO metadata all call
`getContent()` (`lib/content.ts`) instead of importing `content/*.ts`
directly. Publishing something in the dashboard, running `npm run cms:sync`,
and rebuilding genuinely changes what the live site shows — this was
verified by hand, not assumed: a test snapshot with distinctive values was
applied, the site was rebuilt, and the new text appeared on the rendered
pages in both Arabic and English (the doctor's name, the sitewide closing
CTA, and a video catalog entry were each checked); the test snapshot was
then removed and the site rebuilt back to the real bundled content.

A handful of files still read their own narrow slice directly from
`content/*.ts` rather than `getContent()` — `content/media.ts`'s bundled
photo registry (used by `components/ui/Media.tsx` to render a *bundled*
photo; an uploaded replacement is resolved by `lib/content.ts`/`lib/cms/
model.ts` before the component ever sees it) and pure helper functions that
take their data as a parameter (`readingMinutes()`) rather than importing
it. Neither holds editable content of its own.

### Every image field is a real upload, not just a bundled-photo picker

Earlier builds of this CMS let an editor choose a *different* bundled stock
photo for fields like the hero image, specialty/service/article photos and
video posters, but not upload a brand-new replacement — only fields with no
bundled default (the doctor's portrait, certificate scans, before/after
photos, video files) were real uploads. That gap is closed: every one of
those fields now offers the same **Choose from library** picker (bundled
photos and anything already uploaded) plus a real upload button. The
stored value is either the bundled photo's own key (unchanged, so nothing
breaks if an editor never touches the field) or `{ assetId }`, resolved at
build time to a real `/media/cms/…` file by `lib/cms/model.ts`'s
`resolveImageRef()` — the same resolution path the portrait and certificates
already used, just generalised to fields that also have a bundled default
to fall back to if the referenced upload is ever missing. Verified directly:
a hybrid field's bundled-photo picker, its upload button, and a video
catalog item's own file upload (previously wired as an *image* field by
mistake — see the registry's `videos.source`, now `kind: "video"`) were all
exercised in a real browser against the local-demo store (see Testing).

### How a bad snapshot is kept from breaking the build

`getContent()` doesn't trust `content/cms-snapshot.json` blindly. Before
the merge runs, `lib/cms/validate-snapshot.ts` checks every document and
catalog entry's *shape* against its field in `lib/cms/registry.ts` — an
object where one belongs, an array where one belongs, and so on — and
drops anything that doesn't match, falling back to that one item's bundled
default and printing a clear warning during `next build`. A `try/catch`
around the whole merge is the last resort for whatever that check didn't
anticipate. Both paths were exercised directly: a snapshot with a
correctly-shaped override built and rendered as expected; a snapshot with a
deliberately wrong-shaped field (a string where an object belongs) still
built successfully, logged `[cms] dropped from the snapshot for not
matching their expected shape: document "settings.identity".`, and
rendered the real content for that one field instead of crashing. `GET
/cms-build.json` exposes both `usedFallback` (the whole merge failed) and
`droppedFields` (specific fields were dropped) so this is visible without
reading build logs.

## Testing

- `npm run typecheck`, `npm run lint`, `npm run build`, `npm run
  check:content` — all pass against the current code.
- `npm run test:e2e` — Playwright, against the current build with Supabase
  configured and signed out: no public page throws a console error or
  hydration warning; `/admin/` and direct links into it correctly gate
  behind sign-in rather than exposing the dashboard; the sign-in form makes
  a real call to Supabase Auth and is really rejected for a bogus login
  (not a mock that would accept anything).
- `npm run test:e2e:local-demo` — the same dashboard with no Supabase
  configured: the local-demo banner is shown (never claims to be a real
  save); editing a document and reloading proves the save round-tripped
  through `localStorage`, and that the edit never reaches the already-built
  public pages; the new `videos.library` document saves and reloads the
  same way; a hybrid image field's "Choose from library" picker opens and
  lists the bundled stock photos; a video catalog item's source field shows
  a real video upload control (`accept="video/*"`), not an image one;
  uploading a *new* file is disabled everywhere (main field and inside the
  picker) with the actual reason given, never silently accepted — choosing
  something already in the library is not disabled, since that needs no
  Supabase connection; Publish shows the real "rebuild and redeploy" message
  rather than implying it already went live. This needs its own build (no
  `NEXT_PUBLIC_SUPABASE_*` vars) — see the comment at the top of
  `tests/cms.local-demo.spec.ts`.
- **Not run**: anything past the sign-in form with a real account (signing
  in, editing, publishing, then running `npm run cms:sync` against the real
  project) — that needs a bootstrapped admin account, which needs either
  the Supabase SQL editor or the project's Supabase MCP connection to be
  live for this session (see `docs/SUPABASE.md`). The real-Auth rejection
  test above is genuine Supabase integration, just not the full logged-in
  path.

## Known limitations

- **A number of smaller section headings, captions and button labels are
  still inline literals in page/component code**, not content fields.
  Fixed in this pass: the Videos page's library heading (now the
  `videos.library` document), the Home-page introduction and About-page
  biography photo + caption, and the "Why choose us" section's photo +
  caption. **Still hardcoded, found but deliberately left for a future
  pass** (not every one — see below for why): the About page's credentials/
  timeline/certificates section headings and its "Areas of care" button
  label; the Services page's "why trust this approach" / "from consultation
  to follow-up" headings; the Reviews, Before & After and Articles pages'
  section headings, empty-state notes and feature-grid copy; the article
  detail page's "related articles" / "back to articles" / sidebar strings;
  a handful of aria-only labels (landmark/region names) that are invisible
  to visitors. None of these block anything — they're English/Arabic text
  pairs exactly like the ones already wired up, just not yet moved into the
  schema. Treat any hardcoded bilingual ternary (`locale === "ar" ? … : …`)
  inside a page or section component as a candidate for the same treatment.
- **No drag-and-drop reordering** — catalog rows reorder with up/down
  buttons, which is slower for long lists but has no extra moving parts.
- **No visual diff on "modified" rows** — you see *that* a draft differs
  from what's published, not a field-by-field comparison, before publishing.
- **The admin URL is not secret** — `/admin/` is static HTML like every
  other page; it is excluded from search indexing, but access control is
  entirely Supabase Auth + Row Level Security, not the URL.
- **No single cross-page "browse by content type" screen beyond Media** —
  you browse text content by page/section (the left nav) or by catalog
  (services, videos, reviews, …); there isn't yet one combined view of e.g.
  "every image on the site" the way the Media Library is one view of every
  file.
