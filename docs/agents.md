# OMGKIT Agents Reference

## Overview

OMGKIT provides 23 specialized AI agents organized into 5 teams.

## Core Development Team (6)

| Agent | Purpose | Tools |
|-------|---------|-------|
| **planner** | Task decomposition, planning | Read, Grep, Glob, Write, WebSearch |
| **researcher** | Technology research | Read, WebSearch, WebFetch |
| **debugger** | Error analysis, bug fixing | Read, Grep, Glob, Bash |
| **tester** | Test generation, coverage | Read, Write, Bash, Glob |
| **code-reviewer** | Code review, security | Read, Grep, Glob |
| **scout** | Codebase exploration | Read, Grep, Glob |

## Operations Team (5)

| Agent | Purpose | Tools |
|-------|---------|-------|
| **git-manager** | Git operations, PRs | Bash, Read |
| **docs-manager** | Documentation | Read, Write, Glob |
| **project-manager** | Progress tracking | Read, Write, Glob |
| **database-admin** | Schema, queries, migrations | Read, Write, Bash |
| **ui-ux-designer** | UI components, design | Read, Write, Bash |

## Extended Team (6)

| Agent | Purpose | Tools |
|-------|---------|-------|
| **fullstack-developer** | Full implementation | All tools |
| **cicd-manager** | CI/CD pipelines | Read, Write, Bash |
| **security-auditor** | Security reviews | Read, Grep, Bash |
| **api-designer** | API design, OpenAPI | Read, Write |
| **vulnerability-scanner** | Security scanning | Read, Grep, Bash |
| **pipeline-architect** | Pipeline optimization | Read, Write, Bash |

## Creative Team (3)

| Agent | Purpose | Tools |
|-------|---------|-------|
| **copywriter** | Marketing, content | Read, Write, WebSearch |
| **brainstormer** | Creative exploration | Read, WebSearch |
| **journal-writer** | Retrospectives, lessons | Read, Write |

## Omega Team ⭐ (3)

| Agent | Purpose | Tools |
|-------|---------|-------|
| **oracle** | Deep analysis, 7 thinking modes | Read, Grep, Glob, WebSearch, WebFetch |
| **architect** | System design, leverage | Read, Write, Grep, Glob |
| **sprint-master** | Sprint management, orchestration | Read, Write, Task |

## Agent Selection

### Automatic (recommended)
Agents are automatically selected based on the command used.

### Manual
Use the Task tool to invoke specific agents:
```
Task(agent="oracle", prompt="Analyze X using 7 modes")
```

## Task Routing

| Task Type | Primary Agent | Support |
|-----------|---------------|---------|
| Feature | fullstack-developer | planner, tester |
| Bug fix | debugger | scout, tester |
| Documentation | docs-manager | - |
| Testing | tester | - |
| Research | oracle | researcher |
| Architecture | architect | oracle |
| Security | security-auditor | vulnerability-scanner |
