import { expect, type Page } from "@playwright/test";

// GitHub's unauthenticated API is rate limited per IP; the site falls back to its build-time snapshot.
const IGNORED = /api\.github\.com|Failed to load resource/;

/** Loads a page and collects runtime problems for the test to assert on. */
export async function load(page: Page, path = "/") {
  const problems: string[] = [];
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !IGNORED.test(`${m.text()} ${m.location().url}`)) problems.push(`console: ${m.text()}`);
  });
  await page.goto(path);
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeAttached();
  return problems;
}

export const scrollToSection = (page: Page, id: string, offset = 0) =>
  page.evaluate(
    ([id, offset]) => {
      const el = document.getElementById(id as string)!;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + (offset as number));
    },
    [id, offset]
  );
