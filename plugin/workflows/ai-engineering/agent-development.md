---
name: agent-development
description: Build autonomous AI agents with tools
category: ai-engineering
complexity: very-high
estimated-time: 8-24 hours
agents:
  - researcher
  - planner
  - architect
  - fullstack-developer
  - tester
  - security-auditor
skills:
  - ai-engineering/ai-agents
  - ai-engineering/ai-architecture
  - ai-engineering/guardrails-safety
commands:
  - /planning:research
  - /planning:plan-detailed
  - /dev:feature
  - /dev:test
  - /quality:security-scan
prerequisites:
  - Agent use case defined
  - Tool requirements known
  - LLM API access
---

# Agent Development Workflow

## Overview

The Agent Development workflow guides you through building autonomous AI agents capable of planning, tool use, and multi-step task execution. It covers architecture, implementation, testing, and safety measures.

## When to Use

- Building autonomous assistants
- Creating tool-using AI systems
- Implementing multi-step workflows
- Building AI copilots
- Creating agentic applications

## Steps

### Step 1: Research
**Agent:** researcher
**Command:** `/planning:research "agent architectures"`
**Duration:** 1-2 hours

Research phase:
- Study agent architectures (ReAct, Plan-Execute)
- Review tool use patterns
- Analyze memory systems
- Evaluate safety approaches

**Output:** Research findings

### Step 2: Architecture Design
**Agent:** architect
**Command:** `/planning:plan-detailed "agent architecture"`
**Duration:** 1-2 hours

Design architecture:
- Define agent capabilities
- Design tool interface
- Plan memory system
- Specify safety boundaries

**Output:** Architecture document

### Step 3: Tool Implementation
**Agent:** fullstack-developer
**Duration:** 2-4 hours

Build tools:
- Define tool schemas
- Implement tool functions
- Add input validation
- Create error handling

**Output:** Tool implementations

### Step 4: Planning System
**Agent:** fullstack-developer
**Duration:** 2-4 hours

Implement planning:
- Task decomposition
- Step sequencing
- Dependency handling
- Progress tracking

**Output:** Planning system

### Step 5: Execution Loop
**Agent:** fullstack-developer
**Duration:** 2-4 hours

Build execution:
- Action selection
- Tool invocation
- Result processing
- Loop control

**Output:** Execution loop

### Step 6: Memory System
**Agent:** fullstack-developer
**Duration:** 1-2 hours

Implement memory:
- Short-term context
- Long-term storage
- Memory retrieval
- Context management

**Output:** Memory system

### Step 7: Safety Implementation
**Agent:** security-auditor
**Duration:** 1-2 hours

Add safety:
- Input validation
- Output filtering
- Action limits
- Guardrails

**Output:** Safety layer

### Step 8: Testing
**Agent:** tester
**Command:** `/dev:test`
**Duration:** 2-4 hours

Test agent:
- Unit tests for tools
- Integration tests
- Behavior tests
- Safety tests

**Output:** Test suite

### Step 9: Security Review
**Agent:** security-auditor
**Command:** `/quality:security-scan`
**Duration:** 1-2 hours

Security review:
- Prompt injection prevention
- Tool abuse prevention
- Data leak prevention
- Access control

**Output:** Security report

## Quality Gates

- [ ] Architecture documented and approved
- [ ] All tools implemented and tested
- [ ] Planning system working
- [ ] Execution loop reliable
- [ ] Memory system functional
- [ ] Safety measures in place
- [ ] Security review passed
- [ ] All tests passing

## Agent Architecture

```
AI Agent Architecture
=====================

┌─────────────────────────────────────────┐
│                 AGENT                    │
│  ┌─────────────────────────────────┐    │
│  │          PLANNER                │    │
│  │   Task → Steps → Actions        │    │
│  └─────────────────────────────────┘    │
│                  ↓                       │
│  ┌─────────────────────────────────┐    │
│  │         EXECUTOR                │    │
│  │   Select → Execute → Observe    │    │
│  └─────────────────────────────────┘    │
│                  ↓                       │
│  ┌─────────────────────────────────┐    │
│  │          TOOLS                  │    │
│  │   [Search] [Code] [API] [DB]    │    │
│  └─────────────────────────────────┘    │
│                  ↓                       │
│  ┌─────────────────────────────────┐    │
│  │          MEMORY                 │    │
│  │   Short-term │ Long-term        │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## Safety Considerations

```
Agent Safety Checklist
======================
[ ] Rate limiting implemented
[ ] Action scope restricted
[ ] Sensitive data protected
[ ] Prompt injection mitigated
[ ] Human-in-the-loop for risky actions
[ ] Audit logging enabled
[ ] Rollback capability
[ ] Kill switch available
```

## Tips

- Start with limited tools
- Add comprehensive logging
- Implement human approval for risky actions
- Test extensively with edge cases
- Monitor agent behavior in production
- Version control agent prompts

## Example Usage

```bash
# Build code assistant agent
/workflow:agent-development "code review agent with git, search, and code tools"

# Build data analysis agent
/workflow:agent-development "data analyst with SQL, Python, and visualization tools"

# Build customer service agent
/workflow:agent-development "support agent with knowledge base and ticketing tools"
```

## Related Workflows

- `rag-development` - For knowledge-augmented agents
- `prompt-engineering` - For agent prompts
- `security-audit` - For agent security
