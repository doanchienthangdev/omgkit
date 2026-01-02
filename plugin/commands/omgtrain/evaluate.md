---
description: Evaluate model comprehensively including performance, robustness, fairness, and efficiency metrics
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <model_path> [--test_data <path>]
---

# Model Evaluation: $ARGUMENTS

Evaluate model: **$ARGUMENTS**

## Agent
Uses **model-engineer-agent** for comprehensive evaluation.

## Parameters
- **model_path**: Path to trained model
- **test_data**: Path to test dataset

## Evaluation Types

### Performance Metrics
- Accuracy, Precision, Recall, F1
- ROC-AUC, PR-AUC
- Confusion matrix
- Classification report

### Robustness Testing
- Perturbation tests
- Out-of-distribution detection
- Adversarial evaluation
- Noise sensitivity

### Fairness Analysis
- Demographic parity
- Equal opportunity
- Calibration by group
- Bias detection

### Efficiency Metrics
- Inference latency
- Memory usage
- Throughput
- Model size

## Code Template
```python
from omgkit.training import ModelEvaluator

evaluator = ModelEvaluator()

results = evaluator.evaluate(
    model_path="models/best_model.pt",
    test_data="data/splits/test.parquet",
    evaluation_types=[
        "performance",
        "robustness",
        "fairness",
        "efficiency"
    ],
    fairness_groups=["gender", "age_group"],
    perturbation_levels=[0.01, 0.05, 0.1]
)

evaluator.report(
    results=results,
    output="reports/evaluation_report.html",
    include_plots=True
)
```

## Report Includes
- Summary metrics
- Per-class performance
- Confusion matrix visualization
- ROC/PR curves
- Feature importance
- Error analysis

## Progress
- [ ] Model loaded
- [ ] Test data prepared
- [ ] Metrics computed
- [ ] Analysis complete
- [ ] Report generated

Comprehensive evaluation for production readiness.
