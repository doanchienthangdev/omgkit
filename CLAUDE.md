# CLAUDE.md - OMGKIT Project Rules

## CRITICAL: Before-Commit Rules

**MANDATORY**: Before ANY commit to this repository, you MUST:

1. **Read and follow** `stdrules/OMGKIT_BEFORE_COMMIT_RULES.md`
2. **Run all tests**: `npm test` (must pass 4800+ tests)
3. **Verify alignment**: All component references must be valid
4. **Check documentation quality**: All components meet standards

### stdrules/ Folder

This folder contains mandatory standards for OMGKIT development:

| File | Purpose | When to Read |
|------|---------|--------------|
| `OMGKIT_BEFORE_COMMIT_RULES.md` | Validation rules before commit | **BEFORE EVERY COMMIT** |
| `ALIGNMENT_PRINCIPLE.md` | Component hierarchy rules (5 levels) | When adding/modifying components |
| `SKILL_STANDARDS.md` | Skill documentation standards | When creating/updating skills |

---

## Development Workflow Rules

### .devlogs/ Folder
**IMPORTANT**: All development plans, ideas, upgrade plans, and internal notes MUST go in `.devlogs/` folder:
- Plans (implementation plans, upgrade plans, migration plans)
- Ideas and brainstorming notes
- Internal development logs
- Task breakdowns and analysis

This folder is git-ignored and should NEVER be committed to the repository.

### Documentation (`docs/`)
The `docs/` folder is for Mintlify public documentation only:
- User-facing documentation
- API references
- Guides and tutorials
- Agent/command/skill documentation pages

---

## Commit Standards

### Conventional Commits
Use the format: `type(scope): description`

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `chore` | Maintenance tasks |
| `refactor` | Code restructuring |
| `test` | Adding tests |

### Before Committing Checklist

- [ ] Read `stdrules/OMGKIT_BEFORE_COMMIT_RULES.md`
- [ ] Run `npm test` - ALL tests must pass
- [ ] Registry.yaml synced with actual files
- [ ] All commands registered as slash commands
- [ ] Documentation meets quality standards
- [ ] Dependency graph valid
- [ ] Version bumped if releasing
- [ ] Docs regenerated (`npm run docs:generate`)

---

## Component Development

### Agents (`plugin/agents/`)
- Minimum 50+ lines
- Valid frontmatter with `skills` and `commands` arrays
- Follow `stdrules/ALIGNMENT_PRINCIPLE.md`

### Commands (`plugin/commands/`)
- Minimum 15+ lines
- Valid frontmatter with `description`
- Format: `/namespace:command-name`

### Skills (`plugin/skills/`)
- Minimum 30+ lines
- Follow `stdrules/SKILL_STANDARDS.md`
- Format: `category/skill-name`

### Workflows (`plugin/workflows/`)
- Minimum 50+ lines
- Valid frontmatter with `agents` array
- Format: `category/workflow-name`

---

## Quick Commands

```bash
# Run all validation tests
npm test

# Run specific validation
npm test -- tests/validation/before-commit.test.js
npm test -- tests/validation/alignment.test.js

# Generate documentation
npm run docs:generate
```

---

*Think Omega. Build Omega. Be Omega.*
