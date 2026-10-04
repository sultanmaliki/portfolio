import { existsSync, readFileSync } from "node:fs";
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
