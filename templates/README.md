# <name>

> <one-liner from prax.yaml>

<p align="center"><img src="explainers/readme-flow.svg" alt="Animated diagram of how <name> works" width="100%"></p>

> [!IMPORTANT]
> **This repo publishes the blueprint, not just the code.** Most projects share only their code.
> This one also ships, in [`blueprint/`](blueprint/), the goal, the full specification, the
> architecture, every design decision and the ordered prompts an LLM followed to build it. Code is
> written by today's models and ages with them; the blueprint does not. When a more capable model
> arrives, anyone can hand it the blueprint, regenerate this project from scratch (in this language
> or another) and prove the result with the same tests and recorded demo data.
> [How to rebuild it ↓](#rebuild-it-from-the-blueprint)

## The problem it solves
One paragraph: the world without this system, in words a stranger understands.

## What it is
Two or three sentences, then the screenshots that matter.

**Animated explainer:** [explainers/index.html](explainers/index.html) · [published](<artifact link>) ·
**Video (≈60 s, optional):** [explainers/<name>-explainer.mp4](explainers/<name>-explainer.mp4)

## 60-second quickstart (no API key)
```bash
git clone <url> && cd <name>
pip install -r requirements.txt
python3 demo/run_demo.py         # opens on recorded demo data
```

## Run it live
```bash
export <KEY>=...
...
```

## How it works
One Mermaid diagram, five bullets. Details: [ARCHITECTURE.md](blueprint/ARCHITECTURE.md).

## Rebuild it from the blueprint

The code is one rendering of the specification; [`blueprint/`](blueprint/) is the system itself.

| File | What it holds |
|---|---|
| [GOAL.md](blueprint/GOAL.md) | why it exists, who it is for, what success looks like, non-goals |
| [SPEC.md](blueprint/SPEC.md) | the source of truth: components, versioned contracts and numbered requirements (R-…) |
| [ARCHITECTURE.md](blueprint/ARCHITECTURE.md) | how the parts fit, and where each requirement lives in the code |
| [PROMPTS.md](blueprint/PROMPTS.md) | the ordered prompts that built it (P-01…), plus P-REBUILD and P-VERIFY |
| [DECISIONS.md](blueprint/DECISIONS.md) | every design choice, with the alternatives and consequences |
| [ROADMAP.md](blueprint/ROADMAP.md) | milestones done and what comes next |

To regenerate the project, give a coding model the `blueprint/` folder and the **P-REBUILD**
prompt from PROMPTS.md, then run **P-VERIFY**. The tests in `tests/` cite the requirement ids
they prove and `demo/data/` holds recorded traffic, so you can tell whether the rebuild behaves
like this one. The method behind it is [Prax Systems](https://github.com/claudiucalomfirescu/prax-systems).

## Tests
```bash
python3 -m unittest discover -s tests    # offline, fake upstream
```
