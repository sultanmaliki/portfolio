import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { DEFAULT_DESIGN, designPath, liveDesigns } from "../src/designs/registry";
import { OPEN_LINK_EVENT } from "../src/lib/links";
import { OPEN_RESUME_EVENT } from "../src/lib/resume";
import { load } from "./helpers";

/**
 * The browser window and the PDF reader are one shared implementation, themed per design. These tests walk every
 * design through every viewer state: the preview card, the embedded browser and the PDF reader. For each state
 * they check that the viewer carries the design's theme, passes axe, fits the screen, has tappable controls on a
 * phone and keeps keyboard focus inside the window. Further tests cover switching design while a viewer is open
 * and that no two designs share a look.
 */

const live = liveDesigns();
const DEMO = "https://linkedout.raifkarani.in";
const REPO = "https://github.com/sultanmaliki/LinkedOut";

test.beforeEach(async ({ page }) => {
  // The demo site is third-party: serve a stand-in so the embedded browser is tested without the network.
  await page.route(`${DEMO}/**`, (route) => route.fulfill({ contentType: "text/html", body: "<!doctype html><h1>Demo page</h1>" }));
});

// The viewers listen for window events, so they only react once the page has hydrated. Retry until one is listening.
const open = (page: Page, fire: () => Promise<unknown>, kind: string) =>
  expect(async () => {
    await fire();
    await expect(page.locator(`[data-viewer-kind="${kind}"]`)).toHaveCount(1, { timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
const openCard = (page: Page) =>
  open(page, () => page.evaluate(([name, url]) => window.dispatchEvent(new CustomEvent(name, { detail: { url } })), [OPEN_LINK_EVENT, REPO]), "card");
const openResume = (page: Page) => open(page, () => page.evaluate((name) => window.dispatchEvent(new Event(name)), OPEN_RESUME_EVENT), "pdf");

const switcherButton = (page: Page) => page.getByRole("button", { name: /Designs/ });

/** The values that make up a theme, as the browser resolved them. Two designs sharing all of them would look the same. */
const TOKENS = ["--vw-bg", "--vw-frame", "--vw-radius", "--vw-shadow", "--vw-scrim", "--vw-bar-bg", "--vw-btn-bg", "--vw-btn-radius", "--vw-btn-line", "--vw-title-bg", "--vw-font", "--vw-addr-bg", "--vw-pri-bg"];
const fingerprint = (page: Page) =>
  page.evaluate((tokens) => {
    const style = getComputedStyle(document.querySelector("[data-viewer]")!);
    return tokens.map((t) => style.getPropertyValue(t).trim()).join("|");
  }, TOKENS);

/** Entrance animations change opacity, which skews contrast results: wait until the viewer has settled. */
const settled = (page: Page) =>
  page.waitForFunction(() =>
    [...document.querySelectorAll("[data-viewer], [data-viewer] .vw-window")].every((el) => getComputedStyle(el).opacity === "1")
  );

async function checkAxe(page: Page) {
  await settled(page);
  const results = await new AxeBuilder({ page }).include("[data-viewer]").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

/** The window stays on screen and nothing in the toolbar spills out of it. On a phone every control is finger-sized. */
async function checkFit(page: Page) {
  const viewport = page.viewportSize()!;
  const box = await page.locator("[data-viewer] .vw-window").last().boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(-0.5);
  expect(box!.y).toBeGreaterThanOrEqual(-0.5);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 0.5);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height + 0.5);

  const overflow = await page.evaluate(() => {
    const out: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>("[data-viewer] .vw-toolbar, [data-viewer] .vw-status, [data-viewer] .vw-titlebar, [data-viewer] .vw-card")) {
      if (el.scrollWidth > el.clientWidth + 1) out.push(`${el.className} ${el.scrollWidth}>${el.clientWidth}`);
    }
    return out;
  });
  expect(overflow).toEqual([]);

  if (await page.evaluate(() => matchMedia("(pointer: coarse)").matches)) {
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("[data-viewer] .vw-btn")]
        .map((b) => ({ b, r: b.getBoundingClientRect() }))
        .filter(({ r }) => r.width > 0 && (r.width < 40 || r.height < 40))
        .map(({ b, r }) => `${b.getAttribute("aria-label") ?? b.textContent?.trim()} ${Math.round(r.width)}x${Math.round(r.height)}`)
    );
    expect(small).toEqual([]);
  }
}

/** Tab keeps going round inside the open viewer (and the design switcher, which stays reachable). */
async function checkFocusTrap(page: Page) {
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => !!document.activeElement?.closest("[data-viewer], [data-design-switcher]"));
    expect(inside, `focus escaped the viewer after ${i + 1} Tab presses`).toBe(true);
  }
}

for (const design of live) {
  test.describe(`${design.name} viewers`, () => {
    test("preview card, embedded browser and PDF reader", async ({ page }) => {
      const problems = await load(page, designPath(design.slug));
      const themed = page.locator(`[data-viewer][data-viewer-theme="${design.slug}"]`);

      await test.step("preview card", async () => {
        await openCard(page);
        const card = page.getByRole("dialog", { name: "Link preview" });
        await expect(card.getByRole("heading", { name: "LinkedOut" })).toBeVisible();
        await expect(themed).toHaveCount(1);
        await expect(card.getByRole("link", { name: /Open on GitHub/ })).toHaveAttribute("href", REPO);
        await checkAxe(page);
        await checkFit(page);
        await checkFocusTrap(page);
      });

      await test.step("embedded browser", async () => {
        await page.getByRole("button", { name: "Live demo" }).click();
        const browser = page.getByRole("dialog", { name: /Browser: linkedout\.raifkarani\.in/ });
        await expect(browser.getByRole("toolbar", { name: "Browser controls" })).toBeVisible();
        await expect(browser.frameLocator("iframe").getByRole("heading", { name: "Demo page" })).toBeVisible();
        await expect(themed).toHaveCount(1);
        await expect(browser.getByRole("link", { name: "Open in a new tab" }).first()).toHaveAttribute("target", "_blank");

        // reload fetches the page again
        const reloaded = page.waitForRequest(`${DEMO}/**`);
        await browser.getByRole("button", { name: "Reload page" }).click();
        await reloaded;
        await expect(browser.frameLocator("iframe").getByRole("heading", { name: "Demo page" })).toBeVisible();

        await checkAxe(page);
        await checkFit(page);

        await browser.getByRole("button", { name: "Back to preview" }).click();
        await expect(page.getByRole("dialog", { name: "Link preview" })).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.locator("[data-viewer]")).toHaveCount(0);
      });

      await test.step("PDF reader", async () => {
        await openResume(page);
        const reader = page.getByRole("dialog", { name: "Resume" });
        await expect(reader.locator("canvas").first()).toBeVisible({ timeout: 20_000 });
        await expect(themed).toHaveCount(1);
        await expect(reader.getByRole("toolbar", { name: "Resume controls" })).toBeVisible();

        const download = reader.getByRole("link", { name: /Download/ });
        await expect(download).toHaveAttribute("href", "/resume.pdf");
        await expect(download).toHaveAttribute("download", "Syed_Mohammed_Sultan_Resume.pdf");

        // zoom in and out
        const zoom = reader.getByRole("group", { name: "Zoom" });
        await expect(zoom).toContainText("100%");
        await zoom.getByRole("button", { name: "Zoom in" }).click();
        await expect(zoom).toContainText("125%");
        await zoom.getByRole("button", { name: "Zoom out" }).click();
        await zoom.getByRole("button", { name: "Zoom out" }).click();
        await expect(zoom).toContainText("75%");
        await zoom.getByRole("button", { name: "Zoom in" }).click();
        await expect(zoom).toContainText("100%");

        await checkAxe(page);
        await checkFit(page);
        await checkFocusTrap(page);

        await page.keyboard.press("Escape");
        await expect(page.locator("[data-viewer]")).toHaveCount(0);
      });

      expect(problems).toEqual([]);
    });

    test("restyles in place when the design changes", async ({ page }) => {
      const index = live.findIndex((d) => d.slug === design.slug);
      const next = live[(index + 1) % live.length];
      const problems = await load(page, designPath(design.slug));

      await openResume(page);
      const reader = page.getByRole("dialog", { name: "Resume" });
      await expect(reader.locator("canvas").first()).toBeVisible({ timeout: 20_000 });
      const before = await fingerprint(page);
      await expect(page.locator("[data-viewer]")).toHaveAttribute("data-viewer-theme", design.slug);

      // the switcher sits above the open viewer
      await switcherButton(page).click();
      await page.getByRole("button", { name: "Next design" }).click();
      await expect(page).toHaveURL(new RegExp(`${designPath(next.slug)}$`));

      // same window, new design
      await expect(page.locator("[data-viewer]")).toHaveCount(1);
      await expect(page.locator("[data-viewer]")).toHaveAttribute("data-viewer-theme", next.slug);
      await expect(reader.locator("canvas").first()).toBeVisible();
      expect(await fingerprint(page)).not.toBe(before);
      await checkAxe(page);

      // and the link viewer follows too, opened on top of the reader
      await openCard(page);
      await expect(page.locator(`[data-viewer-kind="card"][data-viewer-theme="${next.slug}"]`)).toHaveCount(1);
      await page.keyboard.press("Escape");
      await page.keyboard.press("Escape");
      await expect(page.locator("[data-viewer]")).toHaveCount(0);
      expect(problems).toEqual([]);
    });
  });
}

test("Esc closes the switcher first, then the viewer", async ({ page }) => {
  await load(page, designPath(DEFAULT_DESIGN));
  await openCard(page);
  await expect(page.getByRole("dialog", { name: "Link preview" })).toBeVisible();
  await switcherButton(page).click();
  const panel = page.getByRole("region", { name: "Portfolio designs" });
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: "Link preview" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-viewer]")).toHaveCount(0);
});

test("the preview card scrolls inside its window on a short screen", async ({ page }) => {
  // Landscape phones are barely 320px tall: the card is taller than that, so the card has to scroll, not run off the screen.
  await page.setViewportSize({ width: 568, height: 320 });
  await load(page, designPath(DEFAULT_DESIGN));
  await openCard(page);
  await settled(page);
  const card = page.locator("[data-viewer] .vw-card");
  expect(await card.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
  const box = await page.locator("[data-viewer] .vw-window").boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(320.5);
  await page.getByRole("button", { name: "Live demo" }).click({ timeout: 4_000 });
  await expect(page.getByRole("dialog", { name: /Browser: / })).toBeVisible();
});

test("clicking the scrim closes the viewer", async ({ page }) => {
  await load(page, designPath(DEFAULT_DESIGN));
  await openCard(page);
  const viewport = page.viewportSize()!;
  await page.mouse.click(viewport.width - 4, 4);
  await expect(page.locator("[data-viewer]")).toHaveCount(0);
});

test("every design gives the viewers a look of its own", async ({ page }) => {
  test.setTimeout(120_000);
  const seen = new Map<string, string>();
  for (const design of live) {
    await load(page, designPath(design.slug));
    await openCard(page);
    await expect(page.locator(`[data-viewer][data-viewer-theme="${design.slug}"]`)).toHaveCount(1);
    // the design's own fonts reach the viewer, which sits outside the design's root
    if (design.slug !== DEFAULT_DESIGN) expect(await page.locator("[data-viewer]").getAttribute("class")).toMatch(/variable/);
    const print = await fingerprint(page);
    const twin = seen.get(print);
    expect(twin, `${design.name} has the same viewer theme as ${twin}`).toBeUndefined();
    seen.set(print, design.name);
  }
  expect(seen.size).toBe(live.length);
});
