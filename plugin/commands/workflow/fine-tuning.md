---
description: Model fine-tuning workflow
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <fine-tuning objective>
---

# Fine-Tuning Workflow

Fine-tune for: **$ARGUMENTS**

## Workflow Steps

### Step 1: Data Preparation
**Agent:** @fullstack-developer

- Collect training data
- Format for fine-tuning
- Quality validation
- Train/val split

### Step 2: Configuration
**Agent:** @researcher

- Select base model
- Configure hyperparameters
- Choose PEFT method (LoRA, QLoRA)
- Set up training

### Step 3: Training
**Agent:** @fullstack-developer

- Run fine-tuning
- Monitor metrics
- Handle checkpoints
- Early stopping

### Step 4: Evaluation
**Agent:** @tester

- Evaluate on test set
- Compare to baseline
- Check for regressions
- Measure improvements

### Step 5: Deployment
**Agent:** @fullstack-developer

- Merge weights (if LoRA)
- Optimize for inference
- Deploy model
- Monitor performance

## Progress Tracking
- [ ] Data prepared
- [ ] Configuration complete
- [ ] Training finished
- [ ] Evaluation passed
- [ ] Deployed

Execute each step sequentially. Show progress after each step.
