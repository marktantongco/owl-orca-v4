import { expect, test } from "@playwright/test";

const REPOS = [
  "owl-forward-proxy",
  "owl-agent-proxy",
  "owl-agent",
  "owl-orca-ai-agentic-stack",
  "kiro-owl-agent + owl-agent-installer",
  "freebuff-proxy",
  "unified-owl",
  "owl-dns-synergy",
  "autoclaw-autologin",
];

const ROLES = [
  "Billing & Monetization",
  "Security & Defense",
  "RAG & Scraping Engine",
  "Documentation & Knowledge Base",
  "Deployment Automation",
  "Stealth & Session Layer",
  "Resilient Access & Routing",
  "DNS Resilience",
  "GLM Token Harvesting",
];

const SYNERGY = [
  "High synergy",
  "Medium-High synergy",
  "Medium synergy",
  "Medium · non-code",
  "Operational · medium",
];

const OPTION_LABELS = ["Chain", "Merge", "Tool", "API", "Adopt", "Sync", "One-command", "Orchestrated", "Tunnel", "Failover", "Provider", "Rotate"];

test.describe("companion repo showcase", () => {
  test("renders all nine repos with roles, synergy tiers, and options", async ({
    page,
  }) => {
    await page.goto("/");

    const heading = page.getByRole("heading", {
      name: "Companion Repos for Orca v4",
    });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();

    // Exact-text matches can occur twice (card header + flow note) → take first.
    for (const repo of REPOS) {
      await expect(
        page.getByText(repo, { exact: true }).first()
      ).toBeVisible();
    }
    for (const role of ROLES) {
      await expect(
        page.getByText(role, { exact: true }).first()
      ).toBeVisible();
    }
    for (const tier of SYNERGY) {
      await expect(
        page.getByText(tier, { exact: true }).first()
      ).toBeVisible();
    }
    for (const label of OPTION_LABELS) {
      await expect(
        page.getByText(label, { exact: true }).first()
      ).toBeVisible();
    }

    await expect(
      page.getByText(/On demand: Orca v4 queries/)
    ).toBeVisible();
    await expect(page.getByText("Something went wrong")).toHaveCount(0);
  });

  test("loads with no uncaught page errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Companion Repos for Orca v4" })
    ).toBeAttached();

    expect(errors).toEqual([]);
  });
});
