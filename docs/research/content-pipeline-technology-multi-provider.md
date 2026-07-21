# Research: Content-pipeline technology and multi-provider harness

**Ticket:** [Research content-pipeline technology and multi-provider harness](https://github.com/ventrion/smart-critters/issues/41)  
**Map:** [Smart Critters: offline content pipeline definition](https://github.com/ventrion/smart-critters/issues/36)  
**Downstream (do not resolve here):** [Decide content-pipeline technology stack](https://github.com/ventrion/smart-critters/issues/48)  
**Domain terms:** Content Pack, Item, Subject, Training (see `CONTEXT.md`)  
**Date:** 2026-07-21

## Question

What straightforward-but-sturdy technology approach should run the offline content pipeline: language/runtime, control-plane vs LLM-job split, reusable libraries vs small custom CLI, multi-provider support (OpenAI-compatible / Responses API, subscription/login paths, Claude Code headless, Agent SDKs, DeepSeek, Gemini, etc.), config isolation so global agent settings do not bleed across jobs, and model-sizing by stage (cheap/fast for bulk Item drafts vs heavier for planning/gates)?

## Verdict (short)

Build a **small custom deterministic CLI** (prefer **TypeScript/Node** to match the repo, or **Python** if the team wants LiteLLM+Instructor as the default LLM surface) whose control plane only manages working directories, stage graphs, resume markers, validation, and assembly of Content Packs. Treat every LLM call as an **isolated one-shot job** (HTTP API first; optional `claude --bare -p` / Cursor SDK only for stages that truly need tool loops). Use a thin **provider adapter** over OpenAI Chat Completions + OpenAI-compatible `base_url` (DeepSeek and peers), with first-class native paths for OpenAI Responses, Anthropic Messages, and Gemini. Configure **per-stage model IDs**; default bulk drafts to nano/mini/flash-class models and planning/gates to heavier models; log **usage tokens / cost fields from each response**. Do **not** adopt Temporal/Prefect, dynamic agent control planes, or a LiteLLM Proxy “platform” until volume forces it.

---

## 1. Language / runtime options

Frontend TypeScript does **not** force the pipeline language ([map #36](https://github.com/ventrion/smart-critters/issues/36)). Candidates that fit a local offline CLI:

| Runtime | Strengths for this pipeline | Costs / frictions |
| --- | --- | --- |
| **TypeScript (Node ≥18/22)** | Same language as the SvelteKit client; excellent JSON + Zod schema validation; first-party OpenAI JS SDK, Vercel AI SDK, Cursor SDK (`@cursor/sdk` requires Node **22.13+**); easy `child_process` for one-shot agent CLIs | Packaging is `npm`/`pnpm` scripts or a small bin; less “data science” ecosystem than Python |
| **Python 3.10+** | Best-in-class structured-output stack (Pydantic + [Instructor](https://python.useinstructor.com/getting-started/)); [LiteLLM](https://docs.litellm.ai/docs/) multi-provider `completion()`; Claude Agent SDK Python package | Separate toolchain from the frontend repo; need discipline so the pipeline does not become a notebook farm |
| **Go** | Strong single-binary packaging, subprocess, concurrent fan-out | Weaker first-party LLM SDK surface; more custom HTTP + schema glue |

**Packaging / I/O / validation (decision-relevant):**

- Orchestration is mostly **filesystem + JSON**: working-dir Items, resume markers, final `pack.json` / `assets/` ([map #36](https://github.com/ventrion/smart-critters/issues/36)). Any of the three runtimes handle this well.
- Prefer **schema-first** Item/gate outputs: Zod in TS, Pydantic in Python. OpenAI and Anthropic both document provider-side structured outputs against JSON Schema ([OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs); [Anthropic structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)).
- Subprocess isolation is a first-class need (agent CLIs, image tools). Node and Python both spawn cleanly; Go is slightly nicer for static binaries but not decisive.

**Recommendation:** Default the control plane to **TypeScript** unless grilling #48 prefers Python for LiteLLM/Instructor familiarity. Either way, keep the CLI **thin** and the LLM surface behind one adapter interface.

---

## 2. Control-plane vs LLM-job architecture

Map constraints: deterministic working-dir orchestration; LLM as isolated one-shot jobs; bias against non-deterministic control planes; AFK gates; resume via working-dir checkpoints ([#36](https://github.com/ventrion/smart-critters/issues/36)).

### Recommended pattern

```text
┌──────────────────────────────────────────────┐
│  Deterministic control plane (our CLI)       │
│  - stage graph (plan → draft → gate → …)     │
│  - workdir layout + resume markers           │
│  - schema validate + pack assemble           │
│  - concurrency / retry / clean wipe          │
└───────────────┬──────────────────────────────┘
                │ spawn / await one-shot job
                ▼
┌──────────────────────────────────────────────┐
│  LLM job (isolated)                          │
│  A) HTTP provider call (preferred)           │
│  B) claude --bare -p … (optional tool stage) │
│  C) Cursor Agent.create({ local: { cwd }})   │
│  → writes artifacts only into job workdir    │
│  → returns usage/cost in logs or sidecar     │
└──────────────────────────────────────────────┘
```

**Control plane owns:** which stage runs, which files exist, when to retry, when to mark an Item gated, when to assemble the pack. It must **not** ask an LLM “what should we do next?” as the scheduler.

**LLM job owns:** one prompt (or bounded tool loop), one schema, one workdir slice. Prefer **stateless HTTP** (`store: false` / no conversation chaining) for bulk drafts so jobs stay idempotent. OpenAI’s Responses API is stateful by default (responses stored ~30 days unless `store` is false) ([conversation state guide](https://developers.openai.com/api/docs/guides/conversation-state)); for batch Item drafts, disable store or stick to Chat Completions.

**Agent workflows as inspiration only:** Claude’s Agent SDK / Claude Code headless and Cursor’s Agent SDK are powerful tool loops ([Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk); [Cursor TypeScript SDK](https://cursor.com/docs/sdk/typescript)). Use them for **optional stages** (e.g. “repair failing Item assets in a sandbox workdir”), not as the pipeline scheduler. Non-deterministic multi-agent control planes fight the map’s AFK/resume model.

---

## 3. Reuse candidates: custom CLI vs libraries / frameworks

| Piece | Reuse? | Notes |
| --- | --- | --- |
| **Small custom CLI** | **Yes — own this** | Stage graph, workdirs, resume, pack assemble are product-specific. Prefer a few hundred lines over a framework. |
| **OpenAI official SDK** | Yes | Chat Completions + Responses; Batch API for cheap bulk ([Batch API](https://developers.openai.com/api/docs/guides/batch)) |
| **Anthropic official SDK** | Yes | Messages API + structured outputs ([structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)) |
| **Google GenAI SDK** | Yes | `generateContent` / structured output ([Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output)) |
| **Vercel AI SDK (`ai`)** | Optional (TS) | Multi-provider + `generateText` + `Output.object({ schema })` ([structured data docs](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data)); good if staying in TypeScript |
| **LiteLLM (Python SDK)** | Optional (Python) | One `completion()` interface across 100+ providers; usage/cost callbacks ([LiteLLM docs](https://docs.litellm.ai/docs/)). **Library yes; full Proxy gateway usually no** for a solo offline pipeline |
| **Instructor** | Optional (Python) | Pydantic `response_model` + retries ([Instructor getting started](https://python.useinstructor.com/getting-started/)); OpenAI Responses modes documented ([Instructor ↔ OpenAI](https://python.useinstructor.com/integrations/openai/)) |
| **`just` / Task / Make** | Yes (thin) | Human entrypoints only (`just pack maths-4`). [`just` is a command runner, not a build system](https://just.systems/man/en/); [Task](https://taskfile.dev/docs/getting-started) is similar YAML. Do not put LLM logic in recipes |
| **Temporal / Prefect** | **No for v1** | Temporal is a durable-execution platform for long-running distributed workflows ([Temporal workflows](https://docs.temporal.io/workflows); [use cases](https://docs.temporal.io/evaluate/use-cases-design-patterns)). Prefect targets data/ML orchestration. Both are heavier than “local CLI + workdir checkpoints” |

**Principle:** reuse **provider SDKs + schema libs**; invent only the **Content Pack–specific orchestrator**.

---

## 4. Multi-provider harness

Goal from the map: multi-provider out of the box, including OpenAI-compatible / Responses, subscription/login paths, Claude Code headless, Agent SDKs, DeepSeek, Gemini ([#36](https://github.com/ventrion/smart-critters/issues/36)).

### 4.1 Wire-format tiers (what to implement)

| Tier | Providers | Fit for one-shot batch Item jobs | Auth |
| --- | --- | --- | --- |
| **A. OpenAI Chat Completions (+ compatible)** | OpenAI; DeepSeek (`base_url=https://api.deepseek.com`); any OpenAI-compatible endpoint | Excellent: single request/response, structured JSON, easy concurrency | API key |
| **B. OpenAI Responses API** | OpenAI (recommended for new OpenAI projects) ([migrate to Responses](https://developers.openai.com/api/docs/guides/migrate-to-responses)) | Excellent if `store` managed; supports structured outputs via `text.format` / SDK `.parse` ([Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)); Batch supports `/v1/responses` ([Batch](https://developers.openai.com/api/docs/guides/batch)) | API key |
| **C. Anthropic Messages API** | Claude via Console API | Excellent with `output_config.format` JSON schema ([structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)) | `ANTHROPIC_API_KEY` (pay-per-token) |
| **D. Gemini** | Google AI Gemini | Excellent; schema-constrained JSON ([structured outputs](https://ai.google.dev/gemini-api/docs/structured-output)) | API key / Google auth |
| **E. Claude Code headless / Agent SDK** | Anthropic agent loop | Good for **toolful** stages; overkill for pure JSON Item drafts. CLI: `claude -p` / `--bare` ([headless docs](https://code.claude.com/docs/en/headless)). SDK: `@anthropic-ai/claude-agent-sdk` / `claude-agent-sdk` ([Agent SDK](https://code.claude.com/docs/en/agent-sdk)) | API key preferred for `--bare`; subscription OAuth / `CLAUDE_CODE_OAUTH_TOKEN` also exist ([authentication](https://code.claude.com/docs/en/authentication)) |
| **F. Cursor Agent SDK** | Cursor local/cloud agents | Same: toolful stages / evals; not the bulk draft path. Auth: `CURSOR_API_KEY`. Local runs take `local.cwd`; usage via `result.usage` ([Cursor SDK](https://cursor.com/docs/sdk/typescript)) | API key (dashboard) |

### 4.2 Provider notes (primary sources)

**OpenAI**

- New projects: Responses API preferred; Chat Completions still supported ([migrate guide](https://developers.openai.com/api/docs/guides/migrate-to-responses)).
- Structured Outputs ensure schema adherence (vs JSON mode) ([Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)).
- Batch API: **50% cost discount**, higher rate limits, ≤24h completion — ideal for bulk offline drafts ([Batch](https://developers.openai.com/api/docs/guides/batch)).

**DeepSeek**

- Officially OpenAI- and Anthropic-compatible; OpenAI `base_url` `https://api.deepseek.com`; models e.g. `deepseek-v4-flash` (cheap) and `deepseek-v4-pro` (heavier); JSON Output + Tool Calls documented ([DeepSeek first API call](https://api-docs.deepseek.com/); [pricing](https://api-docs.deepseek.com/quick_start/pricing/)).
- Legacy aliases `deepseek-chat` / `deepseek-reasoner` deprecate **2026-07-24** — new config should use v4 model IDs ([pricing page](https://api-docs.deepseek.com/quick_start/pricing/)).

**Anthropic Messages API**

- Best path for deterministic structured Item JSON without an agent loop.
- Usage returned on messages; separate free token-counting endpoint ([token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)).

**Gemini**

- Structured outputs via JSON Schema / SDK schema helpers ([structured outputs](https://ai.google.dev/gemini-api/docs/structured-output)).
- Flash / Flash-Lite vs Pro-class pricing tiers support stage sizing ([Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)).

**Claude Code headless / Agent SDK**

- Non-interactive: `-p` / `--print`; for scripts/CI prefer **`--bare`** so hooks, skills, plugins, MCP, auto memory, and **CLAUDE.md are not auto-discovered** from cwd or `~/.claude` ([headless](https://code.claude.com/docs/en/headless)).
- `--bare` skips OAuth/keychain; auth must be `ANTHROPIC_API_KEY` or `apiKeyHelper` in `--settings` ([headless](https://code.claude.com/docs/en/headless); [authentication](https://code.claude.com/docs/en/authentication)).
- `--output-format json` includes **`total_cost_usd`** and per-model cost breakdown ([headless](https://code.claude.com/docs/en/headless)); `--json-schema` for structured_output; `--max-budget-usd` caps spend ([CLI reference](https://code.claude.com/docs/en/cli)).
- Subscription path: `/login` or `claude setup-token` → `CLAUDE_CODE_OAUTH_TOKEN` (not read in `--bare`) ([authentication](https://code.claude.com/docs/en/authentication)).
- Agent SDK = same loop programmable in Python/TS; still an **agent**, not a control plane ([Agent SDK](https://code.claude.com/docs/en/agent-sdk)).

**Cursor Agent SDK**

- Local or cloud runtimes; model + `local.cwd`; spend under SDK tag in usage dashboard; programmatic `TokenUsage` on runs ([Cursor SDK](https://cursor.com/docs/sdk/typescript)).
- Without `local.settingSources`, local agents load **only inline MCP servers** (not project/user disk layers) ([Cursor SDK](https://cursor.com/docs/sdk/typescript)) — useful for isolation.
- Local process **inherits the host environment**; scrub secrets and agent-related env when spawning ([Cursor SDK](https://cursor.com/docs/sdk/typescript)).
- Not a substitute for OpenAI-compatible bulk JSON generation.

### 4.3 Suggested adapter shape (conceptual)

```text
ProviderAdapter.complete({
  provider: "openai" | "openai-compatible" | "anthropic" | "gemini" | "claude-code" | "cursor",
  model: string,                 // per-stage from config
  system / instructions,
  input,
  jsonSchema?,                   // structured Item / gate result
  workdir?,                      // only for agent backends
  timeout / maxBudget?,
}) → { artifactPath | parsed, usage, costEstimate?, rawLogPath }
```

Implement **A–D first**. Treat **E–F** as pluggable backends behind the same interface for rare stages.

---

## 5. Config isolation (prevent global agent bleed)

This is a hard requirement: global `CLAUDE.md`, `~/.claude`, Cursor rules, and ambient env must not leak into pack jobs.

### 5.1 Always true (control plane)

1. **Per-job working directory** outside the Smart Critters product repo (or under a dedicated `pipeline-runs/<job-id>/` tree). Never run agent backends with cwd = the interactive developer checkout full of `AGENTS.md` / `.claude/` / `.cursor/`.
2. **Env scrubbing** when spawning subprocesses: pass an explicit env allowlist (`PATH`, provider API keys needed for that job, `HOME` pointed at a job-local fake home if needed). Unset ambient `ANTHROPIC_API_KEY` / `CLAUDE_CODE_OAUTH_TOKEN` / `CURSOR_API_KEY` when the job should use a different credential file.
3. **Config-as-data:** stage→model map, prompts, schemas live in the job workdir or a pinned pipeline config path — not in the developer’s global agent settings.

### 5.2 Claude Code / Agent SDK

| Risk | Mitigation (official) |
| --- | --- |
| Loads project + `~/.claude` CLAUDE.md, hooks, MCP, plugins | Use **`--bare`** — skips auto-discovery of hooks, skills, plugins, MCP, auto memory, CLAUDE.md ([headless](https://code.claude.com/docs/en/headless)) |
| Settings merge from user/project files | Pass explicit **`--settings`** JSON/file; note: **keys you omit keep file-based values** ([CLI `--settings`](https://code.claude.com/docs/en/cli)) — so prefer `--bare` + full explicit settings over relying on `--settings` alone to “clear” globals |
| Settings precedence | Managed > CLI > local > project > user ([settings](https://code.claude.com/docs/en/settings)) |
| Auth bleed (subscription vs API) | Documented precedence: API key / auth token / helper / OAuth token / login ([authentication](https://code.claude.com/docs/en/authentication)). For `--bare`, use `ANTHROPIC_API_KEY` or `apiKeyHelper` |
| Cost runaway | `--max-budget-usd` in print mode ([CLI](https://code.claude.com/docs/en/cli)) |

### 5.3 Cursor SDK

| Risk | Mitigation (official) |
| --- | --- |
| Project/user MCP / settings | Omit `local.settingSources` (or set a minimal list); without it, only **inline** MCP servers load ([Cursor SDK](https://cursor.com/docs/sdk/typescript)) |
| Hooks / workspace policy | Hooks are file-based under `local.cwd` / `~/.cursor` ([Cursor SDK](https://cursor.com/docs/sdk/typescript)) — use a clean job cwd without `.cursor/hooks.json` unless intended |
| Env inheritance | Local agents inherit process env; set env on the process before `send()` ([Cursor SDK](https://cursor.com/docs/sdk/typescript)) |
| Cloud always loads project/team/plugins | Prefer **local** runtime with isolated cwd for reproducible offline jobs ([Cursor SDK](https://cursor.com/docs/sdk/typescript)) |

### 5.4 Pure HTTP providers

OpenAI / Anthropic Messages / Gemini / DeepSeek HTTP calls have **no CLAUDE.md / Cursor rules**. Isolation reduces to: correct API key, pinned model ID, job-local prompt+schema files, and logging. Prefer this path for bulk Item drafts.

---

## 6. Model sizing by stage

Providers publish explicit **cheap/fast vs heavy** SKUs. Evidence (prices change — always re-check; figures below from official pages as of research date):

| Provider | Bulk / cheap (examples) | Heavier (examples) | Source |
| --- | --- | --- | --- |
| OpenAI | `gpt-5.4-nano` ($0.20 / $1.25 per 1M in/out); `gpt-5.4-mini` ($0.75 / $4.50) | `gpt-5.4`, `gpt-5.5`, pro tiers | [OpenAI API pricing](https://developers.openai.com/api/docs/pricing); [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano); [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini); [mini/nano announcement](https://openai.com/index/introducing-gpt-5-4-mini-and-nano/) |
| DeepSeek | `deepseek-v4-flash` | `deepseek-v4-pro` | [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing/) |
| Gemini | Flash / Flash-Lite SKUs (lower $/1M) | Higher Flash/Pro tiers | [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| Anthropic | Haiku-class for volume | Sonnet/Opus-class for gates | Prefer API model IDs in pipeline config; Agent SDK / CLI `--model` for agent stages ([CLI](https://code.claude.com/docs/en/cli)) |

OpenAI’s own guidance: nano for classification / extraction / simpler subagents; mini for higher-volume coding/subagents ([GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano); [announcement](https://openai.com/index/introducing-gpt-5-4-mini-and-nano/)).

**Pipeline policy sketch (config, not hard-coded):**

| Stage | Model class | Why |
| --- | --- | --- |
| Skill-bucket expansion / Item draft fan-out | nano / flash / DeepSeek flash | Highest volume; schema-constrained JSON |
| Dedup / similarity assist (if LLM-aided) | mini / flash | Still volume-sensitive |
| Answer-integrity / hard quality gates | heavier | Fewer calls; higher stakes |
| Pack planning / outline | heavier | Low volume; needs coherence |
| Optional toolful repair | Agent CLI/SDK with explicit model | Isolation flags required |

**How to configure per-stage in common harnesses:**

- Custom CLI: `pipeline.yaml` → `stages.draft.model: openai/gpt-5.4-nano`.
- LiteLLM: `model=` string per call ([LiteLLM](https://docs.litellm.ai/docs/)).
- Vercel AI SDK: pass different `model` into each `generateText` ([structured data](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data)).
- Claude Code: `--model` / `/model` in `-p` (version-dependent; see CLI docs) ([CLI](https://code.claude.com/docs/en/cli)).
- Cursor SDK: `model: { id: "…" }` on `Agent.create` ([Cursor SDK](https://cursor.com/docs/sdk/typescript)).
- OpenAI Batch: one model per batch input file ([Batch](https://developers.openai.com/api/docs/guides/batch)) — align bulk draft batches to one cheap model.

---

## 7. Cost / usage logging (“cost via logs/usage”)

Fit the map’s lean requirement: no separate billing product — **emit usage from each job**.

| Source | What to log | Primary docs |
| --- | --- | --- |
| OpenAI Chat Completions / Responses | `usage` (input/output/total tokens; reasoning details when present) | [Structured Outputs examples include `usage`](https://developers.openai.com/api/docs/guides/structured-outputs); Responses/Completions responses |
| OpenAI Batch | Per-line `usage` in output `.jsonl` | [Batch](https://developers.openai.com/api/docs/guides/batch) |
| Anthropic Messages | `usage` on message; optional pre-count via `/v1/messages/count_tokens` | [Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting) |
| Claude Code `-p --output-format json` | `total_cost_usd` + per-model breakdown | [Headless](https://code.claude.com/docs/en/headless) |
| Claude Code | `--max-budget-usd` hard stop | [CLI](https://code.claude.com/docs/en/cli) |
| LiteLLM | `response_cost` via success callbacks | [LiteLLM cost tracking](https://docs.litellm.ai/docs/) |
| Cursor SDK | `result.usage` / stream `usage` events; dashboard SDK tag | [Cursor SDK token usage](https://cursor.com/docs/sdk/typescript) |
| DeepSeek / Gemini | Standard usage fields on responses; price from official tables | [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing/); [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) |

**Practical pattern:** each job writes `logs/<job-id>.jsonl` with `{ stage, provider, model, tokens_in, tokens_out, cost_usd?, duration_ms, artifact }`. Control plane aggregates per pack run. Convert tokens→USD with a **pinned price table in config** (or provider-reported cost when available) so logs stay reproducible even if dashboards lag.

---

## 8. Recommended stack sketch + non-recommendations

### Recommended (opinionated, evidence-backed)

1. **Control plane:** Small custom **TypeScript CLI** (or Python if LiteLLM/Instructor is the team’s preference) — stage graph, workdirs, resume, Zod/Pydantic validation, pack assemble.
2. **Default LLM path:** Provider adapter over **HTTP APIs** — OpenAI Chat Completions **and** Responses; OpenAI-compatible `base_url` (DeepSeek first-class); Anthropic Messages; Gemini generateContent/structured output.
3. **Structured outputs:** Provider native schemas (OpenAI / Anthropic / Gemini) + Zod or Pydantic; optional Instructor (Python) or AI SDK `Output.object` (TS).
4. **Bulk cost:** Prefer **cheap models per stage** + OpenAI **Batch** for large draft waves when latency can wait up to 24h ([Batch](https://developers.openai.com/api/docs/guides/batch)).
5. **Optional agent backends:** Claude Code `claude --bare -p … --output-format json` and/or Cursor `Agent.create({ local: { cwd: jobDir } })` only for toolful stages; never as the scheduler.
6. **Human UX:** thin `just` / Taskfile recipes calling the CLI.
7. **Cost:** NDJSON usage logs from every job; Claude JSON cost fields / LiteLLM callbacks / Cursor `usage` when those backends are used.
8. **Isolation:** job workdirs + env allowlists + Claude `--bare` + Cursor minimal `settingSources`.

### Explicit non-recommendations

| Avoid | Why |
| --- | --- |
| **Temporal / Prefect as v1 orchestrator** | Durable distributed workflow platforms ([Temporal](https://docs.temporal.io/workflows)); overkill vs workdir checkpoints for a local offline pack builder |
| **LiteLLM Proxy / admin UI as required infra** | Useful as a library; a always-on gateway is platform engineering the map asked to avoid ([LiteLLM](https://docs.litellm.ai/docs/)) |
| **Dynamic multi-agent control plane** (LLM decides next stage) | Conflicts with deterministic AFK resume/gates ([#36](https://github.com/ventrion/smart-critters/issues/36)) |
| **Running Claude/Cursor agents in the Smart Critters repo root** | Loads CLAUDE.md / `.cursor` / hooks — bleed risk ([Claude settings](https://code.claude.com/docs/en/settings); [Cursor SDK](https://cursor.com/docs/sdk/typescript)) |
| **Relying on `--settings` alone (without `--bare`) to isolate Claude** | Omitted keys keep file-based values ([CLI](https://code.claude.com/docs/en/cli)) |
| **`--bare` + subscription OAuth only** | Bare mode does not read `CLAUDE_CODE_OAUTH_TOKEN`; needs API key or `apiKeyHelper` ([authentication](https://code.claude.com/docs/en/authentication)) |
| **Inventing a new agent framework** | Prefer provider SDKs + tiny CLI ([#36](https://github.com/ventrion/smart-critters/issues/36)) |
| **Live / on-device generation** | Architectural never; clients only load Content Packs ([CONTEXT.md](../../CONTEXT.md); [#36](https://github.com/ventrion/smart-critters/issues/36)) |

---

## Open uncertainties for grilling ticket #48

1. **TS vs Python** for the control plane (AI SDK+Zod vs LiteLLM+Instructor) — both fit; pick for team ergonomics.
2. Whether **OpenAI Batch** (async ≤24h) is acceptable for draft waves vs always-synchronous fan-out.
3. Whether **any** stage truly needs Claude Code / Cursor agent backends in v1, or HTTP-only is enough until asset-repair tickets land.
4. **Auth policy:** API-key-only AFK (recommended for isolation) vs allowing subscription OAuth for interactive/dev runs.
5. Whether to standardize on **Responses API** for OpenAI-native calls while keeping Chat Completions as the OpenAI-compatible wire format for DeepSeek/others.
6. Exact **stage→model** matrix once stage list is locked in [#49](https://github.com/ventrion/smart-critters/issues/49).

---

## Primary sources relied on most

- [OpenAI — Migrate to the Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)
- [OpenAI — Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [OpenAI — Batch API](https://developers.openai.com/api/docs/guides/batch)
- [OpenAI — API pricing](https://developers.openai.com/api/docs/pricing)
- [OpenAI — GPT-5.4 nano / mini model pages](https://developers.openai.com/api/docs/models/gpt-5.4-nano)
- [DeepSeek — First API call](https://api-docs.deepseek.com/) + [Models & pricing](https://api-docs.deepseek.com/quick_start/pricing/)
- [Anthropic — Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Claude Code — Headless / programmatic](https://code.claude.com/docs/en/headless)
- [Claude Code — CLI reference](https://code.claude.com/docs/en/cli)
- [Claude Code — Settings](https://code.claude.com/docs/en/settings)
- [Claude Code — Authentication](https://code.claude.com/docs/en/authentication)
- [Claude Code — Agent SDK](https://code.claude.com/docs/en/agent-sdk)
- [Cursor — TypeScript SDK](https://cursor.com/docs/sdk/typescript)
- [Google — Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output) + [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [LiteLLM docs](https://docs.litellm.ai/docs/)
- [Vercel AI SDK — Generating structured data](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data)
- [Instructor — Getting started](https://python.useinstructor.com/getting-started/)
- [just manual](https://just.systems/man/en/) · [Task getting started](https://taskfile.dev/docs/getting-started)
- [Temporal — Workflows](https://docs.temporal.io/workflows)
- Map / tickets: [#36](https://github.com/ventrion/smart-critters/issues/36), [#41](https://github.com/ventrion/smart-critters/issues/41), [#48](https://github.com/ventrion/smart-critters/issues/48)
