---
description: Prune model weights using magnitude, structured, or lottery ticket methods to reduce redundancy
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <method> [--sparsity <sparsity>]
---

# Model Pruning: $ARGUMENTS

Prune model: **$ARGUMENTS**

## Agent
Uses **performance-engineer-agent** for model pruning.

## Parameters
- **method**: magnitude | structured | lottery_ticket (default: magnitude)
- **sparsity**: Target sparsity level (default: 0.5 = 50% removed)

## Pruning Methods

### Magnitude Pruning
- Remove smallest weights
- Unstructured sparsity
- Most flexible
- Requires sparse support

### Structured Pruning
- Remove entire channels/filters
- Hardware-friendly
- Immediate speedup
- More accuracy loss

### Lottery Ticket
- Find sparse subnetwork
- Train from scratch
- Best theoretical results
- Most compute-intensive

## Code Template
```python
from omgkit.optimization import ModelPruner

pruner = ModelPruner()

# Iterative magnitude pruning
pruned_model = pruner.prune(
    model_path="models/best_model.pt",
    method="magnitude",
    target_sparsity=0.7,
    iterative_steps=5,
    finetune_epochs=10,
    finetune_data="data/splits/train.parquet"
)

# Report
pruner.report(
    original_model="models/best_model.pt",
    pruned_model=pruned_model,
    output="reports/pruning_report.html"
)
```

## Sparsity Levels
- 50%: Safe, minimal accuracy loss
- 70%: Moderate, some accuracy drop
- 90%: Aggressive, significant drop
- 95%+: Extreme, research only

## Best Practices
- Iterative pruning (gradual)
- Fine-tune after pruning
- Validate on holdout set
- Consider structured for deployment

## Progress
- [ ] Model analyzed
- [ ] Pruning applied
- [ ] Fine-tuning complete
- [ ] Quality validated
- [ ] Report generated

Remove redundant weights while maintaining performance.
