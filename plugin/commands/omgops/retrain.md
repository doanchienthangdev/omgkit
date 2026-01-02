---
description: Trigger model retraining with full, incremental, or transfer learning strategies
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <strategy> [--trigger <trigger>]
---

# Model Retraining: $ARGUMENTS

Trigger retraining: **$ARGUMENTS**

## Agent
Uses **mlops-engineer-agent** for retraining orchestration.

## Parameters
- **strategy**: full | incremental | transfer (default: incremental)
- **trigger**: manual | scheduled | drift_detected | performance_drop

## Retraining Strategies

### Full Retraining
- Train from scratch
- All historical data
- New architecture possible
- Use case: Major updates

### Incremental Training
- Update with new data
- Stateful training
- Faster convergence
- Use case: Regular updates

### Transfer Learning
- Fine-tune from checkpoint
- Domain adaptation
- New task learning
- Use case: Limited new data

## Code Template
```python
from omgkit.mlops import RetrainingPipeline

pipeline = RetrainingPipeline()

pipeline.setup(
    strategy="incremental",
    triggers=[
        {"type": "scheduled", "cron": "0 0 * * 0"},  # Weekly
        {"type": "drift_detected", "threshold": 0.1},
        {"type": "performance_drop", "metric": "accuracy", "threshold": 0.05}
    ],
    data_config={
        "new_data_path": "data/production/new/",
        "validation_data": "data/splits/val.parquet",
        "min_new_samples": 1000
    },
    training_config={
        "epochs": 10,
        "learning_rate": 1e-4,
        "early_stopping": True
    },
    validation_config={
        "metrics": ["accuracy", "f1"],
        "minimum_improvement": 0.01,
        "fallback_on_regression": True
    }
)

# Manual trigger
pipeline.trigger(reason="manual_update")
```

## Safety Checks
- Minimum improvement threshold
- Regression detection
- Automatic rollback
- Shadow deployment

## Triggers
- **Scheduled**: Cron-based
- **Drift**: Automatic on drift
- **Performance**: Metrics degradation
- **Data**: New data threshold

## Progress
- [ ] Trigger validated
- [ ] Data prepared
- [ ] Training started
- [ ] Validation passed
- [ ] Model deployed

Maintain model freshness with automated retraining.
