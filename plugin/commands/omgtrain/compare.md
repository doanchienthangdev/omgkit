---
description: Compare multiple experiments and models across metrics, visualize differences, and select best
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <experiments> [--metric <metric>]
---

# Experiment Comparison: $ARGUMENTS

Compare experiments: **$ARGUMENTS**

## Agent
Uses **model-engineer-agent** for experiment comparison.

## Parameters
- **experiments**: List of experiment names or run IDs
- **metric**: Primary comparison metric

## Comparison Dimensions

### Metrics
- Primary performance metric
- Secondary metrics
- Training metrics (loss curves)
- Validation metrics

### Resources
- Training time
- GPU memory usage
- Inference latency
- Model size

### Parameters
- Hyperparameter differences
- Architecture variations
- Data preprocessing

## Code Template
```python
from omgkit.training import ExperimentComparer
import mlflow

comparer = ExperimentComparer(tracking_uri="http://mlflow.example.com")

comparison = comparer.compare(
    experiments=[
        "churn_v1",
        "churn_v2_deeper",
        "churn_v3_ensemble"
    ],
    metrics=["accuracy", "f1", "roc_auc", "latency"],
    primary_metric="f1"
)

# Visualize comparison
comparer.plot_comparison(
    comparison,
    output="reports/experiment_comparison.html"
)

# Statistical significance test
significance = comparer.significance_test(
    experiment_a="churn_v2_deeper",
    experiment_b="churn_v3_ensemble",
    metric="f1"
)

# Select best model
best = comparer.select_best(
    comparison,
    metric="f1",
    constraints={"latency_ms": 50}
)
```

## Visualizations
- Parallel coordinates
- Metric bar charts
- Learning curve overlay
- Hyperparameter importance

## Statistical Tests
- t-test for significance
- Bootstrap confidence intervals
- McNemar's test (classification)

## Output
- Comparison table
- Winner recommendation
- Trade-off analysis
- Visual report

## Progress
- [ ] Experiments loaded
- [ ] Metrics extracted
- [ ] Comparison computed
- [ ] Significance tested
- [ ] Report generated

Make data-driven model selection decisions.
