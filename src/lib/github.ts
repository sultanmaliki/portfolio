import { EXCLUDED_REPOS, GITHUB_USERNAME, featured } from "@/data/config";

/** The subset of the GitHub repo payload the site actually uses. */
export interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  pushed_at: string;
}

export const REPOS_ENDPOINT = `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=pushed&per_page=100`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const nullableString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() !== "" ? value : null;

/**
 * Validates a raw GitHub API payload and applies the site's filter: no forks, no archived
 * repos, nothing in EXCLUDED_REPOS, and nothing without a description (a bare card looks
 * unfinished). Returns null when the payload isn't a repo list at all (e.g. a rate-limit
 * error object), so callers can keep what they already have.
 * Keep the filter in sync with scripts/fetch-repos.mjs.
 */
export function parseRepos(payload: unknown): Repo[] | null {
  if (!Array.isArray(payload)) return null;

  const repos: Repo[] = [];
  for (const item of payload) {
    if (!isRecord(item)) continue;
    const { name, html_url, pushed_at, fork, archived } = item;
    if (typeof name !== "string" || typeof html_url !== "string" || typeof pushed_at !== "string") continue;
    if (fork === true || archived === true) continue;
    if (EXCLUDED_REPOS.some((excluded) => excluded.toLowerCase() === name.toLowerCase())) continue;
    if (nullableString(item.description) === null) continue;

    repos.push({
      name,
      description: nullableString(item.description),
      html_url,
      homepage: nullableString(item.homepage),
      language: nullableString(item.language),
      topics: Array.isArray(item.topics) ? item.topics.filter((t): t is string => typeof t === "string") : [],
      stargazers_count: typeof item.stargazers_count === "number" ? item.stargazers_count : 0,
      pushed_at,
    });
  }
  return repos;
}

/** Featured repos first (in the order listed in config), then most recently pushed. */
export function sortRepos(repos: readonly Repo[]): Repo[] {
  const rank = (repo: Repo) => {
    const i = featured.findIndex((name) => name.toLowerCase() === repo.name.toLowerCase());
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...repos].sort(
    (a, b) => rank(a) - rank(b) || Date.parse(b.pushed_at) - Date.parse(a.pushed_at)
  );
}

/** Only ever link to http(s) URLs; a homepage field can hold arbitrary text. */
export function safeHomepage(homepage: string | null): string | null {
  if (!homepage) return null;
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(homepage) ? homepage : `https://${homepage}`;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

/**
 * The browser-side refresh comes straight from the GitHub API, but the build-time snapshot has
 * already dropped homepages that no longer respond. For repos the snapshot knows, keep its
 * (verified) homepage; homepages of repos it has never seen are trusted until the next sync.
 */
export function withVerifiedHomepages(live: readonly Repo[], snapshot: readonly Repo[]): Repo[] {
  const verified = new Map(snapshot.map((r) => [r.name.toLowerCase(), r.homepage]));
  return live.map((r) => (verified.has(r.name.toLowerCase()) ? { ...r, homepage: verified.get(r.name.toLowerCase()) ?? null } : r));
}
