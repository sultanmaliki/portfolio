import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { componentName, fill, markLive, parseRegistry } from "./new-design.mjs";

const registry = readFileSync(new URL("../src/designs/registry.ts", import.meta.url), "utf8");

// The generator is tested against a small fixture, not the real registry: once every design is built
// there is nothing left in the real file for it to flip.
const fixture = `export const designs = [
  { slug: "alpha", name: "Alpha", tagline: "first", palette: ["#000000", "#111111", "#222222"], status: "live" },
  { slug: "beta", name: "Beta design", tagline: "second", palette: ["#000000", "#111111", "#222222"], status: "planned" },
  { slug: "gamma", name: "Gamma", tagline: "third", palette: ["#000000", "#111111", "#222222"], status: "planned" },
];`;

describe("componentName", () => {
  it("turns slugs into component names", () => {
    expect(componentName("neo-brutalism")).toBe("NeoBrutalismDesign");
    expect(componentName("y2k")).toBe("Y2kDesign");
    expect(componentName("luxury-typography")).toBe("LuxuryTypographyDesign");
  });
});

describe("parseRegistry", () => {
  it("reads every design from the real registry", () => {
    const entries = parseRegistry(registry);
    expect(entries).toHaveLength(23);
    expect(entries[0]).toEqual({ slug: "cinematic", name: "Cinematic", status: "live" });
    expect(entries.find((e) => e.slug === "pixel-art")).toMatchObject({ slug: "pixel-art", name: "Pixel art" });
    for (const entry of entries) expect(["live", "planned"]).toContain(entry.status);
  });

  it("reads the fixture", () => {
    expect(parseRegistry(fixture)).toEqual([
      { slug: "alpha", name: "Alpha", status: "live" },
      { slug: "beta", name: "Beta design", status: "planned" },
      { slug: "gamma", name: "Gamma", status: "planned" },
    ]);
  });
});

describe("markLive", () => {
  it("flips only the requested design", () => {
    const next = markLive(fixture, "beta");
    const before = parseRegistry(fixture);
    const after = parseRegistry(next);
    expect(after.find((e) => e.slug === "beta")?.status).toBe("live");
    expect(after.filter((e) => e.slug !== "beta")).toEqual(before.filter((e) => e.slug !== "beta"));
    // everything else in the file is byte-for-byte unchanged
    expect(next.length).toBe(fixture.length - "planned".length + "live".length);
  });

  it("refuses unknown and already-live designs", () => {
    expect(() => markLive(fixture, "not-a-design")).toThrow(/not in src\/designs\/registry/);
    expect(() => markLive(fixture, "alpha")).toThrow(/already live/);
  });
});

describe("fill", () => {
  it("replaces every placeholder occurrence", () => {
    expect(fill("__A__ and __A__ and __B__", { A: "x", B: "y" })).toBe("x and x and y");
  });

  it("generates the starter files for real: no placeholders left", () => {
    const vars = { SLUG: "minimalism", NAME: "Minimalism", COMPONENT: componentName("minimalism") };
    for (const name of ["design.tsx.tpl", "page.tsx.tpl", "styles.module.css.tpl"]) {
      const out = fill(readFileSync(new URL(`./templates/${name}`, import.meta.url), "utf8"), vars);
      expect(out).not.toMatch(/__[A-Z]+__/);
      expect(out).toContain(name === "styles.module.css.tpl" ? "minimalism" : "MinimalismDesign");
    }
  });
});
