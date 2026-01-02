---
description: Train baseline models for comparison including logistic regression, random forest, and XGBoost
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <task_type> [--models <models>]
---

# Baseline Training: $ARGUMENTS

Train baselines: **$ARGUMENTS**

## Agent
Uses **model-engineer-agent** for baseline model training.

## Parameters
- **task_type**: classification | regression | detection | segmentation | nlp
- **models**: List of baseline models to train

## Default Baselines by Task

### Classification
- Logistic Regression
- Random Forest
- XGBoost
- LightGBM
- Naive Bayes

### Regression
- Linear Regression
- Random Forest Regressor
- XGBoost Regressor
- LightGBM Regressor

### NLP
- TF-IDF + SVM
- FastText
- DistilBERT

## Code Template
```python
from omgkit.training import BaselineTrainer

trainer = BaselineTrainer(task_type="classification")

# Train multiple baselines
results = trainer.train_baselines(
    data_path="data/splits/",
    models=["logistic_regression", "random_forest", "xgboost"],
    target_column="label",
    metrics=["accuracy", "f1", "roc_auc"]
)

# Compare and select best
best_model = trainer.select_best(metric="f1")

# Save report
trainer.report(output="reports/baseline_comparison.html")
```

## Output
- Trained models
- Comparison metrics table
- Best baseline selection
- Confusion matrices
- Feature importance (if applicable)

## Comparison Metrics
- Primary: Task-specific (accuracy, F1, RMSE)
- Secondary: Training time, inference time
- Tertiary: Model size, memory usage

## Progress
- [ ] Data loaded
- [ ] Models trained
- [ ] Metrics computed
- [ ] Best selected
- [ ] Report generated

Establish performance baseline before complex models.
