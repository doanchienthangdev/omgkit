---
name: ml-systems-fundamentals
description: Core ML systems concepts including ML lifecycle, system architecture, requirements, and design principles for production ML.
---

# ML Systems Fundamentals

Foundation concepts for building production ML systems.

## ML System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ML SYSTEM ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  DATA LAYER                                                  │
│  ├── Data Collection    ├── Data Storage                    │
│  ├── Data Processing    └── Feature Store                   │
│                                                              │
│  MODEL LAYER                                                 │
│  ├── Training Pipeline  ├── Experiment Tracking              │
│  ├── Model Registry     └── Evaluation                      │
│                                                              │
│  SERVING LAYER                                               │
│  ├── Model Serving      ├── Feature Serving                 │
│  ├── Prediction Cache   └── Load Balancing                  │
│                                                              │
│  MONITORING LAYER                                            │
│  ├── Data Monitoring    ├── Model Monitoring                │
│  ├── System Metrics     └── Alerting                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## ML Lifecycle

1. **Problem Definition** - Business goal → ML task
2. **Data Collection** - Gather relevant data
3. **Data Processing** - Clean, transform, validate
4. **Feature Engineering** - Create informative features
5. **Model Development** - Train, tune, evaluate
6. **Deployment** - Serve predictions
7. **Monitoring** - Track performance
8. **Iteration** - Improve based on feedback

## System Requirements

### Reliability
- Handle failures gracefully
- Maintain prediction quality
- Provide consistent latency

### Scalability
- Handle growing data
- Support more requests
- Enable parallel training

### Maintainability
- Easy to update models
- Clear documentation
- Reproducible experiments

### Adaptability
- Respond to data changes
- Support new features
- Enable quick iterations

## Design Principles

```python
# 1. Start Simple
baseline = LogisticRegression()
baseline.fit(X_train, y_train)
print(f"Baseline: {baseline.score(X_test, y_test)}")

# 2. Data Quality > Model Complexity
def validate_data(df):
    assert df.isnull().sum().sum() == 0
    assert df.duplicated().sum() == 0
    return True

# 3. Version Everything
import mlflow
mlflow.log_param("model_version", "1.0.0")
mlflow.log_artifact("data/processed/")

# 4. Monitor Continuously
def check_drift(reference, current):
    return ks_2samp(reference, current).pvalue < 0.05
```

## Commands
- `/omgml:init` - Initialize ML project
- `/omgml:status` - Project status

## Best Practices

1. Define clear success metrics
2. Establish baselines early
3. Invest in data quality
4. Automate everything possible
5. Monitor production models
