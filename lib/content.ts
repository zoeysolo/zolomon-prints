import fs from "fs";
import path from "path";
import { marked } from "marked";

// ---------------------------------------------------------------------------
// Content loader for the draft pages in /content-drafts.
//
// The new service/location/venue/bouquet pages render straight from these
// markdown files so Zol can edit copy without touching code. While a file's
// frontmatter has `noindex: true`, its page renders but is marked noindex and
// kept out of sitemap.xml. Set `noindex: false` to approve a page, then its
// route can be added to app/sitemap.ts.
// ---------------------------------------------------------------------------

export type ContentType = "service" | "location" | "venue" | "bouquet";

export interface ContentMeta {
  title: string;
  description: string;
  slug: string;
  route: string;
  type: ContentType;
  noindex: boolean;
}

export interface ContentDoc extends ContentMeta {
  html: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content-drafts");

// Minimal frontmatter parser (key: value pairs between --- fences). Values may
// be quoted; `true`/`false` become booleans. Avoids adding a YAML dependency.
function parseFrontmatter(raw: string): { meta: Record<string, string | boolean>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string | boolean> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    let value: string | boolean = kv[2].trim().replace(/^["']|["']$/g, "");
    if (value === "true") value = true;
    else if (value === "false") value = false;
    meta[kv[1]] = value;
  }
  return { meta, body: match[2] };
}

function readDoc(file: string): ContentDoc | null {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
  const { meta, body } = parseFrontmatter(raw);
  if (!meta.slug || !meta.type || !meta.route) return null;
  return {
    title: String(meta.title ?? ""),
    description: String(meta.description ?? ""),
    slug: String(meta.slug),
    route: String(meta.route),
    type: meta.type as ContentType,
    noindex: meta.noindex !== false, // default to noindex unless explicitly false
    html: marked.parse(body.trim(), { async: false }) as string
  };
}

export function getAllContent(): ContentDoc[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map(readDoc)
    .filter((d): d is ContentDoc => d !== null);
}

export function getContentByType(type: ContentType): ContentDoc[] {
  return getAllContent().filter((d) => d.type === type);
}

export function getContentBySlug(type: ContentType, slug: string): ContentDoc | undefined {
  return getContentByType(type).find((d) => d.slug === slug);
}
