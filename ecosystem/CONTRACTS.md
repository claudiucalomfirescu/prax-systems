# Ecosystem contracts

The four systems built with Prax Systems share no code packages, only **versioned contracts**. Each
contract has one owner, and the owner's `blueprint/SPEC.md` defines it in full. Consumers cite it by
id and version in their own SPEC ("Contracts we depend on") and copy only the part they rely on.

This file is the registry: who owns what, and where to read it. It deliberately does not repeat the
definitions, so it cannot drift from them. (Until 2026-11-13 it held a v1 proposal of each contract;
the owners have since taken them over and extended them, so their SPECs are the truth.)

| Contract | What it is | Owner (defined in) | Consumers |
|---|---|---|---|
| `K-openai-chat@1` | OpenAI-compatible `POST /v1/chat/completions`, with `tools` / `tool_calls` | external standard | all four |
| `K-agent-headers@1` | Who is calling: `X-Agent-User` → `calls.user` (fallback `key:` + 8 hex of the key's SHA-256), `X-Agent-Id`, `X-Session-Id`, `X-Agent-Dept`, other `X-Agent-*` → `labels`; stripped before upstream | [llm-proxy-log](https://github.com/claudiucalomfirescu/llm-proxy-log/blob/main/blueprint/SPEC.md) | llm-proxy-firewall, vxc-motors-sim, llm-session-console |
| `K-log-schema@1` | SQLite `calls` table, one row per LLM exchange | [llm-proxy-log](https://github.com/claudiucalomfirescu/llm-proxy-log/blob/main/blueprint/SPEC.md) | llm-proxy-firewall, llm-session-console |
| `K-log-schema@2` | @1 plus `calls.firewall_level` and the `signals` and `admin_actions` tables | [llm-proxy-firewall](https://github.com/claudiucalomfirescu/llm-proxy-firewall/blob/main/blueprint/SPEC.md) | vxc-motors-sim, llm-session-console |
| `K-firewall-rules@1` | The YAML topics file: topics, levels, keyword and co-occurrence rules, intent descriptions | [llm-proxy-firewall](https://github.com/claudiucalomfirescu/llm-proxy-firewall/blob/main/blueprint/SPEC.md) | vxc-motors-sim (ships its own topics file) |
| `K-vxc-tools@1` | The dealership's apps as OpenAI tools over local HTTP services, and what is really behind each one | [vxc-motors-sim](https://github.com/claudiucalomfirescu/vxc-motors-sim/blob/main/blueprint/SPEC.md) | none outside the repo yet |
| `K-vxc-run@1` | A recorded simulation run folder: `proxy.db`, each agent's log, the director's timeline, a summary and end-of-day data | [vxc-motors-sim](https://github.com/claudiucalomfirescu/vxc-motors-sim/blob/main/blueprint/SPEC.md) | none outside the repo yet (the console reads only a run's `proxy.db`, through K-log-schema@2) |
| `K-console-api@1` | The console's read-only JSON API | [llm-session-console](https://github.com/claudiucalomfirescu/llm-session-console/blob/main/blueprint/SPEC.md) | none outside the repo yet |

## How a contract stays honest

- **Fixtures, not promises.** A consumer's tests load data produced by the owner. The console ships
  the Brightleaf demo logs of both proxies and a recorded VXC day, so a schema change that breaks it
  shows up as a failing console test.
- **Additive changes keep the version.** Consumers must tolerate extra columns, tables and labels.
  Removing or renaming something another repo relies on needs a new version id (`@2`, `@3`).
- **Copies, not imports.** When a repo needs another repo's code (llm-proxy-firewall started as a
  copy of llm-proxy-log; vxc-motors-sim vendors the firewall proxy), it copies it and keeps its own
  tests. The contract version is what tells you two copies still agree.
