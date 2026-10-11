import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { REPO_URL } from "@/lib/site";

const REPOS = [
  "owl-forward-proxy",
  "owl-agent-proxy",
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
  "Medium-High synergy",
  "Medium synergy",
  "Medium · non-code",
  "Operational · medium",
];

const OPTION_LABELS = [
  "Tool",
  "API",
  "Adopt",
  "Sync",
  "One-command",
  "Orchestrated",
  "Tunnel",
  "Failover",
  "Provider",
  "Rotate",
];

describe("HomePage — companion repo showcase", () => {
  it("renders the showcase section heading", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { name: "Companion Repos for Orca v4" })
    ).toBeTruthy();
  });

  it("lists all nine companion repos", () => {
    const { container } = render(<HomePage />);
    const text = container.textContent ?? "";
    for (const repo of REPOS) {
      expect(text).toContain(repo);
    }
    // owl-agent card is distinct from owl-agent-proxy: assert its unique copy
    expect(text).toContain("Unified Proxy Ecosystem Builder");
    expect(text).toContain("RAG & Scraping Engine");
  });

  it("shows every role badge", () => {
    const { container } = render(<HomePage />);
    const text = container.textContent ?? "";
    for (const role of ROLES) {
      expect(text).toContain(role);
    }
  });

  it("shows synergy tiers, including the three High-synergy cards", () => {
    render(<HomePage />);
    expect(screen.getAllByText("High synergy")).toHaveLength(3);
    for (const tier of SYNERGY) {
      expect(screen.getAllByText(tier).length).toBeGreaterThan(0);
    }
  });

  it("shows per-repo integration option labels", () => {
    render(<HomePage />);
    // Chain/Merge appear four times (billing, defense, stealth, resilience cards)
    expect(screen.getAllByText("Chain")).toHaveLength(4);
    expect(screen.getAllByText("Merge")).toHaveLength(4);
    for (const label of OPTION_LABELS) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it("shows the integrated request flow with the on-demand RAG note", () => {
    const { container } = render(<HomePage />);
    const text = container.textContent ?? "";
    expect(text).toContain("Integrated request flow");
    expect(text).toContain("On demand: Orca v4 queries");
    expect(text).toContain("Radix routing · racing · circuits");
  });

  it("renders without tripping the error boundary", () => {
    const { container } = render(<HomePage />);
    expect(container.textContent ?? "").not.toContain("Something went wrong");
  });
});

describe("HomePage — links & accessibility", () => {
  it("has no stale repo links; GitHub CTAs point at the current repo", () => {
    const { container } = render(<HomePage />);
    const hrefs = Array.from(container.querySelectorAll("a[href]"))
      .map((a) => a.getAttribute("href") ?? "");

    // The repo was renamed to owl-orca-v4; older links 404 or go stale.
    for (const href of hrefs) {
      expect(href).not.toContain("/owl-orca-v3");
      expect(href).not.toMatch(/github\.com\/marktantongco\/owl-orca(\/|$)/);
    }
    expect(hrefs).toContain(REPO_URL);
    expect(hrefs).toContain(`${REPO_URL}/blob/main/LICENSE`);
    expect(hrefs).toContain(`${REPO_URL}/issues`);
  });

  it("one-line installer targets the current repo", () => {
    const { container } = render(<HomePage />);
    const text = container.textContent ?? "";
    expect(text).toContain(
      "https://raw.githubusercontent.com/marktantongco/owl-orca-v4/main/install.sh"
    );
    expect(text).not.toContain(
      "raw.githubusercontent.com/marktantongco/owl-orca-v3/"
    );
  });

  it("provides a skip-to-content link targeting the main landmark", () => {
    const { container } = render(<HomePage />);
    const skip = screen.getByRole("link", { name: "Skip to content" });
    expect(skip.getAttribute("href")).toBe("#main-content");
    expect(container.querySelector("#main-content")).toBeTruthy();
  });
});
