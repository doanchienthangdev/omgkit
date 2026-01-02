---
name: technology-research
description: Research new technologies systematically
category: research
complexity: medium
estimated-time: 2-6 hours
agents:
  - researcher
  - oracle
  - docs-manager
skills:
  - methodology/research-validation
commands:
  - /planning:research
  - /planning:doc
prerequisites:
  - Research topic defined
---

# Technology Research Workflow

## Overview

The Technology Research workflow provides systematic research of new technologies including evaluation, comparison, and recommendations.

## When to Use

- Evaluating new technologies
- Comparing alternatives
- Making technical decisions
- Staying current with trends

## Steps

### Step 1: Scope Definition
**Agent:** researcher
**Duration:** 15-30 minutes

Define scope:
- Research questions
- Evaluation criteria
- Timeline constraints
- Success metrics

**Output:** Research scope

### Step 2: Information Gathering
**Agent:** researcher
**Command:** `/planning:research "$ARGUMENTS"`
**Duration:** 1-2 hours

Gather information:
- Official documentation
- Community resources
- Case studies
- Performance data

**Output:** Research data

### Step 3: Analysis
**Agent:** oracle
**Duration:** 1-2 hours

Analyze findings:
- Pros and cons
- Comparison matrix
- Risk assessment
- Fit evaluation

**Output:** Analysis report

### Step 4: Recommendations
**Agent:** researcher
**Duration:** 30-60 minutes

Create recommendations:
- Primary recommendation
- Alternatives
- Implementation approach
- Next steps

**Output:** Recommendations

### Step 5: Documentation
**Agent:** docs-manager
**Command:** `/planning:doc`
**Duration:** 30-60 minutes

Document findings:
- Research summary
- Decision rationale
- References
- Future considerations

**Output:** Research document

## Quality Gates

- [ ] Scope clearly defined
- [ ] Multiple sources consulted
- [ ] Analysis objective
- [ ] Recommendations justified
- [ ] Documentation complete

## Evaluation Criteria

```
Technology Evaluation
=====================
- Maturity/stability
- Community/support
- Performance
- Learning curve
- Integration ease
- Cost (TCO)
- Security
- Scalability
- Documentation quality
```

## Example Usage

```bash
/workflow:technology-research "GraphQL vs REST for new API"
/workflow:technology-research "Vector databases for RAG"
```

## Related Workflows

- `best-practices` - For implementation patterns
