import { expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_DESIGN } from "../src/designs/registry";

/** The secret word is read from each egg's own source, so the tests can never drift from the code. */
const source = (slug: string) =>
  readFileSync(join(process.cwd(), slug === DEFAULT_DESIGN ? "src/designs/cinematic/KonamiCode.tsx" : `src/designs/${slug}/Egg.tsx`), "utf8");

export const wordOf = (slug: string) => source(slug).match(/useEasterEgg\(\{[^}]*word: "([a-z]+)"/)![1];

export const eggOf = (page: Page, slug: string) => page.locator(`[data-egg="${slug}"]`);

/** Types the secret word until the egg opens (the page may not have hydrated on the first try). */
export const openEgg = (page: Page, slug: string) =>
  expect(async () => {
    await page.keyboard.type(wordOf(slug), { delay: 15 });
    await expect(eggOf(page, slug)).toHaveCount(1, { timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
