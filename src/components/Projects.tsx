"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, GitBranch, Star } from "lucide-react";
import snapshot from "@/data/repos.json";
import { GITHUB_USERNAME } from "@/data/config";
import { REPOS_ENDPOINT, parseRepos, safeHomepage, sortRepos, type Repo } from "@/lib/github";

const CACHE_KEY = "portfolio:github-repos:v1";
const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_TOPICS = 5;
const PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

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

const formatPushed = (iso: string) =>
  new Date(iso).toLocaleDateString("en", { month: "short", year: "numeric", timeZone: "UTC" });

function RepoCard({ repo }: { repo: Repo }) {
  const homepage = safeHomepage(repo.homepage);
  const shownTopics = repo.topics.slice(0, MAX_TOPICS);
  const hiddenTopics = repo.topics.length - shownTopics.length;

  return (
    <li className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-colors duration-300 focus-within:border-[#6EA8FF]/60 hover:border-[#6EA8FF]/40 md:p-8">
      <div>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="min-w-0 break-words text-xl font-semibold tracking-tight text-white md:text-2xl">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded transition-colors hover:text-[#6EA8FF]"
            >
              {repo.name}
            </a>
          </h3>
          <div className="flex shrink-0 items-center gap-3 text-[#F5F5F5]/70">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${repo.name} source on GitHub`}
              className="rounded transition-colors hover:text-[#6EA8FF]"
            >
              <GitBranch size={20} aria-hidden />
            </a>
            {homepage && (
              <a
                href={homepage}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${repo.name} live site`}
                className="rounded transition-colors hover:text-[#6EA8FF]"
              >
                <ArrowUpRight size={20} aria-hidden />
              </a>
            )}
          </div>
        </div>

        <p className="mb-6 font-light leading-relaxed text-[#F5F5F5]/70 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] overflow-hidden">
          {repo.description ?? "No description yet."}
        </p>
      </div>

      <div className="space-y-4">
        {shownTopics.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Topics">
            {shownTopics.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs font-medium text-[#F5F5F5]/80"
              >
                {topic}
              </li>
            ))}
            {hiddenTopics > 0 && (
              <li className="px-1 py-1 text-xs text-[#F5F5F5]/60">+{hiddenTopics} more</li>
            )}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[#F5F5F5]/60">
          {repo.language && (
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#6EA8FF]" />
              {repo.language}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Star size={14} aria-hidden />
            <span aria-hidden>{repo.stargazers_count}</span>
            <span className="sr-only">
              {repo.stargazers_count} {repo.stargazers_count === 1 ? "star" : "stars"}
            </span>
          </span>
          <span>Updated {formatPushed(repo.pushed_at)}</span>
        </div>
      </div>
    </li>
  );
}

function SkeletonCard() {
  return (
    <li
      aria-hidden
      className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"
    >
      <div className="mb-6 h-7 w-2/5 rounded bg-white/10" />
      <div className="mb-2 h-4 w-full rounded bg-white/10" />
      <div className="mb-2 h-4 w-11/12 rounded bg-white/10" />
      <div className="mb-8 h-4 w-3/5 rounded bg-white/10" />
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-full bg-white/10" />
        <div className="h-6 w-20 rounded-full bg-white/10" />
        <div className="h-6 w-14 rounded-full bg-white/10" />
      </div>
    </li>
  );
}

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>(SNAPSHOT);
  const [refreshing, setRefreshing] = useState(true);

  // Replace the build-time snapshot with live data. Any failure keeps the snapshot.
  useEffect(() => {
    const controller = new AbortController();
    loadLiveRepos(controller.signal).then((live) => {
      if (controller.signal.aborted) return;
      if (live) setRepos(sortRepos(live));
      setRefreshing(false);
    });
    return () => controller.abort();
  }, []);

  const showSkeleton = refreshing && repos.length === 0;

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative z-20 bg-[#121212] px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 id="projects-heading" className="mb-4 text-4xl font-light tracking-tight text-white md:text-5xl">
            Straight from my GitHub.
          </h2>
          <p className="max-w-2xl text-lg font-light text-[#F5F5F5]/70 md:text-xl">
            Everything I&apos;ve made public, kept in sync automatically. New repos show up here on their own.
          </p>
        </motion.div>

        {showSkeleton ? (
          <ul aria-busy="true" aria-label="Loading projects" className="grid list-none grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {Array.from({ length: 4 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </ul>
        ) : repos.length > 0 ? (
          <ul
            aria-busy={refreshing}
            aria-label="GitHub projects"
            className="grid list-none grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
          >
            {repos.map((repo) => (
              <RepoCard key={repo.name} repo={repo} />
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md md:p-12">
            <p className="mb-6 text-lg font-light text-[#F5F5F5]/70">
              Nothing public to show right now.
            </p>
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-[#F5F5F5]"
            >
              <GitBranch size={16} aria-hidden />
              Visit github.com/{GITHUB_USERNAME}
            </a>
          </div>
        )}

        {repos.length > 0 && (
          <p className="mt-10 text-sm text-[#F5F5F5]/60">
            More on{" "}
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded underline underline-offset-4 transition-colors hover:text-white"
            >
              github.com/{GITHUB_USERNAME}
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
