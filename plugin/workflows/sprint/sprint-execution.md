---
name: sprint-execution
description: Execute sprint with AI team
category: sprint
complexity: medium
estimated-time: sprint duration
agents:
  - sprint-master
  - fullstack-developer
  - tester
  - debugger
  - project-manager
skills:
  - omega/omega-sprint
  - methodology/executing-plans
commands:
  - /sprint:sprint-current
  - /sprint:team-run
  - /sprint:team-status
  - /dev:fix
  - /sprint:sprint-end
prerequisites:
  - Sprint created and started
  - Tasks assigned
---

# Sprint Execution Workflow

## Overview

The Sprint Execution workflow manages the day-to-day running of a sprint using the AI team. It covers task execution, progress monitoring, blocker resolution, and sprint completion.

## When to Use

- Running an active sprint
- Managing development work
- Coordinating AI agents
- Tracking progress

## Steps

### Step 1: Sprint Review
**Agent:** sprint-master
**Command:** `/sprint:sprint-current`
**Duration:** 10-15 minutes

Review current sprint:
- Check sprint status
- Review pending tasks
- Identify priorities
- Check blockers

**Output:** Sprint status

### Step 2: Team Execution
**Agent:** AI Team
**Command:** `/sprint:team-run`
**Duration:** Ongoing

Run AI team:
- Execute tasks by priority
- Use appropriate agents
- Report progress
- Flag blockers

**Modes:**
- `--mode full-auto` - No intervention
- `--mode semi-auto` - Review at checkpoints
- `--mode manual` - Approve each step

**Output:** Task progress

### Step 3: Progress Monitoring
**Agent:** project-manager
**Command:** `/sprint:team-status`
**Duration:** Ongoing

Monitor progress:
- Track velocity
- Update burndown
- Identify delays
- Report status

**Output:** Progress report

### Step 4: Blocker Resolution
**Agent:** debugger
**Command:** `/dev:fix`
**Duration:** As needed

Resolve blockers:
- Investigate issues
- Implement fixes
- Unblock tasks
- Update status

**Output:** Blockers resolved

### Step 5: Sprint Completion
**Agent:** sprint-master
**Command:** `/sprint:sprint-end`
**Duration:** 15-30 minutes

Complete sprint:
- Review completed work
- Update sprint status
- Calculate velocity
- Prepare for review

**Output:** Sprint completed

## Quality Gates

- [ ] All high-priority tasks complete
- [ ] Tests passing
- [ ] Documentation updated
- [ ] No critical blockers
- [ ] Sprint reviewed

## Execution Modes

```
AI Team Execution Modes
=======================

FULL-AUTO:
- Agents work independently
- Progress reported automatically
- Minimal human intervention
- Best for routine tasks

SEMI-AUTO (Default):
- Review at checkpoints
- Approve major decisions
- Human oversight maintained
- Balanced approach

MANUAL:
- Approve each action
- Maximum control
- Slower execution
- Best for critical work
```

## Tips

- Start with semi-auto mode
- Check status regularly
- Address blockers quickly
- Keep tasks focused
- Celebrate completions

## Example Usage

```bash
# Run AI team in semi-auto mode
/workflow:sprint-execution

# Or step by step
/sprint:team-run --mode semi-auto
/sprint:team-status
```

## Related Workflows

- `sprint-setup` - For creating sprints
- `sprint-retrospective` - For reviewing sprints
- `feature` - For individual features
