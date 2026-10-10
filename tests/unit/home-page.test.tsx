import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

const REPOS = [
  "owl-forward-proxy",
  "owl-agent-proxy",
  "owl-orca-ai-agentic-stack",
  "kiro-owl-agent + owl-agent-installer",
  "freebuff-proxy",
  "unified-owl",
  "owl-dns-synergy",
  "autoclaw-autologin",
  "hermes-disguise",
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
  "Stealth & Fingerprinting",
];

const SYNERGY = [
  "High synergy",
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

  it("lists all ten companion repos with unique copy", () => {
    const { container } = render(<HomePage />);
    const text = container.textContent ?? "";
    expect(text).toContain("High synergy");
    // Exact badge match: "Medium-High synergy" badges must not be double-counted
    expect(screen.getAllByText("High synergy")).toHaveLength(4);
    for (const repo of REPOS) {
      expect(text).toContain(repo);
    }
    // owl-agent card is distinct from owl-agent-proxy: assert its unique copy
    expect(text).toContain("Unified Proxy Ecosystem Builder");
    expect(text).toContain("RAG & Scraping Engine");
    // hermes-disguise is the stealth+disguise card: assert its unique copy
    expect(text).toContain("Browser-shaped TLS fingerprint");
    expect(text).toContain("Stealth & Fingerprinting");
  });

  it("shows every role badge", () => {
    const { container } = render(<HomePage />);
    const text = container.textContent ?? "";
    for (const role of ROLES) {
      expect(text).toContain(role);
    }
  });

  it("shows synergy tiers, including the four High-synergy cards", () => {
    const { container } = render(<HomePage />);
    const text = container.textContent ?? "";
    expect(text).toContain("High synergy");
    expect(screen.getAllByText("High synergy")).toHaveLength(4);
    expect(text).toContain("hermes-disguise");
    for (const tier of SYNERGY) {
      expect(text).toContain(tier);
    }
  });

  it("shows per-repo integration option labels", () => {
    render(<HomePage />);
    // Chain: billing + defense + hermes + freebuff + unified-owl = 5
    // Merge: billing + defense + hermes + freebuff + unified-owl = 5
    expect(screen.getAllByText("Chain")).toHaveLength(5);
    expect(screen.getAllByText("Merge")).toHaveLength(5);
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
