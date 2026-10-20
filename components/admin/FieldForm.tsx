"use client";

import { useRef, type ChangeEvent } from "react";
import { iconNames } from "@/components/ui/Icon";
import { bundledUrls } from "@/lib/cms/bundled";
import { pageKeys } from "@/lib/routes";
import { defaultValue, emptyL10n, isObject, type Field, type Issue, type Json } from "@/lib/cms/schema";

export type FieldEnv = {
  /** Uploads a file to the Media Library and returns its new asset id. Absent in the local demo (uploads are disabled there). */
  uploadAsset?: (file: File, kind: "image" | "video") => Promise<{ assetId: string; previewUrl: string }>;
  /**
   * Opens the shared Media Library picker for an image/video field; calls
   * `onSelect` with what the field should store (a bundled `MediaKey`
   * string, or `{assetId}`) once the editor chooses or uploads something.
   * Absent in the local demo (the library has nothing to pick there either).
   */
  pickAsset?: (kind: "image" | "video", allowBundled: boolean, onSelect: (value: Json) => void) => void;
  /** Known slugs for each catalog a "reference" field might point at. */
  referenceOptions?: Record<string, { value: string; label: string }[]>;
  /** assetId -> a URL to preview, for image/video fields already pointing at something. */
  assetPreview?: Record<string, string>;
};

type Props = {
  field: Field;
  value: Json | undefined;
  path: string;
  onChange: (next: Json) => void;
  issues: Issue[];
  env: FieldEnv;
};

function issuesAt(issues: Issue[], path: string): Issue[] {
  return issues.filter((i) => i.path === path || i.path.startsWith(`${path}.`) || i.path.startsWith(`${path}[`));
}

function IssueList({ issues }: { issues: Issue[] }) {
  if (!issues.length) return null;
  return (
    <>
      {issues.map((issue, i) => (
        <p key={i} className={`issue issue--${issue.severity}`}>
          {issue.severity === "invalid" ? "⚠" : issue.severity === "incomplete" ? "•" : "ℹ"} {issue.message.en}
        </p>
      ))}
    </>
  );
}

export function FieldForm({ field, value, path, onChange, issues, env }: Props) {
  const mine = issues.filter((i) => i.path === path);

  switch (field.kind) {
    case "note":
      return <p className="field-label" style={{ marginTop: "1.2rem" }}>{field.label.en}</p>;

    case "text": {
      if (field.bilingual) {
        const v = isObject(value) ? value : emptyL10n();
        return (
          <div className="field">
            <span className="field-label">
              {field.label.en} {field.required ? "*" : ""}
            </span>
            <div className="field-bilingual">
              {(["en", "ar"] as const).map((locale) => (
                <label key={locale} className="field-bilingual-col">
                  <span>{locale.toUpperCase()}</span>
                  {field.multiline ? (
                    <textarea
                      dir={locale === "ar" ? "rtl" : "ltr"}
                      value={String(v[locale] ?? "")}
                      onChange={(e) => onChange({ ...v, [locale]: e.target.value })}
                    />
                  ) : (
                    <input
                      type="text"
                      dir={locale === "ar" ? "rtl" : "ltr"}
                      value={String(v[locale] ?? "")}
                      onChange={(e) => onChange({ ...v, [locale]: e.target.value })}
                    />
                  )}
                </label>
              ))}
            </div>
            {field.hint && <p className="field-hint">{field.hint.en}</p>}
            <IssueList issues={mine} />
          </div>
        );
      }
      const v = typeof value === "string" ? value : "";
      return (
        <div className="field">
          <label>
            {field.label.en} {field.required ? "*" : ""}
            {field.multiline ? (
              <textarea value={v} onChange={(e) => onChange(e.target.value)} />
            ) : (
              <input type="text" value={v} onChange={(e) => onChange(e.target.value)} />
            )}
          </label>
          {field.hint && <p className="field-hint">{field.hint.en}</p>}
          <IssueList issues={mine} />
        </div>
      );
    }

    case "lines": {
      const items = Array.isArray(value) ? value : [];
      return (
        <div className="field">
          <span className="field-label">{field.label.en}</span>
          {items.map((item, i) => {
            const v = isObject(item) ? item : emptyL10n();
            return (
              <div key={i} className="field-list-item">
                <div className="field-list-item-head">
                  <strong>Paragraph {i + 1}</strong>
                  <div className="btn-row" style={{ margin: 0 }}>
                    <button type="button" className="btn" disabled={i === 0} onClick={() => onChange(moveItem(items, i, -1))}>↑</button>
                    <button type="button" className="btn" disabled={i === items.length - 1} onClick={() => onChange(moveItem(items, i, 1))}>↓</button>
                    <button type="button" className="btn btn--danger" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>Remove</button>
                  </div>
                </div>
                <div className="field-bilingual">
                  {(["en", "ar"] as const).map((locale) => (
                    <label key={locale} className="field-bilingual-col">
                      <span>{locale.toUpperCase()}</span>
                      <textarea dir={locale === "ar" ? "rtl" : "ltr"} value={String(v[locale] ?? "")} onChange={(e) => onChange(items.map((it, idx) => (idx === i ? { ...v, [locale]: e.target.value } : it)))} />
                    </label>
                  ))}
                </div>
                <IssueList issues={issuesAt(issues, `${path}[${i}]`)} />
              </div>
            );
          })}
          <button type="button" className="btn" onClick={() => onChange([...items, emptyL10n()])}>+ Add paragraph</button>
          <IssueList issues={mine} />
        </div>
      );
    }

    case "number": {
      const v = typeof value === "number" ? value : "";
      return (
        <div className="field">
          <label>
            {field.label.en} {field.required ? "*" : ""}
            <input
              type="number"
              min={field.min}
              max={field.max}
              step={field.step ?? 1}
              value={v}
              onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </label>
          <IssueList issues={mine} />
        </div>
      );
    }

    case "boolean":
      return (
        <div className="field checkbox-row">
          <input id={path} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <label htmlFor={path}>{field.label.en}</label>
        </div>
      );

    case "select": {
      const v = typeof value === "string" ? value : "";
      return (
        <div className="field">
          <label>
            {field.label.en} {field.required ? "*" : ""}
            <select value={v} onChange={(e) => onChange(e.target.value)}>
              <option value="">—</option>
              {field.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label.en}
                </option>
              ))}
            </select>
          </label>
          <IssueList issues={mine} />
        </div>
      );
    }

    case "icon": {
      const v = typeof value === "string" ? value : "";
      return (
        <div className="field">
          <label>
            {field.label.en} {field.required ? "*" : ""}
            <select value={v} onChange={(e) => onChange(e.target.value)}>
              <option value="">—</option>
              {iconNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <IssueList issues={mine} />
        </div>
      );
    }

    case "reference": {
      const v = typeof value === "string" ? value : "";
      const options = env.referenceOptions?.[field.catalog] ?? [];
      return (
        <div className="field">
          <label>
            {field.label.en} {field.required ? "*" : ""}
            <select value={v} onChange={(e) => onChange(e.target.value)}>
              <option value="">—</option>
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <IssueList issues={mine} />
        </div>
      );
    }

    case "image":
      return <ImageField field={field} value={value} onChange={onChange} issues={mine} env={env} />;

    case "video":
      return <VideoField field={field} value={value} onChange={onChange} issues={mine} env={env} path={path} />;

    case "cta": {
      const v = isObject(value) ? value : { label: emptyL10n(), target: "", hash: "" };
      const targets = [{ value: "booking", label: "Booking action" }, ...pageKeys.map((k) => ({ value: k, label: k }))];
      return (
        <div className="field-group">
          <p className="field-label">
            {field.label.en} {field.required ? "*" : ""}
          </p>
          <FieldForm field={{ kind: "text", bilingual: true, label: { en: "Button label", ar: "نص الزر" }, required: field.required }} value={v.label} path={`${path}.label`} onChange={(next) => onChange({ ...v, label: next })} issues={issues} env={env} />
          <div className="field">
            <label>
              Goes to
              <select value={String(v.target ?? "")} onChange={(e) => onChange({ ...v, target: e.target.value })}>
                <option value="">—</option>
                {targets.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="field">
            <label>
              In-page anchor (optional)
              <input type="text" value={String(v.hash ?? "")} onChange={(e) => onChange({ ...v, hash: e.target.value })} />
            </label>
          </div>
          <IssueList issues={mine} />
        </div>
      );
    }

    case "group": {
      const v = isObject(value) ? value : {};
      return (
        <div className="field-group">
          <p className="field-label">{field.label.en}</p>
          {Object.entries(field.fields).map(([key, sub]) => (
            <FieldForm key={key} field={sub} value={v[key]} path={`${path}.${key}`} onChange={(next) => onChange({ ...v, [key]: next })} issues={issues} env={env} />
          ))}
        </div>
      );
    }

    case "list": {
      const items = Array.isArray(value) ? value : [];
      const atMax = Boolean(field.maxItems && items.length >= field.maxItems);
      return (
        <div className="field">
          <span className="field-label">{field.label.en}</span>
          {items.map((item, i) => (
            <div key={i} className="field-list-item">
              <div className="field-list-item-head">
                <strong>#{i + 1}</strong>
                <div className="btn-row" style={{ margin: 0 }}>
                  <button type="button" className="btn" disabled={i === 0} onClick={() => onChange(moveItem(items, i, -1))}>↑</button>
                  <button type="button" className="btn" disabled={i === items.length - 1} onClick={() => onChange(moveItem(items, i, 1))}>↓</button>
                  <button type="button" className="btn btn--danger" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>Remove</button>
                </div>
              </div>
              <FieldForm field={field.item} value={item} path={`${path}[${i}]`} onChange={(next) => onChange(items.map((it, idx) => (idx === i ? next : it)))} issues={issues} env={env} />
            </div>
          ))}
          <button type="button" className="btn" disabled={atMax} onClick={() => onChange([...items, defaultValue(field.item)])}>
            + Add
          </button>
          <IssueList issues={mine} />
        </div>
      );
    }

    case "blocks":
      return <BlocksField value={value} onChange={onChange} issues={issues} path={path} />;
  }
}

function moveItem<T>(items: T[], index: number, dir: 1 | -1): T[] {
  const next = [...items];
  const target = index + dir;
  if (target < 0 || target >= next.length) return items;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function ImageField({ field, value, onChange, issues, env }: { field: Extract<Field, { kind: "image" }>; value: Json | undefined; onChange: (v: Json) => void; issues: Issue[]; env: FieldEnv }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const bundledKey = typeof value === "string" ? value : "";
  const assetId = isObject(value) ? String(value.assetId ?? "") : "";
  const altValue = isObject(value) && isObject(value.alt) ? (value.alt as Record<string, string>) : null;
  const preview = assetId ? env.assetPreview?.[assetId] : bundledKey ? bundledUrls(bundledKey).url : undefined;

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !env.uploadAsset) return;
    const result = await env.uploadAsset(file, "image");
    onChange({ assetId: result.assetId });
  }

  return (
    <div className="field">
      <span className="field-label">{field.label.en}</span>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element -- admin-only preview of the selected photo
        <img src={preview} alt="" style={{ maxWidth: 160, maxHeight: 120, display: "block", marginBottom: "0.4rem", borderRadius: 6 }} />
      )}
      {bundledKey && <p className="field-hint">Currently one of the site&apos;s existing stock photos (&quot;{bundledKey}&quot;).</p>}
      <div className="btn-row" style={{ marginTop: 0 }}>
        <button type="button" className="btn" disabled={!env.uploadAsset} onClick={() => inputRef.current?.click()}>
          {assetId ? "Replace with a new upload" : "Upload a photo"}
        </button>
        <button
          type="button"
          className="btn"
          disabled={!env.pickAsset}
          onClick={() => env.pickAsset?.("image", Boolean(field.bundledOptions), (next) => onChange(next))}
        >
          Choose from library
        </button>
        {assetId && field.bundledOptions && (
          <button type="button" className="btn" onClick={() => onChange(field.bundledOptions![0].value)}>
            Use a stock photo instead
          </button>
        )}
        {assetId && !field.bundledOptions && (
          <button type="button" className="btn btn--danger" onClick={() => onChange(null)}>
            Remove
          </button>
        )}
      </div>
      {!env.uploadAsset && <p className="field-hint">Uploading needs the Supabase connection — not available in the local demo.</p>}
      {assetId && (
        <div className="field-bilingual" style={{ marginTop: "0.5rem" }}>
          {(["en", "ar"] as const).map((locale) => (
            <label key={locale} className="field-bilingual-col">
              <span>Alt text ({locale.toUpperCase()})</span>
              <input
                type="text"
                dir={locale === "ar" ? "rtl" : "ltr"}
                value={altValue?.[locale] ?? ""}
                onChange={(e) => onChange({ assetId, alt: { en: altValue?.en ?? "", ar: altValue?.ar ?? "", [locale]: e.target.value } })}
              />
            </label>
          ))}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />
      <IssueList issues={issues} />
    </div>
  );
}

function VideoField({ field, value, onChange, issues, env, path }: { field: Field; value: Json | undefined; onChange: (v: Json) => void; issues: Issue[]; env: FieldEnv; path: string }) {
  const v = isObject(value) ? value : { type: "", id: "", assetId: "" };
  const inputRef = useRef<HTMLInputElement>(null);
  const assetId = typeof v.assetId === "string" ? v.assetId : "";
  const preview = assetId ? env.assetPreview?.[assetId] : undefined;

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !env.uploadAsset) return;
    const result = await env.uploadAsset(file, "video");
    onChange({ ...v, type: "file", assetId: result.assetId });
  }

  return (
    <div className="field-group">
      <p className="field-label">{field.label.en}</p>
      <div className="field">
        <label>
          Source type
          <select value={String(v.type ?? "")} onChange={(e) => onChange({ ...v, type: e.target.value })}>
            <option value="">Coming soon (no source yet)</option>
            <option value="youtube">YouTube</option>
            <option value="file">Uploaded file</option>
          </select>
        </label>
      </div>
      {v.type === "youtube" && (
        <div className="field">
          <label>
            YouTube video id
            <input type="text" value={String(v.id ?? "")} onChange={(e) => onChange({ ...v, id: e.target.value })} />
          </label>
        </div>
      )}
      {v.type === "file" && (
        <div className="field">
          {preview && <video src={preview} controls style={{ maxWidth: 240, display: "block", marginBottom: "0.4rem", borderRadius: 6 }} />}
          <div className="btn-row" style={{ marginTop: 0 }}>
            <button type="button" className="btn" disabled={!env.uploadAsset} onClick={() => inputRef.current?.click()}>
              {assetId ? "Replace video" : "Upload video"}
            </button>
            <button
              type="button"
              className="btn"
              disabled={!env.pickAsset}
              onClick={() => env.pickAsset?.("video", false, (next) => onChange({ ...v, type: "file", ...(isObject(next) ? next : {}) }))}
            >
              Choose from library
            </button>
          </div>
          {!env.uploadAsset && <p className="field-hint">Uploading needs the Supabase connection — not available in the local demo.</p>}
          <input ref={inputRef} type="file" accept="video/*" hidden onChange={onFile} />
        </div>
      )}
      <IssueList issues={issuesAt(issues, path)} />
    </div>
  );
}

const BLOCK_TYPES = [
  { value: "p", label: "Paragraph" },
  { value: "h2", label: "Heading" },
  { value: "list", label: "Bullet list" },
  { value: "note", label: "Note" },
];

function BlocksField({ value, onChange, issues, path }: { value: Json | undefined; onChange: (v: Json) => void; issues: Issue[]; path: string }) {
  const blocks = Array.isArray(value) ? value : [];

  function update(i: number, next: Json) {
    onChange(blocks.map((b, idx) => (idx === i ? next : b)));
  }

  return (
    <div className="field">
      <span className="field-label">Body</span>
      {blocks.map((block, i) => {
        const b = isObject(block) ? block : { type: "p" };
        const type = String(b.type ?? "p");
        return (
          <div key={i} className="field-list-item">
            <div className="field-list-item-head">
              <select value={type} onChange={(e) => update(i, e.target.value === "list" ? { type: "list", items: [] } : { type: e.target.value, text: emptyL10n() })}>
                {BLOCK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <div className="btn-row" style={{ margin: 0 }}>
                <button type="button" className="btn" disabled={i === 0} onClick={() => onChange(moveItem(blocks, i, -1))}>↑</button>
                <button type="button" className="btn" disabled={i === blocks.length - 1} onClick={() => onChange(moveItem(blocks, i, 1))}>↓</button>
                <button type="button" className="btn btn--danger" onClick={() => onChange(blocks.filter((_, idx) => idx !== i))}>Remove</button>
              </div>
            </div>
            {type === "list" ? (
              <ListBlockEditor items={Array.isArray(b.items) ? b.items : []} onChange={(items) => update(i, { type: "list", items })} />
            ) : (
              <div className="field-bilingual">
                {(["en", "ar"] as const).map((locale) => (
                  <label key={locale} className="field-bilingual-col">
                    <span>{locale.toUpperCase()}</span>
                    <textarea
                      dir={locale === "ar" ? "rtl" : "ltr"}
                      value={String(isObject(b.text) ? b.text[locale] ?? "" : "")}
                      onChange={(e) => update(i, { type, text: { ...(isObject(b.text) ? b.text : emptyL10n()), [locale]: e.target.value } })}
                    />
                  </label>
                ))}
              </div>
            )}
            <IssueList issues={issuesAt(issues, `${path}[${i}]`)} />
          </div>
        );
      })}
      <button type="button" className="btn" onClick={() => onChange([...blocks, { type: "p", text: emptyL10n() }])}>
        + Add block
      </button>
    </div>
  );
}

function ListBlockEditor({ items, onChange }: { items: Json[]; onChange: (items: Json[]) => void }) {
  return (
    <div>
      {items.map((item, i) => {
        const v = isObject(item) ? item : emptyL10n();
        return (
          <div key={i} className="field-bilingual" style={{ marginBottom: "0.4rem" }}>
            {(["en", "ar"] as const).map((locale) => (
              <input
                key={locale}
                type="text"
                dir={locale === "ar" ? "rtl" : "ltr"}
                value={String(v[locale] ?? "")}
                onChange={(e) => onChange(items.map((it, idx) => (idx === i ? { ...v, [locale]: e.target.value } : it)))}
              />
            ))}
          </div>
        );
      })}
      <button type="button" className="btn" onClick={() => onChange([...items, emptyL10n()])}>
        + Add bullet
      </button>
    </div>
  );
}
