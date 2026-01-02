---
description: Detect and analyze data drift, label drift, and concept drift with statistical methods
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <drift_type> [--reference <ref>] [--current <current>]
---

# Drift Detection: $ARGUMENTS

Detect drift: **$ARGUMENTS**

## Agent
Uses **monitoring-agent** for drift detection.

## Parameters
- **drift_type**: feature | label | concept | all
- **reference**: Path to reference data
- **current**: Path to current data

## Drift Types

### Feature Drift
- Input distribution change
- P(X) has changed
- Methods: KS test, PSI, Wasserstein

### Label Drift
- Target distribution change
- P(Y) has changed
- Methods: Chi-square, JS divergence

### Concept Drift
- P(Y|X) relationship change
- Model degradation
- Methods: Performance monitoring, DDM, ADWIN

## Code Template
```python
from omgkit.mlops import DriftDetector

detector = DriftDetector()

drift_report = detector.detect(
    reference_data="data/reference/baseline.parquet",
    current_data="data/production/current_week.parquet",
    drift_types=["feature", "label", "concept"],
    methods={
        "feature": "ks_test",
        "label": "chi_square",
        "concept": "model_performance"
    },
    model_path="models/production/model.pt",
    threshold=0.05
)

print(drift_report.summary())

if drift_report.drift_detected:
    detector.trigger_retraining()
```

## Statistical Methods
- **KS Test**: Kolmogorov-Smirnov
- **PSI**: Population Stability Index
- **Wasserstein**: Earth Mover's Distance
- **Chi-Square**: Categorical data
- **JS Divergence**: Jensen-Shannon

## Actions on Drift
- Alert notification
- Trigger retraining
- Rollback model
- Increase monitoring

## Report Output
- Drift scores per feature
- Statistical significance
- Trend visualization
- Recommended actions

## Progress
- [ ] Data loaded
- [ ] Drift computed
- [ ] Analysis complete
- [ ] Report generated
- [ ] Actions triggered

Proactively detect model degradation causes.
