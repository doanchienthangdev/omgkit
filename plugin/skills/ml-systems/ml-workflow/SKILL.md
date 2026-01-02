---
name: ml-workflow
description: ML development workflow covering experiment design, baseline establishment, iterative improvement, and experiment tracking best practices.
---

# ML Workflow

Systematic approach to ML model development.

## Development Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                  ML DEVELOPMENT WORKFLOW                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. PROBLEM      2. BASELINE     3. EXPERIMENT              │
│     SETUP           MODEL           ITERATE                  │
│     ↓               ↓               ↓                       │
│  Define metrics  Simple model   Hypothesis                  │
│  Success criteria Benchmark     Test ideas                  │
│  Constraints     Comparison     Track results               │
│                                                              │
│  4. EVALUATE     5. VALIDATE    6. DEPLOY                   │
│     ↓               ↓               ↓                       │
│  Full metrics    Production    Ship to prod                │
│  Error analysis  validation    Monitor                     │
│  Fairness        A/B test      Iterate                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Experiment Design

```python
import mlflow
from dataclasses import dataclass

@dataclass
class Experiment:
    name: str
    hypothesis: str
    metrics: list
    success_criteria: dict

experiment = Experiment(
    name="feature_engineering_v2",
    hypothesis="Adding temporal features improves prediction",
    metrics=["accuracy", "f1", "latency_ms"],
    success_criteria={"f1": 0.85, "latency_ms": 50}
)

# Track experiment
mlflow.set_experiment(experiment.name)
with mlflow.start_run():
    mlflow.log_param("hypothesis", experiment.hypothesis)
    # ... training code ...
    mlflow.log_metrics(results)
```

## Baseline Models

```python
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

baselines = {
    "majority": DummyClassifier(strategy="most_frequent"),
    "logistic": LogisticRegression(),
    "random_forest": RandomForestClassifier(n_estimators=100)
}

results = {}
for name, model in baselines.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    results[name] = {
        "accuracy": accuracy_score(y_test, y_pred),
        "f1": f1_score(y_test, y_pred, average="macro")
    }

# Best baseline
best = max(results.items(), key=lambda x: x[1]["f1"])
print(f"Best baseline: {best[0]} with F1={best[1]['f1']:.3f}")
```

## Experiment Tracking

```python
import mlflow
import mlflow.pytorch

# Start experiment
mlflow.set_tracking_uri("http://mlflow.example.com")
mlflow.set_experiment("churn_prediction")

with mlflow.start_run(run_name="xgboost_v3"):
    # Log parameters
    mlflow.log_params({
        "model_type": "xgboost",
        "max_depth": 6,
        "learning_rate": 0.1
    })

    # Train model
    model = train_model(X_train, y_train, params)

    # Log metrics
    mlflow.log_metrics({
        "train_accuracy": train_acc,
        "val_accuracy": val_acc,
        "f1_score": f1
    })

    # Log model
    mlflow.sklearn.log_model(model, "model")

    # Log artifacts
    mlflow.log_artifact("feature_importance.png")
```

## Iterative Improvement

```python
class ExperimentIterator:
    def __init__(self, baseline_metrics):
        self.baseline = baseline_metrics
        self.experiments = []

    def run_experiment(self, name, model_fn, hypothesis):
        with mlflow.start_run(run_name=name):
            mlflow.log_param("hypothesis", hypothesis)
            model, metrics = model_fn()
            mlflow.log_metrics(metrics)

            improvement = {k: metrics[k] - self.baseline[k]
                          for k in metrics}
            mlflow.log_metrics({f"{k}_improvement": v
                              for k, v in improvement.items()})

            self.experiments.append({
                "name": name,
                "hypothesis": hypothesis,
                "metrics": metrics,
                "improvement": improvement
            })

            return model, metrics
```

## Commands
- `/omgml:init` - Initialize project
- `/omgtrain:baseline` - Train baselines

## Best Practices

1. Always start with a baseline
2. Change one thing at a time
3. Track all experiments
4. Document hypotheses
5. Validate before deploying
