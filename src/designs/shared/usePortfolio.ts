"use client";

import { useMemo, type AnchorHTMLAttributes } from "react";
import { portfolio, type ContactLink } from "@/data";
import { safeHomepage, type Repo } from "@/lib/github";
import { linkHandler } from "@/lib/links";
import { RESUME_URL, handleResumeClick } from "@/lib/resume";
import { useCopy } from "@/lib/useCopy";
import { useRepos } from "@/lib/useRepos";

/**
 * Everything a design needs to render the portfolio, already wired up: content from "@/data",
 * GitHub projects from `useRepos()`, and ready-made anchor props so every link behaves the same
 * in every design (the resume opens in the in-page reader, repos and demos open in the link viewer,
 * modified clicks and no-JS visitors still get the plain link).
 *
 *   const { profile, projects, resume } = usePortfolio();
 *   <a {...resume} className={styles.button}>Resume</a>
 */

export type LinkProps = Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick" | "target" | "rel">;

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export const resumeLink = (): LinkProps => ({ href: RESUME_URL, onClick: handleResumeClick, ...external });

export const emailLink = (): LinkProps => ({ href: `mailto:${portfolio.profile.email}` });

export const repoLink = (repo: Repo): LinkProps => ({
  href: repo.html_url,
  onClick: linkHandler({ url: repo.html_url, repo }),
  ...external,
});

/** The live demo of a repo (its GitHub homepage), or null when it has none or it is unsafe. */
export const demoLink = (title: string, repo: Repo): LinkProps | null => {
  const href = safeHomepage(repo.homepage);
  if (!href) return null;
  return { href, onClick: linkHandler({ url: href, embed: true, title: `${title} live demo`, repo }), ...external };
};

/** GitHub, LinkedIn, email and resume links from `profile.links`. */
export const profileLink = (link: ContactLink): LinkProps => {
  if (link.id === "email") return { href: link.href };
  if (link.id === "resume") return resumeLink();
  return {
    href: link.href,
    onClick: link.preview ? linkHandler({ url: link.href, ...link.preview }) : undefined,
    ...external,
  };
};

/** "Sep 2026" from a GitHub timestamp. */
export const monthYear = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

export { SECTION_IDS, type SectionId } from "../sections";

export function usePortfolio() {
  const { featured, others, refreshing } = useRepos();
  const { copied, copy } = useCopy();

  const projects = useMemo(
    () => featured.map(({ project, repo }) => ({ ...project, repo, code: repoLink(repo), demo: demoLink(project.title, repo) })),
    [featured]
  );
  const moreRepos = useMemo(() => others.map((repo) => ({ repo, link: repoLink(repo) })), [others]);

  return {
    ...portfolio,
    projects,
    moreRepos,
    refreshing,
    copied,
    copy,
    resume: resumeLink(),
    mail: emailLink(),
    contactLinks: portfolio.profile.links.map((link) => ({ ...link, props: profileLink(link) })),
  };
}

export type PortfolioView = ReturnType<typeof usePortfolio>;
