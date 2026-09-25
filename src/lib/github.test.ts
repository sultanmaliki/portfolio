import { describe, expect, it } from "vitest";
import { parseRepos, safeHomepage, sortRepos, withVerifiedHomepages, type Repo } from "./github";

const raw = (over: Record<string, unknown> = {}) => ({
  name: "demo",
  description: "A demo project",
  html_url: "https://github.com/sultanmaliki/demo",
  homepage: null,
  language: "TypeScript",
  topics: ["next"],
  stargazers_count: 3,
  pushed_at: "2026-01-02T00:00:00Z",
  fork: false,
  archived: false,
  ...over,
});

const repo = (over: Partial<Repo> = {}): Repo => ({
  name: "demo",
  description: "A demo project",
  html_url: "https://github.com/sultanmaliki/demo",
  homepage: null,
  language: null,
  topics: [],
  stargazers_count: 0,
  pushed_at: "2026-01-02T00:00:00Z",
  ...over,
});

describe("parseRepos", () => {
  it("returns null for anything that is not a repo list (e.g. a rate-limit error object)", () => {
    expect(parseRepos({ message: "API rate limit exceeded" })).toBeNull();
    expect(parseRepos(null)).toBeNull();
    expect(parseRepos("nope")).toBeNull();
  });

  it("keeps a normal public repo and maps only the fields the site uses", () => {
    const [r] = parseRepos([raw()]) ?? [];
    expect(r).toEqual({
      name: "demo",
      description: "A demo project",
      html_url: "https://github.com/sultanmaliki/demo",
      homepage: null,
      language: "TypeScript",
      topics: ["next"],
      stargazers_count: 3,
      pushed_at: "2026-01-02T00:00:00Z",
    });
  });

  it("drops forks, archived repos, the profile repo and this site's repo", () => {
    const list = parseRepos([
      raw({ name: "kept" }),
      raw({ name: "a-fork", fork: true }),
      raw({ name: "old", archived: true }),
      raw({ name: "sultanmaliki" }),
      raw({ name: "Portfolio" }),
    ]);
    expect(list?.map((r) => r.name)).toEqual(["kept"]);
  });

  it("drops repos without a description, because a bare card looks unfinished", () => {
    const list = parseRepos([
      raw({ name: "described" }),
      raw({ name: "null-desc", description: null }),
      raw({ name: "blank-desc", description: "   " }),
      raw({ name: "missing-desc", description: undefined }),
    ]);
    expect(list?.map((r) => r.name)).toEqual(["described"]);
  });

  it("skips malformed entries instead of throwing", () => {
    const list = parseRepos([null, 42, { name: 1 }, raw({ name: "ok" }), { name: "x" }]);
    expect(list?.map((r) => r.name)).toEqual(["ok"]);
  });

  it("tolerates missing optional fields", () => {
    const [r] = parseRepos([raw({ topics: undefined, stargazers_count: undefined, language: undefined })]) ?? [];
    expect(r.topics).toEqual([]);
    expect(r.stargazers_count).toBe(0);
    expect(r.language).toBeNull();
  });
});

describe("sortRepos", () => {
  it("orders by most recent push and does not mutate its input", () => {
    const input = [
      repo({ name: "old", pushed_at: "2025-01-01T00:00:00Z" }),
      repo({ name: "new", pushed_at: "2026-06-01T00:00:00Z" }),
      repo({ name: "mid", pushed_at: "2025-09-01T00:00:00Z" }),
    ];
    const snapshot = [...input];
    expect(sortRepos(input).map((r) => r.name)).toEqual(["new", "mid", "old"]);
    expect(input).toEqual(snapshot);
  });
});

describe("safeHomepage", () => {
  it("returns null for empty values", () => {
    expect(safeHomepage(null)).toBeNull();
    expect(safeHomepage("")).toBeNull();
  });

  it("accepts http(s) URLs and adds https:// to bare hosts", () => {
    expect(safeHomepage("https://example.com/app")).toBe("https://example.com/app");
    expect(safeHomepage("http://example.com")).toBe("http://example.com/");
    expect(safeHomepage("example.com")).toBe("https://example.com/");
  });

  it("refuses dangerous or non-web schemes", () => {
    expect(safeHomepage("javascript:alert(1)")).toBeNull();
    expect(safeHomepage("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(safeHomepage("mailto:someone@example.com")).toBeNull();
    expect(safeHomepage("ftp://example.com")).toBeNull();
  });
});

describe("withVerifiedHomepages", () => {
  it("keeps the build-verified homepage for repos the snapshot knows, even if the API still lists a dead one", () => {
    const snapshot = [repo({ name: "QueryCraft-AI", homepage: null }), repo({ name: "LinkedOut", homepage: "https://ok.example/" })];
    const live = [repo({ name: "querycraft-ai", homepage: "https://dead.example/" }), repo({ name: "LinkedOut", homepage: "https://other.example/" })];
    const merged = withVerifiedHomepages(live, snapshot);
    expect(merged[0].homepage).toBeNull();
    expect(merged[1].homepage).toBe("https://ok.example/");
  });

  it("trusts the API homepage of a repo the snapshot has never seen", () => {
    const merged = withVerifiedHomepages([repo({ name: "brand-new", homepage: "https://new.example/" })], []);
    expect(merged[0].homepage).toBe("https://new.example/");
  });
});
