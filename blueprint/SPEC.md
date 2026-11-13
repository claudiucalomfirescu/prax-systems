# Specification · Prax Systems

> Version 0.3 · 2026-11-13 (0.2: 2026-11-02, 0.1: 2026-10-30) · Contracts provided: `K-prax-repo@0.2` (the repository contract),
> `K-prax-manifest@0.1` (prax.yaml). The explanation lives in [METHOD.md](../METHOD.md); this file is
> the testable core.

## 1. Glossary
| Term | Meaning |
|---|---|
| System | Several cooperating components whose important behaviour happens between them |
| Ecosystem | Several systems (repos) that share versioned contracts |
| Component (C-xx) | A part with one responsibility: a process, a store, an agent group, a UI |
| Contract (K-name@v) | An interface another part depends on: routes, headers, schemas, file formats |
| Requirement (R-xxx) | One testable behaviour with an acceptance check |
| Prompt (P-xx) | One recorded instruction to a coding model that produced part of the repo |
| Rendering | The code: one implementation of the spec |

## 2. Components
| Id | Component | Responsibility |
|---|---|---|
| C-01 | METHOD.md | Explains the layers, files, workflow, rules, ecosystems, rebuilds |
| C-02 | templates/ | One template per required file |
| C-03 | tools/prax_check.py | Checks a repo against K-prax-repo (bronze, silver) |
| C-04 | explainers/ | Animated explainer of the method, README diagram, short video and its source |
| C-05 | demo/check_ecosystem.sh | Runs the Silver check on every published system |
| C-06 | ecosystem/ | Registry of the contracts the systems share, and the history of the split |

## 3. Contracts

### K-prax-repo@0.2 — files every Prax System repo contains
In the root: `prax.yaml`, `README.md`. In `blueprint/`: `GOAL.md`, `SPEC.md`, `ARCHITECTURE.md`,
`PROMPTS.md`, `ROADMAP.md`, `DECISIONS.md` (none of these six may stay in the root). For Silver also `demo/DEMO.md`, non-empty `demo/data/`, `explainers/index.html`,
`tests/`.

### K-prax-manifest@0.1 — prax.yaml
Top-level keys: `prax`, `name`, `kind` (`system` | `method`), `one_liner`, `status`, `run` (with
`demo`, `tests`), `docs`, `explainer` (`file`, `published`). Optional: `components`, `contracts`
(`provides`, `depends_on`), `built_with` (`model`, `date`, `language`, `demo_data_model`),
`level_target`, `run.install`, `run.live`, `run.offline`, `explainer.video`, extra `docs` entries.
Tools MUST ignore keys they do not know (0.3 only documented the optional keys the four systems
already used; nothing became required, so the version stays 0.1).

## 4. Requirements
| Id | Requirement | Acceptance check |
|---|---|---|
| R-001 | Every repo MUST contain the K-prax-repo bronze files | test_R001 (checker flags a missing file) |
| R-002 | SPEC.md MUST define numbered requirements R-xxx, each with an acceptance check | test_R002 |
| R-003 | PROMPTS.md MUST contain step prompts P-01… plus P-REBUILD and P-VERIFY | test_R003 |
| R-004 | prax.yaml MUST carry the K-prax-manifest required keys | test_R004 |
| R-005 | Silver: every R-id MUST be cited by a test or marked manual in SPEC.md | test_R005 |
| R-006 | Silver: demo/data MUST hold recorded data so a clone works without secrets | test_R006 |
| R-007 | Silver: explainers/index.html MUST exist and be self-contained: it loads no script, style, font or image from the network (plain links are fine) | test_R007 |
| R-008 | Contracts shared across repos MUST have a versioned id and one owner | manual: the registry in ecosystem/CONTRACTS.md |
| R-009 | The checker MUST run on the Python standard library only | test_R009 |
| R-010 | Templates MUST exist for every bronze file plus demo/DEMO.md and the explainer guide | test_R010 |
| R-011 | Template placeholders left in a repo MUST be reported | test_R011 |
| R-012 | The six blueprint files MUST live in `blueprint/`; a copy left in the repo root is reported | test_R012 |
| R-013 | README.md MUST point readers to `blueprint/` (the "we publish the blueprint" callout) | test_R013 |
| R-014 | `demo/check_ecosystem.sh` MUST run the Silver check on every published system, with no key and no setup beyond git | manual: demo/data/check_ecosystem.txt |

## 5. Quality bars
| Id | Bar | Check |
|---|---|---|
| R-101 | The method fits in one read (METHOD.md under ~400 lines) | manual: line count |

## 6. Out of scope
Code generation, CI wiring, hosting of explainers, Gold automation (Gold stays a recorded manual rebuild).
