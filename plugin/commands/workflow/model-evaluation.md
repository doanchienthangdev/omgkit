---
description: AI model evaluation and benchmarking workflow
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <model or system to evaluate>
---

# Model Evaluation Workflow

Evaluate: **$ARGUMENTS**

## Workflow Steps

### Step 1: Evaluation Planning
**Agent:** @planner

- Define evaluation objectives
- Identify key metrics
- Design test cases
- Plan benchmarks

### Step 2: Dataset Preparation
**Agent:** @fullstack-developer

- Collect evaluation data
- Create test sets
- Label ground truth
- Validate data quality

### Step 3: Metric Implementation
**Agent:** @fullstack-developer

- Implement evaluation metrics
- Set up scoring functions
- Create comparison framework

### Step 4: Evaluation Execution
**Agent:** @tester

- Run evaluations
- Collect results
- Statistical analysis
- Compare baselines

### Step 5: Reporting
**Agent:** @docs-manager

- Create evaluation report
- Visualize results
- Document findings
- Recommend improvements

## Progress Tracking
- [ ] Evaluation planned
- [ ] Dataset prepared
- [ ] Metrics implemented
- [ ] Evaluation complete
- [ ] Report generated

Execute each step sequentially. Show progress after each step.
