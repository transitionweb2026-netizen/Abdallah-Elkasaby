/**
 * Serves the static export in `out/` the way a plain host does: directory URLs
 * resolve to `index.html`, unknown paths get `404.html` with a 404 status.
 * No rewrites, no server rendering — if a page works here, it works on any
 * static host.
 *
 * Usage: npm run build && npm run preview   (PORT=4173 by default)
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const port = Number(process.env.PORT) || 4173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webmanifest": "application/manifest+json",
};

async function resolveFile(urlPath) {
  const target = path.join(root, decodeURIComponent(urlPath));
  if (!target.startsWith(root)) return null;
  try {
    const info = await stat(target);
    if (info.isFile()) return target;
    if (info.isDirectory()) {
      const index = path.join(target, "index.html");
      if ((await stat(index)).isFile()) return index;
    }
  } catch {
    return null;
  }
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  // Mirror trailing-slash hosting: /en -> /en/
  if (!path.extname(pathname) && !pathname.endsWith("/")) {
    res.writeHead(301, { Location: `${pathname}/` });
    return res.end();
  }
  try {
    const file = await resolveFile(pathname);
    const served = file ?? path.join(root, "404.html");
    const body = await readFile(served);
    res.writeHead(file ? 200 : 404, {
      "Content-Type": types[path.extname(served)] ?? "application/octet-stream",
    });
    res.end(body);
  } catch {
    // e.g. out/ is being rebuilt — answer instead of crashing the preview server
    res.writeHead(503, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Static export not available — run `npm run build`.");
  }
}).listen(port, () => {
  console.log(`Serving out/ at http://localhost:${port}/`);
});
