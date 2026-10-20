# Connecting Supabase

Without this, `/admin/` already works as a fully functional **local demo** —
every screen, every action — but nothing saved there ever reaches the real
website. This is the one-time setup to connect a real Supabase project.

## 1. Create the project

1. Go to [supabase.com](https://supabase.com) and create a new project (any
   region). Note the database password it asks you to set — you will not
   need it for anything in this repo, but keep it somewhere safe (it is a
   **secret**: never paste it into this project, a chat, or a committed file).
2. Wait for the project to finish provisioning (a couple of minutes).

## 2. Run the migration

The schema (tables, security rules, storage policies, publish functions) is
a single committed file: [`supabase/migrations/20261020000000_cms_foundation.sql`](../supabase/migrations/20261020000000_cms_foundation.sql).

- **Supabase CLI** (recommended if you have it): `supabase link` then
  `supabase db push` from the project root.
- **Without the CLI**: open the Supabase dashboard → **SQL Editor** → paste
  the entire contents of that file → **Run**. It is safe to run more than
  once (every statement guards against already existing).
- **Supabase's MCP server**, if connected to your editor/assistant
  (`claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=<ref>&features=database,..."`,
  or your tool's equivalent): it can run the migration and query the
  project directly. A newly added MCP server only becomes available after
  the session restarts/reconnects — it won't appear mid-session.

This also creates a private Storage bucket named `cms-media` with its access
policies — no separate Storage setup step is needed.

## 3. Get the public keys

Dashboard → **Project Settings → API**:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **API keys → publishable key** (starts with `sb_publishable_…`; older
  projects call this the "anon" key) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Both of these are **safe to put in `NEXT_PUBLIC_` variables** — they are
meant to be public. Row Level Security (defined in the migration) is what
actually protects the data, not secrecy of this key.

Do **not** use the **secret / `service_role` key** shown on the same page —
that one must never leave the Supabase dashboard. Every script in this repo
that reads your Supabase key (the CMS itself, `npm run cms:sync`) checks the
key's shape and refuses to start if it looks like a secret key instead.

Put both values in `.env.local` (copy `.env.example` as a starting point —
`.env.local` is already git-ignored):

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Restart `npm run dev` after editing `.env.local`.

## 4. Create the first administrator

There is **no public sign-up** for the dashboard — by design, so a stranger
can never create themselves an account. Access is granted in two steps:

1. **Invite yourself**: Dashboard → **Authentication → Users → Invite
   user** → enter your own email. Supabase emails you a link to set your
   password. This step alone grants no dashboard access yet — it only
   creates the account.
2. **Grant yourself the admin role**: Dashboard → **SQL Editor**, run:

   ```sql
   select cms_bootstrap_admin('you@example.com');
   ```

   This function only works from the SQL editor — it is deliberately not
   callable from the website or the dashboard, so it can't be triggered by
   anyone without direct database access. It is meant to be run exactly
   once, for the first administrator.

After that, sign in at `/admin/login/` with the email and the password you
set from the invite email. From there, use **Users & access** in the
dashboard to invite and grant roles to anyone else — see [`CMS.md`](./CMS.md#users--access)
for the difference between the `admin` and `editor` roles.

## 5. Import the website's current content (optional, recommended)

The database starts empty. Open **Publishing** in the dashboard and use
**"Import as drafts"** (or **"Import and publish immediately"**) to copy the
site's existing `content/*.ts` text into the database as a starting point,
instead of typing everything in from scratch. It is safe to run more than
once — it only fills in rows that don't exist yet.

## Local dev vs. production

The same Supabase project can be used from `next dev` and from the deployed
site — there is no separate "local" backend. What changes between
environments is only which `.env` file supplies the two variables above
(`.env.local` for your machine, whatever your host's env-var settings are
for the deployed build).

## Publishing changes to the live site

Saving and publishing in the dashboard only changes the **database** — the
static website is a separate set of files that does not update by itself.
See [`CMS.md`](./CMS.md#publishing-how-it-actually-works) for the exact
rebuild-and-redeploy steps (`npm run cms:sync` → `npm run build` → re-upload
`out/`).

## Troubleshooting

- **"the configured key is a secret (service-role) key"** — you pasted the
  wrong key into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Go back to Project
  Settings → API keys and copy the **publishable** one.
- **"No auth user with that email yet"** from `cms_bootstrap_admin` — do
  step 1 (invite the user) before step 2 (grant the role).
- **Dashboard shows "No dashboard access yet" after signing in** — your
  account exists but no role has been granted. Either you skipped the
  bootstrap step, or (for anyone after the first admin) an existing admin
  needs to add you from **Users & access**.
