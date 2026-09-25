import { expect, test, type Page } from "@playwright/test";

// GitHub's unauthenticated API is rate limited per IP; the site falls back to its build-time snapshot.
const IGNORED = /api\.github\.com|Failed to load resource/;

/** Loads the page and collects runtime problems for the test to assert on. */
async function load(page: Page) {
  const problems: string[] = [];
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !IGNORED.test(`${m.text()} ${m.location().url}`)) problems.push(`console: ${m.text()}`);
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  return problems;
}

const scrollToSection = (page: Page, id: string, offset = 0) =>
  page.evaluate(([id, offset]) => {
    const el = document.getElementById(id as string)!;
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + (offset as number));
  }, [id, offset]);

test.describe("first impression", () => {
  test("states availability and offers the three key actions", async ({ page }) => {
    await load(page);
    await expect(page.getByText("Open to entry-level roles")).toBeVisible();
    await expect(page.getByRole("link", { name: "View projects" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Resume" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact" }).first()).toBeVisible();
  });

  test("has search and share metadata", async ({ page }) => {
    await load(page);
    await expect(page).toHaveTitle(/Syed Mohammed Sultan.*Full Stack Developer/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://portfolio.syedmohammedsultan.online/");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og\.jpg$/);
    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
    expect(ld.name).toBe("Syed Mohammed Sultan");
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  });

  test("has no horizontal overflow", async ({ page }) => {
    await load(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBe(0);
  });
});

test.describe("the whole page", () => {
  test("scrolls end to end without console or page errors", async ({ page }) => {
    const problems = await load(page);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 1400) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(40);
    }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);
    expect(problems).toEqual([]);
  });

  test("every in-page anchor points at a real section", async ({ page }) => {
    await load(page);
    const missing = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => (a as HTMLAnchorElement).hash.slice(1))
        .filter((id) => id && !document.getElementById(id))
    );
    expect(missing).toEqual([]);
  });

  test("static assets are served", async ({ request }) => {
    for (const [path, type] of [
      ["/resume.pdf", "application/pdf"],
      ["/og.jpg", "image/jpeg"],
      ["/apple-icon.png", "image/png"],
      ["/robots.txt", "text/plain"],
      ["/sitemap.xml", "xml"],
    ]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
      expect(res.headers()["content-type"], path).toContain(type);
    }
  });

  test("unknown URLs show the custom 404 page", async ({ page }) => {
    const res = await page.goto("/definitely-not-a-page/");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("link", { name: /back|home/i }).first()).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("nav links scroll to their section and update the address", async ({ page }) => {
    await load(page);
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeVisible();
    await nav.getByRole("link", { name: "Projects" }).click();
    await expect
      .poll(() => page.evaluate(() => Math.abs(document.getElementById("projects")!.getBoundingClientRect().top - 64)), { timeout: 15_000 })
      .toBeLessThanOrEqual(3);
    await expect(page).toHaveURL(/#projects$/);
    await expect(nav.getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "location");
  });

  test("Back to top returns to the start", async ({ page }) => {
    await load(page);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.getByRole("link", { name: /Back to top/ }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 15_000 }).toBe(0);
  });
});

test.describe("projects", () => {
  test("featured projects show concrete evidence", async ({ page }) => {
    await load(page);
    await scrollToSection(page, "projects", 200);
    const featured = page.getByRole("list", { name: "Featured projects" });
    await expect(featured.getByRole("heading", { level: 3 })).toHaveText(["LinkedOut", "QueryCraft AI", "SetBeat"]);
    await expect(featured.getByText("300+ Jest unit tests", { exact: true })).toBeVisible();
    await expect(featured.getByText("9+ database types", { exact: true })).toBeVisible();
    await expect(featured.getByText("No internet permission", { exact: true })).toBeVisible();
  });

  test("a repo link opens the in-page preview card, not a new tab", async ({ page, context }) => {
    await load(page);
    await scrollToSection(page, "projects", 200);
    const newTabs: unknown[] = [];
    context.on("page", (p) => newTabs.push(p));
    await page.getByRole("link", { name: "View code for LinkedOut" }).click();
    const card = page.getByRole("dialog", { name: "Link preview" });
    await expect(card.getByRole("heading", { name: "LinkedOut" })).toBeVisible();
    await expect(card.getByRole("link", { name: /Open on GitHub/ })).toHaveAttribute("href", "https://github.com/sultanmaliki/LinkedOut");
    await expect(card.getByRole("button", { name: "Live demo" })).toBeVisible();
    expect(newTabs).toHaveLength(0);
    await page.keyboard.press("Escape");
    await expect(card).toHaveCount(0);
  });
});

test.describe("resume", () => {
  test("opens in the built-in reader with a Download PDF button", async ({ page }) => {
    await load(page);
    await page.getByRole("link", { name: "Resume" }).first().click();
    const reader = page.getByRole("dialog", { name: "Resume" });
    await expect(reader.locator("canvas").first()).toBeVisible({ timeout: 20_000 });
    const download = reader.getByRole("link", { name: /Download/ });
    await expect(download).toHaveAttribute("href", "/resume.pdf");
    await expect(download).toHaveAttribute("download", "Syed_Mohammed_Sultan_Resume.pdf");
    await page.keyboard.press("Escape");
    await expect(reader).toHaveCount(0);
  });
});

test.describe("contact", () => {
  test("copies the email address", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "clipboard permissions are Chromium-only");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await load(page);
    await scrollToSection(page, "contact", 0);
    await page.getByRole("button", { name: /Copy/ }).click();
    await expect(page.getByRole("status").filter({ hasText: "copied" })).toBeAttached();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("ssultanmaliki47@gmail.com");
  });
});
