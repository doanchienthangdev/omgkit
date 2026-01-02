---
name: prompt-engineering
description: Optimize prompts for AI applications
category: ai-engineering
complexity: medium
estimated-time: 2-6 hours
agents:
  - researcher
  - tester
skills:
  - ai-engineering/prompt-engineering
  - ai-engineering/evaluation-methodology
commands:
  - /planning:research
  - /dev:test
prerequisites:
  - Use case defined
  - LLM API access
---

# Prompt Engineering Workflow

## Overview

The Prompt Engineering workflow helps you design, test, and optimize prompts for AI applications. It covers prompt design, systematic testing, and iterative improvement.

## When to Use

- Creating new AI features
- Improving output quality
- Reducing hallucinations
- Optimizing token usage
- Building prompt templates

## Steps

### Step 1: Requirements Analysis
**Agent:** researcher
**Duration:** 15-30 minutes

Define requirements:
- Identify task type
- Define expected outputs
- List quality criteria
- Document constraints

**Output:** Requirements document

### Step 2: Initial Design
**Agent:** researcher
**Duration:** 30-60 minutes

Design prompts:
- Create system prompt
- Design user prompt template
- Add few-shot examples
- Include output format

**Output:** Initial prompt design

### Step 3: Test Case Creation
**Agent:** tester
**Duration:** 30-60 minutes

Create test cases:
- Normal inputs
- Edge cases
- Adversarial inputs
- Format variations

**Output:** Test case suite

### Step 4: Evaluation
**Agent:** tester
**Command:** `/dev:test`
**Duration:** 1-2 hours

Run evaluations:
- Test all cases
- Measure quality metrics
- Identify failures
- Document issues

**Output:** Evaluation results

### Step 5: Iteration
**Agent:** researcher
**Duration:** 30-120 minutes

Iterate and improve:
- Analyze failures
- Refine prompts
- Re-test changes
- Repeat until targets met

**Output:** Optimized prompts

### Step 6: Documentation
**Agent:** researcher
**Duration:** 15-30 minutes

Document prompts:
- Final prompt templates
- Usage guidelines
- Known limitations
- Version history

**Output:** Prompt documentation

## Quality Gates

- [ ] Requirements clearly defined
- [ ] Initial prompts created
- [ ] Test cases comprehensive
- [ ] Quality targets met
- [ ] Edge cases handled
- [ ] Documentation complete

## Prompt Patterns

```
Effective Prompt Patterns
=========================

ROLE PATTERN:
"You are an expert [role] with [experience]..."

TASK PATTERN:
"Your task is to [specific action] given [input]..."

FORMAT PATTERN:
"Return your response in the following format:
[format specification]"

FEW-SHOT PATTERN:
"Here are examples of good responses:
Example 1: [input] → [output]
Example 2: [input] → [output]"

CHAIN-OF-THOUGHT:
"Think step by step:
1. First, analyze...
2. Then, consider...
3. Finally, conclude..."

DEFENSIVE PATTERN:
"If [condition], respond with [safe response].
Do not [prohibited action]."
```

## Optimization Tips

```
Prompt Optimization Checklist
=============================
[ ] Clear role definition
[ ] Specific task description
[ ] Output format specified
[ ] Examples provided
[ ] Constraints listed
[ ] Edge cases handled
[ ] Token-efficient
[ ] Version documented
```

## Tips

- Start simple, add complexity
- Use specific, concrete language
- Provide clear examples
- Test edge cases early
- Measure quantitatively
- Version control prompts

## Example Usage

```bash
# Design customer support prompts
/workflow:prompt-engineering "customer support bot with empathy and escalation"

# Optimize code generation prompts
/workflow:prompt-engineering "code review assistant with security focus"

# Create content generation prompts
/workflow:prompt-engineering "marketing copy generator with brand voice"
```

## Related Workflows

- `model-evaluation` - For testing prompts at scale
- `rag-development` - For context-augmented prompts
- `agent-development` - For agent prompts
