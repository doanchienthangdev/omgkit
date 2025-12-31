---
description: Sprint review and retrospective workflow
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: [optional sprint name]
---

# Sprint Retrospective Workflow

Retrospective: **$ARGUMENTS**

## Workflow Steps

### Step 1: Sprint Review
**Agent:** @sprint-master
**Command:** `/sprint:end`

- Review completed work
- Demo deliverables
- Gather feedback
- Document outcomes

### Step 2: Metrics Analysis
**Agent:** @project-manager

- Analyze velocity
- Review cycle times
- Calculate completion rate
- Identify trends

### Step 3: Retrospective
**Agent:** @journal-writer

- What went well
- What could improve
- Action items
- Lessons learned

### Step 4: Process Improvements
**Agent:** @planner

- Prioritize improvements
- Create action items
- Assign owners
- Set deadlines

### Step 5: Documentation
**Agent:** @docs-manager

- Update sprint log
- Document decisions
- Archive artifacts
- Share learnings

## Progress Tracking
- [ ] Sprint reviewed
- [ ] Metrics analyzed
- [ ] Retrospective done
- [ ] Improvements planned
- [ ] Documentation complete

Execute at sprint end. Capture learnings.
