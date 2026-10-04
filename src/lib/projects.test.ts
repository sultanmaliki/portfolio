import { describe, expect, it } from "vitest";
import type { FeaturedProject } from "@/data/projects";
import type { Repo } from "./github";
import { splitFeatured } from "./projects";

const repo = (name: string): Repo => ({
  name,
  description: "d",
  html_url: `https://github.com/someone/${name}`,
  homepage: null,
  language: null,
  topics: [],
  stargazers_count: 0,
  pushed_at: "2026-01-01T00:00:00Z",
});

const project = (name: string): FeaturedProject => ({
  repo: name,
  title: name,
  kind: "k",
  summary: "s",
  highlights: ["h"],
  stack: ["x"],
});

describe("splitFeatured", () => {
  it("returns featured entries in the curated order and everything else as 'others'", () => {
    const { featured, others } = splitFeatured([repo("a"), repo("b"), repo("c")], [project("c"), project("a")]);
    expect(featured.map((f) => f.repo.name)).toEqual(["c", "a"]);
    expect(others.map((r) => r.name)).toEqual(["b"]);
  });

  it("matches repo names case-insensitively", () => {
    const { featured } = splitFeatured([repo("LinkedOut")], [project("linkedout")]);
    expect(featured).toHaveLength(1);
  });

  it("drops a featured project whose repo is no longer public, instead of leaving an orphan card", () => {
    const { featured, others } = splitFeatured([repo("a")], [project("gone"), project("a")]);
    expect(featured.map((f) => f.project.repo)).toEqual(["a"]);
    expect(others).toEqual([]);
  });

  it("handles an empty repo list", () => {
    expect(splitFeatured([], [project("a")])).toEqual({ featured: [], others: [] });
  });
});
