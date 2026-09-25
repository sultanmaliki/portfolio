import { describe, expect, it, vi } from "vitest";

// Pin "b" first, then the rest by recency.
vi.mock("@/data/config", () => ({
  GITHUB_USERNAME: "someone",
  EXCLUDED_REPOS: [],
  featured: ["b"],
}));

import { sortRepos, type Repo } from "./github";

const repo = (name: string, pushed_at: string): Repo => ({
  name,
  description: "d",
  html_url: `https://github.com/someone/${name}`,
  homepage: null,
  language: null,
  topics: [],
  stargazers_count: 0,
  pushed_at,
});

describe("sortRepos with featured repos", () => {
  it("puts featured repos first regardless of recency", () => {
    const sorted = sortRepos([repo("a", "2026-06-01T00:00:00Z"), repo("b", "2020-01-01T00:00:00Z"), repo("c", "2025-01-01T00:00:00Z")]);
    expect(sorted.map((r) => r.name)).toEqual(["b", "a", "c"]);
  });

  it("matches featured names case-insensitively", () => {
    const sorted = sortRepos([repo("a", "2026-06-01T00:00:00Z"), repo("B", "2020-01-01T00:00:00Z")]);
    expect(sorted[0].name).toBe("B");
  });
});
