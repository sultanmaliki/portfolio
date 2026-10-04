import type { FeaturedProject } from "@/data/projects";
import type { Repo } from "@/lib/github";

export interface FeaturedEntry {
  project: FeaturedProject;
  repo: Repo;
}

/**
 * Splits the public repos into the curated featured projects (in the order they are listed in
 * "@/data/projects") and everything else. A featured entry only appears while its repo is still
 * public, so a deleted or private repo can never leave an orphan card behind.
 */
export function splitFeatured(
  repos: readonly Repo[],
  featuredProjects: readonly FeaturedProject[]
): { featured: FeaturedEntry[]; others: Repo[] } {
  const featured = featuredProjects.flatMap((project) => {
    const repo = repos.find((r) => r.name.toLowerCase() === project.repo.toLowerCase());
    return repo ? [{ project, repo }] : [];
  });
  const taken = new Set(featured.map(({ repo }) => repo.name));
  return { featured, others: repos.filter((r) => !taken.has(r.name)) };
}
