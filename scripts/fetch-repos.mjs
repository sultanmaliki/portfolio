// Build-time snapshot of the public GitHub repos shown in the Projects section.
// Runs as `prebuild`. Never fails the build: on any error the existing repos.json is kept.
//
// Deliberately self-contained plain JS (no imports from src/) so it works on any Node
// version a host's build image ships with. Keep USERNAME / EXCLUDED_REPOS and the filter in
// sync with src/data/config.ts and src/lib/github.ts.
import { mkdir, readFile, writeFile } from "node:fs/promises";

const USERNAME = "sultanmaliki";
const EXCLUDED_REPOS = new Set([USERNAME, "portfolio"].map((n) => n.toLowerCase()));
const ENDPOINT = `https://api.github.com/users/${USERNAME}/repos?type=owner&sort=pushed&per_page=100`;
const OUT_FILE = new URL("../src/data/repos.json", import.meta.url);

const pick = (repo) => ({
  name: repo.name,
  description: repo.description ?? null,
  html_url: repo.html_url,
  homepage: repo.homepage || null,
  language: repo.language ?? null,
  topics: Array.isArray(repo.topics) ? repo.topics : [],
  stargazers_count: repo.stargazers_count ?? 0,
  pushed_at: repo.pushed_at,
});

const keep = (repo) =>
  repo &&
  typeof repo.name === "string" &&
  !repo.fork &&
  !repo.archived &&
  typeof repo.description === "string" &&
  repo.description.trim() !== "" &&
  !EXCLUDED_REPOS.has(repo.name.toLowerCase());

// A repo's homepage field can outlive the deployment it points at (e.g. a deleted Vercel project),
// which would put a dead "Live demo" link on the site. Anything that answers 404/410/5xx or does not
// resolve is dropped from the snapshot; 401/403/429 count as alive (bot protection, rate limits).
async function isReachable(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(10_000),
        headers: { "User-Agent": `${USERNAME}-portfolio-build` },
      });
      return res.status < 400 || [401, 403, 429].includes(res.status);
    } catch {
      // network error or timeout: try once more before giving up
    }
  }
  return false;
}

async function dropDeadHomepages(repos) {
  await Promise.all(
    repos.map(async (repo) => {
      if (!repo.homepage) return;
      if (!/^https?:\/\//i.test(repo.homepage) || !(await isReachable(repo.homepage))) {
        console.warn(`[fetch-repos] dropping unreachable homepage for ${repo.name}: ${repo.homepage}`);
        repo.homepage = null;
      }
    })
  );
  return repos;
}

async function readExisting() {
  try {
    return await readFile(OUT_FILE, "utf8");
  } catch {
    return null;
  }
}

async function main() {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": `${USERNAME}-portfolio-build`,
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(ENDPOINT, { headers, signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`GitHub API responded ${res.status} ${res.statusText}`);
  const payload = await res.json();
  if (!Array.isArray(payload)) throw new Error("Unexpected GitHub API response shape");

  const repos = await dropDeadHomepages(payload.filter(keep).map(pick));
  const next = JSON.stringify(repos, null, 2) + "\n";
  const existing = await readExisting();
  if (existing === next) {
    console.log("[fetch-repos] repos.json already up to date");
    return;
  }
  await mkdir(new URL("./", OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, next);
  console.log(`[fetch-repos] wrote ${JSON.parse(next).length} repos to src/data/repos.json`);
}

try {
  await main();
} catch (error) {
  console.warn(`[fetch-repos] ${error instanceof Error ? error.message : error}; keeping existing repos.json`);
  // The app imports this file, so make sure one exists even on a first-ever failure.
  if ((await readExisting()) === null) {
    await mkdir(new URL("./", OUT_FILE), { recursive: true });
    await writeFile(OUT_FILE, "[]\n");
  }
}
