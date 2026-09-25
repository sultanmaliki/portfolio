/** GitHub account whose public repositories are shown in the Projects section. */
export const GITHUB_USERNAME = "sultanmaliki";

/**
 * Repos that are never listed: the profile README repo and this site's own repo
 * (its pushed_at changes on every sync commit, which would keep repos.json dirty).
 * Keep in sync with EXCLUDED_REPOS in scripts/fetch-repos.mjs.
 */
export const EXCLUDED_REPOS: readonly string[] = [GITHUB_USERNAME, "portfolio"];

/** Repo names to pin first, in this order. Everything else follows by last push. */
export const featured: readonly string[] = [];

/** Public contact address shown in the Contact section (with a copy button). */
export const CONTACT_EMAIL = "ssultanmaliki47@gmail.com";
