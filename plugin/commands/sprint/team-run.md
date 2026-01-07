---
description: Run AI team on sprint tasks with configurable test enforcement
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: "[--mode MODE] [--no-test] [--test-level LEVEL] [--ref=<path>]"
references:
  supported: true
  inherit_from_sprint: true
  types: [file, folder, glob]
related_skills:
  - methodology/test-enforcement
  - methodology/test-task-generation
  - omega/omega-sprint
  - autonomous/project-orchestration
related_commands:
  - /sprint:team-status
  - /sprint:sprint-new
  - /quality:verify-done
  - /quality:coverage-check
testing:
  default: true
  configurable: true
---

# Team Run

Start AI team execution on sprint tasks with configurable test enforcement.

## Modes

| Mode | Description | Best For |
|------|-------------|----------|
| `--mode full-auto` | No human intervention | Well-defined tasks, low risk |
| `--mode semi-auto` | Review at checkpoints (default) | Complex features, moderate risk |
| `--mode manual` | Approve each step | Critical systems, learning |

## Testing Options

This command respects project testing configuration from `.omgkit/workflow.yaml`.

### Default Behavior

- **Testing**: Enabled by default
- **Enforcement Level**: Read from `testing.enforcement.level` (default: standard)
- **Auto-generate Tests**: Read from `testing.auto_generate_tasks` (default: true)

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--no-test` | Skip test enforcement (soft mode only) | `/sprint:team-run --no-test` |
| `--test-level <level>` | Override enforcement level | `/sprint:team-run --test-level strict` |
| `--with-test` | Force test enforcement | `/sprint:team-run --with-test` |
| `--ref=<path>` | Additional reference sources | `/sprint:team-run --ref=specs/api.yaml` |

### Reference Options

The `--ref` parameter provides additional context for task execution:

```bash
# Use sprint references (inherited automatically)
/sprint:team-run

# Add additional references for this run
/sprint:team-run --ref=docs/architecture.md

# Override sprint references
/sprint:team-run --ref=specs/api-v2.yaml
```

**Reference Inheritance**: By default, team-run inherits references from the current sprint. Use `--ref` to add or override.

### Enforcement Levels

| Level | Test Failure | Coverage Below Min | Missing Tests |
|-------|--------------|-------------------|---------------|
| `soft` | Warning | Warning | Warning |
| `standard` | Block | Block | Warning |
| `strict` | Block | Block | Block |

## Process

1. **Load Configuration** - Read `.omgkit/workflow.yaml` testing config
2. **Load Sprint** - Get current sprint and backlog
3. **Generate Test Tasks** - Auto-create test tasks if enabled
4. **Assign Tasks** - Route to appropriate agents
5. **Execute** - Run tasks in priority order
6. **Enforce Tests** - Block completion until tests pass (based on level)
7. **Report** - Progress and test coverage status

## Agent Assignment

| Task Type | Primary Agent | Test Agent | Auto-Generate Tests |
|-----------|---------------|------------|---------------------|
| feature | fullstack-developer | tester | Yes |
| bugfix | debugger | tester | Yes (regression) |
| refactor | fullstack-developer | tester | Yes |
| docs | docs-manager | - | No |
| test | tester | - | No |
| research | oracle | - | No |

## Configuration

Configure via `.omgkit/workflow.yaml`:

```yaml
testing:
  enabled: true
  enforcement:
    level: standard    # soft | standard | strict
  auto_generate_tasks: true
  coverage_gates:
    unit:
      minimum: 80
      target: 90
```

Or via CLI:

```bash
omgkit config set testing.enforcement.level strict
omgkit config set testing.auto_generate_tasks true
```

## Examples

```bash
# Default: semi-auto mode with standard test enforcement
/sprint:team-run

# Full auto with strict test enforcement
/sprint:team-run --mode full-auto --test-level strict

# Quick run without test enforcement (soft mode required)
/sprint:team-run --no-test

# Manual mode with high coverage requirement
/sprint:team-run --mode manual --test-level strict
```

## Test Task Generation

When `auto_generate_tasks: true`, for each feature task:

```
TASK-042: Implement user authentication
  ↓ Auto-generates:
TEST-042-UNIT: Unit tests for auth service
TEST-042-INT: Integration tests for auth flow
TEST-042-SEC: Security tests (if auth feature)
```

## Definition of Done

Before marking ANY task as DONE, team verifies:

```
DEFINITION OF DONE CHECKLIST:
├── Code
│   ├── [x] Implementation complete
│   ├── [x] Code review passed
│   └── [x] No lint errors
│
├── Tests (MANDATORY when enabled)
│   ├── [x] Test tasks created
│   ├── [x] All tests passing
│   ├── [x] Coverage ≥ minimum threshold
│   └── [x] No skipped critical tests
│
└── Ready for merge
```
