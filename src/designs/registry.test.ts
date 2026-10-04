import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_DESIGN,
  designForPath,
  designPath,
  designs,
  findDesign,
  liveDesigns,
  plannedDesigns,
} from "./registry";

const root = new URL("../../", import.meta.url);
const file = (path: string) => new URL(path, root);

describe("design registry", () => {
  it("lists 23 designs: the original plus 22 more", () => {
    expect(designs).toHaveLength(23);
    expect(liveDesigns().map((d) => d.slug)).toContain(DEFAULT_DESIGN);
    expect(plannedDesigns()).toHaveLength(designs.length - liveDesigns().length);
  });

  it("has unique kebab-case slugs and unique names", () => {
    const slugs = designs.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    const names = designs.map((d) => d.name.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
  });

  it("describes every design: a tagline and a three-colour palette", () => {
    for (const d of designs) {
      expect(d.tagline.trim().length, d.slug).toBeGreaterThan(10);
      expect(d.palette, d.slug).toHaveLength(3);
      for (const color of d.palette) expect(color, d.slug).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("has a live default design, because it owns the site root", () => {
    expect(findDesign(DEFAULT_DESIGN)?.status).toBe("live");
  });

  it("gives every live design its component and route, and planned designs none", () => {
    for (const d of designs) {
      const component = existsSync(file(`src/designs/${d.slug}/index.tsx`));
      const route = existsSync(file(d.slug === DEFAULT_DESIGN ? "src/app/page.tsx" : `src/app/designs/${d.slug}/page.tsx`));
      if (d.status === "live") {
        expect(component, `${d.slug} component`).toBe(true);
        expect(route, `${d.slug} route`).toBe(true);
      } else {
        // an unlisted route would be reachable by URL while the switcher says "Coming soon"
        expect(route, `${d.slug} has a route but is still planned`).toBe(false);
      }
    }
  });

  it("documents every design in docs/DESIGNS.md", () => {
    const docs = readFileSync(file("docs/DESIGNS.md"), "utf8");
    for (const d of designs) expect(docs, `${d.name} missing from docs/DESIGNS.md`).toContain(`### ${d.name}`);
  });
});

describe("design fonts", () => {
  // next/font names the generated @font-face family after the exported constant. The production build
  // merges every design's CSS into shared chunks, so two designs exporting the same name (say "display")
  // override each other and one of them silently renders in the wrong typeface.
  it("gives every font a name no other design uses", () => {
    const names = new Map<string, string>();
    for (const entry of readdirSync(file("src/designs/"), { withFileTypes: true })) {
      const fontsFile = file(`src/designs/${entry.name}/fonts.ts`);
      if (!entry.isDirectory() || !existsSync(fontsFile)) continue;
      for (const [, name] of readFileSync(fontsFile, "utf8").matchAll(/export const (\w+) = localFont/g)) {
        expect(names.has(name), `font "${name}" is exported by both ${names.get(name)} and ${entry.name}`).toBe(false);
        names.set(name, entry.name);
      }
    }
    expect(names.size).toBeGreaterThan(20);
    expect(names.has("inter")).toBe(false); // the root layout's font
  });
});

describe("design paths", () => {
  it("serves the default design at the root and the others under /designs/", () => {
    expect(designPath(DEFAULT_DESIGN)).toBe("/");
    expect(designPath("pixel-art")).toBe("/designs/pixel-art/");
  });

  it("finds the design that owns a pathname, with or without a trailing slash", () => {
    expect(designForPath("/")?.slug).toBe(DEFAULT_DESIGN);
    expect(designForPath("/designs/pixel-art/")?.slug).toBe("pixel-art");
    expect(designForPath("/designs/pixel-art")?.slug).toBe("pixel-art");
    expect(designForPath("/designs/nope/")).toBeUndefined();
    expect(designForPath("/somewhere-else/")).toBeUndefined();
  });
});

describe("viewer themes", () => {
  // The browser window and PDF reader are shared; each design restyles them from its own viewer.css and tells the
  // viewer which design is active with <ViewerTheme>. A design without both would show another design's look.
  it("gives every live design a viewer theme registered under its own slug", () => {
    for (const d of liveDesigns()) {
      const css = file(`src/designs/${d.slug}/viewer.css`);
      expect(existsSync(css), `${d.slug} has no viewer.css`).toBe(true);
      expect(readFileSync(css, "utf8"), `${d.slug}/viewer.css never styles [data-viewer-theme="${d.slug}"]`).toContain(`[data-viewer-theme="${d.slug}"]`);
      const index = readFileSync(file(`src/designs/${d.slug}/index.tsx`), "utf8");
      expect(index, `${d.slug}/index.tsx does not render <ViewerTheme slug="${d.slug}">`).toContain(`<ViewerTheme slug="${d.slug}"`);
      expect(index, `${d.slug}/index.tsx does not import its viewer.css`).toContain('import "./viewer.css"');
    }
  });

  it("does not let a theme style another design's viewer", () => {
    for (const d of liveDesigns()) {
      const css = readFileSync(file(`src/designs/${d.slug}/viewer.css`), "utf8");
      const targeted = new Set([...css.matchAll(/\[data-viewer-theme="([^"]+)"\]/g)].map((m) => m[1]));
      expect([...targeted], `${d.slug}/viewer.css targets other designs`).toEqual([d.slug]);
    }
  });
});
