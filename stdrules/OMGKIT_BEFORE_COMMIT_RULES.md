# OMGKIT Before-Commit Rules v1.0

> Comprehensive quality gates that MUST pass before any commit to OMGKIT.
> Run `npm test` to validate all rules automatically.

---

## Overview

This document defines the mandatory validation checks that must pass before committing changes to OMGKIT. These rules ensure system integrity, documentation quality, and proper command registration.

---

## 1. Test Validation (MANDATORY)

All commits MUST pass the complete test suite:

```bash
npm test
```

**Minimum Requirements:**
- All tests must pass (0 failures)
- Current baseline: 3700+ tests
- Coverage must not decrease

---

## 2. Registry Integrity

### 2.1 Registry Sync

The `registry.yaml` file must be synchronized with actual component files:

| Check | Description |
|-------|-------------|
| Agent Sync | All registered agents exist as `.md` files in `plugin/agents/` |
| Workflow Sync | All registered workflows exist as `.md` files in `plugin/workflows/` |
| Namespace Sync | All command namespaces in registry exist as directories |
| Category Sync | All skill categories in registry exist as directories |

**Validation Command:**
```bash
npm test -- tests/validation/registry-sync.test.js
```

### 2.2 Dependency Graph Integrity

All component references must be valid:

| Reference Type | Format | Example |
|----------------|--------|---------|
| Skill | `category/skill-name` | `methodology/writing-plans` |
| Command | `/namespace:command-name` | `/dev:feature` |
| Agent | `kebab-case` | `fullstack-developer` |
| Workflow | `category/workflow-name` | `development/feature` |

**Validation Command:**
```bash
npm test -- tests/validation/dependency-graph.test.js
```

---

## 3. Command Registration (CRITICAL)

### 3.1 Slash Command Requirements

Every command in OMGKIT MUST be registered as a Claude Code slash command. This means:

**File Location:**
- Commands must be in `plugin/commands/<namespace>/<command-name>.md`
- Namespace directory must exist

**Format Requirements:**
- Command ID format: `/namespace:command-name`
- All lowercase, hyphens for word separation
- Namespace must be registered in `registry.yaml` under `command_namespaces`

**Frontmatter Requirements:**
```yaml
---
description: Clear description of what the command does
argument-hint: <optional argument format>
allowed-tools: List, Of, Allowed, Tools
---
```

### 3.2 Command Registration Checklist

| Requirement | Description |
|-------------|-------------|
| **File exists** | `plugin/commands/<namespace>/<name>.md` exists |
| **Namespace registered** | Namespace in `registry.yaml` `command_namespaces` |
| **Valid frontmatter** | Has `description` field |
| **Content present** | Body has usage instructions |
| **Format compliance** | Follows `/namespace:command-name` format |

### 3.3 Current Command Namespaces

All commands must belong to one of these registered namespaces:

| Namespace | Purpose |
|-----------|---------|
| `dev` | Development commands (feature, fix, test, tdd, review) |
| `planning` | Planning commands (plan, brainstorm, research, doc) |
| `git` | Git operations (commit, ship, pr, deploy) |
| `quality` | Quality commands (security-scan, refactor, optimize) |
| `omega` | Omega thinking (10x, 100x, 1000x, principles) |
| `sprint` | Sprint management (sprint-new, team-run, backlog) |
| `workflow` | Workflow triggers (feature, bug-fix, rag-development) |
| `auto` | Autonomous mode (init, start, approve, reject) |
| `context` | Context management (mode, index, load, checkpoint) |
| `design` | UI/UX design (screenshot, enhance, cro) |
| `alignment` | System alignment (health, deps) |
| `security` | Security commands (scan, audit) |
| `data` | Data commands (pipeline, quality) |
| `ml` | ML commands (train, evaluate) |
| `game` | Game dev commands (balance, optimize) |
| `iot` | IoT commands (provision) |
| `perf` | Performance commands (profile, benchmark) |
| `domain` | Domain modeling (analyze, map) |
| `platform` | Platform engineering (blueprint) |
| `sre` | SRE commands (dashboard) |

---

## 4. Documentation Quality Standards

### 4.1 Agent Documentation

**Minimum Requirements:**

| Field | Requirement |
|-------|-------------|
| File location | `plugin/agents/<agent-name>.md` |
| Frontmatter | `skills` and `commands` arrays |
| Description | 50-200 words explaining purpose |
| Responsibilities | 3-5 primary, 2-4 secondary |
| Minimum lines | 50+ lines of content |

**Required Sections:**
- Description/Overview
- Primary Responsibilities
- Skills Used
- Commands Triggered
- Usage Examples

### 4.2 Command Documentation

**Minimum Requirements:**

| Field | Requirement |
|-------|-------------|
| File location | `plugin/commands/<namespace>/<name>.md` |
| Frontmatter | `description`, `allowed-tools` |
| Description | Clear, actionable description |
| Minimum lines | 15+ lines of content |

**Required Frontmatter Fields:**
```yaml
---
description: What the command does (required)
argument-hint: Expected arguments (recommended)
allowed-tools: Comma-separated tool list (required)
---
```

### 4.3 Skill Documentation

**Minimum Requirements:**

| Field | Requirement |
|-------|-------------|
| File location | `plugin/skills/<category>/<name>/SKILL.md` |
| Frontmatter | `name`, `description` |
| Description | Third-person, 50-150 words |
| Minimum lines | 30+ lines of content |

**Must Follow:** `plugin/stdrules/SKILL_STANDARDS.md`

### 4.4 Workflow Documentation

**Minimum Requirements:**

| Field | Requirement |
|-------|-------------|
| File location | `plugin/workflows/<category>/<name>.md` |
| Frontmatter | name, description, category, complexity, agents, skills, commands |
| Steps | Clear step-by-step process |
| Quality Gates | Completion checklist |
| Minimum lines | 50+ lines of content |

**Required Frontmatter Fields:**
```yaml
---
name: workflow-name
description: What the workflow accomplishes
category: workflow-category
complexity: low|medium|high|very-high
estimated-time: Time estimate
agents:
  - agent-name
skills:
  - category/skill-name
commands:
  - /namespace:command-name
prerequisites:
  - Prerequisite 1
---
```

---

## 5. Content Quality Rules

### 5.1 Prohibited Content

- No placeholder text: `TODO`, `FIXME`, `XXX`, `HACK`
- No empty sections
- No broken internal links
- No duplicate content across components

### 5.2 Required Content Elements

**Code Blocks:**
- Must have language specifier
- Must be properly indented
- Must be functional examples

**Links:**
- Internal links must be relative
- External links must be valid
- All referenced files must exist

### 5.3 Formatting Standards

- Use proper Markdown heading hierarchy (h1 > h2 > h3)
- Use consistent list formatting
- Use tables for structured data
- Use code blocks for commands/examples

---

## 6. Cross-Reference Validation

### 6.1 Forward References (dependsOn)

All references in component frontmatter must point to existing components:

| Source | Reference Type | Target |
|--------|---------------|--------|
| Agent | skills | Skill files |
| Agent | commands | Command files |
| Workflow | agents | Agent files |
| Workflow | skills | Skill files |
| Workflow | commands | Command files |

### 6.2 Reverse References (usedBy)

The dependency graph must correctly compute:

| Component | usedBy |
|-----------|--------|
| Skill | Agents that use it, Workflows that include it |
| Command | Agents that trigger it, Workflows that include it |
| Agent | Workflows that orchestrate it |

---

## 7. Version Management

### 7.1 Version Bump Requirements

When releasing:
- Bump `package.json` version
- Bump `plugin/registry.yaml` version
- Update version comment in registry header

### 7.2 Changelog

Document changes in commit message following conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `refactor:` Code refactoring
- `test:` Test additions/changes

---

## 8. Pre-Commit Checklist

### Quick Validation

```bash
# Run all tests
npm test

# Check specific validations
npm test -- tests/validation/registry-sync.test.js
npm test -- tests/validation/dependency-graph.test.js
npm test -- tests/validation/before-commit.test.js
npm test -- tests/validation/doc-quality.test.js
npm test -- tests/validation/command-registration.test.js
```

### Manual Checklist

- [ ] All tests pass (`npm test`)
- [ ] Registry.yaml synced with actual files
- [ ] All commands registered as slash commands
- [ ] All command namespaces in registry
- [ ] Documentation meets quality standards
- [ ] No broken internal links
- [ ] Dependency graph valid
- [ ] Version bumped (if releasing)
- [ ] Docs regenerated (`npm run docs:generate`)

---

## 9. Automated Validation

### Test Files

| Test File | Purpose |
|-----------|---------|
| `registry-sync.test.js` | Registry matches actual files |
| `dependency-graph.test.js` | Dependency references valid |
| `before-commit.test.js` | All pre-commit rules |
| `doc-quality.test.js` | Documentation quality |
| `command-registration.test.js` | Command slash registration |
| `format.test.js` | Format compliance |
| `alignment.test.js` | Alignment principle |

### Running Validation

```bash
# Full validation
npm test

# Quick validation (key tests only)
npm test -- tests/validation/before-commit.test.js
```

---

## 10. Enforcement

### CI/CD Integration

These rules are enforced in CI:
- All tests must pass before merge
- Documentation must be regenerated
- Version must be bumped for releases

### Local Development

Before committing:
1. Run `npm test`
2. Fix any failures
3. Re-run until all pass
4. Commit with proper message

---

*Think Omega. Build Omega. Be Omega.*
