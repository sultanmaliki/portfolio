"use client";

import { useEffect, useMemo, useState } from "react";
import snapshot from "@/data/repos.json";
import { featuredProjects } from "@/data/projects";
import { REPOS_ENDPOINT, parseRepos, sortRepos, withVerifiedHomepages, type Repo } from "@/lib/github";
import { splitFeatured } from "@/lib/projects";

const CACHE_KEY = "portfolio:github-repos:v1";
const CACHE_TTL_MS = 10 * 60 * 1000;

// Build-time snapshot, validated with the same parser the live refresh uses.
const SNAPSHOT: Repo[] = sortRepos(parseRepos(snapshot) ?? []);

function readCache(): Repo[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: unknown = JSON.parse(raw);
    if (typeof cached !== "object" || cached === null) return null;
    const { savedAt, repos } = cached as { savedAt?: unknown; repos?: unknown };
    if (typeof savedAt !== "number" || Date.now() - savedAt > CACHE_TTL_MS) return null;
    return parseRepos(repos);
  } catch {
    return null;
  }
}

function writeCache(repos: Repo[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), repos }));
  } catch {
    // Storage can be unavailable (private mode, quota); the cache is optional.
  }
}

/** Resolves to fresh repos, or null when we should silently keep what we have. */
async function loadLiveRepos(signal: AbortSignal): Promise<Repo[] | null> {
  const cached = readCache();
  if (cached) return cached;
  try {
    const res = await fetch(REPOS_ENDPOINT, {
      headers: { Accept: "application/vnd.github+json" },
      signal,
    });
    if (!res.ok) return null; // rate-limited (60/hr per IP) or GitHub down
    const repos = parseRepos(await res.json());
    if (repos) writeCache(repos);
    return repos;
  } catch {
    return null;
  }
}

/**
 * The GitHub projects for any design. Starts from the build-time snapshot (so the first paint is
 * complete), then swaps in live data; any failure keeps the snapshot.
 *
 * - `featured`: the curated entries from "@/data/projects", paired with their repo
 * - `others`: every remaining public repo
 * - `refreshing`: true until the live refresh has settled
 */
export function useRepos() {
  const [repos, setRepos] = useState<Repo[]>(SNAPSHOT);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    loadLiveRepos(controller.signal).then((live) => {
      if (controller.signal.aborted) return;
      if (live) setRepos(sortRepos(withVerifiedHomepages(live, SNAPSHOT)));
      setRefreshing(false);
    });
    return () => controller.abort();
  }, []);

  const { featured, others } = useMemo(() => splitFeatured(repos, featuredProjects), [repos]);
  return { repos, featured, others, refreshing };
}
