import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { designPath, liveDesigns } from "../src/designs/registry";
import { eggOf, openEgg } from "./egg-helpers";
import { load } from "./helpers";

/**
 * Plays every easter egg a little, to prove that each one really is a game or toy and that it responds. These follow
 * the same path a visitor takes: open it with the secret word, then use its own controls.
 */

const status = (page: Page, slug: string) => eggOf(page, slug).getByRole("status");

const plays: Record<string, (page: Page, slug: string) => Promise<void>> = {
  cinematic: async (page, slug) => {
    const egg = eggOf(page, slug);
    await expect(status(page, slug)).toContainText("Scene 1 of");
    await egg.getByRole("button", { name: "Next" }).click();
    await expect(status(page, slug)).toContainText("Scene 2 of");
    await egg.getByRole("button", { name: "Pause" }).click();
    await expect(egg.getByRole("button", { name: "Play" })).toBeVisible();
    for (let i = 0; i < 8; i++) {
      const next = egg.getByRole("button", { name: "Next" });
      if (!(await next.count())) break;
      await next.click();
    }
    await expect(egg.getByRole("link", { name: "Book a screening" })).toHaveAttribute("href", /^mailto:/);
  },

  claymorphism: async (page, slug) => {
    const egg = eggOf(page, slug);
    await expect(status(page, slug)).toHaveText("5 balls", { timeout: 8_000 });
    await egg.getByRole("button", { name: "Clear" }).click();
    await expect(status(page, slug)).toHaveText("0 balls");
    await egg.getByRole("button", { name: "Drop one" }).click();
    await expect(status(page, slug)).toHaveText("1 ball");
    await egg.getByRole("button", { name: "Shake" }).click();
  },

  cybercore: async (page, slug) => {
    const egg = eggOf(page, slug);
    const input = page.getByLabel("Terminal command");
    await input.fill("help");
    await input.press("Enter");
    await expect(egg.getByRole("log")).toContainText("Commands:");
    await input.fill("sudo hire me");
    await input.press("Enter");
    await expect(egg.getByRole("log")).toContainText("ACCESS GRANTED");
    await egg.getByRole("button", { name: "skills" }).click();
    await expect(egg.getByRole("log")).toContainText("Frontend Experience");
    await input.fill("florb");
    await input.press("Enter");
    await expect(egg.getByRole("log")).toContainText("command not found");
    await input.press("ArrowUp");
    await expect(input).toHaveValue("florb");
  },

  "neo-brutalism": async (page, slug) => {
    const egg = eggOf(page, slug);
    await egg.getByRole("button", { name: "Start" }).click();
    await expect(egg.getByRole("button", { name: "Start" })).toHaveCount(0);
    await expect(async () => {
      await egg.getByRole("button", { name: /^bug in hole/ }).first().click({ timeout: 700 });
      await expect(egg).toContainText("Score 1", { timeout: 500 });
    }).toPass({ timeout: 20_000 });
  },

  scrapbook: async (page, slug) => {
    const egg = eggOf(page, slug);
    await egg.getByRole("button", { name: "Stick it" }).click();
    await expect(status(page, slug)).toHaveText("1 stuck");
    await egg.getByRole("button", { name: "Heart" }).click();
    const box = (await egg.boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.8);
    await expect(status(page, slug)).toHaveText("2 stuck");
    await egg.getByRole("button", { name: "Undo" }).click();
    await expect(status(page, slug)).toHaveText("1 stuck");
    await egg.getByRole("button", { name: "Clear" }).click();
    await expect(status(page, slug)).toHaveText("0 stuck");
  },

  surrealism: async (page, slug) => {
    const egg = eggOf(page, slug);
    await egg.getByRole("button", { name: "Name something" }).click();
    await expect(status(page, slug)).toContainText("1 of 7 objects denied");
    await expect(page.getByText(/Ceci n’est pas (un|une) /).first()).toBeVisible();
  },

  y2k: async (page, slug) => {
    const egg = eggOf(page, slug);
    const message = page.getByLabel("Message");
    await message.fill("asl?");
    await message.press("Enter");
    await expect(egg.getByRole("log")).toContainText("You say: asl?");
    await expect(egg.getByRole("log")).toContainText(/asl\?\? ok/, { timeout: 8_000 });
    await egg.getByRole("button", { name: "Nudge" }).click();
    await expect(egg.getByRole("log")).toContainText("You have just sent a nudge.");
  },

  "pixel-art": async (page, slug) => {
    const egg = eggOf(page, slug);
    await egg.getByRole("button", { name: "Start" }).click();
    await expect(egg.getByRole("button", { name: "Start" })).toHaveCount(0);
    await page.keyboard.press("Space");
    await expect(egg).not.toContainText("Score 00000", { timeout: 6_000 });
  },

  synthwave: async (page, slug) => {
    const egg = eggOf(page, slug);
    await egg.getByRole("button", { name: "Start engine" }).click();
    await page.keyboard.press("ArrowLeft");
    await egg.getByRole("button", { name: "Right" }).click();
    await expect(egg).toContainText(/Score [1-9]/, { timeout: 6_000 });
  },

  glassmorphism: async (page, slug) => {
    const egg = eggOf(page, slug);
    await egg.getByRole("button", { name: "Pop one" }).click();
    await expect(status(page, slug)).toHaveText("39 left to pop");
    for (let i = 0; i < 39; i++) await egg.getByRole("button", { name: "Pop one" }).click();
    await expect(status(page, slug)).toContainText("All popped in");
    await egg.getByRole("button", { name: "Another sheet" }).click();
    await expect(status(page, slug)).toHaveText("40 left to pop");
  },

  neumorphism: async (page, slug) => {
    const egg = eggOf(page, slug);
    // the hint always points at a press that is still needed, so following it solves the puzzle
    for (let i = 0; i < 12 && !(await egg.getByRole("button", { name: "Next level" }).count()); i++) {
      await egg.getByRole("button", { name: "Hint" }).click();
      await egg.locator("[data-hint]").click();
    }
    await expect(status(page, slug)).toContainText("Level 1 cleared");
    await egg.getByRole("button", { name: "Next level" }).click();
    await expect(egg).toContainText("Level 2");
  },

  "bento-grid": async (page, slug) => {
    const egg = eggOf(page, slug);
    await egg.locator('button[aria-label*="can slide"]').first().click();
    await expect(egg).toContainText("Moves 1");
    await egg.getByRole("button", { name: "Shuffle" }).click();
    await expect(egg).toContainText("Moves 0");
  },

  editorial: async (page, slug) => {
    const egg = eggOf(page, slug);
    await page.keyboard.type("ab");
    await page.keyboard.press("Enter");
    await expect(status(page, slug)).toHaveText("Not enough letters.");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.type("zzzzz"); // no word contains these, so the day's answer never matters
    await page.keyboard.press("Enter");
    await expect(status(page, slug)).toHaveText("0 in place, 0 elsewhere.");
    await expect(egg.locator('span[aria-label^="z,"]')).toHaveCount(5);
    await egg.getByRole("button", { name: "q", exact: true }).click();
    await expect(egg.locator('span[aria-label="q"]')).toHaveCount(1);
  },

  swiss: async (page, slug) => {
    const egg = eggOf(page, slug);
    const letter = egg.getByRole("slider").nth(1);
    await expect(letter).toBeVisible();
    await letter.focus();
    const before = Number(await letter.getAttribute("aria-valuenow"));
    await page.keyboard.press("ArrowRight");
    expect(Number(await letter.getAttribute("aria-valuenow"))).toBeCloseTo(Math.round((before + 0.01) * 100) / 100, 2);
    await egg.getByRole("button", { name: "Check" }).click();
    await expect(status(page, slug)).toContainText("out of 100");
  },

  minimalism: async (page, slug) => {
    const egg = eggOf(page, slug);
    await egg.getByRole("button", { name: "Start" }).click();
    await expect(status(page, slug)).toHaveText("Doing nothing...");
    await page.waitForTimeout(900); // time to let go of the mouse
    for (const [x, y] of [[100, 120], [300, 260], [520, 400], [700, 500]]) await page.mouse.move(x, y, { steps: 3 });
    await expect(status(page, slug)).toContainText("You lasted");
    await expect(egg.getByRole("button", { name: "Try again" })).toBeVisible();
  },

  maximalism: async (page, slug) => {
    const egg = eggOf(page, slug);
    for (let i = 0; i < 5; i++) await egg.locator("button[data-autofocus]").click();
    await expect(status(page, slug)).toContainText("Unlocked: polka dots");
    await egg.getByRole("button", { name: "less?" }).click();
    await expect(status(page, slug)).toContainText("Request denied");
  },

  "luxury-typography": async (page, slug) => {
    const egg = eggOf(page, slug);
    const canvas = egg.locator("canvas");
    const box = (await canvas.boundingBox())!;
    await page.mouse.move(box.x + 12, box.y + 12);
    await page.mouse.down();
    for (let y = 12; y < box.height; y += 18) {
      await page.mouse.move(box.x + box.width - 12, box.y + y, { steps: 6 });
      await page.mouse.move(box.x + 12, box.y + y + 9, { steps: 6 });
    }
    await page.mouse.up();
    await expect(status(page, slug)).toContainText("Prize found");
    await expect(egg.getByRole("link", { name: "Redeem the prize" })).toHaveAttribute("href", /^mailto:/);
  },

  "conceptual-sketch": async (page, slug) => {
    const egg = eggOf(page, slug);
    await egg.getByRole("button", { name: /^Dot 5\b/ }).click();
    await expect(status(page, slug)).toContainText("Not yet. Find dot 1.");
    for (let n = 1; n <= 25; n++) await egg.getByRole("button", { name: new RegExp(`^Dot ${n}\\b`) }).click();
    await expect(status(page, slug)).toContainText("A light bulb");
  },

  ethereal: async (page, slug) => {
    const egg = eggOf(page, slug);
    await expect(status(page, slug)).toHaveText("3 released", { timeout: 8_000 });
    const wish = page.getByLabel("Your wish");
    await wish.fill("may the deploy be boring");
    await wish.press("Enter");
    await expect(status(page, slug)).toHaveText("4 released");
    await expect(egg).toContainText("may the deploy be boring");
  },

  bohemian: async (page, slug) => {
    const egg = eggOf(page, slug);
    for (let i = 0; i < 4; i++) await egg.getByRole("button", { name: "Plant one" }).click();
    await expect(status(page, slug)).toHaveText("4 flowers");
    await egg.getByRole("button", { name: "Clear" }).click();
    await expect(status(page, slug)).toHaveText("0 flowers");
  },

  victorian: async (page, slug) => {
    const egg = eggOf(page, slug);
    const pour = egg.getByRole("button", { name: "Hold to pour" });
    const box = (await pour.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(800);
    await page.mouse.up();
    await expect(status(page, slug)).toContainText(/Perfectly poured|Very good|Adequate|stingy|too much|Spilled/);
    await egg.getByRole("button", { name: "Next guest" }).click();
    await expect(egg).toContainText("Guest 2 of 5");
  },

  cyberpunk: async (page, slug) => {
    const egg = eggOf(page, slug);
    await egg.getByRole("button", { name: "Jack in" }).click();
    for (let i = 0; i < 6; i++) {
      const open = egg.getByRole("button", { name: /available/ });
      if (!(await open.count())) break; // every daemon went up early, so the game ended
      await open.first().click();
    }
    await expect(status(page, slug)).toContainText(/Breach (successful|failed)/);
    await expect(egg.getByRole("button", { name: "Jack in again" })).toBeVisible();
  },

  "wabi-sabi": async (page, slug) => {
    const egg = eggOf(page, slug);
    for (let i = 1; i <= 5; i++) {
      await egg.locator(`[aria-label^="Shard ${i} of"]`).focus();
      await page.keyboard.press("Enter");
    }
    await expect(status(page, slug)).toContainText("Mended with gold");
  },
};

for (const design of liveDesigns()) {
  test(`${design.name}: play it`, async ({ page }) => {
    const problems = await load(page, designPath(design.slug));
    await openEgg(page, design.slug);
    await plays[design.slug](page, design.slug);
    // the state after playing (results, marks, placed pieces) must be accessible too
    const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
    expect(problems).toEqual([]);
  });
}

test("every egg has a play test", () => {
  expect(Object.keys(plays).sort()).toEqual(liveDesigns().map((d) => d.slug).sort());
});
