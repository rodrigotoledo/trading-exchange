# Documentation Index

Quick reference for all project documentation.

---

## 📚 Core Documents (Read These First)

### 1. **[prd.md](prd.md)** — Product Requirements Document
**What:** Features, use cases, success metrics, roadmap  
**Who:** Product managers, stakeholders, architects  
**When:** Planning features, understanding "why"  
**Length:** ~2,000 words

**Key Sections:**
- Problem statement (13% of skills have vulnerabilities)
- Core features (6 pillars)
- Success metrics (adoption, quality, usability)
- Roadmap (4 phases)

---

### 2. **[architecture-spine.md](architecture-spine.md)** — System Architecture (Essentials)
**What:** The skeleton. How the system works at a high level  
**Who:** Everyone (5-10 min read)  
**When:** Getting oriented, understanding data flow  
**Length:** ~350 words

**Key Sections:**
- System overview (diagram)
- Core packages (what each does)
- Key invariants (guardrails)
- Critical flows (installation, release)
- Deployment targets

**→ Start here if new to the project**

---

### 3. **[architecture-detailed.md](architecture-detailed.md)** — Implementation Details
**What:** Deep dive. How each package works, database schemas, code structure  
**Who:** Developers implementing features  
**When:** Building, modifying code, troubleshooting  
**Length:** ~4,200 words

**Key Sections:**
- Monorepo structure (all packages)
- Data flows (user install, release cycle)
- Technology decisions + reasoning
- Security model (threat, layers)
- Performance baselines

---

## 🔄 BMAD Workflow Documents

### 4. **[BMAD-workflow.md](BMAD-workflow.md)** — Generic BMAD Patterns
**What:** How to use BMAD-METHOD with Claude Code (any project)  
**Who:** You (once per session or when learning BMAD)  
**When:** Starting a task, unclear on process  
**Length:** ~1,500 words

**Key Sections:**
- 4 patterns (single-phase, full cycle, iterative, discovery)
- Phase details (B, M, A, D)
- Best practices & anti-patterns
- Example: Real task using BMAD

---

### 5. **[BMAD-project.md](BMAD-project.md)** — Project-Specific BMAD
**What:** How to use BMAD specifically in Agent Skills project  
**Who:** You (before asking me to code something)  
**When:** Planning a feature, bug fix, or refactor  
**Length:** ~2,000 words

**Key Sections:**
- Project context (what is Agent Skills)
- BMAD patterns for this project (small fix, feature, complex)
- Phase checklists (B, M, A, D specifics)
- Common tasks & which pattern to use
- Nx commands, conventions, golden rules

---

## 📖 How to Use This Documentation

### Scenario 1: You're new to the project
1. Read **architecture-spine.md** (5-10 min)
2. Skim **prd.md** (10-15 min)
3. Bookmark **BMAD-project.md** for later

### Scenario 2: You're starting a feature with BMAD
1. Read **BMAD-workflow.md** (if first time with BMAD)
2. Open **BMAD-project.md** (reference while working)
3. Request from Claude following the patterns

### Scenario 3: You're debugging or refactoring
1. Read **architecture-detailed.md** (relevant section)
2. Reference **BMAD-project.md** for M phase (testing)
3. Ask Claude with specific context

### Scenario 4: You're planning roadmap
1. Read **prd.md** (roadmap, success metrics)
2. Read **architecture-spine.md** (feasibility check)
3. Discuss with Claude

---

## 🗺️ Document Relationships

```
     ┌─ PRD (what to build)
     │
     ├─ Architecture Spine (how, at 30,000 ft)
     │  └─ Architecture Detailed (implementation)
     │
     └─ BMAD Workflow (generic process)
        └─ BMAD Project (process for Agent Skills)
```

**Flow when building a feature:**
```
PRD (understand requirement)
  ↓
Architecture Spine (understand constraints)
  ↓
BMAD-project.md (which pattern?)
  ↓
Ask Claude with context
  ↓
Claude follows BMAD cycle
  ↓
Review + approve
```

---

## 📍 Reference: Key Conventions

**From CLAUDE.md (Project Instructions):**
- Nx monorepo with independent versioning
- 100% TypeScript, strict mode, no `any`
- ESM-only (no CommonJS)
- Jest with `NODE_OPTIONS='--experimental-vm-modules'`
- Prettier: no semicolons, 120 char width, organize-imports

**From Architecture Spine:**
- Skills are static (no runtime execution)
- Single registry for 19+ agents
- Offline-capable (cached)
- Auditability via lockfiles

**From BMAD-project.md:**
- Always run full test suite (M phase)
- Type check before declaring done
- Performance budgets: CLI <3s, registry fetch <500ms
- Backward compatibility: Old skills must still work

---

## ⚡ Quick Commands

```bash
# Development
npm run build
npm test
npm run lint
npm run format

# Single package
npm test --workspace=@tech-leads-club/agent-skills

# Create new skill
npm run generate:skill

# Develop CLI
npm run start:dev:cli

# Generate registry (after modifying skills)
npm run generate:registry
```

---

## 🔗 External Resources

- **BMAD-METHOD:** https://github.com/bmad-code-org/BMAD-METHOD
- **Tech Leads Club:** https://tech-leads-club.github.io/agent-skills/
- **Agent Skills GitHub:** https://github.com/tech-leads-club/agent-skills

---

## 📝 Document Maintenance

| Document | Last Updated | Next Review | Owner |
| -------- | ------------ | ----------- | ----- |
| prd.md | 2026-06-25 | 2026-09-25 | PM |
| architecture-spine.md | 2026-06-25 | 2026-09-25 | Tech Lead |
| architecture-detailed.md | 2026-06-25 | 2026-09-25 | Tech Lead |
| BMAD-workflow.md | 2026-06-25 | 2026-12-25 | Process Owner |
| BMAD-project.md | 2026-06-25 | 2026-12-25 | Process Owner |
| INDEX.md | 2026-06-25 | 2026-12-25 | Docs Owner |

---

**Last Updated:** 2026-06-25  
**Version:** 1.0  
**Start Here:** [architecture-spine.md](architecture-spine.md)
