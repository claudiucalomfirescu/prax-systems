# Writing the animated explainer

One file: `explainers/index.html`. Self-contained (inline CSS/JS/SVG, no CDN, no fetch), opens from
`file://`, light and dark, respects `prefers-reduced-motion`, readable at 375px wide.

## Scenes (in this order)
1. **What** — the system in one picture: its components as labelled shapes.
2. **The problem** — the world without it (e.g. agents call the LLM directly; nobody sees what they say).
3. **How it works** — one real request (ideally from `demo/data/`) travels through every component;
   each hop highlights and a caption explains it. Controls: ▶ play / ❚❚ pause / step ← → / speed.
4. **What you get** — the output (dashboard, log rows, blocked reply), drawn from demo data.
5. **Replicate it** — the exact commands from README, and "build your own": what to change for your case.

## Rules
- Use real names from SPEC.md (headers, tables, routes). The explainer is documentation, not marketing.
- Each scene has a heading and a 1–3 sentence caption a non-engineer understands.
- Keyboard: space = play/pause, arrows = step.
- Publish it as an artifact and put the link in README and `prax.yaml`.
- Load nothing from the network (no CDN script, web font or remote image); the Silver check fails
  otherwise. Plain links out are fine.

# The README diagram: `explainers/readme-flow.svg`
One animated SVG shown at the top of the README (`<img src="explainers/readme-flow.svg" width="100%">`).
GitHub strips scripts from SVG, so animate with CSS keyframes or SMIL only. Show the parts as boxes
and one request or record moving through them, with a one-line caption per step. Keep it under
~20 KB and readable on a dark and a light page (draw your own background).

# The short video (optional)
For readers who will not click through the explainer. About a minute, silent, 1920×1080, one
caption per scene, built from **real** screenshots and **real** numbers from `demo/data/` (never
mock-ups). Keep the source next to it, e.g. a Remotion project in `explainers/video/`, so the video
can be re-rendered when the system changes, and do not commit `node_modules/`. Link the MP4 from
the README and from `prax.yaml` (`explainer.video`). Aim for under ~5 MB.
