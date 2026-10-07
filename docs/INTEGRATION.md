# OWL-ORCA v4 — Companion Repo Integration Plan

Two sibling repos close OWL-ORCA v4's last-mile gaps — **monetization** and **edge defense** — without touching the routing core (radix matching, stream racing, circuit breakers, protocol translation).

## Synergy Overview

| # | Repo | Role | Synergy | Closes the gap |
|---|------|------|---------|----------------|
| 1 | [marktantongco/owl-forward-proxy](https://github.com/marktantongco/owl-forward-proxy) | Billing & Monetization (v4.4 — modular proxy with billing sidecar) | **High** | Orca v4 routes intelligently but never charges: no per-user auth, no tier rate limits, no usage ledger |
| 2 | [marktantongco/owl-agent-proxy](https://github.com/marktantongco/owl-agent-proxy) | Security & Defense (v3.0 — multi-protocol HTTP defense stack) | **High** | Circuit breakers guard *upstream* provider failures; nothing guards *downstream* threats (DDoS, HTTP exploits, prompt injection) |

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
5. Stream racing fires eligible providers; first byte wins; SSE translation streams back chunk-by-chunk.
6. The billing sidecar meters the response (tokens, stream time) post-flight.
7. Circuit/token state is recorded for the next request.

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

## Verification Checklist

- [ ] A request from a client is authenticated and appears in the billing ledger before reaching the router.
- [ ] A rate-limited caller receives a tier-limit response without consuming provider quota.
- [ ] A malicious payload (injection probe / flood) is stopped at the shield; router logs stay clean.
- [ ] Healthy traffic shows zero added latency beyond the extra hop (< 5 ms on localhost).
- [ ] Circuit breakers still open/halve/recover exactly as before (5 failures → 60 s → probe).
- [ ] Stream racing still returns first-byte-wins with SSE translation intact.
- [ ] Total service memory stays under the 768 MB ceiling (Option A: after adding the two units).

## References

- [owl-forward-proxy](https://github.com/marktantongco/owl-forward-proxy) — modular proxy with billing sidecar (`owl-agent-install/forward_proxy.py`, `config/`, `diagnose.sh`)
- [owl-agent-proxy](https://github.com/marktantongco/owl-agent-proxy) — defense stack (`ResilientClient` pipeline, `proxy_defense.py`, tiered proxy pool)
- [README.md](../README.md) — OWL-ORCA architecture, install pipeline, and service management
