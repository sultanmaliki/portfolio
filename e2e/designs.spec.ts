import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { portfolio } from "../src/data";
import { SECTION_IDS } from "../src/designs/sections";
import {
  DEFAULT_DESIGN,
  SHOW_PLANNED_DESIGNS,
  designPath,
  liveDesigns,
  plannedDesigns,
} from "../src/designs/registry";
import { load, scrollToSection } from "./helpers";

const { profile, experience, education, skills, featuredProjects } = portfolio;
const live = liveDesigns();
const planned = SHOW_PLANNED_DESIGNS ? plannedDesigns() : [];
const switcherVisible = live.length + planned.length > 1;

test.describe("design switcher", () => {
  test.skip(!switcherVisible, "nothing to switch to");

  test("lists every design and marks the current one", async ({ page }) => {
    await load(page);
    const launcher = page.getByRole("button", { name: /Designs/ });
    await expect(launcher).toBeVisible();
    await expect(launcher).toHaveAttribute("aria-expanded", "false");
    await launcher.click();
    await expect(launcher).toHaveAttribute("aria-expanded", "true");

    const panel = page.getByRole("region", { name: "Portfolio designs" });
    await expect(panel).toBeVisible();

    const available = panel.getByRole("list", { name: "Available designs" });
    await expect(available.getByRole("link")).toHaveCount(live.length);
    await expect(available.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(available.getByRole("link", { name: new RegExp(live[0].name) })).toHaveAttribute("aria-current", "page");

    if (planned.length > 0) {
      const soon = panel.getByRole("list", { name: "Coming soon" });
      await expect(soon.getByRole("listitem")).toHaveCount(planned.length);
      // planned designs must not be reachable: no links, no buttons
      await expect(soon.getByRole("link")).toHaveCount(0);
      await expect(soon.getByRole("button")).toHaveCount(0);
    }
    for (const design of [...live, ...planned]) await expect(panel).toContainText(design.name);
  });

  test("Escape closes the panel and returns focus to the button", async ({ page }) => {
    await load(page);
    const launcher = page.getByRole("button", { name: /Designs/ });
    await launcher.click();
    const panel = page.getByRole("region", { name: "Portfolio designs" });
    await expect(panel).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(launcher).toBeFocused();
    await expect(launcher).toHaveAttribute("aria-expanded", "false");
  });

  test("clicking elsewhere closes the panel", async ({ page }) => {
    await load(page);
    await page.getByRole("button", { name: /Designs/ }).click();
    const panel = page.getByRole("region", { name: "Portfolio designs" });
    await expect(panel).toBeVisible();
    const viewport = page.viewportSize()!;
    await page.mouse.click(viewport.width - 8, 8);
    await expect(panel).toHaveCount(0);
  });

  test("panel stays inside the viewport", async ({ page }) => {
    await load(page);
    await page.getByRole("button", { name: /Designs/ }).click();
    const box = await page.getByRole("region", { name: "Portfolio designs" }).boundingBox();
    const viewport = page.viewportSize()!;
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
  });

  test("carries the visitor to the same section of the next design", async ({ page }) => {
    const [from, to] = live.filter((d) => d.slug !== DEFAULT_DESIGN);
    test.skip(!from || !to, "needs two designs besides the default");
    await load(page, designPath(from!.slug));
    await scrollToSection(page, "projects");
    await page.getByRole("button", { name: /Designs/ }).click();
    await page.getByRole("link", { name: new RegExp(to!.name) }).click();
    await expect(page).toHaveURL(new RegExp(`${designPath(to!.slug)}#projects$`));
    await expect.poll(() => page.evaluate(() => document.getElementById("projects")!.getBoundingClientRect().top), { timeout: 10_000 }).toBeLessThan(500);
  });

  test("steps to the next and previous design", async ({ page }) => {
    await load(page);
    const open = () => page.getByRole("button", { name: /Designs/ }).click();
    await open();
    await page.getByRole("button", { name: "Next design" }).click();
    await expect(page).toHaveURL(new RegExp(`${designPath(live[1].slug)}$`));
    await open();
    await page.getByRole("button", { name: "Previous design" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("Surprise me opens a different design", async ({ page }) => {
    await load(page);
    await page.getByRole("button", { name: /Designs/ }).click();
    await page.getByRole("button", { name: "Surprise me" }).click();
    await expect(page).toHaveURL(/\/designs\/[a-z0-9-]+\/$/);
    await expect(page.locator(`[data-design="${DEFAULT_DESIGN}"]`)).toHaveCount(0);
  });

  for (const design of live.filter((d) => d.slug !== DEFAULT_DESIGN)) {
    test(`switches to ${design.name} and back`, async ({ page }) => {
      await load(page);
      await page.getByRole("button", { name: /Designs/ }).click();
      await page.getByRole("link", { name: new RegExp(design.name) }).click();
      await expect(page).toHaveURL(new RegExp(`${designPath(design.slug)}$`));
      await expect(page).toHaveTitle(new RegExp(design.name));
      await expect(page.locator(`[data-design="${design.slug}"]`)).toBeVisible();

      await page.getByRole("button", { name: /Designs/ }).click();
      await page.getByRole("link", { name: new RegExp(live[0].name) }).click();
      await expect(page).toHaveURL(/\/$/);
      await expect(page.locator(`[data-design="${DEFAULT_DESIGN}"]`)).toBeAttached();
    });
  }
});

// The portfolio contract (docs/DESIGNS.md). Runs for every live design, so a new design is
// checked the moment it is registered.
for (const design of live) {
  test.describe(`${design.name} design contract`, () => {
    const path = designPath(design.slug);

    test("shows all of the content", async ({ page }) => {
      const problems = await load(page, path);
      await expect(page.locator(`[data-design="${design.slug}"]`)).toBeAttached();
      const text = (await page.locator("body").evaluate((el) => el.textContent ?? "")).replace(/\s+/g, " ").toLowerCase();
      const has = (value: string) => text.includes(value.replace(/\s+/g, " ").toLowerCase());

      const missing = [
        profile.name,
        profile.availability.status,
        profile.email,
        profile.location.city,
        ...featuredProjects.map((p) => p.title),
        ...experience.flatMap((e) => [e.role, e.company]),
        ...education.map((e) => e.degree),
        ...skills.flatMap((c) => c.items),
      ].filter((value) => !has(value));

      expect(missing, "content missing from the page").toEqual([]);
      expect(problems).toEqual([]);
    });

    test("has one h1 with the name and a main landmark", async ({ page }) => {
      await load(page, path);
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toHaveCount(1);
      await expect(h1).toContainText(profile.name, { ignoreCase: true });
      await expect(page.getByRole("main")).toHaveCount(1);
    });

    test("opens the resume reader and links to the email", async ({ page }) => {
      await load(page, path);
      await page.getByRole("link", { name: /^Resume$/ }).first().click();
      const reader = page.getByRole("dialog", { name: "Resume" });
      await expect(reader.locator("canvas").first()).toBeVisible({ timeout: 20_000 });
      await page.keyboard.press("Escape");
      await expect(reader).toHaveCount(0);
      await expect(page.locator(`a[href="mailto:${profile.email}"]`).first()).toBeAttached();
    });

    test("never scrolls sideways", async ({ page }) => {
      await load(page, path);
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y <= total; y += 1600) {
        await page.evaluate((y) => window.scrollTo(0, y), y);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `overflow at scrollY=${y}`).toBe(0);
      }
    });

    test("provides every section anchor exactly once", async ({ page }) => {
      await load(page, path);
      for (const id of SECTION_IDS) await expect(page.locator(`#${id}`), `#${id}`).toHaveCount(1);
    });

    // Reduced motion is emulated so reveal animations are already settled and axe sees final colours.
    test("passes the automated accessibility checks (WCAG 2.1 A and AA)", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await load(page, path);
      await page.waitForTimeout(600);
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      const summary = violations.map(
        (v) => `${v.id} [${v.impact}] x${v.nodes.length}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`
      );
      expect(summary).toEqual([]);
    });

    test("leaves nothing looping when the visitor prefers reduced motion", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await load(page, path);
      await page.waitForTimeout(600);
      const looping = await page.evaluate(() =>
        document
          .getAnimations()
          .filter((a) => a.playState === "running" && a.effect?.getComputedTiming().iterations === Infinity)
          .map((a) => (a instanceof CSSAnimation ? a.animationName : a.id || "animation"))
      );
      expect(looping).toEqual([]);
    });
  });
}
