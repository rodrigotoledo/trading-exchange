# Product Requirements Document (PRD)

## Project Overview

**Agent Skills** is a secure, validated skill registry for professional AI coding agents (Claude Code, Cursor, Copilot, Windsurf, Cline, and 16+ others). It provides verified, tested, and safe capabilities that extend AI agent functionality across development, cloud, automation, design, security, and more.

## Vision & Mission

**Vision:** Create an ecosystem of trusted AI agent capabilities developers can confidently integrate into workflows without security concerns or market fragmentation.

**Mission:** Build and maintain a hardened, open-source library of skills—verified, scanned, and installable across 19+ AI coding agents.

## Problem Statement

**The Challenge:**
- Open skill marketplaces contain ~13% critical vulnerabilities (per Snyk Agent Scan)
- Fragmented ecosystems mean skills work differently across agents
- No standardized security model for agent capabilities
- Developers must choose between convenience (unsafe) and security (tedious)

**The Gap:**
A managed, hardened, unified registry trusted by professional developers and teams.

## Core User Personas

### Primary
1. **Senior Software Engineers** — Want battle-tested skills for complex workflows
2. **Architects & Tech Leads** — Need security-first capabilities and standardization
3. **DevOps & Platform Teams** — Require auditability, compliance, and reproducibility

### Secondary
1. **AI Agent Tool Authors** — Need skill distribution channels
2. **Security-minded Teams** — Require vulnerability scanning and compliance
3. **Open-source Contributors** — Want to contribute verified skills

## Key Features

### 1. Skill Catalog & Registry
- **500+ vetted, categorized skills** (development, cloud, automation, design, security, etc.)
- Search, browse, filter by category
- Skill metadata: description, author, category, compatibility
- Progressive disclosure via MCP server (search → fetch on-demand)

### 2. Installation & Lifecycle Management
- **Multi-agent support** — Install to 19+ agents (Cursor, Claude Code, Copilot, Windsurf, Cline, Amazon Q, Augment, etc.)
- **Dual modes** — Interactive TUI (React + Ink) or non-interactive CLI (Commander.js)
- **Flexible scoping** — Global (user home `~/.claude/`, `~/.cursor/`) or project-local
- **Installation methods** — Copy (default, safe) or symlink (dev-friendly)
- **Lockfile management** — v2 format, Zod-validated, atomic writes, audit trail

### 3. Security & Integrity
- **Pre-release scanning** — All skills scanned with Snyk Agent Scan before publishing
- **Immutable integrity** — SHA-256 content hashing, lockfile-based verification
- **Defense-in-depth** — Sanitization, path isolation, symlink guards
- **Audit trail** — Complete operation history (install, update, remove)
- **No binaries** — 100% open source, static analysis in CI/CD

### 4. Skill Structure & Quality
- **Standardized format** — SKILL.md (YAML frontmatter + markdown body)
- **Modular resources** — Scripts, templates, on-demand references
- **Quality gates** — Nx generator for scaffolding, linting, formatting (Prettier, ESLint)
- **Semantic versioning** — Independent versioning per package (cli, skills-catalog)
- **Conventional commits** — Automated release workflows

### 5. Distribution & CDN
- **jsDelivr CDN** — Fast, global delivery of skills-registry.json
- **On-demand fetching** — Batched downloads (10 concurrent), caching
- **Offline support** — Cached at ~/.cache/agent-skills/
- **MCP Server** — list_skills, search_skills, read_skill, fetch_skill_files tools

### 6. Marketplace & Documentation
- **Next.js 16 static site** — GitHub Pages deployment
- **Interactive browsing** — Filter by category, search, read descriptions
- **Integration docs** — Setup guides for all 19+ supported agents
- **Developer docs** — Contributing guide, skill creation tutorials

## Technical Stack

| Component | Tech | Notes |
| --------- | ---- | ----- |
| **CLI** | Node.js ≥22, Commander.js, Ink + React | Interactive TUI + non-interactive mode |
| **Marketplace** | Next.js 16, React, TypeScript | Static site, GitHub Pages |
| **MCP Server** | Node.js, @modelcontextprotocol | Skill discovery tools |
| **Monorepo** | Nx 22.6+ | Shared cache, independent versioning |
| **Language** | 100% TypeScript, strict mode | No `any`, type safety mandatory |
| **Testing** | Jest 30 + ts-jest, fast-check | Unit + property-based tests |
| **Quality** | ESLint 9, Prettier | 120 char, no semicolons, organize-imports |
| **Security** | Snyk Agent Scan | Pre-release scanning (requires SNYK_TOKEN) |
| **Release** | Semantic Release, conventional commits | Automated versioning (cli, skills-catalog) |
| **Distribution** | npm registry, jsDelivr CDN | CLI via npm, registry via CDN |

## Core Use Cases

### Use Case 1: Developer Installs Skills
**Actor:** Senior Software Engineer  
**Flow:**
1. Run `npx @tech-leads-club/agent-skills` in project or globally
2. Interactive wizard: Choose skills, select agents (Cursor, Claude Code, etc.), install method
3. Skills downloaded, cached, installed to agent directories
4. Lockfile created (.agents/.skill-lock.json)
5. Ready to use in IDE

**Outcome:** Skills available in agent, verified safe, auditable

### Use Case 2: Security Team Audits Installed Skills
**Actor:** Platform/Security Engineer  
**Flow:**
1. Review lockfile (.agents/.skill-lock.json) in version control
2. Check SHA-256 hashes against published registry
3. Run `agent-skills audit` to view operation history
4. Confidence: no unauthorized skills, all verified

**Outcome:** Compliance, auditability, confidence

### Use Case 3: Contributor Creates & Publishes New Skill
**Actor:** Open-source Contributor  
**Flow:**
1. Run `nx g @tech-leads-club/skill-plugin:skill my-skill --category=development`
2. Author SKILL.md (description, triggers, execution details)
3. Add scripts, templates, references as needed
4. Push to GitHub, Snyk scan passes, merge
5. `npm run generate:data` updates skills-registry.json
6. Skill published to jsDelivr CDN, available worldwide

**Outcome:** Contribution, community value, distribution

## Success Metrics

### Product Metrics
- **Adoption:** # unique skill installations / month
- **Catalog Growth:** # skills in registry (target: 500+)
- **Quality:** % of skills passing Snyk scan (target: 100%)
- **Agent Coverage:** # supported agents (target: 19+)

### User Satisfaction
- **NPS:** Net Promoter Score (via feedback)
- **Security Confidence:** % users trust security model
- **Usability:** Installation success rate (target: ≥95%)

### Engineering Metrics
- **Release Cadence:** Weeks between releases
- **Test Coverage:** % of codebase covered
- **Performance:** CLI startup time, registry fetch latency

## Constraints & Assumptions

### Constraints
- **Node ≥22** — Monorepo uses latest Node features (VM modules)
- **Open Source Only** — No proprietary skills
- **ESM-only** — JavaScript modules, no CommonJS
- **Security-first** — All skills scanned before release
- **Storage:** npm (CLI) + GitHub Pages (marketplace) + jsDelivr (registry)

### Assumptions
1. Developers want unified skill distribution across agents
2. Security is a primary concern for enterprise/professional users
3. Open source community will contribute high-quality skills
4. MCP (Model Context Protocol) becomes standard for agent extensions
5. AI agents continue to be the primary development tool for many engineers

## Roadmap

| Phase | Target | Status |
| ----- | ------ | ------ |
| **Phase 1: MVP** | 50+ skills, CLI + marketplace, 5 agents | ✅ Complete |
| **Phase 2: Expansion** | 200+ skills, 10+ agents, MCP server | 🔄 In Progress |
| **Phase 3: Enterprise** | 500+ skills, 19+ agents, SOC 2 compliance | 📅 Planned Q3 2026 |
| **Phase 4: Ecosystem** | Premium skills, enterprise contracts, partnerships | 📅 Planned 2027 |

## Out of Scope

- Closed-source/proprietary skills
- Agent development (we distribute skills, not agents)
- Custom deployment infrastructure (GitHub Pages + CDN only)
- Runtime execution environment (skills are static instructions)
- Real-time skill updates (registry updates on release cycle)

---

**Last Updated:** 2026-06-25  
**Author:** Tech Leads Club  
**Version:** 1.0
