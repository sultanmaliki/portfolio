import { describe, expect, it } from "vitest";
import { portfolio, seo } from "./index";
import { jsonLdScript, personJsonLd } from "../lib/seo";

const { profile, story, skills, timeline, interests } = portfolio;

describe("profile", () => {
  it("has the identity every design needs", () => {
    expect(`${profile.givenName} ${profile.familyName}`).toBe(profile.name);
    expect(profile.tagline).toHaveLength(2);
    expect(profile.availability.status).not.toBe("");
    expect(profile.summary.length).toBeGreaterThan(100);
    expect(profile.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });

  it("has one of each contact link, all consistent with the profile", () => {
    const ids = profile.links.map((l) => l.id).sort();
    expect(ids).toEqual(["email", "github", "linkedin", "resume"]);
    const by = Object.fromEntries(profile.links.map((l) => [l.id, l]));
    expect(by.email.href).toBe(`mailto:${profile.email}`);
    expect(by.resume.href).toBe(profile.resume.url);
    expect(profile.resume.filename).toMatch(/\.pdf$/);
    for (const id of ["github", "linkedin"]) {
      expect(by[id].href).toMatch(/^https:\/\//);
      expect(by[id].preview?.title, id).toBeTruthy();
    }
  });

  it("has statements and contact copy", () => {
    for (const lines of profile.statements) {
      expect(lines.length).toBeGreaterThan(0);
      for (const line of lines) expect(line.trim()).not.toBe("");
    }
    expect(profile.contact.headline).toHaveLength(2);
    expect(profile.location.sentence).toContain(profile.location.city);
  });
});

describe("story, skills, timeline and interests", () => {
  it("has a complete story", () => {
    expect(story.quotes).toHaveLength(3);
    expect(story.paragraphs.length).toBeGreaterThan(0);
    expect(story.refrain.lines.length).toBeGreaterThan(0);
    expect(story.refrain.punchline.emphasis).not.toBe("");
  });

  it("has skill categories without empty or duplicated entries", () => {
    expect(skills.length).toBeGreaterThan(0);
    const seen = new Set<string>();
    for (const category of skills) {
      expect(category.items.length, category.title).toBeGreaterThan(0);
      for (const item of category.items) {
        expect(item.trim(), category.title).not.toBe("");
        expect(seen.has(item), `duplicate skill: ${item}`).toBe(false);
        seen.add(item);
      }
    }
  });

  it("has a timeline that ends at 'Now' and interests that are unique", () => {
    expect(timeline.at(-1)?.year).toBe("Now");
    for (const entry of timeline) expect(entry.year && entry.desc).toBeTruthy();
    expect(new Set(interests).size).toBe(interests.length);
  });
});

describe("portfolio aggregate", () => {
  it("exposes every part a design can ask for", () => {
    expect(Object.keys(portfolio).sort()).toEqual(
      ["certifications", "education", "experience", "featuredProjects", "interests", "profile", "skills", "story", "timeline"].sort()
    );
  });
});

describe("SEO helpers", () => {
  it("builds a Person for JSON-LD from the store", () => {
    const ld = personJsonLd();
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe(profile.name);
    expect(ld.sameAs).toEqual(profile.links.filter((l) => l.id === "github" || l.id === "linkedin").map((l) => l.href));
    expect(ld.alumniOf.name).toBe(portfolio.education[0].institution);
  });

  it("keeps JSON-LD from closing its own <script> tag", () => {
    const out = jsonLdScript({ note: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).note).toBe("</script><script>alert(1)</script>");
  });

  it("has titles that name the person", () => {
    expect(seo.title).toContain(profile.name);
    expect(seo.shortTitle).toContain(profile.name);
  });
});
