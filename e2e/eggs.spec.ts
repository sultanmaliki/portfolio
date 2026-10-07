import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { DEFAULT_DESIGN, designPath, liveDesigns } from "../src/designs/registry";
import { OPEN_LINK_EVENT } from "../src/lib/links";
import { eggOf, openEgg, wordOf } from "./egg-helpers";
import { load } from "./helpers";

/**
 * Every design hides its own easter egg: a small game or toy in that design's character, opened by a secret word (or
 * five quick taps on the name, for touch screens). What every egg must do, however it plays: stay hidden until asked,
 * open as a proper dialog (named, focus moves in and stays in, Esc and a Close button leave and focus goes back), fit
 * the screen, pass axe, and never run by itself under reduced motion. What each one does when played is in
 * eggs-play.spec.ts.
 */

const live = liveDesigns();

const infiniteAnimations = (page: Page) =>
  page.evaluate(() => document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations === Infinity).length);

const insideDialog = (page: Page) => page.evaluate(() => !!document.querySelector("[data-egg]")?.contains(document.activeElement));

for (const design of live) {
  test.describe(`${design.name} easter egg`, () => {
    test("stays hidden until the secret word, then opens as a labelled dialog that fits the screen", async ({ page }) => {
      const problems = await load(page, designPath(design.slug));
      await expect(page.locator("[data-egg]")).toHaveCount(0);

      await openEgg(page, design.slug);
      const egg = eggOf(page, design.slug);
      await expect(egg).toHaveAttribute("role", "dialog");
      await expect(egg).toHaveAttribute("aria-modal", "true");
      expect(((await egg.getAttribute("aria-label")) ?? "").trim().length).toBeGreaterThan(2);
      await expect(page.locator(`main[data-design="${design.slug}"]`)).toHaveAttribute("data-egg-active", /\w+/);

      // focus has moved inside, and there is a Close control that is on screen
      await expect.poll(() => insideDialog(page)).toBe(true);
      const close = egg.locator("[data-egg-close]");
      await expect(close).toBeVisible();
      const box = (await close.boundingBox())!;
      const view = page.viewportSize()!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(view.width + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(view.height + 1);

      // nothing makes the page or the dialog scroll sideways
      const widths = await page.evaluate(() => {
        const dialog = document.querySelector("[data-egg]") as HTMLElement;
        return { page: document.documentElement.scrollWidth, inner: window.innerWidth, dialog: dialog.scrollWidth, shown: dialog.clientWidth };
      });
      expect(widths.page).toBeLessThanOrEqual(widths.inner);
      expect(widths.dialog).toBeLessThanOrEqual(widths.shown + 1);

      // axe, without contrast: some eggs dim or restyle the page behind them on purpose
      const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(results.violations.map((v) => v.id)).toEqual([]);

      // Esc leaves, the page is as it was, and focus is back where it was
      await page.keyboard.press("Escape");
      await expect(egg).toHaveCount(0);
      await expect(page.locator("[data-egg-active]")).toHaveCount(0);
      expect(await insideDialog(page)).toBe(false);
      expect(problems).toEqual([]);
    });

    test("keeps keyboard focus inside while it is open", async ({ page }) => {
      await load(page, designPath(design.slug));
      await openEgg(page, design.slug);
      for (let i = 0; i < 14; i++) {
        await page.keyboard.press(i % 5 === 4 ? "Shift+Tab" : "Tab");
        expect(await insideDialog(page)).toBe(true);
      }
    });

    test("closes with its Close button", async ({ page }) => {
      await load(page, designPath(design.slug));
      await openEgg(page, design.slug);
      await eggOf(page, design.slug).locator("[data-egg-close]").click();
      await expect(eggOf(page, design.slug)).toHaveCount(0);
      await expect(page.locator("[data-egg-active]")).toHaveCount(0);
    });

    test("works without a keyboard: five quick taps on the name", async ({ page }) => {
      await load(page, designPath(design.slug));
      await expect(async () => {
        for (let i = 0; i < 5; i++) await page.locator("h1").first().dispatchEvent("click");
        await expect(eggOf(page, design.slug)).toHaveCount(1, { timeout: 1_000 });
      }).toPass({ timeout: 15_000 });
    });

    test("opens under reduced motion with nothing running by itself", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      const problems = await load(page, designPath(design.slug));
      await openEgg(page, design.slug);
      await page.waitForTimeout(400);
      expect(await infiniteAnimations(page)).toBe(0);
      const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: window.innerWidth }));
      expect(width.scroll).toBeLessThanOrEqual(width.inner);
      expect(problems).toEqual([]);
    });
  });
}

test("the Konami code opens the Cinematic trailer too", async ({ page }) => {
  await load(page, designPath(DEFAULT_DESIGN));
  await expect(async () => {
    for (const key of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]) await page.keyboard.press(key);
    await expect(eggOf(page, DEFAULT_DESIGN)).toHaveCount(1, { timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
});

test("an egg does not go off while a viewer is open", async ({ page }) => {
  await load(page, designPath("swiss"));
  await expect(async () => {
    await page.evaluate((name) => window.dispatchEvent(new CustomEvent(name, { detail: { url: "https://github.com/sultanmaliki/LinkedOut" } })), OPEN_LINK_EVENT);
    await expect(page.locator("[data-viewer]")).toHaveCount(1, { timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
  await page.keyboard.type(wordOf("swiss"), { delay: 15 });
  await expect(page.locator("[data-egg]")).toHaveCount(0);
});

test("typing in a field never sets an egg off", async ({ page }) => {
  await load(page, designPath("swiss"));
  await page.evaluate(() => {
    const input = document.createElement("input");
    input.id = "scratch";
    document.body.append(input);
  });
  await page.locator("#scratch").focus();
  await page.keyboard.type(wordOf("swiss"), { delay: 15 });
  await expect(page.locator("[data-egg]")).toHaveCount(0);
});

test("typing inside a running egg does not start another", async ({ page }) => {
  await load(page, designPath("cybercore"));
  await openEgg(page, "cybercore");
  await page.getByLabel("Terminal command").fill("");
  await page.keyboard.type("sudo");
  await expect(page.locator("[data-egg]")).toHaveCount(1);
});

test("every design has its own secret word", () => {
  const words = live.map((d) => wordOf(d.slug));
  expect(new Set(words).size).toBe(live.length);
});
