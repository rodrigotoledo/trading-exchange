# Security — Agent Skills

Quick reference for security in this project. **For complete security policy, see [SECURITY.md](../SECURITY.md) in the root.**

---

## 🎯 TL;DR

**Agent Skills is security-first:**
- ✅ Every skill scanned with Snyk Agent Scan before publishing
- ✅ Immutable skills via SHA-256 hashing + lockfiles
- ✅ Defense-in-depth in CLI (sanitization, path isolation, symlink guards, audit trail)
- ✅ Read-only MCP server (no write access, no local filesystem access)
- ✅ Human-curated prompts (no hidden instructions)

---

## 🛡️ What's Protected?

### 1. Your Environment (CLI)
```
Threat: Malicious skill overwrites system files
Mitigation: Path isolation, sanitization, symlink guards
```

### 2. Your Context Window (MCP)
```
Threat: Agent fetches arbitrary files via MCP
Mitigation: Read-only server, file list validation
```

### 3. Your Trust (Supply Chain)
```
Threat: Author pushes malicious update to skill
Mitigation: Immutable hashes, lockfiles track what you installed
```

---

## 📋 Quick Security Checklist

**Before installing a skill:**
- ✅ Skill is in the [Agent Skills registry](https://tech-leads-club.github.io/agent-skills/)
- ✅ Skill has a SHA-256 hash (in `skills-registry.json`)
- ✅ Skill passed Snyk Agent Scan

**Before committing lockfile:**
- ✅ Review `.agents/.skill-lock.json` in git diff
- ✅ Hashes match registry (verify in build log)

**Security incident?**
- ⚠️ Never open public GitHub issue
- 🔐 Use [GitHub Security Advisory](../SECURITY.md#-reporting-a-vulnerability)

---

## 🔐 CLI Defense Layers

The CLI has **5 independent security layers:**

| Layer | Purpose | Example |
| ----- | ------- | ------- |
| **1. Input Sanitization** | Block path traversal (`../`, null bytes) | `../../../etc/passwd` → rejected |
| **2. Path Isolation** | Verify all paths stay inside agent dirs | Resolved path must start with `~/.claude/` |
| **3. Symlink Guard** | Detect + reject malicious symlinks | Circular symlinks auto-deleted |
| **4. Lockfile Integrity** | Zod validation, atomic writes | Corrupted file auto-recovers |
| **5. Audit Trail** | Complete history of all operations | `~/.config/agent-skills/audit.log` |

→ **Full details:** [SECURITY.md#-cli-defense-in-depth](../SECURITY.md#-cli-defense-in-depth)

---

## 🔍 Pre-Release Scanning

Every skill is scanned with **Snyk Agent Scan** before publishing:

```bash
npm run scan                    # Incremental (changed skills only)
npm run scan -- --force         # Full re-scan
```

**Cache:** Results cached in `.security-scan-cache.json` (gitignored)  
**Allowlist:** Exceptions in `packages/skills-catalog/security-scan-allowlist.yaml`

→ **Full details:** [SECURITY.md#-security-scanning](../SECURITY.md#-security-scanning)

---

## 🔌 MCP Server Security

The `@tech-leads-club/agent-skills-mcp` server:
- ✅ **Read-only** — No write access to registry
- ✅ **Local-only** — Runs over stdio, no network endpoint
- ✅ **Validated paths** — Fetches only files listed in registry
- ✅ **No local filesystem access** — CDN-only, never reads/writes local files
- ✅ **Clean protocol** — All logging to stderr (stdout is JSON-RPC only)

→ **Full details:** [SECURITY.md#-mcp-server-security](../SECURITY.md#-mcp-server-security)

---

## 🚨 Reporting Vulnerabilities

**DO NOT** open a public GitHub issue for security issues.

**Instead:** [Open GitHub Security Advisory](https://github.com/tech-leads-club/agent-skills/security/advisories/new) (private)

**Include:**
- Description of the vulnerability
- Steps to reproduce
- Affected component (cli, mcp, skills-catalog, skill name)
- Potential impact

**SLA:** Acknowledge within 48 hours, resolve within 14 days

→ **Full details:** [SECURITY.md#-reporting-a-vulnerability](../SECURITY.md#-reporting-a-vulnerability)

---

## 📚 Security References

| Topic | Location |
| ----- | -------- |
| **Complete Security Policy** | [SECURITY.md](../SECURITY.md) |
| **Threat Model** | [SECURITY.md#-threat-model](../SECURITY.md#-threat-model) |
| **CLI Implementation** | [SECURITY.md#-cli-defense-in-depth](../SECURITY.md#-cli-defense-in-depth) |
| **Scanning Process** | [SECURITY.md#-security-scanning](../SECURITY.md#-security-scanning) |
| **Vulnerability Reporting** | [SECURITY.md#-reporting-a-vulnerability](../SECURITY.md#-reporting-a-vulnerability) |
| **License & Attribution** | [README.md#-license-and-attribution](../README.md#-license-and-attribution) |

---

## 🔗 Related Docs

- **Architecture:** [architecture-spine.md](architecture-spine.md) — How security is built in
- **CLAUDE.md:** [CLAUDE.md](../CLAUDE.md) — Project conventions
- **PRD:** [prd.md](prd.md) — Security as a feature

---

**Last Updated:** 2026-06-25  
**For questions:** [GitHub Issues](https://github.com/tech-leads-club/agent-skills/issues)  
**For vulnerabilities:** [GitHub Security Advisory](https://github.com/tech-leads-club/agent-skills/security/advisories)
