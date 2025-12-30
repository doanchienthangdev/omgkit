# 🔮 OMGKIT Phase 5-7: All 54 Commands

## Hướng Dẫn

Copy block instructions và paste vào Claude Code.

---

## PHASE 5: COMMANDS PART 1 - DEV & PLANNING (18 commands)

```markdown
Tiếp tục xây dựng OMGKIT. Phase 1-4 đã hoàn thành (23 agents).

Hãy thực hiện Phase 5: Tạo 18 Commands (Dev + Planning).

Command file format:
```markdown
---
description: Brief description for autocomplete
allowed-tools: Tool1, Tool2
argument-hint: <arg>
---

# Command Instructions
```

## Tạo trong plugin/commands/dev/

### feature.md
```markdown
---
description: Full feature development with planning, testing, and review
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <feature description>
---

# 🍳 Feature: $ARGUMENTS

Build feature: **$ARGUMENTS**

## Workflow
1. **Plan** (planner) - Create implementation plan
2. **Implement** (fullstack-developer) - Write code
3. **Test** (tester) - Write and run tests
4. **Review** (code-reviewer) - Code review
5. **Commit** (git-manager) - Create commit

Show progress checklist.
```

### fix.md
```markdown
---
description: Debug and fix bugs
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <error or issue>
---

# 🔧 Fix: $ARGUMENTS

Fix issue: **$ARGUMENTS**

1. **Investigate** (debugger) - Find root cause
2. **Fix** (fullstack-developer) - Implement fix
3. **Test** (tester) - Verify fix
```

### fix-fast.md
```markdown
---
description: Quick bug fix with minimal investigation
allowed-tools: Read, Write, Bash, Grep
argument-hint: <bug>
---

# ⚡ Fix Fast: $ARGUMENTS

Quick fix for obvious bugs. Skip deep analysis.
```

### fix-hard.md
```markdown
---
description: Complex bug fix with deep investigation
allowed-tools: Task, Read, Write, Bash, Grep, Glob, WebSearch
argument-hint: <complex bug>
---

# 🔬 Fix Hard: $ARGUMENTS

Deep investigation for complex bugs.
Use oracle for analysis, multiple hypotheses.
```

### fix-test.md
```markdown
---
description: Fix failing tests
allowed-tools: Task, Read, Write, Bash, Grep
---

# 🧪 Fix Tests

Fix all failing tests.
1. Run tests
2. Analyze failures
3. Fix each failure
4. Verify all pass
```

### fix-ci.md
```markdown
---
description: Fix CI/CD pipeline issues
allowed-tools: Task, Read, Write, Bash, WebFetch
argument-hint: <github-action-url>
---

# 🔧 Fix CI: $ARGUMENTS

Analyze CI failure and fix.
Fetch logs, identify issue, implement fix.
```

### fix-logs.md
```markdown
---
description: Auto-fetch logs and fix issues
allowed-tools: Task, Read, Write, Bash, Grep
---

# 📋 Fix from Logs

Fetch recent error logs, analyze, and fix.
```

### review.md
```markdown
---
description: Code review with security and quality focus
allowed-tools: Read, Grep, Glob
argument-hint: [file or directory]
---

# 🔍 Review: $ARGUMENTS

Code review for: **$ARGUMENTS**

Use code-reviewer agent.
Check security, performance, quality.
```

### test.md
```markdown
---
description: Generate and run tests
allowed-tools: Task, Read, Write, Bash, Glob
argument-hint: <scope>
---

# 🧪 Test: $ARGUMENTS

Generate tests for: **$ARGUMENTS**

Use tester agent.
Write unit, integration tests.
Run and report coverage.
```

### tdd.md
```markdown
---
description: Test-driven development workflow
allowed-tools: Task, Read, Write, Bash, Glob
argument-hint: <feature>
---

# 🔴🟢♻️ TDD: $ARGUMENTS

Test-driven development for: **$ARGUMENTS**

1. Write failing test
2. Implement to pass
3. Refactor
4. Repeat
```

## Tạo trong plugin/commands/planning/

### plan.md
```markdown
---
description: Create implementation plan
allowed-tools: Task, Read, Grep, Glob, WebSearch
argument-hint: <task>
---

# 📋 Plan: $ARGUMENTS

Create plan for: **$ARGUMENTS**

Use planner agent.
Output to plans/
```

### plan-detailed.md
```markdown
---
description: Detailed plan with 2-5 min tasks
allowed-tools: Task, Read, Grep, Glob, WebSearch
argument-hint: <task>
---

# 📋 Detailed Plan: $ARGUMENTS

Create detailed plan with:
- 2-5 min tasks
- Exact code locations
- Test strategy
```

### plan-parallel.md
```markdown
---
description: Plan with parallel execution strategy
allowed-tools: Task, Read, Grep, Glob
argument-hint: <task>
---

# 📋 Parallel Plan: $ARGUMENTS

Plan optimized for parallel agent execution.
```

### brainstorm.md
```markdown
---
description: Interactive brainstorming session
allowed-tools: Task, Read, WebSearch, Glob
argument-hint: <topic>
---

# 💡 Brainstorm: $ARGUMENTS

Creative exploration for: **$ARGUMENTS**

Use brainstormer agent.
Generate multiple options.
```

### execute-plan.md
```markdown
---
description: Execute existing plan with subagents
allowed-tools: Task, Read, Write, Bash, Glob
argument-hint: <plan-file>
---

# ▶️ Execute: $ARGUMENTS

Execute plan: **$ARGUMENTS**

Read plan, execute tasks sequentially.
Review gates between tasks.
```

### research.md
```markdown
---
description: Research technology or topic
allowed-tools: Task, Read, WebSearch, WebFetch, Glob
argument-hint: <topic>
---

# 🔬 Research: $ARGUMENTS

Research: **$ARGUMENTS**

Use researcher agent.
Multiple sources, synthesize findings.
```

### doc.md
```markdown
---
description: Generate documentation
allowed-tools: Task, Read, Write, Glob
argument-hint: <target>
---

# 📚 Doc: $ARGUMENTS

Generate docs for: **$ARGUMENTS**

Use docs-manager agent.
```

### ask.md
```markdown
---
description: Quick question with codebase context
allowed-tools: Read, Grep, Glob
argument-hint: <question>
---

# ❓ Ask: $ARGUMENTS

Answer: **$ARGUMENTS**

Search codebase for context.
Provide direct answer.
```

## Verification

Kiểm tra có 18 files:
- plugin/commands/dev/ (10 files)
- plugin/commands/planning/ (8 files)
```

---

## PHASE 6: COMMANDS PART 2 - GIT, QUALITY, CONTEXT (18 commands)

```markdown
Tiếp tục Phase 6: Tạo 18 Commands (Git + Quality + Context + Design).

## Tạo trong plugin/commands/git/

### commit.md
```markdown
---
description: Smart commit with conventional message
allowed-tools: Bash, Read
argument-hint: [message]
---

# 📝 Commit: $ARGUMENTS

Create conventional commit.
Analyze changes, generate message.
```

### ship.md
```markdown
---
description: Commit and create PR
allowed-tools: Bash, Read, Write
argument-hint: [message]
---

# 🚀 Ship: $ARGUMENTS

Commit and create PR.
Full workflow: commit → push → PR.
```

### pr.md
```markdown
---
description: Create pull request
allowed-tools: Bash, Read
argument-hint: [title]
---

# 🔀 PR: $ARGUMENTS

Create PR for current branch.
Analyze commits, generate description.
```

### deploy.md
```markdown
---
description: Deploy to environment
allowed-tools: Bash, Read
argument-hint: [env]
---

# 🚀 Deploy: $ARGUMENTS

Deploy to: **$ARGUMENTS**
```

### cm.md
```markdown
---
description: Quick conventional commit
allowed-tools: Bash
---

# 📝 Git Commit

Conventional commit for staged changes.
```

### cp.md
```markdown
---
description: Commit and push
allowed-tools: Bash
---

# 📤 Commit & Push

Commit and push current changes.
```

## Tạo trong plugin/commands/quality/

### security-scan.md
```markdown
---
description: Scan for security vulnerabilities
allowed-tools: Task, Read, Grep, Bash, Glob
---

# 🔒 Security Scan

Full security audit.
Use security-auditor and vulnerability-scanner.
```

### api-gen.md
```markdown
---
description: Generate API code from spec
allowed-tools: Task, Read, Write
argument-hint: <resource>
---

# 🔌 API Gen: $ARGUMENTS

Generate API for: **$ARGUMENTS**

Use api-designer agent.
```

### refactor.md
```markdown
---
description: Improve code structure
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <file or directory>
---

# ♻️ Refactor: $ARGUMENTS

Refactor: **$ARGUMENTS**

Improve structure, remove duplication.
```

### optimize.md
```markdown
---
description: Performance optimization
allowed-tools: Task, Read, Write, Bash, Grep
argument-hint: <file>
---

# ⚡ Optimize: $ARGUMENTS

Optimize performance of: **$ARGUMENTS**
```

### lint.md
```markdown
---
description: Run linting
allowed-tools: Bash
---

# 🔍 Lint

Run linting and auto-fix.
```

## Tạo trong plugin/commands/context/

### mode.md
```markdown
---
description: Switch behavioral mode
allowed-tools: Read, Write
argument-hint: <mode-name>
---

# 🎭 Mode: $ARGUMENTS

Switch to mode: **$ARGUMENTS**

Available: default, brainstorm, token-efficient, deep-research, implementation, review, orchestration, omega, autonomous
```

### index.md
```markdown
---
description: Generate project index
allowed-tools: Read, Glob, Write
---

# 📇 Index Project

Scan and index project structure.
Create searchable index.
```

### load.md
```markdown
---
description: Load project context
allowed-tools: Read, Glob
argument-hint: <component>
---

# 📂 Load: $ARGUMENTS

Load context for: **$ARGUMENTS**
```

### checkpoint.md
```markdown
---
description: Save or restore session state
allowed-tools: Read, Write
argument-hint: <save|restore|list>
---

# 💾 Checkpoint: $ARGUMENTS

Session state management.
```

### spawn.md
```markdown
---
description: Launch parallel background task
allowed-tools: Task
argument-hint: <task description>
---

# 🔀 Spawn: $ARGUMENTS

Launch parallel task: **$ARGUMENTS**
```

### spawn-collect.md
```markdown
---
description: Collect results from parallel tasks
allowed-tools: Read
---

# 🔀 Spawn Collect

Aggregate results from spawned tasks.
```

## Tạo trong plugin/commands/design/

### screenshot.md
```markdown
---
description: Implement UI from screenshot
allowed-tools: Task, Read, Write, Bash
argument-hint: <screenshot reference>
---

# 📸 Design Screenshot: $ARGUMENTS

Implement UI from screenshot.
Use ui-ux-designer agent.
```

### fast.md (trong design/)
```markdown
---
description: Quick UI implementation
allowed-tools: Read, Write
argument-hint: <UI description>
---

# ⚡ Design Fast: $ARGUMENTS

Quick UI implementation. Functional first.
```

### good.md
```markdown
---
description: High-quality UI with polish
allowed-tools: Task, Read, Write, Bash
argument-hint: <UI description>
---

# ✨ Design Good: $ARGUMENTS

High-quality UI. Animations, responsive, accessible.
```

### cro.md (trong design/)
```markdown
---
description: CRO-focused content/design
allowed-tools: Task, Read, Write, WebSearch
argument-hint: <page>
---

# 📈 CRO: $ARGUMENTS

Optimize for conversion.
Use copywriter agent with CRO principles.
```

### enhance.md
```markdown
---
description: Enhance existing content/design
allowed-tools: Read, Write
argument-hint: <target>
---

# ✨ Enhance: $ARGUMENTS

Improve existing content quality.
```

## Verification

Kiểm tra có 18 files:
- plugin/commands/git/ (6 files)
- plugin/commands/quality/ (5 files)
- plugin/commands/context/ (6 files)
- plugin/commands/design/ (5 files)
```

---

## PHASE 7: COMMANDS PART 3 - OMEGA & SPRINT (18 commands)

```markdown
Tiếp tục Phase 7: Tạo 18 Commands (Omega + Sprint).

Đây là commands UNIQUE của OMGKIT!

## Tạo trong plugin/commands/omega/

### 10x.md
```markdown
---
description: Find 10x improvement path
allowed-tools: Task, Read, Grep, Glob, WebSearch
argument-hint: <topic>
---

# 🚀 10x: $ARGUMENTS

Find 10x improvement for: **$ARGUMENTS**

Use oracle agent.

## Analysis
1. Current state
2. Leverage points (Ω1)
3. Abstraction opportunities (Ω2)
4. 10x target

## Output
Save to: docs/omega/10x-<topic>.md

```markdown
# 10x Analysis: [Topic]

## Current State
[Analysis]

## 10x Target
[What 10x looks like]

## Path to 10x
1. [Step] - [Improvement]

## Quick Wins (2x now)
1. [Win]
```
```

### 100x.md
```markdown
---
description: Find 100x paradigm shift
allowed-tools: Task, Read, Grep, Glob, WebSearch, WebFetch
argument-hint: <topic>
---

# 🌟 100x: $ARGUMENTS

Find 100x for: **$ARGUMENTS**

100x requires fundamental rethinking.

Use oracle agent with ALL 7 modes:
🔭 Telescopic → 🔬 Microscopic → ↔️ Lateral → 🔄 Inversion → ⏳ Temporal → 🕸️ Systemic → ⚛️ Quantum

## Output
Save to: docs/omega/100x-<topic>.md
```

### 1000x.md
```markdown
---
description: Find 1000x moonshot path
allowed-tools: Task, Read, Grep, Glob, WebSearch, WebFetch
argument-hint: <topic>
---

# 🌙 1000x: $ARGUMENTS

1000x moonshot for: **$ARGUMENTS**

Revolutionary territory.

## Questions
1. What would Google/Apple do?
2. What makes this problem obsolete?
3. What tech enables 1000x?

## Output
Vision doc at: docs/omega/1000x-<topic>.md
```

### principles.md
```markdown
---
description: Display 7 Omega Principles
---

# 🔮 7 Omega Principles

## Ω1. LEVERAGE MULTIPLICATION 💪
> "Don't do. Create systems that do."

## Ω2. TRANSCENDENT ABSTRACTION 🎯
> "Solve the class, not the instance."

## Ω3. AGENTIC DECOMPOSITION 🤖
> "Complex task = Orchestra of specialists."

## Ω4. FEEDBACK ACCELERATION ⚡
> "Compress feedback loops."

## Ω5. ZERO-MARGINAL-COST SCALING 📈
> "Build once, scale infinitely."

## Ω6. EMERGENT INTELLIGENCE 🌟
> "System > Sum of parts."

## Ω7. AESTHETIC PERFECTION ✨
> "Excellence is not optional."

---
*Think Omega. Build Omega. Be Omega.* 🔮
```

### dimensions.md
```markdown
---
description: Display 10 Omega Dimensions
---

# 📊 10 Omega Dimensions

| # | Dimension | Target |
|---|-----------|--------|
| D1 | **Accuracy** | Error → 0 |
| D2 | **Speed** | Time ÷ 1000 |
| D3 | **Cost** | Cost → 0 |
| D4 | **Human Effort** | FTE ÷ 100 |
| D5 | **Quality** | Excellence |
| D6 | **Intelligence** | Self-improving |
| D7 | **Autonomy** | Months unattended |
| D8 | **Systematization** | 100% consistent |
| D9 | **Security** | Zero vulnerabilities |
| D10 | **Aesthetics** | World-class |

True Omega = 10x+ on ALL dimensions.
```

## Tạo trong plugin/commands/sprint/

### init.md
```markdown
---
description: Initialize OMGKIT in project
allowed-tools: Bash, Write
---

# 🔮 Initialize OMGKIT

Create .omgkit/ directory structure:
- .omgkit/config.yaml
- .omgkit/sprints/
- OMEGA.md

Display next steps.
```

### vision-set.md
```markdown
---
description: Set product vision interactively
allowed-tools: Read, Write
---

# 🎯 Set Vision

Interactive vision setting.

Ask one at a time:
1. What are you building?
2. One-line tagline?
3. Primary users?
4. Main goals? (3-5)
5. Constraints?
6. Success metrics?

Save to: .omgkit/sprints/vision.yaml
```

### vision-show.md
```markdown
---
description: Display current vision
allowed-tools: Read
---

# 🎯 Show Vision

Display .omgkit/sprints/vision.yaml
```

### sprint-new.md
```markdown
---
description: Create new sprint
allowed-tools: Task, Read, Write, Grep, Glob
argument-hint: [name] [--propose]
---

# 🏃 Sprint New: $ARGUMENTS

Create sprint.

--propose: AI analyzes codebase and proposes tasks:
- TODOs/FIXMEs
- Test gaps
- Doc gaps
- Features aligned with vision

Save to: .omgkit/sprints/current.yaml
```

### sprint-start.md
```markdown
---
description: Start current sprint
allowed-tools: Read, Write
---

# ▶️ Sprint Start

Set status: active
Set start_date
Calculate end_date
```

### sprint-current.md
```markdown
---
description: Show sprint progress
allowed-tools: Read
---

# 📊 Sprint Current

Show progress, tasks, velocity.
```

### sprint-end.md
```markdown
---
description: End sprint with retrospective
allowed-tools: Task, Read, Write
---

# 🏁 Sprint End

1. Set status: completed
2. Generate retrospective
3. Archive sprint
```

### backlog-add.md
```markdown
---
description: Add task to backlog
allowed-tools: Read, Write
argument-hint: <task> [--type TYPE] [--priority N]
---

# ➕ Backlog Add: $ARGUMENTS

Add task to backlog.
Generate ID, save to backlog.yaml
```

### backlog-show.md
```markdown
---
description: Display backlog
allowed-tools: Read
---

# 📋 Backlog Show

Display all tasks in backlog.
```

### backlog-prioritize.md
```markdown
---
description: AI-powered backlog prioritization
allowed-tools: Task, Read, Write
---

# 🎯 Backlog Prioritize

Use oracle to prioritize by:
- Vision alignment
- User impact
- Effort (inverse)
- Risk of delay
```

### team-run.md
```markdown
---
description: Run AI team on sprint tasks
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: [--mode MODE]
---

# 🤖 Team Run

Start AI team.

Modes:
- full-auto: No stops
- semi-auto: Review at checkpoints (default)
- manual: Approve each step

Use sprint-master to orchestrate agents.
```

### team-status.md
```markdown
---
description: Show AI team activity
allowed-tools: Read
---

# 🤖 Team Status

Show active agents, tasks, progress.
```

### team-ask.md
```markdown
---
description: Ask the AI team a question
allowed-tools: Task, Read, Grep, Glob, WebSearch
argument-hint: <question>
---

# ❓ Team Ask: $ARGUMENTS

Route to appropriate agent(s).
Synthesize answer.
```

## Verification

Kiểm tra có 18 files:
- plugin/commands/omega/ (5 files)
- plugin/commands/sprint/ (13 files)

TOTAL: 54 commands
```

---

**Copy từng phase block và paste vào Claude Code.**
