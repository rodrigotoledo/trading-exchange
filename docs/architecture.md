# Architecture Document

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   Agent Skills Ecosystem                         │
└─────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
    ┌────────┐            ┌────────────┐         ┌──────────┐
    │  CLI   │            │ Marketplace│         │MCP Server│
    │ (Node) │            │(Next.js 16)│         │  (Node)  │
    └────────┘            └────────────┘         └──────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                      ┌────────▼────────┐
                      │  jsDelivr CDN   │
                      │(skills-registry │
                      │     .json)      │
                      └────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │ Cursor   │         │Claude Code│        │Copilot &  │
   │ Windsurf │         │  + 16+    │        │ Others   │
   └──────────┘         └──────────┘         └──────────┘
```

## Monorepo Structure (Nx)

### Packages

#### 1. **`packages/cli`** — @tech-leads-club/agent-skills
The primary user-facing CLI tool.

**Purpose:**
- Interactive TUI (React + Ink) for skill browsing & installation
- Non-interactive CLI mode (Commander.js) for automation/CI
- Skill fetching, caching, installation, lifecycle management
- Lockfile (v2) creation and management

**Key Directories:**
```
packages/cli/
├── src/
│   ├── index.ts                    # Entry point
│   ├── commands/                   # Commander.js CLI commands
│   │   ├── install.ts
│   │   ├── list.ts
│   │   ├── remove.ts
│   │   ├── update.ts
│   │   └── ...
│   ├── services/                   # Business logic
│   │   ├── registry-service.ts     # Fetch & parse registry
│   │   ├── installer-service.ts    # Install skills to agents
│   │   ├── lockfile-service.ts     # Manage lockfile (v2)
│   │   ├── cache-service.ts        # Disk caching
│   │   ├── audit-service.ts        # Operation audit trail
│   │   └── agents.ts               # Agent configs (19+ agents)
│   ├── ui/                         # Ink/React TUI
│   │   ├── components/
│   │   └── screens/
│   └── types/
├── tests/
├── package.json                    # Node ≥22
└── tsconfig.json

**Dependencies:**
- commander (CLI parsing)
- ink, react (TUI)
- axios (HTTP)
- zod (validation, lockfile)
- chalk (colors)
- listr2 (progress)
```

**Agent Configuration:**
```typescript
// src/services/agents.ts
export const AGENT_CONFIGS = {
  cursor: {
    skillsDir: '~/.cursor/rules/skills',
    globalSkillsDir: '~/.cursor/rules',
    tier: 1,
  },
  'claude-code': {
    skillsDir: '~/.claude/skills',
    globalSkillsDir: '~/.claude',
    tier: 1,
  },
  copilot: { /* ... */ },
  // ... 19+ agents total
};
```

#### 2. **`packages/skills-catalog`** — Skill Definitions
Repository of all skill definitions.

**Structure:**
```
packages/skills-catalog/
├── skills/
│   ├── (development)/              # Category (parentheses = metadata)
│   │   ├── tlc-spec-driven/
│   │   │   ├── SKILL.md            # Main instructions (YAML + markdown)
│   │   │   ├── scripts/            # Executable scripts
│   │   │   ├── templates/          # File templates
│   │   │   └── references/         # On-demand documentation
│   │   └── ...other skills...
│   ├── (cloud)/
│   │   ├── aws-advisor/
│   │   └── ...
│   ├── (automation)/
│   │   ├── playwright-skill/
│   │   └── ...
│   ├── (design)/
│   ├── (security)/
│   └── ...
├── src/
│   └── generate-registry.ts        # Scans SKILL.md files → skills-registry.json
├── package.json
└── tsconfig.json

**Skill Format (SKILL.md):**
```yaml
---
name: my-skill
description: Brief description (max 1024 chars)
author: "Name/GitHub"
category: development | cloud | automation | design | security | ...
tags: [tag1, tag2]
compatibility: cursor | claude-code | all
license: MIT | CC-BY-4.0 | ...
---

# Skill Title

[Instructions, trigger phrases, execution details in markdown]
```

**Key Files:**
- **generate-registry.ts** — Scans all SKILL.md files
  - Parses YAML frontmatter
  - Computes SHA-256 content hashes
  - Generates skills-registry.json (committed to repo, published to npm)
  - Outputs skills.json for marketplace

#### 3. **`packages/marketplace`** — Next.js 16 Site
Interactive skill browsing & documentation.

**Purpose:**
- Static site deployed to GitHub Pages
- Search & filter skills by category
- Read skill descriptions, authors, compatibility
- Integration guides for each agent
- Community docs, contributing guides

**Structure:**
```
packages/marketplace/
├── src/
│   ├── app/
│   │   ├── page.tsx                # Home
│   │   ├── skills/
│   │   │   └── [slug]/page.tsx     # Individual skill page
│   │   ├── categories/
│   │   └── layout.tsx
│   ├── data/
│   │   └── skills.json             # Generated from registry
│   ├── components/
│   ├── lib/
│   └── styles/
├── next.config.ts                  # Static export
├── package.json
└── tsconfig.json
```

#### 4. **`libs/core`** — @tech-leads-club/core
Shared types and constants across packages.

**Exports:**
```typescript
export type AgentType = 'cursor' | 'claude-code' | 'copilot' | ...;
export type CategoryName = 'development' | 'cloud' | 'automation' | ...;

export interface SkillInfo {
  name: string;
  description: string;
  author: string;
  category: CategoryName;
  compatibility: AgentType[];
  hash: string; // SHA-256
  tags: string[];
}

export interface SkillsRegistry {
  version: string;
  timestamp: string;
  skills: SkillInfo[];
}

export interface LockfileEntry {
  skillName: string;
  version: string;
  installedAt: string;
  hash: string;
  agents: AgentType[];
}
```

#### 5. **`tools/skill-plugin`** — Nx Generator
Scaffolding tool for creating new skills.

**Command:**
```bash
nx g @tech-leads-club/skill-plugin:skill my-skill --category=development
```

**Generates:**
- `skills/(category)/my-skill/SKILL.md` (template)
- `scripts/`, `templates/`, `references/` directories

#### 6. **`packages/mcp`** — MCP Server
Model Context Protocol server for progressive skill access.

**Tools Exposed:**
- `list_skills` — Browse all skills by category
- `search_skills` — Fuzzy search skills
- `read_skill` — Load full SKILL.md content
- `fetch_skill_files` — Fetch specific scripts/templates/references

**Installation (Claude Code, Cursor, etc.):**
```json
{
  "mcpServers": {
    "agent-skills": {
      "command": "npx",
      "args": ["-y", "@tech-leads-club/agent-skills-mcp"]
    }
  }
}
```

---

## Data Flow

### Flow 1: User Installs Skills

```
User runs: npx @tech-leads-club/agent-skills
                    │
                    ▼
        ┌──────────────────────────┐
        │ TUI (Ink/React)          │
        │ - Fetch registry from CDN│
        │ - Browse/search skills   │
        │ - Select agents          │
        └──────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │ Installer Service        │
        │ - Validate selections    │
        │ - Download skill files   │
        │   (batched, 10 concurrent)
        │ - Cache locally          │
        └──────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │ Agent Installation       │
        │ - Copy or symlink        │
        │ - to ~/.cursor/rules/    │
        │ - ~/.claude/skills/      │
        │ - etc.                   │
        └──────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │ Lockfile (v2)            │
        │ - Write .agents/         │
        │   .skill-lock.json       │
        │ - Atomic write           │
        │ - Zod validation         │
        └──────────────────────────┘
                    │
                    ▼
                SUCCESS
            Skills ready to use
```

### Flow 2: Release Cycle

```
Developer pushes to main
                    │
                    ▼
        ┌──────────────────────────┐
        │ GitHub Actions CI/CD     │
        │ - Lint (ESLint)          │
        │ - Format check (Prettier)│
        │ - Tests (Jest)           │
        │ - Type check (TypeScript)│
        └──────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │ Snyk Agent Scan          │
        │ - Security scan all      │
        │   skills before release  │
        │ (incremental, if needed) │
        └──────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │ Semantic Release         │
        │ - Parse conventional     │
        │   commits                │
        │ - Generate CHANGELOG     │
        │ - Bump versions          │
        │ - Tag & push             │
        └──────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │ npm publish              │
        │ - CLI to npm registry    │
        │ - MCP server to npm      │
        └──────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │ Registry Update          │
        │ - generate-registry.ts   │
        │ - Scan all SKILL.md      │
        │ - Compute SHA-256        │
        │ - Create registry.json   │
        │ - Publish to jsDelivr    │
        └──────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │ Marketplace Deploy       │
        │ - Build Next.js static   │
        │ - Deploy to GitHub Pages │
        │ - skills.json published  │
        └──────────────────────────┘
                    │
                    ▼
            Available worldwide
            (CLI, marketplace, MCP)
```

---

## Technology Decisions

### 1. **Monorepo (Nx)**
**Decision:** Use Nx for multi-package coordination  
**Why:**
- Shared build cache across packages
- Consistent tooling (linting, testing, formatting)
- Independent versioning & release per package
- Task scheduling (affected builds)

### 2. **100% TypeScript + Strict Mode**
**Decision:** No JavaScript, `strict: true`  
**Why:**
- Security: Catches type mismatches early
- Reliability: No implicit `any` (error)
- Developer confidence: Refactoring is safe
- Enterprise requirement: Teams expect type safety

### 3. **ESM-only** (no CommonJS)
**Decision:** Node ≥22, VM modules, no .js/.cjs dual build  
**Why:**
- Future-proof (CommonJS deprecated)
- Cleaner module system
- Consistent across CLI + MCP + marketplace
- Jest with `--experimental-vm-modules`

### 4. **CDN Distribution (jsDelivr)**
**Decision:** Serve skills-registry.json from CDN, not npm  
**Why:**
- Fast global download (CLI fetch)
- Versioned URLs (immutable)
- No npm registry dependency
- Cache-friendly (HTTP headers)
- Lower bandwidth costs

### 5. **Lockfile v2 (Zod-validated)**
**Decision:** .agents/.skill-lock.json with atomic writes  
**Why:**
- Auditability: Track installed skills + hashes
- Integrity: Detect tampering or corruption
- Reproducibility: Same skills on all machines
- Security: Zod validation prevents injection

### 6. **MCP Server**
**Decision:** Separate MCP package for agent integration  
**Why:**
- Progressive disclosure (search → fetch on-demand)
- Direct agent integration (no CLI needed)
- Tool-based API (list_skills, search_skills, etc.)
- Future-proof (MCP becoming standard)

### 7. **Security Scanning**
**Decision:** Snyk Agent Scan pre-release (not runtime)  
**Why:**
- Prevents vulnerable skills at publish time
- No runtime overhead
- Industry standard (MCP security)
- Incremental scanning (SNYK_TOKEN)

---

## Deployment Architecture

### CLI Deployment
```
GitHub (source code)
    │
    ├→ npm registry           (npx @tech-leads-club/agent-skills)
    └→ GitHub Releases        (tagged commits)
```

### Registry Deployment
```
GitHub (skills-catalog/)
    │
    ├→ npm (skills-registry.json in package)
    └→ jsDelivr CDN          (fast global access)
                  ↓
            Downloaded by CLI on demand
```

### Marketplace Deployment
```
GitHub (packages/marketplace/)
    │
    └→ GitHub Pages          (static export)
       └→ https://tech-leads-club.github.io/agent-skills/
```

### MCP Deployment
```
GitHub (packages/mcp/)
    │
    └→ npm registry           (npx @tech-leads-club/agent-skills-mcp)
       └→ Installed in agent config
```

---

## Security Model

### Threat Model
1. **Malicious skill code** → Scanned with Snyk before publish
2. **Registry tampering** → SHA-256 hashing + lockfile validation
3. **Unauthorized installation** → User consent required per skill
4. **Privilege escalation** → Path isolation, no `sudo`
5. **Cache poisoning** → Lockfile validates downloaded hashes

### Defense Layers
1. **Pre-release scanning** — Snyk Agent Scan
2. **Content hashing** — SHA-256 per skill
3. **Immutable lockfile** — Zod validation, atomic writes
4. **Path isolation** — No traversal outside agent dirs
5. **Symlink guards** — Detect malicious links
6. **Audit trail** — Complete operation history

---

## Performance Considerations

### CLI Startup
- **Target:** <3 seconds (non-cached), <500ms (cached)
- **Strategy:** Lazy load, cache registry, parallel downloads (10 concurrent)

### Registry Fetch
- **Target:** <500ms
- **Strategy:** CDN (jsDelivr), HTTP caching, gzip compression

### Installation
- **Target:** <30 seconds for 5 skills
- **Strategy:** Batched downloads, parallel extraction, progress UI

### Marketplace Load
- **Target:** <2s
- **Strategy:** Next.js static export, CDN, image optimization

---

## Monitoring & Observability

### Metrics
- CLI startup time
- Registry fetch latency
- Installation success rate
- Skill download bandwidth
- Error rates per agent
- Audit trail entries

### Logging
- Install/update/remove operations → Audit log
- Errors → stderr
- Debug info → environment variable (`DEBUG=agent-skills:*`)

### Alerting (Future)
- High error rates
- Snyk scan failures
- CDN availability

---

## Future Roadmap

### Short-term (Q3 2026)
- Expand skill catalog (500+ skills)
- Add 5+ more agents
- Enterprise compliance features (SOC 2)

### Medium-term (Q4 2026)
- Monetization (premium skills)
- Custom domain marketplace
- Skill versioning & pinning

### Long-term (2027)
- Enterprise support contracts
- Self-hosted registry option
- Skill marketplace partnerships

---

**Last Updated:** 2026-06-25  
**Architecture Version:** 1.0  
**Next Review:** 2026-09-25
