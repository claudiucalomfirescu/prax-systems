# Demo · Prax Systems

Everything here runs with Python 3 and git, offline except for cloning. No key.

## Check the smallest compliant repo
```bash
python3 tools/prax_check.py examples/minimal --level silver
```
You should see `PASS (silver)` and `3/3 requirements covered`. Recorded:
[data/check_minimal.json](data/check_minimal.json).

## Check the whole ecosystem
```bash
./demo/check_ecosystem.sh
```
Uses `../llm-proxy-log` and the other three when they are cloned next to this repo, otherwise makes
a shallow clone of each in a temporary folder. Each one should print `PASS (silver)` with all of its
requirements covered (34, 58, 31 and 33). Recorded: [data/check_ecosystem.txt](data/check_ecosystem.txt) (R-014).

## Five-minute walkthrough
1. Read [METHOD.md](../METHOD.md) §2, the six layers: the method fits in one read (R-101).
2. Run the checker on `examples/minimal`: PASS (R-001…R-006).
3. Break it in a scratch copy and watch the checker name the problem:
   ```bash
   cp -r examples/minimal /tmp/m && rm /tmp/m/blueprint/PROMPTS.md
   python3 tools/prax_check.py /tmp/m        # ✗ missing blueprint/PROMPTS.md   (R-001, R-003)
   mv /tmp/m/blueprint/SPEC.md /tmp/m/
   python3 tools/prax_check.py /tmp/m        # ✗ SPEC.md is in the repo root   (R-012)
   ```
4. Open [explainers/index.html](../explainers/index.html) with the network off; nothing is missing
   (R-007, also checked by the tests).
5. Read [ecosystem/CONTRACTS.md](../ecosystem/CONTRACTS.md): each shared contract has one owner (R-008).
