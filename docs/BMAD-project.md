# BMAD Workflow - Agent Skills Project

Como usar BMAD-METHOD especificamente neste projeto (Agent Skills monorepo).

---

## 🎯 Project Context

**Project:** Agent Skills — Secure skill registry for 19+ AI coding agents  
**Stack:** Nx monorepo (TypeScript, Node ≥24, ESM-only)  
**Structure:**
- `packages/cli/` — CLI installer
- `packages/skills-catalog/` — Skill definitions + registry generator
- `packages/marketplace/` — Next.js static site
- `packages/mcp/` — MCP server
- `libs/core/` — Shared types
- `tools/skill-plugin/` — Nx generator

**Reference Docs:**
- `prd.md` — What we're building
- `architecture-spine.md` — System design (lean)
- `architecture-detailed.md` — Deep dive
- `BMAD-workflow.md` — Generic BMAD patterns (read first if new to BMAD)

---

## 🔄 BMAD Cycle - Agent Skills Style

### Pattern 1: Fix or Small Feature

**Example:** "Add timezone handling to skill timestamps"

**Your Request:**
```
@claude Feature: Add timezone to skill timestamps

BMAD: B only (small fix)
- B: Modify SkillInfo interface + timestamp in registry generator
- Files: libs/core/types.ts, packages/skills-catalog/generate-registry.ts

I'll then:
- M: npm test (verify type safety)
- A: Check no breaking changes to existing skills
- D: Commit if passing
```

**Your Role:**
1. Run `npm test` after I implement
2. Review output
3. Approve commit or ask for changes

**Typical Duration:** 15-30 min

---

### Pattern 2: Feature or Bug Fix

**Example:** "Implement search in CLI"

**Your Request:**
```
@claude Feature: Add skill search to CLI

BMAD: Full cycle
Context: packages/cli/src/commands/, searching against registry

- B: Create SearchCommand, fuzzy-search logic
- M: npm test (CLI tests), verify search matches
- A: Check performance (<500ms), edge cases (empty results?)
- D: Ready to commit? or iterate?

Acceptance:
✓ User can search by name, description, category
✓ Results highlighted with context
✓ <500ms latency on 500+ skills
✓ Tests >80% coverage
✓ No type errors
```

**Your Role:**
1. Wait for full BMAD report (B → M → A → D)
2. Review findings before I commit
3. Approve or ask for iteration

**Typical Duration:** 1-2 hours

---

### Pattern 3: Complex Feature (Multi-Phase)

**Example:** "Add skill versioning to lockfile"

**Your Request:**
```
@claude Implement: Skill versioning in lockfile

Context: Affects lockfile format, CLI install, marketplace display

BMAD: Iterative (multiple cycles)
Phase 1:
- B: Update LockfileEntry type + migration logic
- M: Test migration (old → new format)
- A: Check backward compatibility, data loss risk
- D: If safe, continue; if risky, redesign

Phase 2:
- B: Update CLI install to record versions
- M: Integration tests (install with version)
- A: Verify marketplace displays version
- D: Ready to release?

Acceptance:
✓ Old lockfiles migrate without data loss
✓ New installations track skill version
✓ CLI respects pinned versions (--pin-version flag)
✓ Tests pass, no type errors
✓ Marketplace shows version info
```

**Your Role:**
1. Review after each D-phase decision
2. Approve continuation or ask for changes
3. Final sign-off before release

**Typical Duration:** 4-8 hours (split across days)

---

## 📋 BMAD Phases - Project-Specific Checklist

### B - BUILD (Checklist)

**Before "build is done":**
- ✅ Code follows TypeScript strict mode (no `any`)
- ✅ Imports organized (eslint-plugin-organize-imports)
- ✅ Prettier formatting (120 char, no semicolons)
- ✅ Affected packages identified (cli? marketplace? registry?)
- ✅ If monorepo change: Does it affect other packages?
- ✅ No unused variables/imports
- ✅ If modifying types (libs/core): Updated everywhere?

**Reference:**
```bash
# Check syntax & formatting
npm run lint
npm run format:check
npm run type-check  # tsc --noEmit
```

---

### M - MEASURE (Checklist)

**Test commands:**
```bash
# Run all tests
npm test

# Specific package
npm test --workspace=@tech-leads-club/agent-skills

# Watch mode
npm test -- --watch
```

**Must pass:**
- ✅ All unit tests (Jest)
- ✅ Type check (tsc --noEmit)
- ✅ Lint (eslint .)
- ✅ Format check (prettier --check)
- ✅ Build succeeds (npm run build) — if touching multiple packages

**Performance baselines:**
- CLI startup: <3 seconds (cold), <500ms (cached)
- Registry fetch: <500ms
- Installation: <30 seconds for 5 skills

**Coverage targets:**
- Default: >70%
- For security-critical code (lockfile, installer): >85%

---

### A - ANALYZE (Checklist)

**Questions to answer:**

1. **Does it solve the problem?**
   - Original requirement met?
   - Edge cases handled?

2. **Architecture intact?**
   - Monorepo dependency graph unchanged?
   - No circular dependencies?
   - Core types still immutable/predictable?

3. **Backward compatible?**
   - Old skills still work?
   - Old lockfiles still readable?
   - No breaking CLI changes?

4. **Security?**
   - No hardcoded secrets?
   - No new OWASP issues?
   - If modifying installer: Does it still validate SHA-256?

5. **Performance?**
   - Meets baselines above?
   - No new N+1 queries?
   - No memory leaks (if Node.js code)?

6. **User experience?**
   - Error messages helpful?
   - Progress feedback (for long operations)?
   - CLI help text accurate?

---

### D - DECIDE (Checklist)

**Three outcomes:**

#### ✅ READY
- All tests pass
- Type check passes
- Analysis found no blockers
- Ready for production

**Action:**
```bash
git add .
git commit -m "feat: add search to CLI

Implements fuzzy search for skills by name, description, category.
Search completes <500ms even with 500+ skills in registry.

Co-Authored-By: Claude Haiku <noreply@anthropic.com>"
```

#### ⚡ ITERATE
- Test failure (actionable)
- Analysis found issue (fixable)
- Example: "Type error: SkillInfo doesn't have 'category' field"

**Action:**
```
Issues found:
- SkillInfo missing category field (test failure)
- Solution: Import CategoryName type, update interface

Back to B phase: Fix, then M → A → D
```

#### 🔄 PIVOT
- Fundamental issue with approach
- Can't fix without major redesign
- Example: "Lockfile format incompatible with versioning"

**Action:**
```
Pivot needed:
Current approach: Store version in lockfile entry
Problem: Breaks old lockfiles, no migration path

Recommend: /plan to design migration strategy first
```

---

## 🛠️ Common Tasks & BMAD Pattern

| Task | Pattern | Duration |
| ---- | ------- | -------- |
| Fix typo or lint issue | B only | <5 min |
| Add new CLI command | Full cycle | 1-2 h |
| Create new skill | B only (you generate via Nx) | 30 min |
| Update shared types (libs/core) | Full cycle (impacts all packages) | 1-2 h |
| Refactor installer logic | Full cycle (security-critical) | 2-4 h |
| Add MCP tool | Full cycle | 1-2 h |
| Update marketplace UI | Full cycle | 2-3 h |
| Generate registry (publish skills) | M only (automation) | <5 min |

---

## 📊 BMAD Report Template for Agent Skills

Use this when reporting each phase:

```markdown
## BMAD Report: [Feature Name]

**Task:** [Description]  
**Files Changed:** [List]  
**Duration:** [Actual time]

### B - BUILD
✅ Code implemented
- Modified: packages/cli/src/commands/search.ts
- Added: src/services/search-service.ts
- Dependencies: fuzzy (npm package)

Type check: ✅ 0 errors  
Linter: ✅ 0 errors  

### M - MEASURE
```bash
$ npm test
Test Suites: 15 passed, 15 total
Tests: 240 passed, 240 total
Coverage: 84% (target: >70%)
```

Duration: 45 seconds  
✅ All passing

### A - ANALYZE
✅ Solves problem: User can search 500+ skills in <500ms  
✅ Architecture: No breaking changes, no new dependencies on core  
✅ Backward compatible: Old CLI commands unchanged  
✅ Security: No new inputs, search is read-only  
✅ Performance: Search completes in 340ms (target: <500ms)  
⚠️ Edge case: Empty search returns all skills (is this desired?)

### D - DECIDE
**Status:** ⚡ ITERATE  
**Reason:** Edge case needs clarification  

**Ask:** Should empty search return all skills or show "No results"?

If yes → Fix, loop back to B  
If no → Already fixed, ready to commit
```

---

## 🚀 Before You Ask Me to Code

1. **Clarify the scope** — One focused change per BMAD cycle
2. **Reference docs** — Point to PRD features or architecture sections
3. **Acceptance criteria** — What does "done" look like?
4. **Constraints** — Breaking changes allowed? Performance budget?

Example good request:
```
@claude Feature: Add "most popular" sort to skill search

Reference: prd.md#Use Case 1 (developer installs skills)
Scope: CLI search only (not marketplace yet)
Files: packages/cli/src/services/search-service.ts

Acceptance:
✓ Search supports --sort=popular (default: relevance)
✓ Popularity based on installation count from registry metadata
✓ <500ms latency
✓ Tests >80%

BMAD: Full cycle
```

Example bad request:
```
@claude Refactor the whole installer

(Too vague, too broad, no acceptance criteria, risky)
```

---

## 🔗 Quick Reference

**Nx commands:**
```bash
npm run build                                  # Build all packages
npm test                                       # Test all
npm run lint                                   # Lint all
npm run format                                 # Format all

npm run lint --workspace=@tech-leads-club/agent-skills  # Single package
npm test --workspace=@tech-leads-club/agent-skills
```

**Key files:**
- `package.json` — Scripts, dependencies
- `nx.json` — Nx config
- `packages/cli/src/index.ts` — CLI entry point
- `packages/skills-catalog/src/generate-registry.ts` — Registry generation
- `libs/core/src/index.ts` — Shared types
- `CLAUDE.md` — Project conventions (read this!)

**Testing:**
```bash
NODE_OPTIONS='--experimental-vm-modules' npm test
# Jest uses VM modules (ESM support)
```

---

## 📌 Golden Rules (Agent Skills Edition)

1. **Type safety first** — Strict mode, no `any`. Catches bugs early.
2. **Test before declaring done** — M phase is mandatory, not optional.
3. **Security in lockfile** — Commits to .agents/.skill-lock.json are audited. Validate JSON.
4. **Independent versioning** — Don't coordinate releases across packages. Let Semantic Release handle it.
5. **Backward compatibility** — Skills from 6 months ago must still install. No breaking lockfile changes without migration.
6. **Performance budgets** — Registry fetch <500ms, CLI startup <3s. If you violate this, redesign.

---

**Version:** 1.0  
**Last Updated:** 2026-06-25  
**Author:** You + Claude Code  
**See Also:** `BMAD-workflow.md` (generic BMAD patterns), `AGENTS.md` (project governance)
