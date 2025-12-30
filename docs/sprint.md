# OMGKIT Sprint Management

## Overview

OMGKIT provides AI-powered sprint management with autonomous team execution.

## Sprint Lifecycle

```
Vision → Backlog → Sprint → Execute → Retrospect
   ↑                                      │
   └──────────────────────────────────────┘
```

## Getting Started

### 1. Initialize Project
```bash
omgkit init
```

Creates:
- `.omgkit/` directory
- `OMEGA.md` project context
- Config and template files

### 2. Set Vision
```
/vision:set
```

Interactive prompts for:
- Product name
- Tagline
- Target users
- Goals
- Constraints
- Success metrics

### 3. Create Sprint
```
/sprint:new "Sprint 1" --propose
```

With `--propose`, AI analyzes codebase and suggests:
- TODOs/FIXMEs
- Test gaps
- Documentation gaps
- Vision-aligned features

### 4. Run AI Team
```
/team:run --mode semi-auto
```

## Autonomy Modes

| Mode | Description | Use When |
|------|-------------|----------|
| `full-auto` | No human intervention | Well-defined tasks |
| `semi-auto` | Review at checkpoints | Complex features |
| `manual` | Approve each step | Critical systems |

## Backlog Management

### Add Tasks
```
/backlog:add "Add user authentication" --type feature --priority 1
```

### View Backlog
```
/backlog:show
```

### AI Prioritization
```
/backlog:prioritize
```

Prioritizes by:
- Vision alignment
- User impact
- Effort (inverse)
- Risk of delay
- Dependencies

## Sprint Commands

| Command | Description |
|---------|-------------|
| `/sprint:new` | Create new sprint |
| `/sprint:start` | Start current sprint |
| `/sprint:current` | Show progress |
| `/sprint:end` | End with retrospective |

## Team Commands

| Command | Description |
|---------|-------------|
| `/team:run` | Start AI team |
| `/team:status` | Show activity |
| `/team:ask` | Ask team question |

## Agent Assignment

| Task Type | Primary Agent |
|-----------|---------------|
| feature | fullstack-developer |
| bugfix | debugger |
| docs | docs-manager |
| test | tester |
| research | oracle |

## Retrospective

At sprint end, generates:
- Completion metrics
- Velocity data
- What went well
- What to improve
- Action items

---
*Think Omega. Build Omega. Be Omega.* 🔮
