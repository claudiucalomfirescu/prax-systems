# Roadmap · Prax Systems

Status: ✅ done · 🔜 in progress · ⏳ planned · 💤 parked

| Milestone | Delivers | Status |
|---|---|---|
| M1 · v0.1 method, templates, checker | R-001…R-011 | ✅ 2026-10-30 |
| M2 · Applied to 4 repos (proxy-log, proxy-firewall, motors-sim, session-console) | Silver for each | ✅ 2026-10-31, published 2026-11-01 |
| M3 · Animated explainer of the method, published | R-007 | ✅ 2026-10-31 |
| M4 · Blueprint folder (K-prax-repo@0.2) + README callout in all 5 repos | R-012, R-013 | ✅ 2026-11-02 |
| M5 · Method 0.3: written down from practice (README diagram, video, maintenance prompts, copies not imports), R-007 automated, ecosystem check, contract registry, 60 s video | R-007, R-008, R-014, D-010…D-014 | ✅ 2026-11-13 |
| M6 · First Gold: rebuild llm-proxy-log from P-REBUILD in another language (e.g. Go or TypeScript) and pass P-VERIFY | Gold | ⏳ |
| M7 · Language-neutral acceptance tests (HTTP/SQL fixtures run by a tiny harness, so a rebuild in any language reuses them unchanged) | | ⏳ |

## Next
M6 is the one that matters: until one system has been rebuilt from its blueprint by a different
model or in a different language, the central claim of the method is untested. llm-proxy-log is the
best first candidate (34 requirements, stdlib only, black-box HTTP and SQLite tests).

## Ideas, not commitments
- A catalogue page generated from every repo's prax.yaml.
- `prax_check.py --fix` that copies missing templates in.
- Prompt "lineage": record model + date per P-xx when it is re-run.
