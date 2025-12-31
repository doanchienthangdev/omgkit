---
name: marketing
description: Create marketing content and materials
category: content
complexity: low
estimated-time: 1-4 hours
agents:
  - copywriter
  - brainstormer
  - researcher
skills: []
commands:
  - /planning:brainstorm
  - /planning:research
prerequisites:
  - Product/feature defined
  - Target audience known
---

# Marketing Content Workflow

## Overview

The Marketing Content workflow helps create compelling marketing materials including landing page copy, product descriptions, and promotional content.

## When to Use

- Launching new products
- Creating landing pages
- Writing promotional content
- Developing messaging

## Steps

### Step 1: Research
**Agent:** researcher
**Command:** `/planning:research`
**Duration:** 30-60 minutes

Research phase:
- Target audience
- Competitor analysis
- Market positioning
- Key messages

**Output:** Research findings

### Step 2: Ideation
**Agent:** brainstormer
**Command:** `/planning:brainstorm`
**Duration:** 30-60 minutes

Generate ideas:
- Messaging angles
- Headlines options
- Value propositions
- Call-to-actions

**Output:** Content ideas

### Step 3: Copy Writing
**Agent:** copywriter
**Duration:** 1-2 hours

Write copy:
- Headlines
- Body copy
- Features/benefits
- CTAs

**Output:** Marketing copy

### Step 4: Review
**Agent:** copywriter
**Duration:** 30-60 minutes

Review and refine:
- Tone consistency
- Clarity
- Persuasiveness
- Grammar

**Output:** Refined copy

## Quality Gates

- [ ] Audience researched
- [ ] Ideas generated
- [ ] Copy written
- [ ] Copy reviewed

## Copy Frameworks

```
Marketing Copy Frameworks
=========================
AIDA:
- Attention: Hook
- Interest: Benefits
- Desire: Value
- Action: CTA

PAS:
- Problem: Pain point
- Agitate: Emphasize
- Solution: Your product
```

## Example Usage

```bash
/workflow:marketing "product launch landing page"
/workflow:marketing "feature announcement email"
```

## Related Workflows

- `technical-docs` - For documentation
