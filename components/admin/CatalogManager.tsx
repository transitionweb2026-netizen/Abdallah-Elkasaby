"use client";

import { useEffect, useMemo, useState } from "react";
import { catalogs, type CatalogKey } from "@/lib/cms/model";
import { catalogRegistry } from "@/lib/cms/registry";
import { blocksPublish, blocksSave, defaultValue, validateField, type Field, type Json } from "@/lib/cms/schema";
import type { CatalogRecord } from "@/lib/cms/store/types";
import { useAdmin } from "./AdminProvider";
import { FieldForm } from "./FieldForm";
import { useAsync } from "./useAsync";
import { useFieldEnv } from "./useFieldEnv";
import { useUnsavedWarning } from "./useUnsavedWarning";

const PAGE_SIZE = 20;

export function CatalogManager({ catalog }: { catalog: CatalogKey }) {
  const def = catalogRegistry[catalog];
  const catalogDef = catalogs[catalog];
  const { store } = useAdmin();
  const [items, setItems] = useState<CatalogRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CatalogRecord | "new" | null>(null);
  const [parents, setParents] = useState<CatalogRecord[]>([]);
  const [referenceOptions, setReferenceOptions] = useState<Record<string, { value: string; label: string }[]>>({});
  const action = useAsync();

  async function reload() {
    if (!store) return;
    const result = await store.listCatalog(catalog, { page, pageSize: PAGE_SIZE, search });
    setItems(result.items);
    setTotal(result.total);
  }

  useEffect(() => {
    if (!store) return;
    let active = true;
    store.listCatalog(catalog, { page, pageSize: PAGE_SIZE, search }).then((result) => {
      if (!active) return;
      setItems(result.items);
      setTotal(result.total);
    });
    return () => {
      active = false;
    };
  }, [store, catalog, page, search]);

  useEffect(() => {
    if (!store || !catalogDef.parent) return;
    store.listAll(catalogDef.parent).then(setParents);
  }, [store, catalogDef.parent]);

  useEffect(() => {
    if (!store) return;
    const referenced = Object.values(def.fields).filter((f): f is Field & { kind: "reference" } => f.kind === "reference");
    referenced.forEach((f) => {
      store.listAll(f.catalog as CatalogKey).then((rows) => {
        setReferenceOptions((prev) => ({ ...prev, [f.catalog]: rows.map((r) => ({ value: r.slug, label: r.slug })) }));
      });
    });
  }, [store, def.fields]);

  if (selected) {
    return (
      <ItemEditor
        catalog={catalog}
        record={selected === "new" ? null : selected}
        parents={parents}
        referenceOptions={referenceOptions}
        onDone={() => {
          setSelected(null);
          reload();
        }}
      />
    );
  }

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-title">{def.itemLabel.en}s</h1>
          <p className="admin-hint">{total} total</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setSelected("new")}>
          + New {def.itemLabel.en.toLowerCase()}
        </button>
      </div>

      <div className="search-row">
        <input placeholder={`Search ${def.itemLabel.en.toLowerCase()}s…`} value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
      </div>

      {action.error && <div className="banner banner--error">{action.error}</div>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Slug</th>
            {catalogDef.parent && <th>Parent</th>}
            <th>Status</th>
            <th>Order</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const status = item.published ? (JSON.stringify(item.published) === JSON.stringify(item.draft) ? "published" : "modified") : "draft";
            const parentLabel = parents.find((p) => p.id === item.parentId)?.slug ?? "—";
            return (
              <tr key={item.id}>
                <td>
                  <button type="button" className="btn" style={{ border: "none", background: "none", padding: 0, fontWeight: 700 }} onClick={() => setSelected(item)}>
                    {item.slug}
                  </button>
                </td>
                {catalogDef.parent && <td>{parentLabel}</td>}
                <td>
                  <span className={`status-pill status-pill--${status}`}>{status}</span>
                </td>
                <td>
                  <div className="btn-row" style={{ margin: 0 }}>
                    <button type="button" className="btn" disabled={i === 0} onClick={() => reorder(store, catalog, items, i, -1, setItems, action)}>
                      ↑
                    </button>
                    <button type="button" className="btn" disabled={i === items.length - 1} onClick={() => reorder(store, catalog, items, i, 1, setItems, action)}>
                      ↓
                    </button>
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn--danger"
                    onClick={() =>
                      action.run(async () => {
                        if (!confirm(`Delete "${item.slug}"? This cannot be undone.`)) return;
                        await store?.deleteCatalogItem(catalog, item.id);
                        reload();
                      })
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {total > PAGE_SIZE && (
        <div className="btn-row">
          <button type="button" className="btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {Math.ceil(total / PAGE_SIZE)}
          </span>
          <button type="button" className="btn" disabled={page * PAGE_SIZE >= total} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function reorder(
  store: ReturnType<typeof useAdmin>["store"],
  catalog: CatalogKey,
  items: CatalogRecord[],
  index: number,
  dir: 1 | -1,
  setItems: (items: CatalogRecord[]) => void,
  action: ReturnType<typeof useAsync>,
) {
  const target = index + dir;
  if (!store || target < 0 || target >= items.length) return;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  setItems(next);
  action.run(() => store.reorder(catalog, next.map((i) => i.id)));
}

function ItemEditor({
  catalog,
  record,
  parents,
  referenceOptions,
  onDone,
}: {
  catalog: CatalogKey;
  record: CatalogRecord | null;
  parents: CatalogRecord[];
  referenceOptions: Record<string, { value: string; label: string }[]>;
  onDone: () => void;
}) {
  const def = catalogRegistry[catalog];
  const catalogDef = catalogs[catalog];
  const groupField: Field = useMemo(() => ({ kind: "group", label: def.itemLabel, fields: def.fields }), [def]);
  const { store } = useAdmin();
  const action = useAsync();

  const [slug, setSlug] = useState(record?.slug ?? "");
  const [parentId, setParentId] = useState<string | null>(record?.parentId ?? null);
  const [draft, setDraft] = useState<Json>(record?.draft ?? defaultValue(groupField));
  const [consentConfirmed, setConsentConfirmed] = useState(record?.consentConfirmed ?? false);
  const [verificationNote, setVerificationNote] = useState(record?.verificationNote ?? "");
  const [current, setCurrent] = useState<CatalogRecord | null>(record);

  const dirty = JSON.stringify(draft) !== JSON.stringify(current?.draft ?? defaultValue(groupField)) || slug !== (current?.slug ?? "");
  useUnsavedWarning(dirty);

  const needsConsent = catalog === "reviews" || catalog === "beforeAfterCases";
  const isPlaceholder = typeof draft === "object" && draft !== null && !Array.isArray(draft) && Boolean((draft as Record<string, Json>).isPlaceholder);

  const issues = useMemo(() => {
    const base = validateField(groupField, draft, catalog, { catalogSlugs: referenceOptions ? Object.fromEntries(Object.entries(referenceOptions).map(([k, v]) => [k, v.map((o) => o.value)])) : undefined });
    if (!slug.trim()) base.push({ path: "slug", severity: "invalid", message: { en: "A slug is required.", ar: "المعرف مطلوب." } });
    else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug.trim())) base.push({ path: "slug", severity: "invalid", message: { en: "Use lowercase letters, numbers and hyphens only.", ar: "استخدم أحرفًا إنجليزية صغيرة وأرقامًا وشرطات فقط." } });
    if (catalogDef.parent && !parentId) base.push({ path: "parent", severity: "incomplete", message: { en: "Choose a parent.", ar: "اختر عنصرًا أعلى." } });
    if (needsConsent && !isPlaceholder && !consentConfirmed) {
      base.push({ path: "consent", severity: "incomplete", message: { en: "Confirm written patient consent before this can be published.", ar: "أكّد وجود موافقة كتابية من المريض قبل النشر." } });
    }
    return base;
  }, [groupField, draft, catalog, slug, catalogDef.parent, parentId, needsConsent, isPlaceholder, consentConfirmed, referenceOptions]);

  const canSave = !blocksSave(issues.filter((i) => i.path !== "consent"));
  const canPublish = !blocksPublish(issues);

  async function save() {
    if (!store) return;
    await action.run(async () => {
      let next: CatalogRecord;
      if (current) {
        next = await store.saveCatalogDraft(catalog, current.id, draft, { parentId, consentConfirmed, verificationNote });
      } else {
        next = await store.createCatalogItem(catalog, { slug: slug.trim(), parentId, draft });
        if (needsConsent || verificationNote) next = await store.saveCatalogDraft(catalog, next.id, draft, { consentConfirmed, verificationNote });
      }
      setCurrent(next);
    }, "Saved.");
  }

  async function publish() {
    if (!store) return;
    await action.run(async () => {
      let rec = current;
      if (!rec || dirty) {
        rec = current
          ? await store.saveCatalogDraft(catalog, current.id, draft, { parentId, consentConfirmed, verificationNote })
          : await store.createCatalogItem(catalog, { slug: slug.trim(), parentId, draft });
        setCurrent(rec);
      }
      await store.publish(catalogDef.table, rec.id);
      const refreshed = await store.getCatalogItem(catalog, rec.id);
      setCurrent(refreshed);
    }, "Published. Rebuild and redeploy the site to make this live — see Publishing.");
  }

  async function unpublish() {
    if (!store || !current) return;
    await action.run(async () => {
      await store.unpublish(catalogDef.table, current.id);
      setCurrent(await store.getCatalogItem(catalog, current.id));
    }, "Unpublished.");
  }

  const { env, pickerNode } = useFieldEnv(draft);

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-title">{current ? current.slug : `New ${def.itemLabel.en.toLowerCase()}`}</h1>
          <p className="admin-hint">{def.group.en}</p>
        </div>
        <button type="button" className="btn" onClick={onDone}>
          ← Back to list
        </button>
      </div>

      {action.error && <div className="banner banner--error">{action.error}</div>}
      {action.success && <div className="banner banner--success">{action.success}</div>}
      {dirty && <div className="banner banner--warn">You have unsaved changes.</div>}

      <div className="admin-card">
        <div className="field">
          <label>
            Slug (used in the URL / as the id) *
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </label>
        </div>
        {catalogDef.parent && (
          <div className="field">
            <label>
              Parent *
              <select value={parentId ?? ""} onChange={(e) => setParentId(e.target.value || null)}>
                <option value="">—</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.slug}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        {needsConsent && (
          <div className="field-group">
            <p className="field-label">Consent (required to publish a real entry)</p>
            <div className="checkbox-row">
              <input id="consent" type="checkbox" checked={consentConfirmed} onChange={(e) => setConsentConfirmed(e.target.checked)} />
              <label htmlFor="consent">I confirm documented written patient consent exists for this entry.</label>
            </div>
            <div className="field">
              <label>
                Verification note (internal only, e.g. where consent is filed)
                <input type="text" value={verificationNote ?? ""} onChange={(e) => setVerificationNote(e.target.value)} />
              </label>
            </div>
          </div>
        )}
        <FieldForm field={groupField} value={draft} path={catalog} onChange={setDraft} issues={issues} env={env} />
      </div>
      {pickerNode}

      <div className="btn-row">
        <button type="button" className="btn btn--primary" disabled={!canSave || action.pending} onClick={save}>
          Save draft
        </button>
        <button type="button" className="btn btn--accent" disabled={!canPublish || action.pending} onClick={publish} title={!canPublish ? "Resolve the required fields above before publishing." : undefined}>
          Publish
        </button>
        {current?.published && (
          <button type="button" className="btn" disabled={action.pending} onClick={unpublish}>
            Unpublish
          </button>
        )}
      </div>
    </div>
  );
}
