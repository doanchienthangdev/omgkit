---
name: fine-tuning
description: Fine-tune foundation models for specific tasks
category: ai-engineering
complexity: high
estimated-time: 4-16 hours
agents:
  - researcher
  - planner
  - fullstack-developer
  - tester
skills:
  - ai-engineering/finetuning
  - ai-engineering/dataset-engineering
  - ai-engineering/evaluation-methodology
commands:
  - /planning:plan
  - /dev:feature
  - /dev:test
prerequisites:
  - Training data available
  - Compute resources allocated
  - Base model selected
---

# Fine-tuning Workflow

## Overview

The Fine-tuning workflow guides you through fine-tuning foundation models for specific domains or tasks. It covers data preparation, training configuration, execution, evaluation, and deployment.

## When to Use

- Adapting models to domains
- Improving task-specific performance
- Reducing inference costs
- Creating specialized assistants
- Achieving better quality/latency

## Steps

### Step 1: Strategy Planning
**Agent:** planner
**Command:** `/planning:plan "fine-tuning strategy"`
**Duration:** 30-60 minutes

Define strategy:
- Identify fine-tuning goals
- Select base model
- Choose technique (LoRA, QLoRA, full)
- Estimate resources

**Output:** Fine-tuning strategy

### Step 2: Data Preparation
**Agent:** fullstack-developer
**Duration:** 2-6 hours

Prepare data:
- Collect training examples
- Format for fine-tuning
- Quality filtering
- Train/val/test split

**Output:** Training dataset

### Step 3: Configuration
**Agent:** fullstack-developer
**Duration:** 30-60 minutes

Configure training:
- Set hyperparameters
- Configure LoRA/QLoRA settings
- Setup logging
- Define checkpoints

**Output:** Training configuration

### Step 4: Training
**Agent:** fullstack-developer
**Duration:** 1-8 hours

Run training:
- Execute training job
- Monitor metrics
- Save checkpoints
- Handle errors

**Output:** Trained model

### Step 5: Evaluation
**Agent:** tester
**Command:** `/dev:test`
**Duration:** 1-2 hours

Evaluate model:
- Run evaluation suite
- Compare to baseline
- Analyze improvements
- Check for regressions

**Output:** Evaluation report

### Step 6: Deployment
**Agent:** fullstack-developer
**Duration:** 1-2 hours

Deploy model:
- Export model
- Setup inference
- Configure serving
- Validate deployment

**Output:** Deployed model

## Quality Gates

- [ ] Strategy approved
- [ ] Dataset quality verified
- [ ] Training completed
- [ ] Evaluation targets met
- [ ] No harmful behaviors
- [ ] Deployment successful

## Fine-tuning Techniques

```
Fine-tuning Techniques Comparison
=================================

FULL FINE-TUNING:
- Updates all parameters
- Highest quality potential
- Most compute/memory
- Best for small models

LoRA (Low-Rank Adaptation):
- Updates small adapters
- Good quality/efficiency
- Lower memory needs
- Works with large models

QLoRA (Quantized LoRA):
- LoRA + 4-bit quantization
- Very memory efficient
- Good for consumer GPUs
- Slight quality tradeoff

PROMPT TUNING:
- Only tunes prompt embeddings
- Very parameter efficient
- Limited adaptation
- Fast training
```

## Data Format

```json
// Chat fine-tuning format
{
  "messages": [
    {"role": "system", "content": "You are..."},
    {"role": "user", "content": "Question..."},
    {"role": "assistant", "content": "Answer..."}
  ]
}

// Instruction fine-tuning format
{
  "instruction": "Task description",
  "input": "Input data",
  "output": "Expected output"
}
```

## Hyperparameters

| Parameter | Typical Range | Notes |
|-----------|---------------|-------|
| Learning Rate | 1e-5 to 5e-4 | Lower for larger models |
| Batch Size | 4-32 | Depends on memory |
| Epochs | 1-5 | Watch for overfitting |
| LoRA Rank | 8-64 | Higher = more capacity |
| LoRA Alpha | 16-128 | Usually 2x rank |

## Tips

- Start with small dataset
- Use validation set
- Monitor for overfitting
- Save checkpoints frequently
- Compare to baseline early
- Document everything

## Example Usage

```bash
# Fine-tune for customer support
/workflow:fine-tuning "customer support model with company FAQ and tone"

# Fine-tune for code generation
/workflow:fine-tuning "code completion model for Python with company patterns"

# Fine-tune for domain adaptation
/workflow:fine-tuning "legal document analyzer with contract examples"
```

## Related Workflows

- `dataset-engineering` - For data preparation
- `model-evaluation` - For comprehensive evaluation
- `prompt-engineering` - Alternative to fine-tuning
