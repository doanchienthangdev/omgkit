---
name: sprint-retrospective
description: Analyze sprint and improve process
category: sprint
complexity: low
estimated-time: 30min-2 hours
agents:
  - sprint-master
  - project-manager
  - journal-writer
skills:
  - omega/omega-sprint
commands:
  - /sprint:sprint-end
  - /planning:doc
prerequisites:
  - Sprint completed
---

# Sprint Retrospective Workflow

## Overview

The Sprint Retrospective workflow helps analyze completed sprints, identify improvements, and document learnings for future iterations.

## When to Use

- After sprint completion
- For process improvement
- To capture learnings
- Before planning next sprint

## Steps

### Step 1: Sprint Closure
**Agent:** sprint-master
**Command:** `/sprint:sprint-end`
**Duration:** 15-30 minutes

Close sprint:
- Mark sprint complete
- Calculate final velocity
- Summarize outcomes
- List incomplete items

**Output:** Sprint closure

### Step 2: Metrics Analysis
**Agent:** project-manager
**Duration:** 15-30 minutes

Analyze metrics:
- Velocity calculation
- Completion rate
- Quality metrics
- Time tracking

**Output:** Metrics report

### Step 3: What Went Well
**Agent:** sprint-master
**Duration:** 15-30 minutes

Identify positives:
- Successful deliveries
- Good practices
- Team wins
- Process improvements

**Output:** Success list

### Step 4: What Could Improve
**Agent:** sprint-master
**Duration:** 15-30 minutes

Identify improvements:
- Challenges faced
- Process issues
- Communication gaps
- Technical debt

**Output:** Improvement list

### Step 5: Action Items
**Agent:** sprint-master
**Duration:** 15-30 minutes

Create actions:
- Concrete improvements
- Responsible parties
- Timelines
- Success criteria

**Output:** Action items

### Step 6: Documentation
**Agent:** journal-writer
**Command:** `/planning:doc`
**Duration:** 15-30 minutes

Document learnings:
- Retrospective notes
- Best practices
- Patterns to repeat
- Anti-patterns to avoid

**Output:** Retrospective document

## Quality Gates

- [ ] Sprint officially closed
- [ ] Metrics calculated
- [ ] Team input gathered
- [ ] Improvements identified
- [ ] Actions assigned
- [ ] Documentation complete

## Retrospective Template

```markdown
# Sprint [N] Retrospective

## Summary
- Sprint Duration: [dates]
- Velocity: [points]
- Completion Rate: [%]

## What Went Well
1. [Success 1]
2. [Success 2]

## What Could Improve
1. [Issue 1]
2. [Issue 2]

## Action Items
| Action | Owner | Due |
|--------|-------|-----|
| [Action] | [Owner] | [Date] |

## Learnings
- [Learning 1]
- [Learning 2]
```

## Tips

- Be honest and constructive
- Focus on process, not people
- Create specific actions
- Follow up on actions
- Celebrate successes

## Example Usage

```bash
# Run retrospective
/workflow:sprint-retrospective

# Or manually
/sprint:sprint-end
# Then document learnings
```

## Related Workflows

- `sprint-setup` - For next sprint
- `sprint-execution` - For running sprints
