---
name: omega-sprint
description: Omega sprint management. Use for AI team sprint execution.
---

# Omega Sprint Skill

## Sprint Lifecycle
```
Vision → Backlog → Sprint → Execute → Retrospect
   ↑                                      │
   └──────────────────────────────────────┘
```

## Vision Setting
```yaml
vision:
  product: "What we're building"
  users: "Who it's for"
  goals: ["Goal 1", "Goal 2"]
  success: "How we measure"
```

## Sprint Planning
1. Review backlog
2. Select tasks for sprint
3. Estimate (optional)
4. Assign to agents

## AI Team Execution

### Autonomy Levels
- **Full-Auto**: No human intervention
- **Semi-Auto**: Review at checkpoints
- **Manual**: Approve each step

### Agent Routing
| Task Type | Agent |
|-----------|-------|
| feature | fullstack-developer |
| bugfix | debugger |
| research | oracle |
| docs | docs-manager |
| test | tester |

## Retrospective
```markdown
## What Went Well
- [Success]

## What Could Improve
- [Learning]

## Action Items
- [Improvement for next sprint]
```

## Commands
```bash
/vision:set
/sprint:new --propose
/team:run --mode semi-auto
/sprint:end
```
