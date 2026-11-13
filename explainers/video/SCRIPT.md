# Prax Systems explainer video: script

Video: [../prax-explainer.mp4](../prax-explainer.mp4) · 61.5 s · 1920×1080 · 30 fps · no audio ·
Remotion, all scenes in [`src/Composition.tsx`](src/Composition.tsx). File names, layers and rules
come from METHOD.md and SPEC.md; the four PASS lines are the real output recorded in
[`demo/data/check_ecosystem.txt`](../../demo/data/check_ecosystem.txt) (13 Nov 2026); the R-ids in
the rebuild scene are real requirements of llm-proxy-log. The rebuild itself is labelled as Gold,
next on the roadmap: it has not happened yet.

Re-render:
```bash
cd explainers/video && npm ci
npx remotion render PraxExplainer out/raw.mp4 --browser-executable=/opt/pw-browsers/chromium
ffmpeg -i out/raw.mp4 -c:v libx264 -crf 31 -tune animation -pix_fmt yuv420p -movflags +faststart ../prax-explainer.mp4
```
(`--browser-executable` only where Remotion cannot download its own Chromium.)

| # | Time | Scene | On screen |
|---|---|---|---|
| 1 | 0:00–0:04 | Title | Blueprint-and-code mark, "Ship code with the specs and prompts to rebuild it". |
| 2 | 0:04–0:12 | The problem | A code file greys out ("months later: a better model, a new language") while the chat that held the reasons scrolls away. |
| 3 | 0:12–0:22 | The fix | The six `blueprint/` files appear, then tests + demo data, explainers, and the code drawn dashed: one rendering of the spec. |
| 4 | 0:22–0:30 | Six layers | Intent, Contract, Proof, Recipe, Shape, Rendering, ordered by how long they stay true; Rendering fades as replaceable. |
| 5 | 0:30–0:41 | Rebuild | llm-proxy-log's blueprint → a future model (P-REBUILD) → rendering 2 → P-VERIFY ticks four real R-ids. Labelled Gold, next on the roadmap. |
| 6 | 0:41–0:50 | Keep it honest | `./demo/check_ecosystem.sh` types out; the four recorded PASS (silver) lines with 34, 58, 31 and 33 requirements. |
| 7 | 0:50–0:56 | Ecosystem | The four repos joined by K-agent-headers@1, K-log-schema@1 and @2. |
| 8 | 0:56–1:01 | Outro | "Copy the templates. Let the checker list the gaps." + the command and the repo URL. |
