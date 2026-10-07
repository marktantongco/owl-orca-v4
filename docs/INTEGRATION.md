# OWL-ORCA v4 — Companion Repo Integration Plan

Five companion repos extend OWL-ORCA v4 into a complete product surface — **monetization**, **edge defense**, **live web data**, **documentation**, and **deployment automation** — without touching the routing core (radix matching, stream racing, circuit breakers, protocol translation).

## Synergy Overview

| # | Repo | Role | Synergy | Closes the gap |
|---|------|------|---------|----------------|
| 1 | [marktantongco/owl-forward-proxy](https://github.com/marktantongco/owl-forward-proxy) | Billing & Monetization (v4.4 — modular proxy with billing sidecar) | **High** | Orca v4 routes intelligently but never charges: no per-user auth, no tier rate limits, no usage ledger |
| 2 | [marktantongco/owl-agent-proxy](https://github.com/marktantongco/owl-agent-proxy) | Security & Defense (v3.0 — multi-protocol HTTP defense stack) | **High** | Circuit breakers guard *upstream* provider failures; nothing guards *downstream* threats (DDoS, HTTP exploits, prompt injection) |
| 3 | [marktantongco/owl-agent](https://github.com/marktantongco/owl-agent) | RAG & Scraping Engine (Unified Proxy Ecosystem Builder) | **Medium-High** | No live-web path exists in the pipeline — real-time RAG stops at the training cutoff |
| 4 | [marktantongco/owl-orca-ai-agentic-stack](https://github.com/marktantongco/owl-orca-ai-agentic-stack) | Documentation & Knowledge Base (interactive wiki) | **Medium (non-code)** | Production readiness needs one knowledge base: onboarding, API reference, troubleshooting — strictly v4 |
| 5 | [marktantongco/kiro-owl-agent](https://github.com/marktantongco/kiro-owl-agent) + [marktantongco/owl-agent-installer](https://github.com/marktantongco/owl-agent-installer) | Deployment Automation (AWS Builder ID installer + general installer) | **Operational (Medium)** | Provisioning v4, defense, and billing means running separate installers by hand — deployment logic lives in two repos instead of one command |

## Target Architecture

```
                     ┌──────────────────────────┐
                     │  owl-forward-proxy       │  Billing & Monetization
 Client ───────────▶ │  · user authentication   │  (edge — who is calling,
 (IDE / CLI / app)   │  · per-tier rate limits   │   what they're allowed,
                     │  · usage metering        │   what they owe)
                     └────────────┬─────────────┘
                                  │ authenticated + logged
                     ┌────────────▼─────────────┐
                     │  owl-agent-proxy         │  Security & Defense
                     │  · cache → dedup         │  (shield — directly before
                     │  · domain rate limiting  │   Orca v4, so only sanitized
                     │  · proxy rotation        │   traffic consumes routing
                     │  · protocol router       │   resources)
                     └────────────┬─────────────┘
                                  │ scrubbed request
                     ┌────────────▼─────────────┐
                     │  Orca Router (Orca v4)   │
                     │  Radix Tree · StreamRacer│  Routing brain (unchanged)
                     │  Circuit Breakers · SSE  │
                     └────────────┬─────────────┘
                                  │
                     ┌────────────▼─────────────┐
                     │  AI Providers            │
                     │  Copilot · Antigravity · │
                     │  Kiro Gateway            │
                     └──────────────────────────┘
```

**Request lifecycle**

1. Client sends a request to the **owl-forward-proxy** edge.
2. Forward proxy authenticates the caller, checks tier quota, and records the request in the billing sidecar (pre-flight metering).
3. Traffic passes to **owl-agent-proxy**: SHA-256 cache lookup → in-flight dedup → per-domain token-bucket rate limit → tier-sorted proxy rotation → protocol router (http/1.1 → escalate only when justified).
4. Scrubbed request reaches **Orca v4**: radix route match → circuit-breaker gate → strategy selection (race / canary / fallback).
5. *On demand*: if the model requests real-time web data, Orca v4 invokes the **owl-agent** tool/internal API; the scraping engine returns extracted content as RAG context.
6. Stream racing fires eligible providers; first byte wins; SSE translation streams back chunk-by-chunk.
7. The billing sidecar meters the response (tokens, stream time) post-flight.
8. Circuit/token state is recorded for the next request.

**On-demand branch (tool call):**

```
                     Orca v4 ──── tool call / internal API ────▶ owl-agent
                          ◀───── extracted web data (RAG) ──────  (scraping /
                                                                 extraction)
```

The knowledge base (repo 4) and the Production Deployer (repo 5) live outside the request path.

## Integration Options

### Option A — Chain in front (no core changes)

Deploy both repos as standalone hops in front of the existing router stack.

- Point clients at **owl-forward-proxy** instead of the router directly; it forwards to Orca v4 after auth + metering.
- Deploy **owl-agent-proxy** as the shield immediately before Orca v4.
- The existing stack (`orca-router` :60001, `owl-proxy` :60000, `kiro-gateway` :8333) keeps its ports; give the billing proxy its own unused port (e.g. `60010`) in its config so nothing collides.
- **Pros:** zero changes to `orca_router.py`; each layer restarts independently; Safe-Mode/SIGHUP behavior preserved.
- **Cons:** one extra network hop per layer; three services to fit inside the 8 GB memory budget (see below).

### Option B — Merge into the v4 middleware pipeline (recommended long-term)

Extract the billing sidecar and the defense handlers as pipeline stages inside Orca v4, ahead of radix matching:

| Stage | Source | Purpose |
|-------|--------|---------|
| 1. Auth & tier check | owl-forward-proxy | Identify caller, enforce tier quota |
| 2. Pre-flight metering | owl-forward-proxy (billing sidecar) | Record request start for billing |
| 3. Defense chain | owl-agent-proxy | Cache → dedup → rate limit → proxy rotate → protocol routing |
| 4. Radix route match | Orca v4 core | O(1) path matching |
| 5. Circuit-breaker gate | Orca v4 core | Half-open provider protection |
| 6. Race / canary / fallback | Orca v4 core | StreamRacer + translation |
| 7. Post-flight metering | owl-forward-proxy (billing sidecar) | Record tokens/stream-time, close the ledger entry |

- **Pros:** no extra hops, no extra service processes — stages share the router's event loop and memory allowance.
- **Cons:** requires touching the v4 pipeline; the two codebases must be reconciled (both are Python 3.10+ asyncio, which keeps this realistic).

## Additional Companion Repos (3–5)

### 3. owl-agent — RAG & Scraping Engine (Medium-High)

[marktantongco/owl-agent](https://github.com/marktantongco/owl-agent) is the *Unified Proxy Ecosystem Builder* — interactive proxy builder with synergy scoring, compatibility matrix, architecture schematic, and its own installer. Its scraping/data-extraction components become Orca v4's **live-web tool**.

- **Integration — Tool/Function-Calling module:** register the scraper as a callable tool inside the Orca v4 pipeline. When a model routed through Orca needs real-time web data, it emits a tool call; Orca invokes the scraping engine and streams extracted content back as RAG context.
- **Integration — Internal API endpoint:** extract the scraping components behind an internal HTTP endpoint that Orca v4 queries during a request (pre-flight context fetch) — the router treats it like any other upstream.
- **Placement:** on-demand only, so it adds no fixed memory footprint; keep it behind the same edge auth as the rest of the pipeline, and gate it behind the circuit-breaker registry like a provider so a dead scraper degrades gracefully instead of hanging the race.

### 4. owl-orca-ai-agentic-stack — Documentation & Knowledge Base (Medium, non-code)

[marktantongco/owl-orca-ai-agentic-stack](https://github.com/marktantongco/owl-orca-ai-agentic-stack) is the interactive *Knowledge Base & Wiki*. There is no code to merge — **the documentation must be merged**.

- Adopt it as the **official documentation site for owl-orca-v4**.
- Rewrite its content to **strictly reflect v4 architecture**: request flow (billing → defense → router → providers), ports (60000/60001/8333), middleware order, routing strategies, circuit-breaker semantics, install pipeline, and troubleshooting runbooks.
- Treat docs as part of the change: every v4 architecture PR updates the knowledge base in the same change, so onboarding, API reference, and troubleshooting never drift from reality.

### 5. kiro-owl-agent + owl-agent-installer — Deployment Automation (Operational, Medium)

[marktantongco/kiro-owl-agent](https://github.com/marktantongco/kiro-owl-agent) (one-command AWS Builder ID → drop-in Anthropic API installer) and [marktantongco/owl-agent-installer](https://github.com/marktantongco/owl-agent-installer) (general installer) hold the deployment logic. **Merge the logic, not the code.**

- Build a unified **OWL-ORCA Production Deployer**: a single entrypoint that combines both installers and, in one command, provisions **owl-orca-v4**, sets up the **owl-agent-proxy defense stack**, and configures the **owl-forward-proxy billing sidecar**.
- Keep both repos independently usable — the deployer orchestrates them (shared entrypoint, separate repos), so a user who only wants the Kiro path still runs `kiro-owl-agent` alone.
- The deployer must re-run the existing idempotent 12-step install pipeline (swap guard, memory accounting, systemd units, health checks) and declare `MemoryMax` on every unit it creates.

## Memory Budget (8 GB constraint)

| Deployment | Added processes | Added memory ceiling |
|------------|-----------------|----------------------|
| Current stack (router + forward proxy + kiro) | — | 768 MB hard cap |
| Option A | +2 services | +128–256 MB → tighten `MemoryMax` on each new unit |
| Option B | +0 services | ~0 (stages run inside the router's 384 MB allowance — monitor `MemoryHigh`) |

Option B is the safer fit for the 8 GB profile; if Option A is used, declare `MemoryMax`/`MemoryHigh` on both new systemd units and re-run the swap-guard check.

## Rollout Plan

1. **Phase 1 — Defense:** deploy owl-agent-proxy in front of Orca v4 in observe-only mode; confirm cache/dedup/rate-limit stats before enabling blocking.
2. **Phase 2 — Billing:** put owl-forward-proxy at the edge; run auth + metering in log-only mode; reconcile ledger entries against actual router traffic.
3. **Phase 3 — Enforce:** turn on tier quotas and blocking rules.
4. **Phase 4 — Merge (Option B):** extract both logics as v4 pipeline stages per the mapping table; delete the standalone hops; re-run `./install.sh --status` health checks.
5. **Phase 5 — Knowledge base:** adopt owl-orca-ai-agentic-stack as the official docs site; rewrite content against v4 architecture; wire docs updates into every architecture change.
6. **Phase 6 — RAG tool:** expose owl-agent as a tool module or internal API; run in observe-only (log-only) mode first, then enable live web data for models that request it.
7. **Phase 7 — Production Deployer:** unify kiro-owl-agent + owl-agent-installer deployment logic into the one-command OWL-ORCA Production Deployer; validate on a clean 8 GB machine.

## Verification Checklist

- [ ] A request from a client is authenticated and appears in the billing ledger before reaching the router.
- [ ] A rate-limited caller receives a tier-limit response without consuming provider quota.
- [ ] A malicious payload (injection probe / flood) is stopped at the shield; router logs stay clean.
- [ ] Healthy traffic shows zero added latency beyond the extra hop (< 5 ms on localhost).
- [ ] Circuit breakers still open/halve/recover exactly as before (5 failures → 60 s → probe).
- [ ] Stream racing still returns first-byte-wins with SSE translation intact.
- [ ] Total service memory stays under the 768 MB ceiling (Option A: after adding the two units).
- [ ] A model routed through Orca v4 can request live web data and receives scraped content end-to-end (owl-agent tool call or internal API), and a dead scraper fails open instead of hanging the race.
- [ ] The knowledge base reflects v4 architecture exactly (routes, ports, middleware order) and is reachable as the official docs site.
- [ ] One command provisions the full stack from a clean machine: owl-orca-v4 + owl-agent-proxy defense + owl-forward-proxy billing, with all health checks green.

## References

- [owl-forward-proxy](https://github.com/marktantongco/owl-forward-proxy) — modular proxy with billing sidecar (`owl-agent-install/forward_proxy.py`, `config/`, `diagnose.sh`)
- [owl-agent-proxy](https://github.com/marktantongco/owl-agent-proxy) — defense stack (`ResilientClient` pipeline, `proxy_defense.py`, tiered proxy pool)
- [owl-agent](https://github.com/marktantongco/owl-agent) — unified proxy ecosystem builder; scraping/data-extraction components for the RAG tool
- [owl-orca-ai-agentic-stack](https://github.com/marktantongco/owl-orca-ai-agentic-stack) — interactive knowledge base & wiki; official v4 documentation site
- [kiro-owl-agent](https://github.com/marktantongco/kiro-owl-agent) — one-command AWS Builder ID installer; deployment logic for the Production Deployer
- [owl-agent-installer](https://github.com/marktantongco/owl-agent-installer) — general installer; deployment logic for the Production Deployer
- [README.md](../README.md) — OWL-ORCA architecture, install pipeline, and service management
