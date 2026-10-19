/**
 * Lists every real-world detail that still needs to be supplied before launch:
 * `REPLACE_WITH_…` values, sample/placeholder content flags, the stock
 * imagery notice and missing portrait/certificate files.
 *
 * Usage: npm run check:content
 * Exit code is always 0 — this is a checklist, not a gate.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "content");

const checks = [
  { pattern: /REPLACE_WITH_[A-Z_]+/g, label: "placeholder value" },
  { pattern: /sample:\s*true/g, label: "sample entry (shown with a 'Sample' label)" },
  { pattern: /placeholder:\s*true/g, label: "placeholder before/after case" },
  { pattern: /source:\s*null/g, label: "video without a published source" },
  { pattern: /src:\s*null/g, label: "missing image (portrait/certificate)" },
];

let total = 0;
for (const file of (await readdir(contentDir)).filter((f) => f.endsWith(".ts"))) {
  const text = await readFile(path.join(contentDir, file), "utf8");
  const lines = text.split("\n");
  const hits = [];
  lines.forEach((line, i) => {
    if (/^\s*(\*|\/\/|\/\*)/.test(line)) return; // documentation comments
    for (const { pattern, label } of checks) {
      for (const match of line.matchAll(pattern)) hits.push(`  ${file}:${i + 1}  ${label}  →  ${match[0]}`);
    }
  });
  if (hits.length) {
    console.log(`\n${file}`);
    console.log(hits.join("\n"));
    total += hits.length;
  }
}

const media = await readFile(path.join(contentDir, "media.ts"), "utf8");
const stock = (media.match(/slot\(\{/g) ?? []).length;
console.log(`\nmedia.ts\n  ${stock} image slots use temporary stock photography — replace with the clinic's own photos.`);
console.log("\nAlso confirm with the doctor: the service list (content/practice.ts) and all article/FAQ wording.");
console.log(`\n${total} item(s) still marked as placeholder or sample content.`);
