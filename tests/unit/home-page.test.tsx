import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

const REPOS = [
  "owl-forward-proxy",
  "owl-agent-proxy",
  "owl-orca-ai-agentic-stack",
  "kiro-owl-agent + owl-agent-installer",
];

const ROLES = [
  "Billing & Monetization",
  "Security & Defense",
  "RAG & Scraping Engine",
  "Documentation & Knowledge Base",
  "Deployment Automation",
];

const SYNERGY = [
  "Medium-High synergy",
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
];

describe("HomePage — companion repo showcase", () => {
  it("renders the showcase section heading", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { name: "Companion Repos for Orca v4" })
    ).toBeTruthy();
  });

  it("lists all five companion repos", () => {
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

  it("shows synergy tiers, including the two High-synergy cards", () => {
    render(<HomePage />);
    expect(screen.getAllByText("High synergy")).toHaveLength(2);
    for (const tier of SYNERGY) {
      expect(screen.getAllByText(tier).length).toBeGreaterThan(0);
    }
  });

  it("shows per-repo integration option labels", () => {
    render(<HomePage />);
    // Chain/Merge appear twice (one per original card)
    expect(screen.getAllByText("Chain")).toHaveLength(2);
    expect(screen.getAllByText("Merge")).toHaveLength(2);
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
