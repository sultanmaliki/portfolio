import { describe, expect, it } from "vitest";
import snapshot from "./repos.json";
import { education, certifications } from "./education";
import { experience } from "./experience";
import { featuredProjects } from "./projects";
import { parseRepos } from "@/lib/github";

const isHttps = (url: string) => {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
};

describe("featured projects", () => {
  it("are unique and complete", () => {
    const repos = featuredProjects.map((p) => p.repo.toLowerCase());
    expect(new Set(repos).size).toBe(repos.length);
    for (const p of featuredProjects) {
      expect(p.title.trim(), p.repo).not.toBe("");
      expect(p.summary.trim(), p.repo).not.toBe("");
      expect(p.highlights.length, `${p.repo} highlights`).toBeGreaterThan(0);
      expect(p.stack.length, `${p.repo} stack`).toBeGreaterThan(0);
    }
  });
});

describe("repos.json snapshot", () => {
  it("is a valid repo list that already satisfies the site's filter", () => {
    const parsed = parseRepos(snapshot);
    expect(parsed).not.toBeNull();
    // nothing in the committed snapshot should be something the parser would drop
    expect(parsed).toHaveLength((snapshot as unknown[]).length);
  });

  it("only links to github.com repos", () => {
    for (const repo of parseRepos(snapshot) ?? []) expect(repo.html_url).toMatch(/^https:\/\/github\.com\/sultanmaliki\//);
  });
});

describe("experience and education data", () => {
  it("has complete experience entries with https links", () => {
    expect(experience.length).toBeGreaterThan(0);
    for (const e of experience) {
      expect(e.role && e.company && e.period).toBeTruthy();
      expect(e.highlights.length).toBeGreaterThan(0);
      if (e.link) expect(isHttps(e.link.href), e.link.href).toBe(true);
    }
  });

  it("has complete education entries and named certifications", () => {
    for (const e of education) expect(e.degree && e.institution && e.period).toBeTruthy();
    for (const c of certifications) expect(c.name.trim()).not.toBe("");
  });
});
