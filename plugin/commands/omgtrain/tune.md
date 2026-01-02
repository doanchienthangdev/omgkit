---
description: Hyperparameter tuning with Optuna using TPE, random, grid, or CMA-ES optimization
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: "[--n_trials <n>] [--method <method>]"
---

# Hyperparameter Tuning: $ARGUMENTS

Tune hyperparameters: **$ARGUMENTS**

## Agent
Uses **model-engineer-agent** for hyperparameter optimization.

## Parameters
- **n_trials**: Number of optimization trials (default: 100)
- **method**: tpe | random | grid | cmaes (default: tpe)

## Search Methods

### TPE (Tree-structured Parzen Estimator)
- Bayesian optimization
- Sample-efficient
- Handles conditionals

### Random Search
- Simple baseline
- Parallelizable
- Good for high dimensions

### Grid Search
- Exhaustive search
- Reproducible
- Best for small spaces

### CMA-ES
- Evolution strategy
- Good for continuous spaces
- Noise-robust

## Code Template
```python
from omgkit.training import HyperparameterTuner
import optuna

tuner = HyperparameterTuner(
    study_name="churn_prediction_tuning",
    direction="maximize",
    sampler=optuna.samplers.TPESampler()
)

search_space = {
    "learning_rate": {"type": "float", "low": 1e-5, "high": 1e-1, "log": True},
    "hidden_dim": {"type": "categorical", "choices": [64, 128, 256, 512]},
    "num_layers": {"type": "int", "low": 1, "high": 5},
    "dropout": {"type": "float", "low": 0.0, "high": 0.5},
    "batch_size": {"type": "categorical", "choices": [16, 32, 64, 128]}
}

best_params = tuner.tune(
    train_fn=train_model,
    search_space=search_space,
    n_trials=100,
    metric="val_f1",
    pruner=optuna.pruners.MedianPruner()
)

tuner.report(output="reports/tuning_report.html")
```

## Pruning
- Median pruner: Stop unpromising trials
- Percentile pruner: More aggressive
- Hyperband: Multi-fidelity

## Output
- Best hyperparameters
- Optimization history
- Parameter importance
- Parallel coordinate plot
- HTML report

## Progress
- [ ] Search space defined
- [ ] Optimization started
- [ ] Trials completed
- [ ] Best params found
- [ ] Report generated

Find optimal hyperparameters efficiently.
