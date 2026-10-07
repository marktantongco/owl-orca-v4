import { defineConfig, devices } from "@playwright/test";

/**
 * E2E tests run against the already-running Freebuff preview
 * (`freebuff-preview start`) — no webServer is started here, per project rules.
 * Override with E2E_BASE_URL when the preview URL changes.
 */
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
