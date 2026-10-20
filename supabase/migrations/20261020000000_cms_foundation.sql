-- ============================================================================
-- CMS foundation for Dr. Abdullah Elkasaby's website.
--
-- Draft/published content model: every content table has a `draft` jsonb
-- column (what editors are working on) and a `published` jsonb column (what
-- `cms_published_site()` — and therefore the public build — actually uses).
-- Publishing is `published := draft`; nothing else copies data between the
-- two states. RLS is the real access boundary throughout: `anon` has no
-- grants at all on content/media/profile tables and reaches published
-- content only through `cms_published_site()`, a SECURITY DEFINER function.
--
-- Run with the Supabase CLI (`supabase db push`) or paste into the SQL
-- editor of a fresh project. Safe to re-run: every statement is guarded with
-- IF NOT EXISTS / CREATE OR REPLACE / DROP ... IF EXISTS.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. Documents — one fixed-shape JSON blob per page section or settings group
-- ----------------------------------------------------------------------------

create table if not exists cms_documents (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

comment on table cms_documents is
  'Fixed-shape page sections and settings (keyed by a dotted string, e.g. "home.intro", "settings.contact"). See lib/cms/registry.ts for the full list.';

-- ----------------------------------------------------------------------------
-- 2. Authorization — cms_profiles is the ONLY source of role. Never a client
--    flag: every write-capable policy and function checks this table (via
--    cms_is_editor / cms_is_admin), never a value the browser sent.
-- ----------------------------------------------------------------------------

create table if not exists cms_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

comment on table cms_profiles is
  'Authorization only. There is no public sign-up: rows are created by cms_bootstrap_admin (SQL editor, one-time) or cms_set_role (an existing admin, via the dashboard).';

create or replace function cms_is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from cms_profiles where user_id = auth.uid());
$$;

create or replace function cms_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from cms_profiles where user_id = auth.uid() and role = 'admin');
$$;

-- ----------------------------------------------------------------------------
-- 3. Catalogs — repeatable, slug-keyed, sortable rows. Every catalog shares
--    the same draft/published/sort_order shape; a few add their own columns.
-- ----------------------------------------------------------------------------

create table if not exists cms_service_groups (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order int not null default 0,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists cms_services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  group_id uuid not null references cms_service_groups (id) on delete restrict,
  sort_order int not null default 0,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists cms_specialties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order int not null default 0,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists cms_videos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order int not null default 0,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists cms_reviews (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order int not null default 0,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  consent_confirmed boolean not null default false,
  verification_note text,
  constraint cms_reviews_consent_chk check (
    published is null
    or coalesce((draft->>'isPlaceholder')::boolean, false)
    or consent_confirmed
  )
);

comment on constraint cms_reviews_consent_chk on cms_reviews is
  'A real (non-placeholder) review cannot be published without documented patient consent. Enforced here, not only in the UI.';

create table if not exists cms_faq_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order int not null default 0,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists cms_faqs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid not null references cms_faq_categories (id) on delete restrict,
  sort_order int not null default 0,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists cms_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order int not null default 0,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint cms_articles_reviewer_chk check (
    published is null
    or coalesce((draft->>'isPlaceholder')::boolean, false)
    or (draft->>'reviewedBy') is not null
  )
);

comment on constraint cms_articles_reviewer_chk on cms_articles is
  'A real article cannot be published without a named medical reviewer recorded in draft.reviewedBy.';

create table if not exists cms_before_after_cases (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order int not null default 0,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  consent_confirmed boolean not null default false,
  verification_note text,
  constraint cms_before_after_consent_chk check (
    published is null
    or coalesce((draft->>'isPlaceholder')::boolean, false)
    or consent_confirmed
  )
);

comment on constraint cms_before_after_consent_chk on cms_before_after_cases is
  'A real before/after case cannot be published without documented written patient consent (see content/results.ts rules).';

create table if not exists cms_credentials (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order int not null default 0,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists cms_timeline (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order int not null default 0,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists cms_certificates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order int not null default 0,
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists cms_services_group_idx on cms_services (group_id);
create index if not exists cms_faqs_category_idx on cms_faqs (category_id);

-- ----------------------------------------------------------------------------
-- 4. Media library
-- ----------------------------------------------------------------------------

create table if not exists cms_media (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('image', 'video')),
  storage_path text,
  thumb_path text,
  -- Set only for the site's existing bundled stock photos (content/media.ts);
  -- never paired with storage_path. Lets uploaded and bundled media share one
  -- table without pretending a bundled photo was "uploaded".
  bundled_src text unique,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  duration_seconds int,
  original_name text,
  title text,
  alt jsonb not null default '{"en":"","ar":""}'::jsonb,
  -- Recomputed by cms_refresh_media_visibility(): true only while this asset
  -- is referenced by PUBLISHED content. Storage policies key off this, not
  -- off who uploaded it.
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  constraint cms_media_storage_or_bundled check (
    (storage_path is not null and bundled_src is null) or (storage_path is null and bundled_src is not null)
  )
);

create index if not exists cms_media_public_idx on cms_media (is_public) where is_public;

-- ----------------------------------------------------------------------------
-- 5. Revision history — last 30 versions per record, newest first
-- ----------------------------------------------------------------------------

create table if not exists cms_revisions (
  id bigserial primary key,
  record_id uuid not null,
  action text not null check (action in ('update', 'delete')),
  draft jsonb,
  published jsonb,
  created_at timestamptz not null default now()
);

create index if not exists cms_revisions_record_idx on cms_revisions (record_id, created_at desc);

-- ----------------------------------------------------------------------------
-- 6. Site state — lets the dashboard detect "published changes exist that
--    the live static build does not have yet" (see cms-build.json route).
-- ----------------------------------------------------------------------------

create table if not exists cms_site_state (
  id boolean primary key default true,
  content_changed_at timestamptz not null default now(),
  constraint cms_site_state_single_row check (id)
);

insert into cms_site_state (id, content_changed_at)
values (true, now())
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- 7. Triggers: updated_at, revision history, site-state touch
-- ----------------------------------------------------------------------------

create or replace function cms_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function cms_record_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' then
    insert into cms_revisions (record_id, action, draft, published)
    values (old.id, 'update', old.draft, old.published);
  elsif tg_op = 'DELETE' then
    insert into cms_revisions (record_id, action, draft, published)
    values (old.id, 'delete', old.draft, old.published);
  end if;

  delete from cms_revisions
  where record_id = old.id
    and id not in (
      select id from cms_revisions where record_id = old.id order by created_at desc limit 30
    );

  return old;
end;
$$;

create or replace function cms_touch_site_state()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'UPDATE' and new.published is distinct from old.published)
     or tg_op = 'DELETE' then
    update cms_site_state set content_changed_at = now() where id = true;
  end if;
  return coalesce(new, old);
end;
$$;

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'cms_documents', 'cms_service_groups', 'cms_services', 'cms_specialties', 'cms_videos',
    'cms_reviews', 'cms_faq_categories', 'cms_faqs', 'cms_articles', 'cms_before_after_cases',
    'cms_credentials', 'cms_timeline', 'cms_certificates'
  ])
  loop
    execute format('drop trigger if exists %I_updated_at on %I', t, t);
    execute format('create trigger %I_updated_at before update on %I for each row execute function cms_set_updated_at()', t, t);

    execute format('drop trigger if exists %I_revision on %I', t, t);
    execute format('create trigger %I_revision after update or delete on %I for each row execute function cms_record_revision()', t, t);

    if t <> 'cms_documents' then
      execute format('drop trigger if exists %I_site_state on %I', t, t);
      execute format('create trigger %I_site_state after update or delete on %I for each row execute function cms_touch_site_state()', t, t);
    end if;
  end loop;
end;
$$;

-- cms_documents affects the live site too, but has no sort_order/slug concerns.
drop trigger if exists cms_documents_site_state on cms_documents;
create trigger cms_documents_site_state
  after update or delete on cms_documents
  for each row execute function cms_touch_site_state();

-- ----------------------------------------------------------------------------
-- 8. Functions: publish lifecycle, reorder, status, the public snapshot
-- ----------------------------------------------------------------------------

-- Allow-listed tables for the generic functions below. Table names reach
-- these functions as plain RPC parameters, so they are checked against this
-- fixed list before ever being interpolated into dynamic SQL.
create or replace function cms_valid_table(p_table text)
returns boolean
language sql
immutable
as $$
  select p_table in (
    'cms_documents', 'cms_service_groups', 'cms_services', 'cms_specialties', 'cms_videos',
    'cms_reviews', 'cms_faq_categories', 'cms_faqs', 'cms_articles', 'cms_before_after_cases',
    'cms_credentials', 'cms_timeline', 'cms_certificates'
  );
$$;

create or replace function cms_publish(p_table text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not cms_is_editor() then
    raise exception 'You don''t have permission to do this.' using errcode = '42501';
  end if;
  if not cms_valid_table(p_table) then
    raise exception 'Unknown content type.' using errcode = 'P0002';
  end if;

  execute format('update %I set published = draft, published_at = now() where id = $1', p_table) using p_id;

  if p_table <> 'cms_documents' then
    perform cms_refresh_media_visibility();
  end if;
end;
$$;

create or replace function cms_unpublish(p_table text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not cms_is_editor() then
    raise exception 'You don''t have permission to do this.' using errcode = '42501';
  end if;
  if not cms_valid_table(p_table) then
    raise exception 'Unknown content type.' using errcode = 'P0002';
  end if;

  execute format('update %I set published = null, published_at = null where id = $1', p_table) using p_id;

  if p_table <> 'cms_documents' then
    perform cms_refresh_media_visibility();
  end if;
end;
$$;

create or replace function cms_reorder(p_table text, p_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not cms_is_editor() then
    raise exception 'You don''t have permission to do this.' using errcode = '42501';
  end if;
  if not cms_valid_table(p_table) or p_table = 'cms_documents' then
    raise exception 'Unknown content type.' using errcode = 'P0002';
  end if;

  execute format(
    'update %I as t set sort_order = x.ord from unnest($1) with ordinality as x(id, ord) where t.id = x.id',
    p_table
  ) using p_ids;
end;
$$;

create or replace function cms_content_status()
returns table (table_name text, record_id uuid, label text, status text, updated_at timestamptz, published_at timestamptz)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not cms_is_editor() then
    raise exception 'You don''t have permission to do this.' using errcode = '42501';
  end if;

  return query
    select 'cms_documents'::text, d.id, d.key,
      case when d.published is null then 'draft' when d.published = d.draft then 'published' else 'modified' end,
      d.updated_at, d.published_at
    from cms_documents d
    union all
    select 'cms_service_groups', c.id, c.slug, case when c.published is null then 'draft' when c.published = c.draft then 'published' else 'modified' end, c.updated_at, c.published_at from cms_service_groups c
    union all
    select 'cms_services', c.id, c.slug, case when c.published is null then 'draft' when c.published = c.draft then 'published' else 'modified' end, c.updated_at, c.published_at from cms_services c
    union all
    select 'cms_specialties', c.id, c.slug, case when c.published is null then 'draft' when c.published = c.draft then 'published' else 'modified' end, c.updated_at, c.published_at from cms_specialties c
    union all
    select 'cms_videos', c.id, c.slug, case when c.published is null then 'draft' when c.published = c.draft then 'published' else 'modified' end, c.updated_at, c.published_at from cms_videos c
    union all
    select 'cms_reviews', c.id, c.slug, case when c.published is null then 'draft' when c.published = c.draft then 'published' else 'modified' end, c.updated_at, c.published_at from cms_reviews c
    union all
    select 'cms_faq_categories', c.id, c.slug, case when c.published is null then 'draft' when c.published = c.draft then 'published' else 'modified' end, c.updated_at, c.published_at from cms_faq_categories c
    union all
    select 'cms_faqs', c.id, c.slug, case when c.published is null then 'draft' when c.published = c.draft then 'published' else 'modified' end, c.updated_at, c.published_at from cms_faqs c
    union all
    select 'cms_articles', c.id, c.slug, case when c.published is null then 'draft' when c.published = c.draft then 'published' else 'modified' end, c.updated_at, c.published_at from cms_articles c
    union all
    select 'cms_before_after_cases', c.id, c.slug, case when c.published is null then 'draft' when c.published = c.draft then 'published' else 'modified' end, c.updated_at, c.published_at from cms_before_after_cases c
    union all
    select 'cms_credentials', c.id, c.slug, case when c.published is null then 'draft' when c.published = c.draft then 'published' else 'modified' end, c.updated_at, c.published_at from cms_credentials c
    union all
    select 'cms_timeline', c.id, c.slug, case when c.published is null then 'draft' when c.published = c.draft then 'published' else 'modified' end, c.updated_at, c.published_at from cms_timeline c
    union all
    select 'cms_certificates', c.id, c.slug, case when c.published is null then 'draft' when c.published = c.draft then 'published' else 'modified' end, c.updated_at, c.published_at from cms_certificates c;
end;
$$;

-- The ONLY way published content reaches visitors. Callable by anon and
-- authenticated with the publishable key; returns published rows only.
create or replace function cms_published_site()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'initialized', exists (select 1 from cms_documents),
    'version', (select content_changed_at from cms_site_state where id = true),
    'documents', coalesce((select jsonb_object_agg(key, published) from cms_documents where published is not null), '{}'::jsonb),
    'serviceGroups', coalesce((select jsonb_agg(jsonb_build_object('slug', slug, 'content', published) order by sort_order) from cms_service_groups where published is not null), '[]'::jsonb),
    'services', coalesce((select jsonb_agg(jsonb_build_object('slug', s.slug, 'group', g.slug, 'content', s.published) order by s.sort_order) from cms_services s join cms_service_groups g on g.id = s.group_id where s.published is not null), '[]'::jsonb),
    'specialties', coalesce((select jsonb_agg(jsonb_build_object('slug', slug, 'content', published) order by sort_order) from cms_specialties where published is not null), '[]'::jsonb),
    'videos', coalesce((select jsonb_agg(jsonb_build_object('slug', slug, 'content', published) order by sort_order) from cms_videos where published is not null), '[]'::jsonb),
    'reviews', coalesce((select jsonb_agg(jsonb_build_object('slug', slug, 'content', published) order by sort_order) from cms_reviews where published is not null), '[]'::jsonb),
    'faqCategories', coalesce((select jsonb_agg(jsonb_build_object('slug', slug, 'content', published) order by sort_order) from cms_faq_categories where published is not null), '[]'::jsonb),
    'faqs', coalesce((select jsonb_agg(jsonb_build_object('slug', f.slug, 'category', c.slug, 'content', f.published) order by f.sort_order) from cms_faqs f join cms_faq_categories c on c.id = f.category_id where f.published is not null), '[]'::jsonb),
    'articles', coalesce((select jsonb_agg(jsonb_build_object('slug', slug, 'content', published) order by sort_order) from cms_articles where published is not null), '[]'::jsonb),
    'beforeAfterCases', coalesce((select jsonb_agg(jsonb_build_object('slug', slug, 'content', published) order by sort_order) from cms_before_after_cases where published is not null), '[]'::jsonb),
    'credentials', coalesce((select jsonb_agg(jsonb_build_object('slug', slug, 'content', published) order by sort_order) from cms_credentials where published is not null), '[]'::jsonb),
    'timeline', coalesce((select jsonb_agg(jsonb_build_object('slug', slug, 'content', published) order by sort_order) from cms_timeline where published is not null), '[]'::jsonb),
    'certificates', coalesce((select jsonb_agg(jsonb_build_object('slug', slug, 'content', published) order by sort_order) from cms_certificates where published is not null), '[]'::jsonb),
    'media', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'kind', kind, 'path', coalesce(storage_path, thumb_path))) from cms_media where is_public and storage_path is not null), '[]'::jsonb)
  );
$$;

grant execute on function cms_published_site() to anon, authenticated;

create or replace function cms_media_usage(p_asset uuid)
returns table (table_name text, record_id uuid, label text, in_draft boolean, in_published boolean)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  needle text := '"assetId":"' || p_asset::text || '"';
begin
  if not cms_is_editor() then
    raise exception 'You don''t have permission to do this.' using errcode = '42501';
  end if;

  return query
    select 'cms_documents'::text, d.id, d.key, d.draft::text like '%'||needle||'%', coalesce(d.published::text, '') like '%'||needle||'%'
    from cms_documents d where d.draft::text like '%'||needle||'%' or coalesce(d.published::text,'') like '%'||needle||'%'
    union all
    select 'cms_service_groups', c.id, c.slug, c.draft::text like '%'||needle||'%', coalesce(c.published::text,'') like '%'||needle||'%' from cms_service_groups c where c.draft::text like '%'||needle||'%' or coalesce(c.published::text,'') like '%'||needle||'%'
    union all
    select 'cms_services', c.id, c.slug, c.draft::text like '%'||needle||'%', coalesce(c.published::text,'') like '%'||needle||'%' from cms_services c where c.draft::text like '%'||needle||'%' or coalesce(c.published::text,'') like '%'||needle||'%'
    union all
    select 'cms_specialties', c.id, c.slug, c.draft::text like '%'||needle||'%', coalesce(c.published::text,'') like '%'||needle||'%' from cms_specialties c where c.draft::text like '%'||needle||'%' or coalesce(c.published::text,'') like '%'||needle||'%'
    union all
    select 'cms_videos', c.id, c.slug, c.draft::text like '%'||needle||'%', coalesce(c.published::text,'') like '%'||needle||'%' from cms_videos c where c.draft::text like '%'||needle||'%' or coalesce(c.published::text,'') like '%'||needle||'%'
    union all
    select 'cms_reviews', c.id, c.slug, c.draft::text like '%'||needle||'%', coalesce(c.published::text,'') like '%'||needle||'%' from cms_reviews c where c.draft::text like '%'||needle||'%' or coalesce(c.published::text,'') like '%'||needle||'%'
    union all
    select 'cms_articles', c.id, c.slug, c.draft::text like '%'||needle||'%', coalesce(c.published::text,'') like '%'||needle||'%' from cms_articles c where c.draft::text like '%'||needle||'%' or coalesce(c.published::text,'') like '%'||needle||'%'
    union all
    select 'cms_before_after_cases', c.id, c.slug, c.draft::text like '%'||needle||'%', coalesce(c.published::text,'') like '%'||needle||'%' from cms_before_after_cases c where c.draft::text like '%'||needle||'%' or coalesce(c.published::text,'') like '%'||needle||'%'
    union all
    select 'cms_credentials', c.id, c.slug, c.draft::text like '%'||needle||'%', coalesce(c.published::text,'') like '%'||needle||'%' from cms_credentials c where c.draft::text like '%'||needle||'%' or coalesce(c.published::text,'') like '%'||needle||'%'
    union all
    select 'cms_timeline', c.id, c.slug, c.draft::text like '%'||needle||'%', coalesce(c.published::text,'') like '%'||needle||'%' from cms_timeline c where c.draft::text like '%'||needle||'%' or coalesce(c.published::text,'') like '%'||needle||'%'
    union all
    select 'cms_certificates', c.id, c.slug, c.draft::text like '%'||needle||'%', coalesce(c.published::text,'') like '%'||needle||'%' from cms_certificates c where c.draft::text like '%'||needle||'%' or coalesce(c.published::text,'') like '%'||needle||'%';
end;
$$;

-- Recomputes cms_media.is_public from what PUBLISHED content currently
-- references. Run after every publish/unpublish and after a bulk import.
create or replace function cms_refresh_media_visibility()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update cms_media m
  set is_public = exists (
    select 1 from (
      select published::text as t from cms_documents where published is not null
      union all select published::text from cms_service_groups where published is not null
      union all select published::text from cms_services where published is not null
      union all select published::text from cms_specialties where published is not null
      union all select published::text from cms_videos where published is not null
      union all select published::text from cms_reviews where published is not null
      union all select published::text from cms_articles where published is not null
      union all select published::text from cms_before_after_cases where published is not null
      union all select published::text from cms_credentials where published is not null
      union all select published::text from cms_timeline where published is not null
      union all select published::text from cms_certificates where published is not null
    ) published_blobs
    where published_blobs.t like '%"assetId":"' || m.id::text || '"%'
  )
  where m.storage_path is not null;
end;
$$;

grant execute on function cms_refresh_media_visibility() to authenticated;

-- Blocks deleting a media row that any draft OR published content still
-- references. The dashboard already disables the Delete button in this
-- case, but that is only a UI courtesy — without this trigger, a direct API
-- call could delete a file a draft (not yet published) still points at,
-- silently breaking it next time that draft is opened or published.
create or replace function cms_media_block_delete_if_used()
returns trigger
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  needle text := '"assetId":"' || old.id::text || '"';
  in_use boolean;
begin
  select exists (
    select 1 from (
      select draft::text as t from cms_documents union all select published::text from cms_documents
      union all select draft::text from cms_service_groups union all select published::text from cms_service_groups
      union all select draft::text from cms_services union all select published::text from cms_services
      union all select draft::text from cms_specialties union all select published::text from cms_specialties
      union all select draft::text from cms_videos union all select published::text from cms_videos
      union all select draft::text from cms_reviews union all select published::text from cms_reviews
      union all select draft::text from cms_articles union all select published::text from cms_articles
      union all select draft::text from cms_before_after_cases union all select published::text from cms_before_after_cases
      union all select draft::text from cms_credentials union all select published::text from cms_credentials
      union all select draft::text from cms_timeline union all select published::text from cms_timeline
      union all select draft::text from cms_certificates union all select published::text from cms_certificates
    ) blobs
    where blobs.t like '%' || needle || '%'
  ) into in_use;

  if in_use then
    raise exception 'This item is still used elsewhere, so it can''t be removed.' using errcode = '23503';
  end if;

  return old;
end;
$$;

drop trigger if exists cms_media_delete_guard on cms_media;
create trigger cms_media_delete_guard before delete on cms_media
  for each row execute function cms_media_block_delete_if_used();

-- ----------------------------------------------------------------------------
-- 9. Team management — no public self-registration. First admin: run
--    cms_bootstrap_admin in the SQL editor (see docs/SUPABASE.md). After
--    that, admins manage the team from the dashboard via cms_set_role /
--    cms_remove_member, which are the only paths that can write cms_profiles.
-- ----------------------------------------------------------------------------

create or replace function cms_team()
returns table (user_id uuid, email text, role text, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select p.user_id, u.email, p.role, p.created_at
  from cms_profiles p
  join auth.users u on u.id = p.user_id
  where cms_is_admin()
  order by p.created_at;
$$;

create or replace function cms_set_role(p_email text, p_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid;
begin
  if not cms_is_admin() then
    raise exception 'Only administrators can manage team access.' using errcode = '42501';
  end if;
  if p_role not in ('admin', 'editor') then
    raise exception 'Unknown role.' using errcode = 'P0002';
  end if;

  select id into target from auth.users where email = p_email;
  if target is null then
    raise exception 'No such user. Invite them from the Supabase dashboard first (Authentication -> Users -> Invite).' using errcode = 'P0002';
  end if;

  insert into cms_profiles (user_id, role) values (target, p_role)
  on conflict (user_id) do update set role = excluded.role;
end;
$$;

create or replace function cms_remove_member(p_user uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not cms_is_admin() then
    raise exception 'Only administrators can manage team access.' using errcode = '42501';
  end if;
  if p_user = auth.uid() then
    raise exception 'You cannot remove your own access.' using errcode = 'P0002';
  end if;

  delete from cms_profiles where user_id = p_user;
end;
$$;

-- One-time bootstrap: deliberately has NO grant to anon/authenticated, so it
-- can only be run from the Supabase SQL editor by someone with project
-- access — never through the website or the publishable key.
create or replace function cms_bootstrap_admin(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid;
begin
  select id into target from auth.users where email = p_email;
  if target is null then
    raise exception 'No auth user with that email yet. Create them first in Authentication -> Users -> Invite user.';
  end if;

  insert into cms_profiles (user_id, role) values (target, 'admin')
  on conflict (user_id) do update set role = 'admin';
end;
$$;

revoke all on function cms_bootstrap_admin(text) from public, anon, authenticated;

-- ----------------------------------------------------------------------------
-- 10. Row Level Security. `anon` is never granted anything on these tables;
--     visitors reach published content solely through cms_published_site().
-- ----------------------------------------------------------------------------

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'cms_documents', 'cms_profiles', 'cms_service_groups', 'cms_services', 'cms_specialties',
    'cms_videos', 'cms_reviews', 'cms_faq_categories', 'cms_faqs', 'cms_articles',
    'cms_before_after_cases', 'cms_credentials', 'cms_timeline', 'cms_certificates',
    'cms_media', 'cms_revisions', 'cms_site_state'
  ])
  loop
    execute format('alter table %I enable row level security', t);
    execute format('revoke all on table %I from anon, authenticated', t);
  end loop;
end;
$$;

-- cms_documents: editors and admins read/write; no delete (a document's
-- draft is edited, never removed).
grant select, insert, update on cms_documents to authenticated;
create policy cms_documents_rw on cms_documents for all to authenticated
  using (cms_is_editor()) with check (cms_is_editor());

-- cms_profiles: everyone can read their own row (to learn their own role);
-- admins can read every row. All writes go through the SECURITY DEFINER
-- functions above, never direct table grants.
grant select on cms_profiles to authenticated;
create policy cms_profiles_self on cms_profiles for select to authenticated
  using (user_id = auth.uid() or cms_is_admin());

-- Catalog tables: editors and admins read/write/create; only admins delete.
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'cms_service_groups', 'cms_services', 'cms_specialties', 'cms_videos', 'cms_reviews',
    'cms_faq_categories', 'cms_faqs', 'cms_articles', 'cms_before_after_cases',
    'cms_credentials', 'cms_timeline', 'cms_certificates'
  ])
  loop
    execute format('grant select, insert, update, delete on table %I to authenticated', t);
    execute format(
      'create policy %I_editor_rw on %I for select to authenticated using (cms_is_editor())', t, t
    );
    execute format(
      'create policy %I_editor_write on %I for insert to authenticated with check (cms_is_editor())', t, t
    );
    execute format(
      'create policy %I_editor_update on %I for update to authenticated using (cms_is_editor()) with check (cms_is_editor())', t, t
    );
    execute format(
      'create policy %I_admin_delete on %I for delete to authenticated using (cms_is_admin())', t, t
    );
  end loop;
end;
$$;

-- cms_media: editors upload/read/edit metadata; only admins delete files.
grant select, insert, update, delete on cms_media to authenticated;
create policy cms_media_read on cms_media for select to authenticated using (cms_is_editor());
create policy cms_media_insert on cms_media for insert to authenticated with check (cms_is_editor());
create policy cms_media_update on cms_media for update to authenticated using (cms_is_editor()) with check (cms_is_editor());
create policy cms_media_delete on cms_media for delete to authenticated using (cms_is_admin());

-- cms_revisions: read-only for editors/admins; rows are written only by the
-- cms_record_revision trigger (SECURITY DEFINER, bypasses this policy).
grant select on cms_revisions to authenticated;
create policy cms_revisions_read on cms_revisions for select to authenticated using (cms_is_editor());

-- cms_site_state: read-only for editors/admins; written only by the
-- cms_touch_site_state trigger.
grant select on cms_site_state to authenticated;
create policy cms_site_state_read on cms_site_state for select to authenticated using (cms_is_editor());

-- ----------------------------------------------------------------------------
-- 11. Storage — a private bucket. Public read is per-object, gated on
--     cms_media.is_public (kept in sync by cms_refresh_media_visibility).
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('cms-media', 'cms-media', false)
on conflict (id) do nothing;

drop policy if exists cms_media_storage_read on storage.objects;
create policy cms_media_storage_read on storage.objects for select
  using (
    bucket_id = 'cms-media'
    and (
      cms_is_editor()
      or exists (
        select 1 from cms_media m
        where (m.storage_path = storage.objects.name or m.thumb_path = storage.objects.name)
          and m.is_public
      )
    )
  );

drop policy if exists cms_media_storage_insert on storage.objects;
create policy cms_media_storage_insert on storage.objects for insert to authenticated
  with check (
    bucket_id = 'cms-media'
    and cms_is_editor()
    and name ~ '^(images/[0-9a-f-]{36}\.(jpg|png|webp|avif)|videos/[0-9a-f-]{36}\.(mp4|webm)|thumbs/[0-9a-f-]{36}\.webp)$'
  );

drop policy if exists cms_media_storage_delete on storage.objects;
create policy cms_media_storage_delete on storage.objects for delete to authenticated
  using (bucket_id = 'cms-media' and cms_is_admin());

-- ============================================================================
-- End of migration. Next: invite your own user in the Supabase dashboard
-- (Authentication -> Users -> Invite user), then run, once, in the SQL
-- editor:   select cms_bootstrap_admin('you@example.com');
-- See docs/SUPABASE.md for the full walkthrough.
-- ============================================================================
