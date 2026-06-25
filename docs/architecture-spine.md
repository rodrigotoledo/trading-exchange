# Architecture Spine

**The essential skeleton.** Start here to understand the system. For implementation details, see `architecture-detailed.md`.

---

## System Overview

**Agent Skills** is a distributed system for discovering, installing, and managing AI agent capabilities (skills).

```
┌──────────────┐
│   Developer  │
└──────┬───────┘
       │ npx @tech-leads-club/agent-skills
       │
       ▼
┌──────────────────────────────────────────┐
│ CLI (Node.js, interactive TUI)           │
├──────────────────────────────────────────┤
│ • Fetch skills from CDN                  │
│ • Browse/filter by category              │
│ • Download & install to agents           │
│ • Manage lockfile (.agents/.skill-lock)  │
└───────────────┬──────────────────────────┘
                │
    ┌───────────┴──────────────┐
    │                          │
    ▼                          ▼
┌─────────────┐        ┌──────────────┐
│ jsDelivr    │        │ Agent Dirs   │
│ CDN         │        │ ~/.cursor/   │
│ (registry)  │        │ ~/.claude/   │
└─────────────┘        │ ~/.copilot/  │
                       └──────────────┘
```

---

## Core Packages

| Package | Purpose | Deliverable |
| ------- | ------- | ----------- |
| **`packages/cli`** | User-facing installer | npm: @tech-leads-club/agent-skills |
| **`packages/skills-catalog`** | Skill definitions | npm + jsDelivr (registry) |
| **`packages/marketplace`** | Web UI for browsing | GitHub Pages static site |
| **`packages/mcp`** | MCP server for agents | npm: @tech-leads-club/agent-skills-mcp |
| **`libs/core`** | Shared types | npm: @tech-leads-club/core |
| **`tools/skill-plugin`** | Nx generator for skills | Internal tool |

---

## Key Invariants

1. **Skills are static documents** — No runtime execution. Skills are markdown instructions + optional templates/scripts.

2. **Security-first** — All skills scanned with Snyk Agent Scan before publishing. Immutable SHA-256 hashes in lockfiles.

3. **Multi-agent, single registry** — One source of truth for 19+ agents (Cursor, Claude Code, Copilot, etc.).

4. **Offline-capable** — Registry cached locally. Installation works without network (if already cached).

5. **Auditability** — Lockfile tracks what skills are installed where, by whom, when. Version control-friendly.

6. **Independent versioning** — Packages (cli, skills-catalog) release on their own schedules. No lockstep.

---

## Critical Flows

### Installation Flow
```
CLI fetches registry → User selects skills → Download (batched, 10 concurrent)
→ Validate SHA-256 → Copy/symlink to agent dirs → Write lockfile → Done
```

### Release Flow
```
Developer pushes code → CI/CD tests + lints → Snyk scan → Semantic release
→ npm publish → Registry regenerated → CDN updated → Worldwide available
```

---

## Technology Foundation

- **Language:** 100% TypeScript, strict mode (no `any`)
- **Monorepo:** Nx 22.6+ (shared cache, independent versioning)
- **Runtime:** Node.js ≥24 (monorepo), ≥22 (CLI package)
- **Module System:** ESM-only (no CommonJS)
- **Testing:** Jest 30 + ts-jest
- **Quality:** ESLint 9, Prettier (120 char, no semicolons)
- **Distribution:** npm (packages) + jsDelivr CDN (registry)

---

## Deployment Targets

| Component | Destination | Trigger |
| --------- | ----------- | ------- |
| CLI | npm registry | Semantic release |
| MCP Server | npm registry | Semantic release |
| Registry | jsDelivr CDN | Manual (after `npm run generate:data`) |
| Marketplace | GitHub Pages | Automatic (on release) |

---

## Risk & Mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Malicious skill injected | Snyk Agent Scan pre-release |
| Registry tampering | SHA-256 hashing + atomic lockfile writes |
| Installation fails silently | Lockfile validation (Zod) + audit log |
| Fragmentation across agents | Single skill format (SKILL.md), CLI installs to all agents |
| Performance: slow registry fetch | jsDelivr CDN + HTTP caching + gzip |

---

## Design Decisions

1. **CDN over npm for registry** — Fast, versioned, no npm dependency
2. **Lockfile v2 with Zod** — Integrity + reproducibility
3. **Batched downloads** — 10 concurrent = throughput without DoS
4. **Static skills** — No runtime code execution = secure by default
5. **MCP server separate** — Agents can query directly without CLI

---

**Version:** 1.0  
**Last Updated:** 2026-06-25  
**See Also:** `architecture-detailed.md` for implementation details, `prd.md` for features/use cases
