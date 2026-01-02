# Optimized Alignment Principle (OAP)

**Version:** 1.0.0
**Status:** Core Principle
**Enforcement:** Mandatory (validated by tests)

---

## Overview

The **Optimized Alignment Principle (OAP)** is a core architectural rule that defines how OMGKIT components relate to each other. This principle ensures consistency, maintainability, and scalability across all components.

---

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────┐
│                     OPTIMIZED ALIGNMENT HIERARCHY                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Level 0: MCPs (Model Context Protocol Servers)                      │
│           └── Foundation layer, used by all other components         │
│                                                                      │
│  Level 1: Commands                                                   │
│           └── Use: zero-to-many MCPs                                 │
│           └── Format: /namespace:command-name                        │
│                                                                      │
│  Level 2: Skills                                                     │
│           └── Use: zero-to-many Commands, MCPs                       │
│           └── Format: category/skill-name                            │
│                                                                      │
│  Level 3: Agents                                                     │
│           └── Use: zero-to-many Skills, Commands, MCPs               │
│           └── Format: kebab-case name                                │
│                                                                      │
│  Level 4: Workflows                                                  │
│           └── Use: zero-to-many Agents, Skills, Commands, MCPs       │
│           └── Format: category/workflow-name                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Alignment Rules

### Rule 1: Format Compliance

All component references MUST use the correct format:

| Component | Format | Example |
|-----------|--------|---------|
| MCP | `mcp-name` | `context7`, `sequential-thinking` |
| Command | `/namespace:command-name` | `/dev:feature`, `/omega:10x` |
| Skill | `category/skill-name` | `methodology/writing-plans` |
| Agent | `kebab-case` | `fullstack-developer` |
| Workflow | `category/workflow-name` | `development/feature` |

### Rule 2: Existence Validation

All referenced components MUST exist:

- Skills → Must exist in `/plugin/skills/<category>/<name>/SKILL.md`
- Commands → Must exist in `/plugin/commands/<namespace>/<name>.md`
- Agents → Must exist in `/plugin/agents/<name>.md`
- Workflows → Must exist in `/plugin/workflows/<category>/<name>.md`
- MCPs → Must be registered in `/plugin/mcp/`

### Rule 3: No Cross-Type Confusion

Components MUST NOT be confused with other types:

- ❌ Agent names in `skills:` field
- ❌ Skill names in `agents:` field
- ❌ Commands without proper `/namespace:` prefix

### Rule 4: Hierarchical Respect

Components can only reference components from their level or below:

| Component | Can Reference |
|-----------|---------------|
| MCP | (none - foundation layer) |
| Command | MCPs |
| Skill | Commands, MCPs |
| Agent | Skills, Commands, MCPs |
| Workflow | Agents, Skills, Commands, MCPs |

### Rule 5: Optimization Requirements

References should be:

1. **Appropriate** - Only reference what is needed
2. **Minimal** - Avoid redundant dependencies
3. **Unique** - No duplicate references
4. **Contextual** - Match the component's purpose

---

## Frontmatter Specifications

### Skill Frontmatter

```yaml
---
name: skill-name
description: What the skill does
category: category-name
commands:          # Optional: commands this skill uses
  - /namespace:cmd
mcps:              # Future: MCPs this skill uses
  - mcp-name
---
```

### Agent Frontmatter

```yaml
---
name: agent-name
description: What the agent does
tools: Tool1, Tool2
model: inherit
skills:            # Skills this agent uses
  - category/skill-name
commands:          # Commands this agent can trigger
  - /namespace:cmd
mcps:              # Future: MCPs this agent uses
  - mcp-name
---
```

### Workflow Frontmatter

```yaml
---
name: workflow-name
description: What the workflow does
category: category-name
agents:            # Agents this workflow orchestrates
  - agent-name
skills:            # Skills used across the workflow
  - category/skill-name
commands:          # Commands triggered by the workflow
  - /namespace:cmd
mcps:              # Future: MCPs used by the workflow
  - mcp-name
---
```

---

## Validation

### Automated Tests

The alignment principle is enforced by automated tests in:
- `tests/validation/alignment.test.js`
- `tests/validation/format.test.js`
- `tests/validation/existence.test.js`
- `tests/validation/hierarchy.test.js`

### Pre-Publish Check

Before publishing to npm, ALL alignment tests MUST pass:

```bash
npm test
```

### CI/CD Integration

GitHub Actions validates alignment on every PR.

---

## Examples

### Correct Alignment

```yaml
# Agent: fullstack-developer.md
skills:
  - methodology/executing-plans      # ✓ Valid skill format
  - languages/typescript             # ✓ Exists in skills directory
commands:
  - /dev:feature                     # ✓ Valid command format
  - /dev:fix                         # ✓ Exists in commands directory
```

### Incorrect Alignment

```yaml
# WRONG - Common mistakes
skills:
  - planner                          # ✗ This is an agent name, not skill
  - writing-plans                    # ✗ Missing category prefix
  - methodology/nonexistent          # ✗ Skill doesn't exist

commands:
  - feature                          # ✗ Missing /namespace: prefix
  - /dev/feature                     # ✗ Wrong separator (/ not :)
```

---

## Future: MCP Alignment

When MCP support is fully implemented:

1. MCPs will be registered in `/plugin/mcp/`
2. All components can declare `mcps:` in frontmatter
3. Tests will validate MCP references exist
4. Registry will track MCP-component mappings

---

## Enforcement

This principle is:

1. **Documented** - In this file and public docs
2. **Tested** - 400+ automated tests
3. **Required** - Must pass before publish
4. **Versioned** - Changes tracked in changelog

---

## Changelog

### 1.0.0 (2026-01-02)
- Initial definition of Optimized Alignment Principle
- Established 5 core alignment rules
- Created comprehensive test suite
- Added MCP future support placeholder

---

*Think Omega. Build Omega. Be Omega.* 🔮
