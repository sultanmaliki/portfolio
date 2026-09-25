import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
// Point the suite at any running copy of the site (e.g. the deployed URL) instead of the local static export.
const REMOTE = process.env.E2E_BASE_URL;

/**
 * End-to-end smoke tests run against the static export (`npm run build` first).
 * Locally, set PW_CHANNEL=chrome to use an installed Chrome instead of downloading Chromium.
 */
export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: REMOTE ?? `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}),
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
  webServer: REMOTE
    ? undefined
    : {
        command: `npx serve out -l ${PORT} --no-clipboard`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
