// Scaffolds a planned design:  npm run new-design -- <slug>
//
//   src/designs/<slug>/index.tsx     starter component (renders all content through usePortfolio())
//   src/designs/<slug>/styles.module.css  starter styles
//   src/designs/<slug>/viewer.css    starter theme for the browser window and PDF reader
//   src/app/designs/<slug>/page.tsx  route + metadata
//   src/designs/registry.ts          status flipped from "planned" to "live"
//
// Nothing is overwritten; the script refuses to run if either file already exists.
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const ROOT = new URL("../", import.meta.url);
const REGISTRY = new URL("src/designs/registry.ts", ROOT);

/** "neo-brutalism" -> "NeoBrutalismDesign" */
export function componentName(slug) {
  return (
    slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("") + "Design"
  );
}

/** Slugs and their status, read from the registry source. */
export function parseRegistry(source) {
  const entries = [];
  const re = /slug:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?status:\s*"(live|planned)"/g;
  for (const m of source.matchAll(re)) entries.push({ slug: m[1], name: m[2], status: m[3] });
  return entries;
}

/** Returns the registry source with `slug` flipped to live. Throws if it is unknown or already live. */
export function markLive(source, slug) {
  const entry = parseRegistry(source).find((e) => e.slug === slug);
  if (!entry) throw new Error(`"${slug}" is not in src/designs/registry.ts. Add it there first.`);
  if (entry.status === "live") throw new Error(`"${slug}" is already live.`);
  const start = source.indexOf(`slug: "${slug}"`);
  const statusAt = source.indexOf('status: "planned"', start);
  const nextSlug = source.indexOf("slug:", start + 1);
  if (statusAt < 0 || (nextSlug >= 0 && statusAt > nextSlug)) throw new Error(`Could not find the status line of "${slug}".`);
  return source.slice(0, statusAt) + 'status: "live"' + source.slice(statusAt + 'status: "planned"'.length);
}

export function fill(template, vars) {
  return Object.entries(vars).reduce((out, [key, value]) => out.split(`__${key}__`).join(value), template);
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: npm run new-design -- <slug>   (slugs are listed in src/designs/registry.ts)");
    process.exit(1);
  }

  const registry = await readFile(REGISTRY, "utf8");
  const entry = parseRegistry(registry).find((e) => e.slug === slug);
  if (!entry) {
    console.error(`Unknown design "${slug}". Planned designs:\n  ${parseRegistry(registry).filter((e) => e.status === "planned").map((e) => e.slug).join("\n  ")}`);
    process.exit(1);
  }

  const designFile = new URL(`src/designs/${slug}/index.tsx`, ROOT);
  const styleFile = new URL(`src/designs/${slug}/styles.module.css`, ROOT);
  const viewerFile = new URL(`src/designs/${slug}/viewer.css`, ROOT);
  const pageFile = new URL(`src/app/designs/${slug}/page.tsx`, ROOT);
  if (existsSync(designFile) || existsSync(pageFile) || existsSync(styleFile) || existsSync(viewerFile)) {
    console.error(`"${slug}" already has files; refusing to overwrite them.`);
    process.exit(1);
  }

  const updatedRegistry = markLive(registry, slug);
  const vars = { SLUG: slug, NAME: entry.name, COMPONENT: componentName(slug) };
  const component = fill(await readFile(new URL("scripts/templates/design.tsx.tpl", ROOT), "utf8"), vars);
  const page = fill(await readFile(new URL("scripts/templates/page.tsx.tpl", ROOT), "utf8"), vars);
  const styles = fill(await readFile(new URL("scripts/templates/styles.module.css.tpl", ROOT), "utf8"), vars);
  const viewer = fill(await readFile(new URL("scripts/templates/viewer.css.tpl", ROOT), "utf8"), vars);

  await mkdir(new URL(`src/designs/${slug}/`, ROOT), { recursive: true });
  await mkdir(new URL(`src/app/designs/${slug}/`, ROOT), { recursive: true });
  await writeFile(designFile, component);
  await writeFile(styleFile, styles);
  await writeFile(viewerFile, viewer);
  await writeFile(pageFile, page);
  await writeFile(REGISTRY, updatedRegistry);

  console.log(`Created ${entry.name} (${slug}):
  src/designs/${slug}/index.tsx      <- design it here (starter already renders all content)
  src/designs/${slug}/styles.module.css
  src/designs/${slug}/viewer.css     <- how the browser window and PDF reader look in this design
  src/app/designs/${slug}/page.tsx   <- route, served at /designs/${slug}/
  src/designs/registry.ts            <- status is now "live"

Next: npm run dev, open /designs/${slug}/, then npm run check && npm run test:e2e.
Brief for this design: docs/DESIGNS.md`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
