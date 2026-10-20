/**
 * Generic, schema-driven field system that powers every editing screen in
 * the admin dashboard. A document or catalog entry in `registry.ts` is
 * described once as a tree of `Field`s; the editor renders a form from that
 * description and `validate()` checks it the same way everywhere, instead of
 * every content type needing its own bespoke form and its own bespoke rules.
 *
 * Three severities, used consistently across the dashboard:
 *  - "invalid"    the value is actively wrong (bad URL, bad phone) -> blocks saving the draft
 *  - "incomplete" required content is missing -> draft saves fine, but blocks publishing
 *  - "warning"    informational only (e.g. a REPLACE_WITH_ placeholder is still in place)
 */
import type { IconName } from "@/components/ui/Icon";
import { iconNames } from "@/components/ui/Icon";
import type { L10n, Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** A bilingual label — identical shape to the site's own `L10n`, reused rather than duplicated. */
export type Label = L10n;

export type IssueSeverity = "invalid" | "incomplete" | "warning";

export type Issue = { path: string; severity: IssueSeverity; message: Label };

export type FieldBase = {
  label: Label;
  hint?: Label;
  required?: boolean;
};

export type TextFormat = "plain" | "email" | "phone" | "whatsapp" | "url" | "slug";

export type Field =
  | (FieldBase & { kind: "text"; bilingual?: boolean; multiline?: boolean; format?: TextFormat; maxLength?: number })
  /** A reorderable list of bilingual paragraphs, e.g. a biography's `paragraphs`. */
  | (FieldBase & { kind: "lines"; minItems?: number; maxItems?: number })
  | (FieldBase & { kind: "number"; min?: number; max?: number; step?: number })
  | (FieldBase & { kind: "boolean" })
  | (FieldBase & { kind: "select"; options: { value: string; label: Label }[] })
  | (FieldBase & { kind: "icon" })
  /**
   * A Media Library asset reference. Plain `kind: "image"` (no
   * `bundledOptions`) is a pure upload with no fallback, stored as
   * `{assetId}` or `null` (the doctor's portrait, certificate scans,
   * before/after photos). With `bundledOptions`, the field also accepts one
   * of the site's existing stock photos as a plain string value — used for
   * image slots that already render something by default (hero photos,
   * specialty/service/article images, video posters) so a never-replaced
   * field still shows a real photo.
   */
  | (FieldBase & { kind: "image"; bundledOptions?: { value: string; label: Label }[] })
  | (FieldBase & { kind: "video" })
  /** A button: bilingual label + an internal page target (or "booking") + optional in-page hash. */
  | (FieldBase & { kind: "cta" })
  | (FieldBase & { kind: "group"; fields: Record<string, Field> })
  | (FieldBase & { kind: "list"; item: Field; minItems?: number; maxItems?: number })
  /** The article body: an ordered list of paragraph / heading / bullet-list / note blocks. */
  | (FieldBase & { kind: "blocks" })
  /** A slug reference into another catalog, validated against its live entries. */
  | (FieldBase & { kind: "reference"; catalog: string })
  /** A read-only separator/heading inside a form — carries no value. */
  | (FieldBase & { kind: "note" });

export type FieldKind = Field["kind"];

// ---- small shared helpers --------------------------------------------------------------

export const isObject = (v: unknown): v is Record<string, Json> => Boolean(v) && typeof v === "object" && !Array.isArray(v);

export function isEmptyL10n(v: unknown): boolean {
  if (!isObject(v)) return true;
  return locales.every((l) => !String(v[l] ?? "").trim());
}

export function emptyL10n(): L10n {
  return Object.fromEntries(locales.map((l) => [l, ""])) as L10n;
}

function msg(en: string, ar: string): Label {
  return { en, ar };
}

const PATTERNS: Record<TextFormat, RegExp | null> = {
  plain: null,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/[^\s]+$/i,
  slug: /^[a-z0-9]+(-[a-z0-9]+)*$/,
  // International format, digits with an optional leading "+" and spaces (as shown throughout content/site.ts).
  phone: /^\+?[\d\s]{6,20}$/,
  // Country code + number, digits only (wa.me requires this — see lib/contact.ts).
  whatsapp: /^\d{6,15}$/,
};

/** Values using the site's own "not supplied yet" convention (see content/site.ts). */
function isUnreplacedPlaceholder(value: string): boolean {
  return value.trim().toUpperCase().startsWith("REPLACE_WITH_");
}

// ---- validation -------------------------------------------------------------------------

export function validateField(field: Field, value: Json | undefined, path: string, context: { catalogSlugs?: Record<string, string[]> } = {}): Issue[] {
  const issues: Issue[] = [];
  const missing = () => issues.push({ path, severity: "incomplete", message: msg("This field is required.", "هذا الحقل مطلوب.") });

  switch (field.kind) {
    case "text": {
      if (field.bilingual) {
        for (const l of locales) {
          const v = isObject(value) ? String(value[l] ?? "") : "";
          if (!v.trim()) {
            if (field.required) issues.push({ path: `${path}.${l}`, severity: "incomplete", message: msg("Missing text.", "النص غير موجود.") });
            continue;
          }
          if (isUnreplacedPlaceholder(v)) {
            issues.push({ path: `${path}.${l}`, severity: "warning", message: msg("Still a placeholder value.", "لا تزال قيمة مؤقتة.") });
          }
        }
      } else {
        const v = typeof value === "string" ? value : "";
        if (!v.trim()) {
          if (field.required) missing();
          break;
        }
        if (isUnreplacedPlaceholder(v)) {
          issues.push({ path, severity: "warning", message: msg("Still a placeholder value.", "لا تزال قيمة مؤقتة.") });
          break;
        }
        const pattern = field.format ? PATTERNS[field.format] : null;
        if (pattern && !pattern.test(v.trim())) {
          issues.push({ path, severity: "invalid", message: msg(`Not a valid ${field.format}.`, "القيمة غير صحيحة.") });
        }
        if (field.maxLength && v.length > field.maxLength) {
          issues.push({ path, severity: "invalid", message: msg(`Longer than ${field.maxLength} characters.`, "النص أطول من المسموح.") });
        }
      }
      break;
    }

    case "lines": {
      const items = Array.isArray(value) ? value : [];
      if (field.required && items.length === 0) missing();
      items.forEach((item, i) => {
        if (isEmptyL10n(item) && field.required) {
          issues.push({ path: `${path}[${i}]`, severity: "incomplete", message: msg("Empty paragraph.", "فقرة فارغة.") });
        }
      });
      if (field.minItems && items.length < field.minItems) {
        issues.push({ path, severity: "incomplete", message: msg(`Needs at least ${field.minItems}.`, "يحتاج إلى عدد أكبر من العناصر.") });
      }
      break;
    }

    case "number": {
      if (value === undefined || value === null || value === "") {
        if (field.required) missing();
        break;
      }
      const n = Number(value);
      if (Number.isNaN(n)) issues.push({ path, severity: "invalid", message: msg("Not a number.", "ليس رقمًا صحيحًا.") });
      else if (field.min !== undefined && n < field.min) issues.push({ path, severity: "invalid", message: msg(`Must be at least ${field.min}.`, "القيمة أقل من المسموح.") });
      else if (field.max !== undefined && n > field.max) issues.push({ path, severity: "invalid", message: msg(`Must be at most ${field.max}.`, "القيمة أكبر من المسموح.") });
      break;
    }

    case "boolean":
      break;

    case "select": {
      if (value === undefined || value === null || value === "") {
        if (field.required) missing();
        break;
      }
      if (!field.options.some((o) => o.value === value)) {
        issues.push({ path, severity: "invalid", message: msg("Not one of the allowed choices.", "القيمة ليست من الخيارات المسموحة.") });
      }
      break;
    }

    case "icon": {
      if (!value) {
        if (field.required) missing();
        break;
      }
      if (!iconNames.includes(value as IconName)) {
        issues.push({ path, severity: "invalid", message: msg("Unknown icon.", "أيقونة غير معروفة.") });
      }
      break;
    }

    case "image": {
      if (typeof value === "string" && value) {
        if (field.bundledOptions && !field.bundledOptions.some((o) => o.value === value)) {
          issues.push({ path, severity: "invalid", message: msg("Not one of the site's existing photos.", "ليست من الصور المتوفرة في الموقع.") });
        }
        break;
      }
      if (!isObject(value) || !value.assetId) {
        if (field.required) missing();
        break;
      }
      break;
    }

    case "video": {
      if (!isObject(value)) {
        if (field.required) missing();
        break;
      }
      const type = value.type;
      if (type === "youtube") {
        if (!String(value.id ?? "").trim()) issues.push({ path: `${path}.id`, severity: "invalid", message: msg("Missing YouTube video id.", "رقم فيديو يوتيوب غير موجود.") });
      } else if (type === "file") {
        if (!isObject(value.asset) && !value.assetId) issues.push({ path: `${path}.asset`, severity: "invalid", message: msg("Missing uploaded file.", "الملف المرفوع غير موجود.") });
      } else if (field.required) {
        missing();
      }
      break;
    }

    case "cta": {
      const v = isObject(value) ? value : {};
      issues.push(...validateField({ kind: "text", bilingual: true, required: field.required, label: field.label }, v.label as Json, `${path}.label`));
      if (!v.target && field.required) issues.push({ path: `${path}.target`, severity: "incomplete", message: msg("Choose where this button goes.", "اختر الوجهة التي يؤدي إليها الزر.") });
      break;
    }

    case "group": {
      for (const [key, sub] of Object.entries(field.fields)) {
        issues.push(...validateField(sub, isObject(value) ? value[key] : undefined, `${path}.${key}`, context));
      }
      break;
    }

    case "list": {
      const items = Array.isArray(value) ? value : [];
      if (field.minItems && items.length < field.minItems) {
        issues.push({ path, severity: "incomplete", message: msg(`Needs at least ${field.minItems} item(s).`, "يحتاج إلى عناصر أكثر.") });
      }
      if (field.maxItems && items.length > field.maxItems) {
        issues.push({ path, severity: "invalid", message: msg(`Allows at most ${field.maxItems} item(s).`, "تجاوز العدد المسموح من العناصر.") });
      }
      items.forEach((item, i) => issues.push(...validateField(field.item, item, `${path}[${i}]`, context)));
      break;
    }

    case "blocks": {
      const items = Array.isArray(value) ? value : [];
      if (field.required && items.length === 0) missing();
      items.forEach((block, i) => {
        if (!isObject(block)) {
          issues.push({ path: `${path}[${i}]`, severity: "invalid", message: msg("Malformed block.", "عنصر غير صحيح.") });
          return;
        }
        if (block.type === "list") {
          const rows = Array.isArray(block.items) ? block.items : [];
          if (rows.length === 0 || rows.some(isEmptyL10n)) {
            issues.push({ path: `${path}[${i}]`, severity: "incomplete", message: msg("This list has an empty item.", "توجد عناصر فارغة في هذه القائمة.") });
          }
        } else if (["p", "h2", "note"].includes(String(block.type))) {
          if (isEmptyL10n(block.text)) {
            issues.push({ path: `${path}[${i}]`, severity: "incomplete", message: msg("Empty block.", "عنصر فارغ.") });
          }
        } else {
          issues.push({ path: `${path}[${i}]`, severity: "invalid", message: msg("Unknown block type.", "نوع عنصر غير معروف.") });
        }
      });
      break;
    }

    case "reference": {
      if (!value) {
        if (field.required) missing();
        break;
      }
      const known = context.catalogSlugs?.[field.catalog];
      if (known && !known.includes(String(value))) {
        issues.push({ path, severity: "invalid", message: msg("Refers to an entry that no longer exists.", "يشير إلى عنصر غير موجود.") });
      }
      break;
    }

    case "note":
      break;
  }

  return issues;
}

export function blocksSave(issues: Issue[]): boolean {
  return issues.some((i) => i.severity === "invalid");
}

export function blocksPublish(issues: Issue[]): boolean {
  return issues.some((i) => i.severity === "invalid" || i.severity === "incomplete");
}

/** A sensible empty value for a freshly-created field, so new entries start from a valid shape. */
export function defaultValue(field: Field): Json {
  switch (field.kind) {
    case "text":
      return field.bilingual ? emptyL10n() : "";
    case "lines":
    case "list":
    case "blocks":
      return [];
    case "number":
      return 0;
    case "boolean":
      return false;
    case "select":
    case "icon":
    case "reference":
      return "";
    case "image":
      return field.bundledOptions?.length ? field.bundledOptions[0].value : null;
    case "video":
      return null;
    case "cta":
      return { label: emptyL10n(), target: "", hash: "" };
    case "group":
      return Object.fromEntries(Object.entries(field.fields).map(([k, f]) => [k, defaultValue(f)]));
    case "note":
      return null;
  }
}

export type { Locale };
