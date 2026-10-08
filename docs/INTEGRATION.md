# OWL-ORCA v4 — Companion Repo Integration Plan

Nine companion repos extend OWL-ORCA v4 into a complete product surface — **monetization**, **edge defense**, **stealth egress**, **resilient access & DNS**, **token-sourced providers**, **live web data**, **documentation**, and **deployment automation** — without touching the routing core (radix matching, stream racing, circuit breakers, protocol translation).

## Synergy Overview

| # | Repo | Role | Synergy | Closes the gap |
|---|------|------|---------|----------------|
| 1 | [marktantongco/owl-forward-proxy](https://github.com/marktantongco/owl-forward-proxy) | Billing & Monetization (v4.4 — modular proxy with billing sidecar) | **High** | Orca v4 routes intelligently but never charges: no per-user auth, no tier rate limits, no usage ledger |
| 2 | [marktantongco/owl-agent-proxy](https://github.com/marktantongco/owl-agent-proxy) | Security & Defense (v3.0 — multi-protocol HTTP defense stack) | **High** | Circuit breakers guard *upstream* provider failures; nothing guards *downstream* threats (DDoS, HTTP exploits, prompt injection) |
| 3 | [marktantongco/owl-agent](https://github.com/marktantongco/owl-agent) | RAG & Scraping Engine (Unified Proxy Ecosystem Builder) | **Medium-High** | No live-web path exists in the pipeline — real-time RAG stops at the training cutoff |
| 4 | [marktantongco/owl-orca-ai-agentic-stack](https://github.com/marktantongco/owl-orca-ai-agentic-stack) | Documentation & Knowledge Base (interactive wiki) | **Medium (non-code)** | Production readiness needs one knowledge base: onboarding, API reference, troubleshooting — strictly v4 |
| 5 | [marktantongco/kiro-owl-agent](https://github.com/marktantongco/kiro-owl-agent) + [marktantongco/owl-agent-installer](https://github.com/marktantongco/owl-agent-installer) | Deployment Automation (AWS Builder ID installer + general installer) | **Operational (Medium)** | Provisioning v4, defense, and billing means running separate installers by hand — deployment logic lives in two repos instead of one command |
| 6 | [marktantongco/freebuff-proxy](https://github.com/marktantongco/freebuff-proxy) | Stealth & Session Layer (Go — JA3 stealth transport, multi-token session pool, SOCKS5 pool) | **High** | Orca v4's provider calls are fingerprintable and static — no JA3 shaping, no warm token sessions, no rotating egress, so anti-bot systems can identify and throttle every race |
| 7 | [marktantongco/unified-owl](https://github.com/marktantongco/unified-owl) | Resilient Access & Routing (v1.1 — merged 6-repo engine: evasion · DNS tunneling · NadirClaw cost routing) | **Medium-High** | Racing has no evasion when a provider blocks egress, and no cost tiering — NadirClaw routes simple queries to cheap models and complex ones to premium (40-70% savings) |
| 8 | [marktantongco/owl-dns-synergy](https://github.com/marktantongco/owl-dns-synergy) | DNS Resilience (v2.5 — dual-channel resiliency engine with AutoClaw synergy) | **Medium** | Blocked or poisoned DNS means unreachable providers — routing intelligence never engages; dual-channel resolution keeps upstream endpoints resolvable |
| 9 | [marktantongco/autoclaw-autologin](https://github.com/marktantongco/autoclaw-autologin) | GLM Token Harvesting (v2.7 — OpenAI-compatible free proxy, OAuth harvesting + rotation) | **Medium** | No persistent free GLM source exists in the provider table — tokens expire and the provider drops out of the race; AutoClaw harvests and rotates them continuously |

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
                                  │ racing provider streams
                     ┌────────────▼─────────────┐
                     │  freebuff-proxy          │  Stealth & Session Layer
                     │  · JA3 shaped TLS        │  (egress — every race leaves
                     │  · multi-token sessions  │   over stealth transport)
                     │  · SOCKS5 proxy pool     │
                     └────────────┬─────────────┘
                                  │ fingerprint-soft egress
                     ┌────────────▼─────────────┐
                     │  AI Providers            │
                     │  Copilot · Antigravity · │
                     │  Kiro Gateway · GLM      │
                     └──────────────────────────┘
```

**Side channels (failover & providers):**

```
  Orca v4 ──(blocked egress / cost pressure)──▶ unified-owl (evasion · NadirClaw routing) ──▶ providers
  Orca v4 ──(DNS blocked or poisoned)────────▶ owl-dns-synergy (dual-channel DNS) ─────────▶ resolution
  Orca v4 ◀──(GLM endpoint · rotated tokens)── autoclaw-autologin (OAuth harvest + rotation)
```

**Request lifecycle**

1. Client sends a request to the **owl-forward-proxy** edge.
2. Forward proxy authenticates the caller, checks tier quota, and records the request in the billing sidecar (pre-flight metering).
3. Traffic passes to **owl-agent-proxy**: SHA-256 cache lookup → in-flight dedup → per-domain token-bucket rate limit → tier-sorted proxy rotation → protocol router (http/1.1 → escalate only when justified).
4. Scrubbed request reaches **Orca v4**: radix route match → circuit-breaker gate → strategy selection (race / canary / fallback).
5. *On demand*: if the model requests real-time web data, Orca v4 invokes the **owl-agent** tool/internal API; the scraping engine returns extracted content as RAG context.
6. Provider traffic exits through **freebuff-proxy**: JA3-shaped TLS, warm multi-token sessions, and rotating SOCKS5 egress — anti-bot systems see a browser-like, rotating client instead of a gateway.
7. Stream racing fires eligible providers; first byte wins; SSE translation streams back chunk-by-chunk.
8. If egress is blocked or DNS is poisoned, **unified-owl** (evasion · NadirClaw cost routing) and **owl-dns-synergy** (dual-channel DNS) take the failover path; **autoclaw-autologin** supplies the GLM provider with freshly rotated OAuth tokens.
9. The billing sidecar meters the response (tokens, stream time) post-flight.
10. Circuit/token state is recorded for the next request.

**On-demand branch (tool call):**

```
                     Orca v4 ──── tool call / internal API ────▶ owl-agent
                          ◀───── extracted web data (RAG) ──────  (scraping /
                                                                 extraction)
```

The knowledge base (repo 4) and the Production Deployer (repo 5) live outside the request path. The stealth hop (repo 6) sits *inside* the request path between Orca v4 and the providers; unified-owl, owl-dns-synergy, and autoclaw-autologin (repos 7–9) act as failover paths and provider sources beside it.

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

## Additional Companion Repos (6–9)

### 6. freebuff-proxy — Stealth & Session Layer (High)

[marktantongco/freebuff-proxy](https://github.com/marktantongco/freebuff-proxy) is the Go gateway core: JA3 stealth transport, a multi-token session pool, and a SOCKS5 proxy pool. Orca v4's provider calls are fingerprintable and static; this layer makes every outbound race look like a real browser.

- **Integration — Chain as egress (Option A):** point Orca v4's provider connections at freebuff-proxy so every race is issued over JA3-shaped TLS with warm session tokens and rotating SOCKS5 egress.
- **Integration — Merge as stage (Option B):** expose JA3 shaping and the token pool behind a local hop the router treats as its egress transport — routing decisions stay unchanged.
- **Placement:** sits *behind* the routing decision (egress), runs as its own Go process — declare `MemoryMax` (~96 MB) and keep it outside the router's event loop.

### 7. unified-owl — Resilient Access & Routing (Medium-High)

[marktantongco/unified-owl](https://github.com/marktantongco/unified-owl) merges six repos into one resilient access engine: proxy evasion, DNS tunneling, and cost-optimized routing via NadirClaw.

- **Integration — Fallback chain:** when Orca v4 detects blocked egress or provider fingerprinting, hand the request to unified-owl's evasion path instead of failing the race.
- **Integration — Race strategy:** adopt NadirClaw's cost-tier decisions as an Orca v4 strategy — simple prompts to cheap models, complex prompts to premium (40-70% measured savings).
- **Placement:** on-demand failover only, no fixed footprint while idle — gate it behind the same circuit-breaker registry so a dead fallback degrades gracefully instead of hanging the race.

### 8. owl-dns-synergy — DNS Resilience (Medium)

[marktantongco/owl-dns-synergy](https://github.com/marktantongco/owl-dns-synergy) is the unified dual-channel resilient access engine (v2.5) with AutoClaw ecosystem synergy enhancements.

- **Integration — Resolution layer:** route Orca v4's upstream lookups through the dual-channel DNS engine so provider endpoints stay resolvable when standard DNS is blocked or poisoned.
- **Integration — Failover trigger:** treat DNS health like a circuit breaker — poisoned resolution trips traffic to the tunnel channel automatically.
- **Placement:** network-level, ahead of connection setup; shares the failover path with unified-owl (repo 7) and adds no per-request memory inside the router.

### 9. autoclaw-autologin — GLM Token Harvesting (Medium)

[marktantongco/autoclaw-autologin](https://github.com/marktantongco/autoclaw-autologin) is an OpenAI-compatible free LLM proxy (v2.7) with OAuth token harvesting, Google SSO, and token rotation.

- **Integration — Provider registration:** register its GLM endpoint in Orca v4's routing table as a first-class free provider — the OpenAI-compatible shape needs no protocol translation.
- **Integration — Token lifecycle:** AutoClaw's harvester and rotation keep the GLM OAuth tokens fresh so the provider never expires out of the race (observe in log-only mode first).
- **Placement:** provider-side; runs beside the Kiro Gateway with its own `MemoryMax` — no changes to radix matching or translation.

## Memory Budget (8 GB constraint)

| Deployment | Added processes | Added memory ceiling |
|------------|-----------------|----------------------|
| Current stack (router + forward proxy + kiro) | — | 768 MB hard cap |
| Option A | +2 services | +128–256 MB → tighten `MemoryMax` on each new unit |
| Option B | +0 services | ~0 (stages run inside the router's 384 MB allowance — monitor `MemoryHigh`) |
| Phases 8–10 (repos 6–9) | +4 services (freebuff-proxy, unified-owl, owl-dns-synergy, autoclaw-autologin) | +256–384 MB → declare `MemoryMax` on each new unit (Go core ~96 MB, Python sidecars ~64–96 MB each); run them Option A-style beside the router |

Option B is the safer fit for the 8 GB profile; if Option A is used, declare `MemoryMax`/`MemoryHigh` on both new systemd units and re-run the swap-guard check.

## Rollout Plan

1. **Phase 1 — Defense:** deploy owl-agent-proxy in front of Orca v4 in observe-only mode; confirm cache/dedup/rate-limit stats before enabling blocking.
2. **Phase 2 — Billing:** put owl-forward-proxy at the edge; run auth + metering in log-only mode; reconcile ledger entries against actual router traffic.
3. **Phase 3 — Enforce:** turn on tier quotas and blocking rules.
4. **Phase 4 — Merge (Option B):** extract both logics as v4 pipeline stages per the mapping table; delete the standalone hops; re-run `./install.sh --status` health checks.
5. **Phase 5 — Knowledge base:** adopt owl-orca-ai-agentic-stack as the official docs site; rewrite content against v4 architecture; wire docs updates into every architecture change.
6. **Phase 6 — RAG tool:** expose owl-agent as a tool module or internal API; run in observe-only (log-only) mode first, then enable live web data for models that request it.
7. **Phase 7 — Production Deployer:** unify kiro-owl-agent + owl-agent-installer deployment logic into the one-command OWL-ORCA Production Deployer; validate on a clean 8 GB machine.
8. **Phase 8 — Stealth egress:** chain freebuff-proxy behind Orca v4's provider connections; observe JA3 shaping, token rotation, and SOCKS5 egress in log-only mode before enforcing it for all races.
9. **Phase 9 — Resilience:** wire unified-owl (evasion + NadirClaw cost routing) and owl-dns-synergy (dual-channel DNS) as failover paths; validate under simulated blocked egress and poisoned DNS.
10. **Phase 10 — GLM provider:** register autoclaw-autologin's GLM endpoint in Orca v4's routing table; confirm OAuth harvest + rotation keeps tokens fresh without manual refreshes.

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
- [ ] Provider traffic leaves Orca v4 over freebuff-proxy's stealth transport (JA3-shaped, rotating SOCKS5) and passes an anti-bot fingerprint check.
- [ ] With egress blocked or DNS poisoned, requests fail over through unified-owl / owl-dns-synergy and still reach a provider.
- [ ] GLM stays available through autoclaw-autologin for 7 days with zero manual token refreshes.
- [ ] NadirClaw cost routing sends a simple prompt to a cheap model and a complex one to a premium model, with measured savings in the 40-70% band.

## References

- [owl-forward-proxy](https://github.com/marktantongco/owl-forward-proxy) — modular proxy with billing sidecar (`owl-agent-install/forward_proxy.py`, `config/`, `diagnose.sh`)
- [owl-agent-proxy](https://github.com/marktantongco/owl-agent-proxy) — defense stack (`ResilientClient` pipeline, `proxy_defense.py`, tiered proxy pool)
- [owl-agent](https://github.com/marktantongco/owl-agent) — unified proxy ecosystem builder; scraping/data-extraction components for the RAG tool
- [owl-orca-ai-agentic-stack](https://github.com/marktantongco/owl-orca-ai-agentic-stack) — interactive knowledge base & wiki; official v4 documentation site
- [kiro-owl-agent](https://github.com/marktantongco/kiro-owl-agent) — one-command AWS Builder ID installer; deployment logic for the Production Deployer
- [owl-agent-installer](https://github.com/marktantongco/owl-agent-installer) — general installer; deployment logic for the Production Deployer
- [freebuff-proxy](https://github.com/marktantongco/freebuff-proxy) — Go stealth gateway: JA3 transport, multi-token session pool, SOCKS5 proxy pool (egress hop)
- [unified-owl](https://github.com/marktantongco/unified-owl) — merged 6-repo resilient access engine: proxy evasion, DNS tunneling, NadirClaw cost routing (failover)
- [owl-dns-synergy](https://github.com/marktantongco/owl-dns-synergy) — dual-channel DNS resiliency engine with AutoClaw synergy (resolution failover)
- [autoclaw-autologin](https://github.com/marktantongco/autoclaw-autologin) — OpenAI-compatible free LLM proxy: OAuth token harvesting, Google SSO, token rotation (GLM provider)
- [README.md](../README.md) — OWL-ORCA architecture, install pipeline, and service management
