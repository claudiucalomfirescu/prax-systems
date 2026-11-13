# The Prax Systems method

Version 0.3 · 2026-11-13 (0.1: 2026-10-30; 0.2 moved the blueprint into its own folder; 0.3 writes
down what the first four systems actually do: README diagram, optional video, maintenance prompts)

## 1. What counts as a "system"

Use Prax Systems when what you are building has **more than one moving part and the behaviour that
matters happens between them**. Typical signs:

- several processes or actors (a proxy, agents, local services, a console) talk over a protocol;
- some parts are *non-deterministic* (LLMs, simulated people), so "it works" means "the recorded
  traffic looks right", not "the function returned 4";
- other systems will plug into yours later, so its **contracts** (HTTP shapes, headers, DB schemas,
  file formats) matter more than its internals;
- you expect to **rebuild** it: with a better model, in another language, or split and recombined
  with sibling systems.

If it is one screen over one API, use Prax App. If it is a data flow ending in a report, use Prax
Analytics. A Prax System can contain an app (its console) and a pipeline (its log aggregation); the
method wraps them.

## 2. The six layers

Every Prax System is described in six layers, from most durable to least. A rewrite may replace a
lower layer completely as long as the layers above it still hold.

| # | Layer | File(s) | Changes when… | Survives a rewrite? |
|---|---|---|---|---|
| 1 | **Intent** | `GOAL.md` | the problem or audience changes | always |
| 2 | **Contract** | `SPEC.md` | behaviour or interfaces change | always (it *is* the system) |
| 3 | **Proof** | `tests/`, `demo/` | the spec changes | yes: tests target contracts, not internals; demo data is plain files |
| 4 | **Recipe** | `PROMPTS.md` | the spec changes, or we learn a better way to build | yes, re-run by a new model |
| 5 | **Shape** | `ARCHITECTURE.md` | the implementation changes | partly: the component graph survives, file paths do not |
| 6 | **Rendering** | `src/` (code) | any time | no: this is what gets regenerated |

Two cross-cutting records sit beside the layers: **`DECISIONS.md`** (memory: why things are the way
they are) and **`ROADMAP.md`** (direction: what is done, what is next). And one outward-facing
layer: **`explainers/`** (story: the system told visually to a newcomer).

The four documents of layers 1, 2, 4 and 5 plus DECISIONS and ROADMAP live together in one folder,
**`blueprint/`**, never in the repo root. The root stays the front door (README, manifest, code),
and the folder is the single thing to hand a future model: "here is the blueprint, rebuild it".
Every README says so near the top, because publishing the blueprint, not only the code, is the
point of the method.

## 3. The files, precisely

### prax.yaml — the manifest
Machine-readable front page. Tools (the checker, a future catalogue site, a model rebuilding the
repo) start here. Required: `prax`, `name`, `kind: system`, `one_liner`, `status`, `run` (`demo`,
`tests`), `docs`, `explainer`. Usual: `components`, `contracts` (`provides`, `depends_on`),
`built_with` (`model`, `date`, `language`). Optional, as the systems needed them: `run.install`,
`run.live`, `run.offline`, `explainer.video`, `built_with.demo_data_model`, extra `docs` entries.
See [templates/prax.yaml](templates/prax.yaml).

### GOAL.md — intent
Problem (one paragraph a stranger understands), who it is for, what success looks like (3–5
observable criteria), non-goals, and the **one-sentence pitch**. No implementation words.

### SPEC.md — the contract (source of truth)
1. **Glossary** — the nouns, so every later sentence is unambiguous.
2. **Components** — each part with its responsibility, inputs, outputs (C-01, C-02…).
3. **Contracts** — every interface another part or system depends on, exactly: HTTP routes with
   request/response examples, headers, DB tables with columns and types, file formats, CLI flags,
   env vars. Contracts get versioned ids (`K-log-schema@1`).
4. **Requirements** — numbered `R-001…`, one behaviour each, written as *Given / When / Then* or a
   single "The proxy MUST…" sentence, each with an **acceptance check** (how a test or a person
   proves it).
5. **Quality bars** — performance, limits, security, privacy (as requirements too).
6. **Out of scope.**

Rule: **if it is not in SPEC.md, a rebuild is allowed to drop it.** Anything you care about goes in.

### ARCHITECTURE.md — shape
A Mermaid diagram of components and flows, a runtime view (processes, ports, files), the data
model, a **requirement → code map** (`R-004 → proxy/logstore.py:write_call`), and the extension
points.

### PROMPTS.md — the recipe
An ordered list of prompts (`P-01…`) that took a capable coding model from an empty folder to
this repo. Each prompt has:

- **Goal** — what exists after this step;
- **Delivers** — the R-ids it implements;
- **Inputs** — which docs/files the model must read first (always GOAL + SPEC);
- **Prompt** — the exact text to paste;
- **Done when** — the tests / demo commands that must pass.

It ends with two special prompts: **P-REBUILD** (one-shot: "here are GOAL, SPEC, ARCHITECTURE and
tests; rebuild the system in `<language>`") and **P-VERIFY** ("run the acceptance tests and the
demo against the rebuild and report every R-id that fails"). The prompts are written for a
*future, more capable* model: say what, not how, unless the how is a contract.

Later work is appended, not rewritten: a maintenance pass or a new feature becomes a new dated
prompt (`P-08 · Maintenance pass (2026-11-13)`) that names the R-ids it added or changed. The list
stays the honest history of how the repo was built, and P-REBUILD is updated to cover the new R-ids.

### ROADMAP.md — direction
Milestones `M1…` with status (✅ done · 🔜 in progress · ⏳ planned · 💤 parked), each listing the
R-ids it delivers, plus a "Next" section and "Ideas, not commitments".

### DECISIONS.md — memory
Short entries `D-001…`: date, context, decision, alternatives considered, consequences, who
decided. Includes decisions the user delegated ("decided autonomously overnight; review").

### demo/ — proof you can watch
- `demo/data/` — **recorded** output committed to the repo (e.g. a small SQLite log of a demo
  team's day), so a clone shows something meaningful with **zero setup and no API key**;
- a script that produces fresh live traffic (needs a key, or runs against a fake upstream); its
  command goes in `prax.yaml` as `run.live`;
- `demo/DEMO.md` — a 5-minute walkthrough: commands, what you should see, what to click.

### explainers/ — the story
`explainers/index.html`, a single self-contained HTML file (inline SVG/CSS/JS, no network, works
from `file://`) that animates, in order:

1. **What** it is (one picture);
2. **Goal / problem** (the pain before it existed);
3. **How it works** (the request/data flowing through the components, step by step, with play /
   pause / step controls);
4. **Try it / replicate it** (the exact commands, and how to build your own variant).

It respects `prefers-reduced-motion` and works in light and dark. It is also published as a
claude.ai artifact; the link goes in README and `prax.yaml`. The checker refuses a Silver explainer
that loads any script, style or image from the network.

Two smaller visuals sit beside it:

- `explainers/readme-flow.svg` — one animated SVG (CSS or SMIL, no script, so GitHub renders it)
  at the top of the README: the system's parts and one request moving through them.
- optionally a **short video** (about a minute, silent, captioned) built from real screenshots and
  real demo data, for people who will not click through an explainer. Commit the MP4 and its
  source (e.g. a Remotion project in `explainers/video/`) so the video, too, can be re-rendered
  when the system changes. Link it from README and as `explainer.video`.

See [templates/EXPLAINER_GUIDE.md](templates/EXPLAINER_GUIDE.md).

### tests/ — the proof you can run
Acceptance tests named or tagged with the R-ids they prove (`test_R004_logs_every_call`, or a
docstring line `Proves: R-004, R-005`). Prefer **black-box tests at contract level** (HTTP in,
HTTP/DB out) because those are the tests that survive a rewrite in another language. Tests must run
offline (fake upstream LLM).

## 4. The workflow

```
  ┌─────────┐   ┌─────────┐   ┌──────────┐   ┌───────────┐   ┌──────────┐   ┌──────────┐
  │ 1 FRAME │ → │ 2 SPEC  │ → │ 3 PROVE  │ → │ 4 RENDER  │ → │ 5 SHOW   │ → │ 6 SEAL   │
  │ GOAL    │   │ SPEC    │   │ tests +  │   │ code via  │   │ demo +   │   │ prompts  │
  │ prax    │   │ contracts│  │ demo data│   │ PROMPTS   │   │ explainer│   │ replayed │
  └─────────┘   └─────────┘   └──────────┘   └───────────┘   └──────────┘   └──────────┘
        ▲                                                                         │
        └──────────────── ROADMAP next milestone · DECISIONS logged throughout ───┘
```

1. **Frame** — write GOAL.md and `prax.yaml`. Agree the pitch and non-goals.
2. **Spec** — glossary, components, contracts, R-ids. Contracts shared with sibling systems are
   copied *by version* (see §6).
3. **Prove** — write acceptance tests and the demo scenario *before or alongside* the code. The demo
   is a test you can watch.
4. **Render** — build the code, one prompt per step, recording each prompt in PROMPTS.md as you go
   (not afterwards from memory).
5. **Show** — record demo data, write DEMO.md, build the animated explainer, publish it.
6. **Seal** — run `tools/prax_check.py` (each repo vendors a copy, so it checks itself after it
   leaves the ecosystem); update ROADMAP and DECISIONS; tag the release with the
   model and date in `prax.yaml: built_with`. Optionally run **P-REBUILD** in a scratch folder to
   prove the prompts still work.

## 5. Rules (the ones that keep you honest)

1. **No code without spec.** A pull request that adds behaviour adds or changes an R-id.
2. **No R-id without proof.** Every requirement is covered by a test (or marked `manual:` with the
   demo step that shows it).
3. **No repo without rebuild prompts.** PROMPTS.md exists and ends with P-REBUILD and P-VERIFY.
4. **Clone-and-see.** A fresh clone shows the system working from recorded demo data with one
   command and no secrets.
5. **Publish the blueprint, not just the code.** GOAL, SPEC, ARCHITECTURE, PROMPTS, DECISIONS and
   ROADMAP live in `blueprint/`, and the README tells readers, near the top, that they can rebuild
   the project from it with a better model.
6. **Secrets stay out.** Keys are env vars; demo data is scrubbed; the explainer works offline.
7. **Decisions are written down the day they are made**, including autonomous ones.
8. **Contracts are versioned.** Breaking a contract other systems use means a new version id.

## 6. Ecosystems: several systems that plug together

When a system is split into sibling repos (as here: proxy-log, proxy-firewall, motors-sim,
session-console), the shared surface is a set of **contracts** with one *owner* each:

| Contract | Owner | Consumers |
|---|---|---|
| `K-openai-chat@1` — OpenAI-compatible `/v1/chat/completions` | (external standard) | all |
| `K-agent-headers@1` — `X-Agent-User`, `X-Agent-Id`, `X-Session-Id`, `X-Agent-Dept`… | llm-proxy-log | firewall, motors-sim, console |
| `K-log-schema@1` — SQLite tables `calls` (+ `signals`, `admin_actions` in @2) | llm-proxy-log (@1), llm-proxy-firewall (@2) | firewall, motors-sim, console |
| `K-firewall-rules@1` — the YAML topics file | llm-proxy-firewall | motors-sim |

The current registry is [ecosystem/CONTRACTS.md](ecosystem/CONTRACTS.md). The owner's SPEC.md
defines the contract in full. Each consumer's SPEC.md has a **"Contracts we
depend on"** section naming the id and version and copying the minimum it relies on. A consumer's
tests include a fixture produced by the owner (e.g. a demo SQLite file), so a broken contract fails
the build of the consumer. This is how independent repos can be recombined later without a monster
monorepo.

When a repo needs another repo's code, it **copies** it (llm-proxy-firewall began as a copy of
llm-proxy-log; vxc-motors-sim vendors the firewall proxy) and keeps its own tests, instead of
depending on a shared package. Each repo stays clonable and runnable alone; the contract version is
what says two copies still agree. The checker is vendored the same way: copy the latest
`tools/prax_check.py` from prax-systems when you touch a repo.

## 7. Rebuilding with a future model

To regenerate a system:

1. Give the model `prax.yaml`, GOAL.md, SPEC.md, ARCHITECTURE.md (shape only), the `tests/` and
   `demo/data/`.
2. Paste **P-REBUILD** with the target language/runtime.
3. Run **P-VERIFY**: the acceptance tests (ported if the language changed; the fixtures and the
   expected HTTP/DB shapes do not change) and the demo walkthrough.
4. The rebuild passes when every R-id passes and the explainer's story still matches what the demo
   shows.

The step-by-step prompts P-01… are the *fallback*: if a one-shot rebuild drifts, replay them in
order.

## 8. Compliance levels

| Level | Means | Checker |
|---|---|---|
| **Bronze** | All required files exist; GOAL/SPEC/PROMPTS non-empty; README quickstart | `prax_check.py` exits 0 |
| **Silver** | Bronze + every R-id cited by at least one test or `manual:` note; demo data present; offline explainer present | `prax_check.py --level silver` |
| **Gold** | Silver + P-REBUILD has been replayed once by a different model or language and the result passed P-VERIFY; logged in DECISIONS | manual, recorded |

Target for the first public release of each repo: **Silver**. All four systems built so far pass
it ([recorded](demo/data/check_ecosystem.txt)); none is Gold yet.
